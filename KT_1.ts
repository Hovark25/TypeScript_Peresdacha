class User {
  static count = 0
  private _name: string
  private _login: string
  private _password: string
  private _grade: number

  constructor(name: string, login: string, password: string, grade: number) {
    if (!name || !login || !password) throw new Error('Все поля обязательны')
    if (!Number.isInteger(grade) || grade <= 0) throw new Error('grade: целое > 0')
    this._name = name
    this._login = login
    this._password = password
    this._grade = grade
    if (new.target === User) User.count++
  }



  // геттеры и сеттеры
  get name() { return this._name }
  set name(v: string) { this._name = v }

  get login() { return this._login }
  set login(_: string) { console.log('Невозможно изменить логин!') }

  get password() { return '********' }
  set password(v: string) { this._password = v }

  get grade(): any { console.log('Неизвестное свойство grade'); return 'Неизвестное свойство grade' }
  set grade(_: number) { console.log('Неизвестное свойство grade') }

  // методы
  showInfo() {
    console.log(`Name: ${this._name}, Login: ${this._login}`)
  }

  eq(other: User) { return this._grade === (other as any)._grade }
  lt(other: User) { return this._grade < (other as any)._grade }
  gt(other: User) { return this._grade > (other as any)._grade }
}

class SuperUser extends User {
  static count = 0
  private _role: string

  constructor(name: string, login: string, password: string, role: string, grade: number) {
    super(name, login, password, grade)
    this._role = role
    SuperUser.count++
  }

  get role() { return this._role }
  set role(v: string) { this._role = v }

  showInfo() {
    console.log(`Name: ${this.name}, Login: ${this.login}, Role: ${this.role}`)
  }
}



// тест
const user1 = new User('Paul McCartney', 'paul', '1234', 3)
const user2 = new User('George Harrison', 'george','5678', 2)
const user3 = new User('Richard Starkey', 'ringo', '8523', 3)
const admin = new SuperUser('John Lennon','john', '0000', 'admin', 5)

user1.showInfo()
admin.showInfo()

let users = User.count
let admins = SuperUser.count
console.log(`Всего обычных пользователей: ${users}`)
console.log(`Всего супер-пользователей: ${admins}`)

console.log(user1.lt(user2))
console.log(admin.gt(user3))
console.log(user1.eq(user3))

user3.name = 'Ringo Star'
user1.password = 'Pa$$w0rd'

console.log(user3.name)
console.log(user2.password)
console.log(user2.login)
user2.login = 'geo'
console.log(user3.grade)
admin.grade = 10


