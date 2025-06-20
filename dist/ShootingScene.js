"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShootingScene = void 0;
const pixi_js_1 = require("pixi.js");
const gsap_1 = __importDefault(require("gsap"));
const ScoreBar_1 = require("./ScoreBar");
const Player_1 = require("./Player");
const logger_1 = require("./logger");
const Projectile_1 = require("./Projectile");
const Animal_1 = require("./Animal");
const Particle_1 = require("./Particle");
const StartModal_1 = require("./StartModal");
class ShootingScene extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.gameEnded = false;
        this.elapsedFrames = 0;
        this.ids = 0;
        this.backgroundSettings = {
            color: 0x00C853
        };
        this.startGame = () => {
            this.startModal.visible = false;
            this.scoreBar.clearScore();
            while (this.projectilesContainer.children[0] != null) {
                this.projectilesContainer.removeChild(this.projectilesContainer.children[0]);
            }
            while (this.enemiesContainer.children[0] != null) {
                this.enemiesContainer.removeChild(this.enemiesContainer.children[0]);
            }
            while (this.particlesContainer.children[0] != null) {
                this.particlesContainer.removeChild(this.particlesContainer.children[0]);
            }
            this.gameEnded = false;
        };
        this.setup(options);
        this.draw(options);
        this.addEventLesteners();
    }
    init({ app }) {
        this.app = app;
    }
    setup({ viewWidth, viewHeight }) {
        this.background = new pixi_js_1.Graphics();
        this.addChild(this.background);
        this.enemiesContainer = new pixi_js_1.ParticleContainer(2000, { scale: true, position: true, tint: true });
        this.addChild(this.enemiesContainer);
        this.projectilesContainer = new pixi_js_1.ParticleContainer(2000, { scale: true, position: true, tint: true });
        this.addChild(this.projectilesContainer);
        this.particlesContainer = new pixi_js_1.ParticleContainer(2000, { scale: true, position: true, tint: true });
        this.addChild(this.particlesContainer);
        this.scoreBar = new ScoreBar_1.ScoreBar();
        this.addChild(this.scoreBar);
        this.player = new Player_1.Player({
            radius: 30,
            fillColor: 0xffffff,
            damage: 20,
            health: 100
        });
        this.player.position.set(viewWidth / 2, viewHeight / 2);
        this.addChild(this.player);
        this.startModal = new StartModal_1.StartModal({ viewWidth, viewHeight });
        this.startModal.visible = false;
        this.addChild(this.startModal);
    }
    draw({ viewWidth, viewHeight }) {
        this.background.beginFill(this.backgroundSettings.color);
        this.background.drawRect(0, 0, viewWidth, viewHeight);
        this.background.endFill();
    }
    handleResize(options) {
        this.centerPlayer(options);
        this.resizeBackground(options);
        this.centerModal(options);
    }
    centerPlayer({ viewWidth, viewHeight }) {
        this.player.x = viewWidth / 2;
        this.player.y = viewHeight / 2;
    }
    centerModal({ viewWidth, viewHeight }) {
        // this.startModal.anchor
        this.startModal.position.set(viewWidth / 2 - this.startModal.boxOptions.width / 2, viewHeight / 2 - this.startModal.boxOptions.height / 2);
    }
    resizeBackground({ viewWidth, viewHeight }) {
        (0, logger_1.logLayout)(`bgw=${this.background.width} bgh=${this.background.height} vw=${viewWidth} vh=${viewHeight}`);
        this.background.width = viewWidth;
        this.background.height = viewHeight;
    }
    handleUpdate(deltaMS) {
        if (this.gameEnded) {
            return;
        }
        this.elapsedFrames += 1;
        const { x, y, width, height } = this;
        const left = x;
        const top = y;
        const right = x + width;
        const bottom = y + height;
        for (const child of this.particlesContainer.children) {
            const particle = child;
            particle.update();
            if (particle.alpha <= 0) {
                this.particlesContainer.removeChild(particle);
                (0, logger_1.logParticle)(`Removed particle alpha (${this.particlesContainer.children.length})`);
            }
            else if (particle.isOutOfViewport({ left, top, right, bottom })) {
                this.particlesContainer.removeChild(particle);
                (0, logger_1.logParticle)(`Removed particle out of viewport (${this.particlesContainer.children.length})`);
            }
        }
        for (const child of this.enemiesContainer.children) {
            const enemy = child;
            enemy.update();
            if (enemy.isOutOfViewport({ left, top, right, bottom })) {
                this.enemiesContainer.removeChild(enemy);
                (0, logger_1.logAnimal)(`Removed enemy out of viewport (${this.enemiesContainer.children.length})`);
            }
        }
        for (const child of this.projectilesContainer.children) {
            const projectile = child;
            projectile.update(deltaMS);
            if (projectile.isOutOfViewport({ left, top, right, bottom })) {
                this.projectilesContainer.removeChild(projectile);
                (0, logger_1.logProjectile)(`Removed projectile out of viewport (${this.projectilesContainer.children.length})`);
            }
        }
        const removedProjectileIds = [];
        for (const child of this.enemiesContainer.children) {
            // detect enemy collision with player
            const enemy = child;
            const distP = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (distP - enemy.radius - this.player.radius < 0) {
                this.endGame();
                break;
            }
            // detect enemy collision with projectile
            for (const _child of this.projectilesContainer.children) {
                const projectile = _child;
                if (!projectile.isProjectile) {
                    continue;
                }
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                if (dist - enemy.radius - projectile.radius < 0) {
                    this.projectilesContainer.removeChild(projectile);
                    (0, logger_1.logProjectile)(`Removed projectile hit emeny (${this.projectilesContainer.children.length})`);
                    removedProjectileIds.push(projectile.id);
                    // update score
                    this.scoreBar.addScore(100);
                    // create particle Effect
                    for (let index = 0; index < enemy.radius * 3; index++) {
                        const angleExp = Math.atan2(projectile.y - enemy.y, projectile.x - enemy.x);
                        const px = Math.cos(angleExp) * enemy.radius + enemy.x;
                        const py = Math.sin(angleExp) * enemy.radius + enemy.y;
                        const vx = (Math.random() - 0.5) * 10;
                        const vy = (Math.random() - 0.5) * 10;
                        const particle = new Particle_1.Particle({
                            app: this.app,
                            radius: 2,
                            vx,
                            vy,
                            fillColor: enemy.tintValue
                        });
                        particle.position.set(px, py);
                        this.particlesContainer.addChild(particle);
                    }
                    // shrink enemy
                    enemy.radius = enemy.radius - projectile.radius;
                    if (enemy.radius <= 5) {
                        this.enemiesContainer.removeChild(enemy);
                        (0, logger_1.logAnimal)(`Removed enemy killed (${this.enemiesContainer.children.length})`);
                    }
                    else {
                        this.scoreBar.addScore(projectile.radius);
                        gsap_1.default.to(enemy, {
                            width: enemy.radius * 2,
                            height: enemy.radius * 2
                        });
                    }
                }
            }
        }
        if (removedProjectileIds.length > 0) {
            let startIdx = -1;
            let endIdx = -1;
            this.projectilesContainer.children.forEach((child, idx) => {
                const projectileTrail = child;
                if (!projectileTrail.isProjectile && removedProjectileIds.includes(projectileTrail.mainId)) {
                    if (startIdx === -1) {
                        startIdx = idx;
                    }
                    endIdx = idx;
                }
            });
            if (startIdx > -1 && endIdx > -1) {
                this.projectilesContainer.removeChildren(startIdx, endIdx);
                (0, logger_1.logProjectileTrail)(`Removed projectile trails [${startIdx}:${endIdx}]`);
            }
        }
        if (this.elapsedFrames % 60 === 0) {
            this.spawnEnemies();
        }
    }
    addEventLesteners() {
        this.interactive = true;
        this.on('pointertap', this.handlePointerTap);
        this.startModal.on('click', this.startGame);
    }
    removeEventListeners() {
        this.interactive = false;
        this.off('pointertap', this.handlePointerTap);
        this.startModal.off('click', this.startGame);
    }
    handlePointerTap(e) {
        if (this.gameEnded) {
            return;
        }
        const point = this.toLocal(e.global);
        (0, logger_1.logPointerEvent)(`${e.type} px=${point.x} py=${point.y}`);
        const diffY = point.y - this.player.y;
        const diffX = point.x - this.player.x;
        // const diff = Math.hypot(diffX, diffY)
        // const maxDiff = Math.hypot(this.player.x, this.player.y)
        // const relVelocityFactor = diff / maxDiff
        const relVelocityFactor = 1;
        const angle = Math.atan2(diffY, diffX);
        (0, logger_1.logPointerEvent)(`angle=${angle} diffY=${diffY} diffX=${diffX} relVelocityFactor=${relVelocityFactor}`);
        const radius = 5 + Math.random() * 15;
        const velocityAmplifier = 20;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const vx = cos * relVelocityFactor * velocityAmplifier;
        const vy = sin * relVelocityFactor * velocityAmplifier;
        const projectile = new Projectile_1.Projectile({
            id: ++this.ids,
            app: this.app,
            radius,
            fillColor: 0xffffff,
            vx,
            vy
        });
        projectile.anchor.set(0.5, 0.5);
        projectile.position.set(this.player.x, this.player.y);
        this.projectilesContainer.addChild(projectile);
        const trailProjectiles = projectile.BuildTrail();
        (0, logger_1.logProjectileTrail)(`Trail projectiles (${trailProjectiles.length})`);
        trailProjectiles.forEach(p => {
            p.anchor.set(0.5, 0.5);
            p.position.set(this.player.x, this.player.y);
            this.projectilesContainer.addChild(p);
        });
        (0, logger_1.logProjectile)(`Added (${this.projectilesContainer.children.length})`);
    }
    spawnEnemies() {
        const radMax = 30;
        const radMin = 15;
        const rad = Math.floor(radMin + Math.random() * (radMax - radMin + 1));
        const { width, height } = this.background;
        const RI = 1 + Math.round(Math.random() * (4 - 1));
        let x = 0;
        let y = 0;
        switch (RI) {
            case 1:
                x = width + rad;
                y = Math.random() * height;
                break;
            case 2:
                x = Math.random() * width;
                y = 0 - rad;
                break;
            case 3:
                x = 0 - rad;
                y = Math.random() * height;
                break;
            case 4:
                x = Math.random() * width;
                y = height + rad;
                break;
        }
        const velMax = 3;
        const velMin = 1;
        const velocityAmplifier = velMin + Math.round((velMax - velMin) * Math.random());
        const angle = Math.atan2(this.player.y - y, this.player.x - x);
        const vx = Math.cos(angle) * velocityAmplifier;
        const vy = Math.sin(angle) * velocityAmplifier;
        const enemy = new Animal_1.Animal({
            app: this.app,
            radius: rad,
            vx,
            vy
        });
        enemy.anchor.set(0.5, 0.5);
        enemy.position.set(x, y);
        this.enemiesContainer.addChild(enemy);
    }
    endGame() {
        this.gameEnded = true;
        this.startModal.scoreText.text = this.scoreBar.score;
        this.startModal.visible = true;
    }
}
exports.ShootingScene = ShootingScene;
//# sourceMappingURL=ShootingScene.js.map