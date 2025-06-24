import { Container, type FederatedPointerEvent, Graphics, ParticleContainer, type Application, Sprite, Texture } from 'pixi.js'
import gsap from 'gsap'
import { ScoreBar } from './ScoreBar'
import { Player } from './Player'
import { Yard } from './Yard'
import { logAnimal, logLayout, logParticle, logPointerEvent, logProjectile, logProjectileTrail } from './logger'
import { type IScene } from './SceneManager'
import { Projectile, type ProjectileTrail } from './Projectile'
import { Animal } from './Animal'
import { Particle } from './Particle'
import { StartModal } from './StartModal'
import { Settings } from './Settings'

interface IHuntingSceneOptions {
  viewWidth: number
  viewHeight: number
}

export class HuntingScene extends Container implements IScene {
  public gameEnded = false
  public elapsedFrames = 0
  public ids = 0
  public app!: Application
  public background!: Graphics

  public backgroundSettings = {
    color: Settings.backgroundColor
  }

  public player!: Player
  public yard!: Yard
  public projectilesContainer!: ParticleContainer
  public animalsContainer!: ParticleContainer
  public animalsInPlayerGroupContainer!: ParticleContainer
  public particlesContainer!: ParticleContainer
  public scoreBar!: ScoreBar
  public startModal!: StartModal
  private viewWidth_2!: number
  private viewHeight_2!: number
  private setInYardShow!: boolean

  constructor(options: IHuntingSceneOptions) {
    super()
    this.setup(options)
    this.draw(options)
    this.addEventLesteners()
    this.viewWidth_2 = 0
    this.viewHeight_2 = 0
    this.setInYardShow = false
  }

  init({ app }: { app: Application }): void {
    this.app = app
  }

  setup({ viewWidth, viewHeight }: IHuntingSceneOptions): void {
    this.background = new Graphics()
    this.addChild(this.background)

    this.yard = new Yard({
      yardX: 0,
      yardY: 0,
      yardRadius: Settings.yardRadius,
      yardFillColor: Settings.yardColor,
      yardLineColor: Settings.yardLineColor
    })
    this.yard.position.set(viewWidth / 2, viewHeight / 2)
    this.addChild(this.yard)

    this.animalsContainer = new ParticleContainer(2000, { scale: true, position: true, tint: true })
    this.addChild(this.animalsContainer)

    this.animalsInPlayerGroupContainer = new ParticleContainer(2000, { scale: true, position: true, tint: true })
    this.addChild(this.animalsInPlayerGroupContainer)

    this.projectilesContainer = new ParticleContainer(2000, { scale: true, position: true, tint: true })
    this.addChild(this.projectilesContainer)

    this.particlesContainer = new ParticleContainer(2000, { scale: true, position: true, tint: true })
    this.addChild(this.particlesContainer)

    this.scoreBar = new ScoreBar()
    this.addChild(this.scoreBar)

    this.player = new Player({
      radius: Settings.playerRadius,
      fillColor: Settings.playerColor,
      damage: 20,
      health: 100
    })
    this.player.position.set(viewWidth / 2, viewHeight / 2)
    this.addChild(this.player)

    this.startModal = new StartModal({ viewWidth, viewHeight })
    this.startModal.visible = false
    this.addChild(this.startModal)
  }

  draw({ viewWidth, viewHeight }: IHuntingSceneOptions): void {
    this.background.beginFill(this.backgroundSettings.color)
    this.background.drawRect(0, 0, viewWidth, viewHeight)
    this.background.endFill()
  }

  handleResize(options: { viewWidth: number, viewHeight: number }): void {
    this.centerPlayer(options)
    this.resizeBackground(options)
    this.centerModal(options)
  }

  centerPlayer({ viewWidth, viewHeight }: { viewWidth: number, viewHeight: number }): void {
    this.player.x = viewWidth / 2
    this.player.y = viewHeight / 2
    this.viewWidth_2 = this.player.x
    this.viewHeight_2 = this.player.y
    this.yard.x = viewWidth / 2
    this.yard.y = viewHeight / 2
  }

  centerModal({ viewWidth, viewHeight }: { viewWidth: number, viewHeight: number }): void {
    // this.startModal.anchor
    this.startModal.position.set(viewWidth / 2 - this.startModal.boxOptions.width / 2, viewHeight / 2 - this.startModal.boxOptions.height / 2)
  }

  resizeBackground({ viewWidth, viewHeight }: { viewWidth: number, viewHeight: number }): void {
    logLayout(`bgw=${this.background.width} bgh=${this.background.height} vw=${viewWidth} vh=${viewHeight}`)
    this.background.width = viewWidth
    this.background.height = viewHeight
  }

