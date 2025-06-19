/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/Enemy.ts":
/*!**********************!*\
  !*** ./src/Enemy.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Enemy = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class Enemy extends pixi_js_1.Sprite {
    constructor(options) {
        super();
        this.isProjectile = true;
        this.app = options.app;
        this.radius = options.radius;
        this.vx = options.vx;
        this.vy = options.vy;
        this.setup(options);
    }
    static numColorToArray(num) {
        const numStr = num.toString(16).padStart(6, '0');
        const r = Number.parseInt(numStr[0] + numStr[1], 16); // rgb >> 16;
        const g = Number.parseInt(numStr[2] + numStr[3], 16); // (rgb >> 8) % 256;
        const b = Number.parseInt(numStr[4] + numStr[5], 16); // rgb % 256;
        return [r, g, b];
    }
    static toHex(num) {
        let hex = num.toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    }
    static interpolateColors(p) {
        const q = 1 - p;
        const [r1, g1, b1] = this.maxColorArray;
        const [r2, g2, b2] = this.minColorArray;
        const rr = Math.round(r1 * p + r2 * q);
        const rg = Math.round(g1 * p + g2 * q);
        const rb = Math.round(b1 * p + b2 * q);
        // return Number((rr << 16) + (rg << 8) + rb).toString(16)
        return Enemy.toHex(rr) + Enemy.toHex(rg) + Enemy.toHex(rb);
    }
    setup(options) {
        let texture = Enemy.textureCache;
        if (texture == null) {
            const circle = new pixi_js_1.Graphics();
            circle.beginFill(0xffffff);
            circle.drawCircle(0, 0, this.radius);
            circle.endFill();
            circle.cacheAsBitmap = true;
            texture = options.app.renderer.generateTexture(circle);
            Enemy.textureCache = texture;
        }
        this.texture = texture;
        this.scale.set(options.radius * 2 / texture.width, options.radius * 2 / texture.height);
        const colorStr = Enemy.interpolateColors(Math.random());
        this.tint = Number.parseInt(colorStr, 16);
    }
    update() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }
    isOutOfViewport({ left, top, right, bottom }) {
        const pLeft = this.x - this.radius;
        const pTop = this.y - this.radius;
        const pRight = this.x + this.radius;
        const pBottom = this.y + this.radius;
        if (pRight < left) {
            return true;
        }
        if (pLeft > right) {
            return true;
        }
        if (pBottom < top) {
            return true;
        }
        if (pTop > bottom) {
            return true;
        }
        return false;
    }
}
Enemy.minColor = 0xff0000;
Enemy.minColorArray = Enemy.numColorToArray(Enemy.minColor);
Enemy.maxColor = 0x00ff00;
Enemy.maxColorArray = Enemy.numColorToArray(Enemy.maxColor);
exports.Enemy = Enemy;


/***/ }),

/***/ "./src/Particle.ts":
/*!*************************!*\
  !*** ./src/Particle.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Particle = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class Particle extends pixi_js_1.Sprite {
    constructor(options) {
        super();
        this.isProjectile = true;
        this.app = options.app;
        this.radius = options.radius;
        this.vx = options.vx;
        this.vy = options.vy;
        this.setup(options);
    }
    setup(options) {
        let texture = Particle.textureCache;
        if (texture == null) {
            const circle = new pixi_js_1.Graphics();
            circle.beginFill(0xffffff);
            circle.drawCircle(0, 0, this.radius);
            circle.endFill();
            circle.cacheAsBitmap = true;
            texture = options.app.renderer.generateTexture(circle);
            Particle.textureCache = texture;
        }
        this.texture = texture;
        this.scale.set(options.radius * 2 / texture.width, options.radius * 2 / texture.height);
        this.tint = options.fillColor;
    }
    update() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        this.alpha = this.alpha - 0.01;
        if (this.alpha < 0) {
            this.alpha = 0;
        }
    }
    isOutOfViewport({ left, top, right, bottom }) {
        const pLeft = this.x - this.radius;
        const pTop = this.y - this.radius;
        const pRight = this.x + this.radius;
        const pBottom = this.y + this.radius;
        if (pRight < left) {
            return true;
        }
        if (pLeft > right) {
            return true;
        }
        if (pBottom < top) {
            return true;
        }
        if (pTop > bottom) {
            return true;
        }
        return false;
    }
}
exports.Particle = Particle;


/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class Player extends pixi_js_1.Graphics {
    constructor(options) {
        super();
        this.radius = options.radius;
        this.damage = options.damage;
        this.health = options.health;
        this.fillColor = options.fillColor;
        this.draw();
    }
    draw() {
        this.beginFill(this.fillColor);
        this.drawCircle(0, 0, this.radius);
        this.endFill();
    }
}
exports.Player = Player;


/***/ }),

