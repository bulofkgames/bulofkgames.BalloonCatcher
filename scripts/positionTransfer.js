class TransferPosition {
    constructor(level) {
        this.level = level;
        this.fontSize = 140;
        this.fontColor = 255;
    }

    update(play) {
        this.fontSize -= 1;
        this.fontColor -= 1.5;

        if (this.fontSize < 1) {
            if (typeof InGamePosition !== "undefined") {
                play.goToPosition(new InGamePosition(play.setting, this.level));
            } else {
                console.warn("InGamePosition não encontrada.");
            }
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);
        con.font = this.fontSize + "px Times";
        con.textAlign = "center";
        con.fillStyle = `rgba(255, ${this.fontColor}, ${this.fontColor}, 1)`;
        con.fillText(
            "Get ready for level " + this.level,
            play.width / 2,
            play.height / 2
        );
    }
}
