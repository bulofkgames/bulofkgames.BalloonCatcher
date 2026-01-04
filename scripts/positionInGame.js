class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
    }

    entry(play) {
        this.startTime = Date.now();
    }

    update(play) {
        // ESC para voltar ao menu
        if (play.pressedKeys[27]) {
            play.goToPosition(new OpeningPosition());
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);

        con.fillStyle = "white";
        con.font = "22px Arial";
        con.textAlign = "left";
        con.fillText("Level: " + this.level, 20, 30);
        con.fillText("Score: " + play.score, 20, 60);

        con.textAlign = "center";
        con.fillText("GAME RUNNING...", play.width / 2, play.height / 2);
    }
}
