const canvas = document.getElementById("Canvas");
canvas.width = 900;
canvas.height = 750;
const con = canvas.getContext("2d");

function resize() {
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}
window.addEventListener("load", resize, false);

// ===============================
// Game Basics
// ===============================
class GameBasics {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        // Área ativa do jogo
        this.playBoundaries = {
            top: 150,
            bottom: 650,
            left: 100,
            right: 800
        };

        this.level = 1;
        this.score = 0;
        this.shields = 2;

        // Configurações
        this.setting = {
            updateSeconds: 1 / 60,
            manSpeed: 200,
            bulletSpeed: 130,
            bulletMaxFrequency: 500,
            ufoLines: 4,
            ufoColumns: 8,
            ufoSpeed: 35,
            ufoSinkingValue: 30,
            bombSpeed: 75,
            bombFrequency: 0.05,
            pointsPerUFO: 25
        };

        this.positionContainer = [];
        this.pressedKeys = {};
    }

    presentPosition() {
        return this.positionContainer.length > 0
            ? this.positionContainer[this.positionContainer.length - 1]
            : null;
    }

    goToPosition(position) {
        this.positionContainer.length = 0;

        if (position.entry) {
            position.entry(this);
        }

        this.positionContainer.push(position);
    }

    pushPosition(position) {
        this.positionContainer.push(position);
    }

    popPosition() {
        this.positionContainer.pop();
    }

    start() {
        setInterval(() => {
            gameLoop(this);
        }, this.setting.updateSeconds * 1000);

        // IMPORTANTE: OpeningPosition deve existir em outro arquivo
        if (typeof OpeningPosition !== "undefined") {
            this.goToPosition(new OpeningPosition());
        } else {
            console.warn("OpeningPosition não encontrada.");
        }
    }

    keyDown(keyboardCode) {
        this.pressedKeys[keyboardCode] = true;

        if (this.presentPosition() && this.presentPosition().keyDown) {
            this.presentPosition().keyDown(this, keyboardCode);
        }
    }

    keyUp(keyboardCode) {
        delete this.pressedKeys[keyboardCode];
    }
}

// ===============================
// Game Loop
// ===============================
function gameLoop(play) {
    const position = play.presentPosition();

    if (!position) return;

    if (position.update) {
        position.update(play);
    }

    if (position.draw) {
        position.draw(play);
    }
}

// ===============================
// Keyboard
// ===============================
window.addEventListener("keydown", function (e) {
    const keyboardCode = e.which || e.keyCode;

    if (keyboardCode === 37 || keyboardCode === 39 || keyboardCode === 32) {
        e.preventDefault();
    }

    play.keyDown(keyboardCode);
});

window.addEventListener("keyup", function (e) {
    const keyboardCode = e.which || e.keyCode;
    play.keyUp(keyboardCode);
});

// ===============================
// Start Game
// ===============================
const play = new GameBasics(canvas);
play.start();
