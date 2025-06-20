"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const pixi_js_1 = require("pixi.js");
class Player extends pixi_js_1.Graphics {
    constructor(options) {
        super();
        this.radius = options.radius;
        this.damage = options.damage;
        this.health = options.health;
        this.fillColor = options.fillColor;
        console.log(`Player this.fillColor:${this.fillColor}`);
        this.draw();
    }
    draw() {
        this.beginFill(this.fillColor);
        this.drawCircle(0, 0, this.radius);
        this.endFill();
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map