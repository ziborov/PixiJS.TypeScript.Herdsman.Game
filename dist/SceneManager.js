"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneManager = void 0;
const pixi_js_1 = require("pixi.js");
const logger_1 = require("./logger");
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
//# sourceMappingURL=SceneManager.js.map