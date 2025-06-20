"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreBar = void 0;
const pixi_js_1 = require("pixi.js");
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
//# sourceMappingURL=ScoreBar.js.map