/***/ "./src/Projectile.ts":
/*!***************************!*\
  !*** ./src/Projectile.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectileTrail = exports.Projectile = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
class Projectile extends pixi_js_1.Sprite {
    constructor(options) {
        super();
        this.isProjectile = true;
        this.id = options.id;
        this.app = options.app;
        this.radius = options.radius;
        this.vx = options.vx;
        this.vy = options.vy;
        this.fillColor = options.fillColor;
        this.setup(options);
    }
    setup(options) {
        let texture = Projectile.textureCache;
        if (texture == null) {
            const circle = new pixi_js_1.Graphics();
            circle.beginFill(this.fillColor);
            circle.drawCircle(0, 0, this.radius);
            circle.endFill();
            circle.cacheAsBitmap = true;
            texture = options.app.renderer.generateTexture(circle);
            Projectile.textureCache = texture;
        }
        this.texture = texture;
    }
    update() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }
    isOutOfViewport({ left, top, right, bottom }) {
        const pLeft = this.x - this.radius;
        const pTop = this.y - this.radius;
        const pRight = this.x + this.radius;
        const pBottom = this.y + this.radius;
        if (pRight < left) {
            return true;
        }
        if (pLeft > right) {
            return true;
        }
        if (pBottom < top) {
            return true;
        }
        if (pTop > bottom) {
            return true;
        }
        return false;
    }
    BuildTrail() {
        const length = Math.floor(this.radius) * 3;
        // const length = 1
        return Array.from({ length }, (_, idx) => {
            return new ProjectileTrail({
                mainId: this.id,
                mainX: this.x,
                mainY: this.y,
                texture: this.texture,
                radius: this.radius - (this.radius - 1) * idx / length,
                vx: this.vx,
                vy: this.vy,
                dt: 0.5 - (0.5 - 0.01) * idx / length,
                alpha: 0.9 - 0.8 * (idx + 1) / length
            });
        });
    }
}
exports.Projectile = Projectile;
class ProjectileTrail extends pixi_js_1.Sprite {
    constructor(options) {
        var _a, _b, _c;
        super(options.texture);
        this.isProjectile = false;
        this.mainId = options.mainId;
        this.radius = options.radius;
        this.mainX = options.mainX;
        this.mainY = options.mainY;
        this.vx = options.vx;
        this.vy = options.vy;
        this.minDelta = (_a = options.minDelta) !== null && _a !== void 0 ? _a : 0.05;
        this.dt = (_b = options.dt) !== null && _b !== void 0 ? _b : 0.1;
        this.tint = 0xffffff;
        this.alpha = (_c = options.alpha) !== null && _c !== void 0 ? _c : 1;
        this.scale.set(options.radius * 2 / options.texture.width, options.radius * 2 / options.texture.height);
    }
    update(deltaMS) {
        // const dt = 1 - Math.pow(1 - this.sharpness, deltaMS)
        const dt = this.dt;
        this.mainX += this.vx;
        this.mainY += this.vy;
        (0, logger_1.logProjectileTrail)(`main(${this.mainX}, ${this.mainY}) cur(${this.x}, ${this.y})`);
        const dx = Math.abs(this.x - this.mainX);
        const dy = Math.abs(this.y - this.mainY);
        (0, logger_1.logProjectileTrail)('dt', dt, 'dx', dx, 'dy', dy, 'mind', this.minDelta);
        if (dx > this.minDelta) {
            (0, logger_1.logProjectileTrail)('dx * dt', dx * dt);
            this.x += this.vx > 0 ? dx * dt : -dx * dt;
        }
        else {
            this.x = this.mainX;
        }
        if (dy > this.minDelta) {
            (0, logger_1.logProjectileTrail)('dy * dt', dy * dt);
            this.y += this.vy > 0 ? dy * dt : -dy * dt;
        }
        else {
            this.y = this.mainY;
        }
    }
    isOutOfViewport({ left, top, right, bottom }) {
        const pLeft = this.x - this.radius;
        const pTop = this.y - this.radius;
        const pRight = this.x + this.radius;
        const pBottom = this.y + this.radius;
        if (pRight < left) {
            return true;
        }
        if (pLeft > right) {
            return true;
        }
        if (pBottom < top) {
            return true;
        }
        if (pTop > bottom) {
            return true;
        }
        return false;
    }
}
exports.ProjectileTrail = ProjectileTrail;


/***/ }),

