"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartModal = void 0;
const pixi_js_1 = require("pixi.js");
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
//# sourceMappingURL=StartModal.js.map