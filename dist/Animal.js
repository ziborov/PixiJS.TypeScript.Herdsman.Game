"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const pixi_js_1 = require("pixi.js");
class Animal extends pixi_js_1.Sprite {
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
        return Animal.toHex(rr) + Animal.toHex(rg) + Animal.toHex(rb);
    }
    setup(options) {
        let texture = Animal.textureCache;
        if (texture == null) {
            const circle = new pixi_js_1.Graphics();
            circle.beginFill(0xffffff);
            circle.drawCircle(0, 0, this.radius);
            circle.endFill();
            circle.cacheAsBitmap = true;
            texture = options.app.renderer.generateTexture(circle);
            Animal.textureCache = texture;
        }
        this.texture = texture;
        this.scale.set(options.radius * 2 / texture.width, options.radius * 2 / texture.height);
        const colorStr = Animal.interpolateColors(Math.random());
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
Animal.minColor = 0xff0000;
Animal.minColorArray = Animal.numColorToArray(Animal.minColor);
Animal.maxColor = 0x00ff00;
Animal.maxColorArray = Animal.numColorToArray(Animal.maxColor);
exports.Animal = Animal;
//# sourceMappingURL=Animal.js.map