/***/ "./src/SceneManager.ts":
/*!*****************************!*\
  !*** ./src/SceneManager.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SceneManager = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
class DefaultScene extends pixi_js_1.Container {
    init() { }
    handleUpdate() { }
    handleResize() { }
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class SceneManager {
    constructor() { }
    static get width() {
        return window.innerWidth;
    }
    static get height() {
        return window.innerHeight;
    }
    static async initialize() {
        var _a;
        const app = new pixi_js_1.Application({
            autoDensity: true,
            resolution: (_a = window.devicePixelRatio) !== null && _a !== void 0 ? _a : 1,
            width: SceneManager.width,
            height: SceneManager.height,
            resizeTo: window
        });
        document.body.appendChild(app.view);
        if (logger_1.logApp.enabled) {
            (0, logger_1.logApp)('window.app initialized!');
            window.app = app;
        }
        SceneManager.app = app;
        SceneManager.setupEventLesteners();
    }
    static setupEventLesteners() {
        window.addEventListener('resize', SceneManager.resizeDeBounce);
        SceneManager.app.ticker.add(SceneManager.updateHandler);
    }
    static async changeScene(newScene) {
        SceneManager.app.stage.removeChild(SceneManager.currentScene);
        SceneManager.currentScene.destroy();
        SceneManager.currentScene = newScene;
        SceneManager.app.stage.addChild(SceneManager.currentScene);
        SceneManager.currentScene.init({ app: SceneManager.app });
        SceneManager.resizeHandler();
    }
    static resizeDeBounce() {
        SceneManager.cancelScheduledResizeHandler();
        SceneManager.scheduleResizeHandler();
    }
    static cancelScheduledResizeHandler() {
        clearTimeout(SceneManager.resizeTimeoutId);
    }
    static scheduleResizeHandler() {
        SceneManager.resizeTimeoutId = setTimeout(() => {
            SceneManager.cancelScheduledResizeHandler();
            SceneManager.resizeHandler();
        }, SceneManager.resizeTimeout);
    }
    static resizeHandler() {
        SceneManager.currentScene.handleResize({
            viewWidth: SceneManager.width,
            viewHeight: SceneManager.height
        });
    }
    static updateHandler() {
        SceneManager.currentScene.handleUpdate(SceneManager.app.ticker.deltaMS);
    }
}
SceneManager.currentScene = new DefaultScene();
SceneManager.resizeTimeout = 300;
exports.SceneManager = SceneManager;


/***/ }),

/***/ "./src/ScoreBar.ts":
/*!*************************!*\
  !*** ./src/ScoreBar.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScoreBar = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class ScoreBar extends pixi_js_1.Container {
    constructor() {
        super();
        this.scoreOptions = {
            padding: 20,
            textColor: 0xffffff,
            textSize: 40
        };
        this._score = 0;
        this.setup();
    }
    get score() {
        return this._score;
    }
    setup() {
        const { scoreOptions } = this;
        const scoreText = new pixi_js_1.Text(`Score: ${this._score}`, {
            fontSize: scoreOptions.textSize,
            fill: scoreOptions.textColor
        });
        scoreText.position.set(scoreOptions.padding, scoreOptions.padding);
        this.addChild(scoreText);
        this.scoreText = scoreText;
    }
    addScore(score) {
        this._score += Math.round(score);
        this.scoreText.text = `Score: ${this._score}`;
    }
    clearScore() {
        this._score = 0;
        this.scoreText.text = `Score: ${this._score}`;
    }
}
exports.ScoreBar = ScoreBar;


/***/ }),

/***/ "./src/ShootingScene.ts":
/*!******************************!*\
  !*** ./src/ShootingScene.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShootingScene = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
const gsap_1 = __importDefault(__webpack_require__(/*! gsap */ "./node_modules/gsap/index.js"));
const ScoreBar_1 = __webpack_require__(/*! ./ScoreBar */ "./src/ScoreBar.ts");
const Player_1 = __webpack_require__(/*! ./Player */ "./src/Player.ts");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/logger.ts");
const Projectile_1 = __webpack_require__(/*! ./Projectile */ "./src/Projectile.ts");
const Enemy_1 = __webpack_require__(/*! ./Enemy */ "./src/Enemy.ts");
const Particle_1 = __webpack_require__(/*! ./Particle */ "./src/Particle.ts");
const StartModal_1 = __webpack_require__(/*! ./StartModal */ "./src/StartModal.ts");
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
                (0, logger_1.logEnemy)(`Removed enemy out of viewport (${this.enemiesContainer.children.length})`);
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
                        (0, logger_1.logEnemy)(`Removed enemy killed (${this.enemiesContainer.children.length})`);
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
        const enemy = new Enemy_1.Enemy({
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


/***/ }),

