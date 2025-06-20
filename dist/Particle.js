"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Particle = void 0;
const pixi_js_1 = require("pixi.js");
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
//# sourceMappingURL=Particle.js.map