  handleUpdate(deltaMS: number): void {
    if (this.gameEnded) {
      return
    }
    this.elapsedFrames += 1
    const { x, y, width, height } = this
    const left = x
    const top = y
    const right = x + width
    const bottom = y + height
    for (const child of this.particlesContainer.children) {
      const particle: Particle = child as Particle
      particle.update()
      if (particle.alpha <= 0) {
        this.particlesContainer.removeChild(particle)
        logParticle(`Removed particle alpha (${this.particlesContainer.children.length})`)
      } else if (particle.isOutOfViewport({ left, top, right, bottom })) {
        this.particlesContainer.removeChild(particle)
        logParticle(`Removed particle out of viewport (${this.particlesContainer.children.length})`)
      }
    }
    for (const child of this.animalsContainer.children) {
      const animal: Animal = child as Animal
      animal.update()
      if (animal.isOutOfViewport({ left, top, right, bottom })) {
        animal.movinDirection = !animal.movinDirection
        animal.update()
      }
    }
    if (this.player.visible) {
      for (const child of this.animalsInPlayerGroupContainer.children) {
        const animal: Animal = child as Animal
        animal.playerX = this.player.position.x
        animal.playerY = this.player.position.y
        animal.update()
      }
    }

    for (const child of this.projectilesContainer.children) {
      const projectile: Projectile | ProjectileTrail = child as Projectile | ProjectileTrail
      projectile.update(deltaMS)
      if (!this.player.visible) {
        for (const child of this.animalsInPlayerGroupContainer.children) {
          const animal: Animal = child as Animal
          animal.playerX = projectile.position.x
          animal.playerY = projectile.position.y
          animal.update()
        }
      }
      if (projectile.isOutOfViewport({ left, top, right, bottom })) {
        this.projectilesContainer.removeChild(projectile)
        this.player.visible = true
        logProjectile(`Removed projectile out of viewport (${this.projectilesContainer.children.length})`)
      }
      if (projectile.isInsideYard(this.yard)
        && this.animalsInPlayerGroupContainer.children.length === Settings.playerGroupAnimalMaximum 
      && !this.setInYardShow) {
        this.setInYardShow = true
        this.projectilesContainer.removeChildren()
        //console.log(`Projectile is in yard`)
        setTimeout(() => {
          this.animalsInPlayerGroupContainer.removeChildren()
          this.setInYardShow = false
          this.scoreBar.addScore(Settings.playerGroupAnimalMaximum)
        }, 1000);
        this.player.visible = true
        this.player.x = this.viewWidth_2
        this.player.y = this.viewHeight_2
      }
    }
    const removedProjectileIds: number[] = []
    for (const child of this.animalsContainer.children) {
      // detect animal collision with player
      const animal: Animal = child as Animal
      const distP = Math.hypot(this.yard.x - animal.x, this.yard.y - animal.y)
      if (distP - animal.radius - this.yard.yardRadius < 0) {
        animal.movinDirection = !animal.movinDirection
        animal.update()
        //this.endGame()
        break
      }
      // detect animal collision with projectile
      for (const _child of this.projectilesContainer.children) {
        const projectile: Projectile = _child as Projectile
        if (!projectile.isProjectile) {
          continue
        }
        const dist = Math.hypot(projectile.x - animal.x, projectile.y - animal.y)
        if (dist - animal.radius - projectile.radius < 0) {
          this.projectilesContainer.removeChild(projectile)
          logProjectile(`Removed projectile hit emeny (${this.projectilesContainer.children.length})`)
          removedProjectileIds.push(projectile.id)
          this.player.visible = true
          const angleExp = Math.atan2(projectile.y - animal.y, projectile.x - animal.x)
          const px = Math.cos(angleExp) * animal.radius + animal.x
          const py = Math.sin(angleExp) * animal.radius + animal.y
          this.player.position.set(px, py)
          this.player.visible = true
          const animalColor = Number.parseInt(animal.colorStr, 16)
          // create particle Effect
          for (let index = 0; index < animal.radius * 3; index++) {
            const vx = (Math.random() - 0.5) * 10
            const vy = (Math.random() - 0.5) * 10
            const particle = new Particle({
              app: this.app,
              radius: 2,
              vx,
              vy,
              fillColor: animalColor
            })
            particle.position.set(px, py)
            this.particlesContainer.addChild(particle)
          }
          // shrink animal
          animal.radius = animal.radius - projectile.radius
          if (animal.radius <= 5) {
            if (this.animalsInPlayerGroupContainer.children.length < Settings.playerGroupAnimalMaximum) {
              animal.inPlayerGroup = true
              animal.playerX = this.player.position.x
              animal.playerY = this.player.position.y
              this.animalsInPlayerGroupContainer.addChild(animal)
              animal.playerGroupNumber = this.animalsInPlayerGroupContainer.children.length
            } else {
              this.animalsContainer.removeChild(animal)
            }
            logAnimal(`Removed animal killed (${this.animalsContainer.children.length})`)
          } else {
            gsap.to(animal, {
              width: animal.radius * 2,
              height: animal.radius * 2
            })
          }
        } else {
          this.player.visible = false
        }
      }
    }
    if (removedProjectileIds.length > 0) {
      let startIdx = -1
      let endIdx = -1
      this.projectilesContainer.children.forEach((child, idx) => {
        const projectileTrail: ProjectileTrail = child as ProjectileTrail
        if (!projectileTrail.isProjectile && removedProjectileIds.includes(projectileTrail.mainId)) {
          if (startIdx === -1) {
            startIdx = idx
          }
          endIdx = idx
        }
      })
      if (startIdx > -1 && endIdx > -1) {
        this.projectilesContainer.removeChildren(startIdx, endIdx)
        logProjectileTrail(`Removed projectile trails [${startIdx}:${endIdx}]`)
      }
    }
    if (this.elapsedFrames % 60 === 0) {
      this.spawnAnimals()
    }
  }