/***/ "./src/StartModal.ts":
/*!***************************!*\
  !*** ./src/StartModal.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartModal = void 0;
const pixi_js_1 = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/lib/index.js");
class StartModal extends pixi_js_1.Container {
    constructor(options) {
        super();
        this.boxOptions = {
            fill: 0xffffff,
            width: 300,
            height: 200,
            borderRadius: 5
        };
        this.scoreOptions = {
            top: -50,
            textColor: 0x000000,
            textSize: 40,
            fontWeight: 'bold'
        };
        this.pointsOptions = {
            top: -10,
            textColor: 0x000000,
            textSize: 20
        };
        this.buttonOptions = {
            top: 120,
            left: 50,
            width: 200,
            height: 50,
            fill: 0x0ea5e9,
            borderRadius: 10
        };
        this.buttonTextOptions = {
            top: 95,
            textColor: 0xffffff,
            textSize: 20
        };
        this.setup(options);
        this.draw(options);
        this.setupEventListeners();
    }
    setup(_) {
        this.modalBox = new pixi_js_1.Graphics();
        this.addChild(this.modalBox);
        const { boxOptions, scoreOptions, pointsOptions, buttonTextOptions } = this;
        this.scoreText = new pixi_js_1.Text('0', {
            fontSize: scoreOptions.textSize,
            fill: scoreOptions.textColor,
            fontWeight: scoreOptions.fontWeight
        });
        this.scoreText.anchor.set(0.5, 0.5);
        this.scoreText.position.set(boxOptions.width / 2, boxOptions.height / 2 + scoreOptions.top);
        this.addChild(this.scoreText);
        this.pointsText = new pixi_js_1.Text('Points', {
            fontSize: pointsOptions.textSize,
            fill: pointsOptions.textColor
        });
        this.pointsText.anchor.set(0.5, 0.5);
        this.pointsText.position.set(boxOptions.width / 2, boxOptions.height / 2 + pointsOptions.top);
        this.addChild(this.pointsText);
        this.button = new pixi_js_1.Graphics();
        this.button.interactive = true;
        this.button.cursor = 'pointer';
        this.addChild(this.button);
        this.buttonText = new pixi_js_1.Text('Start Game', {
            fontSize: buttonTextOptions.textSize,
            fill: buttonTextOptions.textColor
        });
        this.buttonText.anchor.set(0.5, 0.5);
        this.buttonText.position.set(boxOptions.width / 2, boxOptions.height / 2 / 2 + buttonTextOptions.top);
        this.button.addChild(this.buttonText);
    }
    draw(_) {
        const { boxOptions, buttonOptions } = this;
        this.modalBox.beginFill(boxOptions.fill);
        this.modalBox.drawRoundedRect(0, 0, boxOptions.width, boxOptions.height, boxOptions.borderRadius);
        this.modalBox.endFill();
        this.button.beginFill(buttonOptions.fill);
        this.button.drawRoundedRect(buttonOptions.left, buttonOptions.top, buttonOptions.width, buttonOptions.height, buttonOptions.borderRadius);
        this.button.endFill();
    }
    setupEventListeners() {
        this.button.on('pointertap', (e) => {
            this.emit('click', e);
        });
    }
}
exports.StartModal = StartModal;


/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./styles.css */ "./src/styles.css");
const SceneManager_1 = __webpack_require__(/*! ./SceneManager */ "./src/SceneManager.ts");
const ShootingScene_1 = __webpack_require__(/*! ./ShootingScene */ "./src/ShootingScene.ts");
async function run() {
    const ellipsis = document.querySelector('.ellipsis');
    if (ellipsis != null) {
        ellipsis.style.display = 'none';
    }
    await SceneManager_1.SceneManager.initialize();
    await SceneManager_1.SceneManager.changeScene(new ShootingScene_1.ShootingScene({
        viewWidth: SceneManager_1.SceneManager.width,
        viewHeight: SceneManager_1.SceneManager.height
    }));
}
run().catch((err) => {
    console.error(err);
    const div = document.createElement('div');
    const divStack = document.createElement('div');
    document.body.prepend(div);
    document.body.prepend(divStack);
    div.style.color = 'red';
    div.style.fontSize = '2rem';
    div.innerText = ((Boolean(err)) && (Boolean(err.message))) ? err.message : err;
    divStack.style.color = 'red';
    divStack.style.fontSize = '2rem';
    divStack.innerText = ((Boolean(err)) && (Boolean(err.stack))) ? err.stack : '';
});


/***/ }),

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logProjectileTrail = exports.logParticle = exports.logEnemy = exports.logProjectile = exports.logPointerEvent = exports.logLayout = exports.logApp = void 0;
const debug_1 = __importDefault(__webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js"));
exports.logApp = (0, debug_1.default)('shooting-app');
exports.logLayout = (0, debug_1.default)('shooting-layout');
exports.logPointerEvent = (0, debug_1.default)('shooting-pointer-event');
exports.logProjectile = (0, debug_1.default)('shooting-projectile');
exports.logEnemy = (0, debug_1.default)('shooting-enemy');
exports.logParticle = (0, debug_1.default)('shooting-particle');
exports.logProjectileTrail = (0, debug_1.default)('shooting-projectile-trail');


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksimple_html5_shooting_game"] = self["webpackChunksimple_html5_shooting_game"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map