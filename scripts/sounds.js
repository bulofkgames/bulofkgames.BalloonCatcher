class Sounds {
    constructor() {
        this.shot = new Audio("sounds/shot.mp3");
        this.pop = new Audio("sounds/balloon-pop.mp3");
    }

    playShot() {
        this.shot.currentTime = 0;
        this.shot.play();
    }

    playPop() {
        this.pop.currentTime = 0;
        this.pop.play();
    }
}