  addEventLesteners(): void {
    this.interactive = true
    this.on('pointertap', this.handlePointerTap)
    this.startModal.on('click', this.startGame)
  }

  removeEventListeners(): void {
    this.interactive = false
    this.off('pointertap', this.handlePointerTap)
    this.startModal.off('click', this.startGame)
  }

  handlePointerTap(e: FederatedPointerEvent): void {
    if (this.gameEnded) {
      return
    }
    const point = this.toLocal(e.global)
    logPointerEvent(`${e.type} px=${point.x} py=${point.y}`)
    const diffY = point.y - this.player.y
    const diffX = point.x - this.player.x
    // const diff = Math.hypot(diffX, diffY)
    // const maxDiff = Math.hypot(this.player.x, this.player.y)
    // const relVelocityFactor = diff / maxDiff
    const relVelocityFactor = 1
    const angle = Math.atan2(diffY, diffX)
    logPointerEvent(`angle=${angle} diffY=${diffY} diffX=${diffX} relVelocityFactor=${relVelocityFactor}`)
    const radius = Settings.playerRadius
    const velocityAmplifier = 20
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const vx = cos * relVelocityFactor * velocityAmplifier
    const vy = sin * relVelocityFactor * velocityAmplifier
    const projectile = new Projectile({
      id: ++this.ids,
      app: this.app,
      radius,
      fillColor: Settings.playerColor,     //Shooting start color
      vx,
      vy
    })
    projectile.anchor.set(0.5, 0.5)
    projectile.position.set(this.player.x, this.player.y)
    this.projectilesContainer.addChild(projectile)
    const trailProjectiles = projectile.BuildTrail()
    logProjectileTrail(`Trail projectiles (${trailProjectiles.length})`)
    trailProjectiles.forEach(p => {
      p.anchor.set(0.5, 0.5)
      p.position.set(this.player.x, this.player.y)
      this.projectilesContainer.addChild(p)
    })
    logProjectile(`Added (${this.projectilesContainer.children.length})`)
  }

  spawnAnimals(): void {
    const radMax = 30
    const radMin = 15
    const rad = Math.floor(radMin + Math.random() * (radMax - radMin + 1))
    const { width, height } = this.background
    const RI = 1 + Math.round(Math.random() * (4 - 1))
    let x = 0; let y = 0
    switch (RI) {
      case 1:
        x = width + rad
        y = Math.random() * height
        break
      case 2:
        x = Math.random() * width
        y = 0 - rad
        break
      case 3:
        x = 0 - rad
        y = Math.random() * height
        break
      case 4:
        x = Math.random() * width
        y = height + rad
        break
    }
    const velMax = 3
    const velMin = 1
    const velocityAmplifier = velMin + Math.round((velMax - velMin) * Math.random())
    const angle = Math.atan2(this.player.y - y, this.player.x - x)
    const vx = Math.cos(angle) * velocityAmplifier
    const vy = Math.sin(angle) * velocityAmplifier

    const animal = new Animal({
      app: this.app,
      radius: rad,
      vx,
      vy,
      colorIndex: Math.trunc(Math.random() * 4)
    })
    animal.anchor.set(0.5, 0.5)
    animal.position.set(x, y)
    this.animalsContainer.addChild(animal)
  }

  startGame = (): void => {
    this.startModal.visible = false
    this.scoreBar.clearScore()
    while (this.projectilesContainer.children[0] != null) {
      this.projectilesContainer.removeChild(this.projectilesContainer.children[0])
    }
    while (this.animalsContainer.children[0] != null) {
      this.animalsContainer.removeChild(this.animalsContainer.children[0])
    }
    while (this.particlesContainer.children[0] != null) {
      this.particlesContainer.removeChild(this.particlesContainer.children[0])
    }
    this.gameEnded = false
  }

  endGame(): void {
    this.gameEnded = true
    this.startModal.scoreText.text = this.scoreBar.score
    this.startModal.visible = true
  }
}
