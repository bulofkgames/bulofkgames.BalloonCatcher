class OpeningPosition {
    entry(play) {
        this.blink = 0;
    }

    update(play) {
        this.blink++;

        // Pressione ESPAÇO para começar
        if (play.pressedKeys[32]) {
            play.goToPosition(new TransferPosition(1));
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);

        con.fillStyle = "white";
        con.font = "48px Arial";
        con.textAlign = "center";
        con.fillText("BALLOON CATCHER", play.width / 2, play.height / 2 - 40);

        if (Math.floor(this.blink / 30) % 2 === 0) {
            con.font = "24px Arial";
            con.fillText("Press SPACE to start", play.width / 2, play.height / 2 + 20);
        }
    }
}
