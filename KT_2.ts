
// моделирование библиотеки

abstract class Edition {
  constructor(
    private _title: string,
    private _author: string,
    private _year: number,
    private _count: number
  ) {
    if (_count < 0) throw new Error('count >= 0')
  }

  
  get title() { return this._title }
  set title(v: string) { this._title = v }

  get author() { return this._author }
  set author(v: string) { this._author = v }

  get year() { return this._year }
  set year(v: number) { this._year = v }

  get count() { return this._count }
  set count(v: number) { if (v < 0) throw new Error('count >= 0'); this._count = v }

  info() { return `${this._title} (${this._author}, ${this._year})` }
}


// интерфейс выдачи и приёма
interface Issue {
  give(r: Reader): boolean
  take(r: Reader): boolean
}

class Book extends Edition implements Issue {
  constructor(title: string, author: string, year: number, count: number, private _pages: number) {
    super(title, author, year, count)
  }

  get pages() { return this._pages }
  set pages(v: number) { this._pages = v }

  give(r: Reader): boolean {
    if (this.count <= 0 || !r.canGet(this)) return false
    r.getItem(this)
    this.count--
    return true
  }

  take(r: Reader): boolean {
    if (!r.hasItem(this)) return false
    r.returnItem(this)
    this.count++
    return true
  }
}


class Journal extends Edition implements Issue {
  constructor(title: string, author: string, year: number, count: number, private _issue: number) {
    super(title, author, year, count)
  }

  get issue() { return this._issue }
  set issue(v: number) { this._issue = v }

  give(r: Reader): boolean {
    if (this.count <= 0 || !r.canGet(this)) return false
    r.getItem(this)
    this.count--
    return true
  }

  take(r: Reader): boolean {
    if (!r.hasItem(this)) return false
    r.returnItem(this)
    this.count++
    return true
  }
}

class Reader {
  static limitDefault = 3
  private _items: Edition[] = [] 

  constructor(private _name: string, private _surname: string, private _limit: number = Reader.limitDefault) {}

  get name() { return this._name }
  set name(v: string) { this._name = v }

  get surname() { return this._surname }
  set surname(v: string) { this._surname = v }

  get limit() { return this._limit }
  set limit(v: number) { this._limit = v }

  get items() { return [...this._items] }

  canGet(item: Edition) { return this._items.length < this._limit && !this.hasItem(item) }
  hasItem(item: Edition) { return this._items.includes(item) }
  getItem(item: Edition) { this._items.push(item) }
  returnItem(item: Edition) { this._items = this._items.filter(x => x !== item) }

  info() { return `${this._name} ${this._surname}` }
}

class Library {
  private _list: Edition[] = []

  add(e: Edition) { this._list.push(e) }
  remove(e: Edition) { this._list = this._list.filter(x => x !== e) }
  show() { return this._list.map(x => `${x.info()} — экземпляров: ${x.count}`) }
}


// проверка
const lib = new Library()

const b1 = new Book('Clean Code', 'Robert Martin', 2008, 2, 464)
const b2 = new Book('JS Guide', 'Kyle Simpson', 2015, 1, 280)
const j1 = new Journal('Wired', 'Condé Nast', 2024, 3, 7)

lib.add(b1)
lib.add(b2)
lib.add(j1)

const r1 = new Reader('Alice', 'Jones')
const r2 = new Reader('Bob', 'Smith', 2)

console.log('Каталог:')
console.log(lib.show().join('\n'))


console.log('\nВыдача:')
console.log('b1 -> r1', b1.give(r1))
console.log('b1 -> r2', b1.give(r2))
console.log('b1 -> r2 ещё раз', b1.give(r2))
console.log('j1 -> r2', j1.give(r2))
console.log('j1 -> r2 ещё раз', j1.give(r2))

console.log('\nЧитатели:')
console.log('Alice:', r1.items.map(i => i.info()))
console.log('Bob:', r2.items.map(i => i.info()))

console.log('\nВозврат:')
console.log('b1 <- r1', b1.take(r1))
console.log('j1 <- r2', j1.take(r2))

console.log('\nКаталог после:')
console.log(lib.show().join('\n'))

