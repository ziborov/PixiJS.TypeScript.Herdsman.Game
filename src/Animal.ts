import { Sprite, Graphics, type Application, type Texture } from 'pixi.js'
import { Settings } from './Settings'

export interface IAnimalOptions {
  app: Application
  radius: number
  vx: number
  vy: number
  colorIndex: number
}

export class Animal extends Sprite {
  static textureCache: Texture
  public isProjectile = true
  public app!: Application
  public radius!: number
  public vx!: number
  public vy!: number
  public colorIndex: number
  public movinDirection: boolean   //true - increase false - decrice
  public colorStr: string
  public inPlayerGroup: boolean
  public playerGroupNumber: number
  public playerX: number
  public playerY: number

  constructor(options: IAnimalOptions) {
    super()
    this.app = options.app
    this.radius = options.radius
    this.vx = options.vx
    this.vy = options.vy
    this.colorIndex = options.colorIndex
    this.colorStr = "0xffffff"
    this.movinDirection = true  //Increase
    this.inPlayerGroup = false
    this.playerGroupNumber = 0
    this.playerX = 0
    this.playerY = 0
    this.setup(options)
  }

  setup(options: IAnimalOptions): void {
    let texture = Animal.textureCache
    if (texture == null) {
      const circle = new Graphics()
      circle.beginFill(0xffffff)
      circle.drawCircle(0, 0, this.radius)
      circle.endFill()
      circle.cacheAsBitmap = true
      texture = options.app.renderer.generateTexture(circle)
      Animal.textureCache = texture
    }
    this.texture = texture
    this.scale.set(options.radius * 2 / texture.width, options.radius * 2 / texture.height)
    //const colorStr = Animal.interpolateColors(Math.random())
    this.colorStr = Settings.animalColor[this.colorIndex]
    this.tint = Number.parseInt(this.colorStr, 16)
  }

  update(): void {

    if (!this.inPlayerGroup) {
      if (this.movinDirection) {
        this.x = this.x + this.vx
        this.y = this.y + this.vy
      } else {
        this.x = this.x - this.vx
        this.y = this.y - this.vy
      }
    } else {
      switch (this.playerGroupNumber) {
        case 0:
          break
        case 1:
          this.x = this.playerX 
          this.y = this.playerY - 80
          break
        case 2:
          this.x = this.playerX + 60
          this.y = this.playerY - 60
          break
        case 3:
          this.x = this.playerX + 80
          this.y = this.playerY 
          break
        case 4:
          this.x = this.playerX + 60
          this.y = this.playerY + 60
          break
        case 5:
          this.x = this.playerX 
          this.y = this.playerY + 80
          break
        case 6:
          this.x = this.playerX - 60
          this.y = this.playerY + 60
          break
        case 7:
          this.x = this.playerX - 80
          this.y = this.playerY 
          break
        case 8:
          this.x = this.playerX - 60
          this.y = this.playerY - 60
          break

        default:
          console.log(`Error playerGroupNumber: ${this.playerGroupNumber}`)
      }

    }
  }

  isOutOfViewport({ left, top, right, bottom }: { left: number, top: number, right: number, bottom: number }): boolean {
    const pLeft = this.x - this.radius
    const pTop = this.y - this.radius
    const pRight = this.x + this.radius
    const pBottom = this.y + this.radius
    if (pRight < left) {
      return true
    }
    if (pLeft > right) {
      return true
    }
    if (pBottom < top) {
      return true
    }
    if (pTop > bottom) {
      return true
    }
    return false
  }
}
