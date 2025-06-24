import { Graphics } from 'pixi.js'
import { Settings } from './Settings'

export interface IYardOptions {
  yardX: number,
  yardY: number,
  yardRadius: number,
  yardFillColor: number,
  yardLineColor: number
}

export class Yard extends Graphics {
  public yardX!: number
  public yardY!: number
  public yardRadius!: number
  public yardFillColor!: number
  public yardLineColor!: number

  constructor (options: IYardOptions) {
    super()
    this.yardX = options.yardX
    this.yardY = options.yardY
    this.yardRadius = options.yardRadius
    this.yardFillColor = options.yardFillColor
    this.yardLineColor = options.yardLineColor
    this.draw()
  }

  draw (): void {
    this.lineStyle(10, this.yardLineColor, 1);
    this.beginFill(this.yardFillColor)
    this.drawCircle(0, 0, this.yardRadius)
    //this.drawRect(this.yardX - this.yardWidth / 2, this.yardY - this.yardHeight / 2, this.yardWidth, this.yardHeight)
    this.endFill()
  }
}
