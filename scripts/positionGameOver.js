class GameOverPosition {
    entry(play) {
        this.blink = 0;
    }

    update(play) {
        this.blink++;

        // ENTER para reiniciar o jogo
        if (play.pressedKeys[13]) {
            play.level = 1;
            play.score = 0;
            play.lives = 3;
            play.goToPosition(new OpeningPosition());
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);

        con.fillStyle = "red";
        con.font = "60px Arial";
        con.textAlign = "center";
        con.fillText("GAME OVER", play.width / 2, play.height / 2 - 40);

        con.fillStyle = "white";
        con.font = "26px Arial";
        con.fillText("Score: " + play.score, play.width / 2, play.height / 2 + 10);

        if (Math.floor(this.blink / 30) % 2 === 0) {
            con.font = "22px Arial";
            con.fillText(
                "Press ENTER to restart",
                play.width / 2,
                play.height / 2 + 60
            );
        }
    }
}
