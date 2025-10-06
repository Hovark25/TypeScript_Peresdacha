

// моделирование плоттера

type Distance = number
type Degrees = number
type Color = 'Black' | 'Red' | 'Green' 


interface Logger {
  log(message: string): void
}

class LogToConsole implements Logger {
  log(msg: string) { console.log(msg) }
}

class Plotter {
  private x = 0
  private y = 0
  private angle: Degrees = 0
  private penDown = false
  private color: Color = 'Black'

  constructor(private logger: Logger){}

  setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.logger.log(`Начальная позиция установлена: (${this.round(x)}, ${this.round(y)})`)
  }

  setColor(c: Color) {
    this.color = c
    this.logger.log(`Установка цвета линии:${this.ruColor()}.`)
  }

  carriageDown() {
    this.penDown = true
    this.logger.log('Каретка опущена.')
  }

  carriageUp() {
    this.penDown = false
    this.logger.log('Каретка  поднята.')
    
  }

  turn(deg: Degrees) {
    this.angle = (this.angle + deg) % 360
    if (this.angle < 0) this.angle += 360
    this.logger.log(`Поворот на ${this.round(deg)} градусов.` )
  }

  move(d: Distance) {
    const startX = this.x, startY = this.y
    const rad = (Math.PI / 180) * this.angle
    this.x += d * Math.cos(rad)
    this.y += d * Math.sin(rad)
    if (this.penDown) {
      const from = `(${this.round(startX)}, ${this.round(startY)})`
      const to = `(${this.round(this.x)}, ${this.round(this.y)})`
      this.logger.log(`Чертёж линии: от ${from} до ${to}, цвет: ${this.ruColor()}.`)
    }
  }

  // утилиты
  private ruColor() {
    return this.color === 'Black' ? 'чёрный'
         : this.color === 'Red' ? 'красный'
         : 'зелёный'
  }
  private round(n: number) { return Math.round(n) }
}


// пример работы
function drawTriangle(plt: Plotter, size: Distance): void {
  plt.setColor('Green')
  for (let i = 0; i < 3; ++i) {
    plt.carriageDown()
    plt.move(size)
    plt.carriageUp()
    plt.turn(120.0)
  }
}

const plotter = new Plotter(new LogToConsole())
drawTriangle(plotter, 100.0)



