// ===============================
// Canvas setup
// ===============================
const canvas = document.getElementById("Canvas");
canvas.width = 900;
canvas.height = 750;
const con = canvas.getContext("2d");

// ===============================
// Resize (responsivo)
// ===============================
function resize() {
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

window.addEventListener("load", resize);
window.addEventListener("resize", resize);

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

        // Configurações do jogo
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
        this.lastTime = 0;
    }

    presentPosition() {
        return this.positionContainer.length
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

    start() {
        if (typeof OpeningPosition !== "undefined") {
            this.goToPosition(new OpeningPosition());
        } else {
            console.warn("OpeningPosition não encontrada.");
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    loop(time) {
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        const position = this.presentPosition();
        if (position) {
            if (position.update) position.update(this, delta);
            if (position.draw) position.draw(this);
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    keyDown(code) {
        this.pressedKeys[code] = true;

        if (this.presentPosition()?.keyDown) {
            this.presentPosition().keyDown(this, code);
        }
    }

    keyUp(code) {
        delete this.pressedKeys[code];
    }
}

// ===============================
// Keyboard controls
// ===============================
const play = new GameBasics(canvas);

window.addEventListener("keydown", (e) => {
    const code = e.keyCode || e.which;

    // Evita scroll com setas, espaço e enter
    if ([13, 32, 37, 38, 39, 40].includes(code)) {
        e.preventDefault();
    }

    play.keyDown(code);
});

window.addEventListener("keyup", (e) => {
    const code = e.keyCode || e.which;
    play.keyUp(code);
});

// ===============================
// Start Game
// ===============================
play.start();
