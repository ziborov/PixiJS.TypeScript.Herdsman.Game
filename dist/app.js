"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles.css");
const SceneManager_1 = require("./SceneManager");
const ShootingScene_1 = require("./ShootingScene");
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
//# sourceMappingURL=app.js.map