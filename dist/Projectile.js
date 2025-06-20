"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectileTrail = exports.Projectile = void 0;
const pixi_js_1 = require("pixi.js");
const logger_1 = require("./logger");
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
//# sourceMappingURL=Projectile.js.map