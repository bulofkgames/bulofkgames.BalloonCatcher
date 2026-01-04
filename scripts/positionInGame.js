class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
    }

    entry(play) {
        play.lives = play.lives ?? 3;
        play.sounds = play.sounds ?? new Sounds();

        // Player
        this.player = {
            x: play.width / 2 - 17,
            y: play.playBoundaries.bottom - 40,
            w: 34,
            h: 30,
            speed: this.setting.manSpeed
        };

        this.playerImg = new Image();
        this.playerImg.src = "images/man.gif";

        // Enemies
        this.ufos = [];
        this.bullets = [];
        this.dir = 1;

        for (let i = 0; i < 6; i++) {
            this.ufos.push({
                x: 150 + i * 80,
                y: 160,
                w: 32,
                h: 24,
                alive: true
            });
        }

        this.ufoImg = new Image();
        this.ufoImg.src = "images/ufo.png";

        this.lastShot = Date.now();
    }

    update(play) {
        const dt = play.setting.updateSeconds;

        // ===== PLAYER MOVE =====
        if (play.pressedKeys[37]) this.player.x -= this.player.speed * dt;
        if (play.pressedKeys[39]) this.player.x += this.player.speed * dt;

        this.player.x = Math.max(
            play.playBoundaries.left,
            Math.min(
                this.player.x,
                play.playBoundaries.right - this.player.w
            )
        );

        // ===== UFO MOVE =====
        let hitEdge = false;
        this.ufos.forEach(u => {
            if (!u.alive) return;
            u.x += this.dir * 40 * dt;
            if (u.x < play.playBoundaries.left || u.x + u.w > play.playBoundaries.right) {
                hitEdge = true;
            }
        });

        if (hitEdge) {
            this.dir *= -1;
            this.ufos.forEach(u => u.y += 20);
        }

        // ===== UFO SHOOT =====
        if (Date.now() - this.lastShot > 1000) {
            const shooter = this.ufos.find(u => u.alive);
            if (shooter) {
                this.bullets.push({
                    x: shooter.x + shooter.w / 2,
                    y: shooter.y + shooter.h,
                    r: 4
                });
                play.sounds.playShot();
            }
            this.lastShot = Date.now();
        }

        // ===== BULLETS MOVE =====
        this.bullets.forEach(b => b.y += 200 * dt);

        // ===== COLLISION =====
        this.bullets = this.bullets.filter(b => {
            const hit =
                b.x > this.player.x &&
                b.x < this.player.x + this.player.w &&
                b.y > this.player.y &&
                b.y < this.player.y + this.player.h;

            if (hit) {
                play.lives--;
                play.sounds.playPop();
                return false;
            }
            return b.y < play.height;
        });

        // ===== GAME OVER CONDITIONS =====
        if (play.lives <= 0) {
            play.goToPosition(new OpeningPosition());
        }

        if (this.ufos.some(u => u.y + u.h >= play.playBoundaries.bottom)) {
            play.goToPosition(new OpeningPosition());
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);

        // HUD
        con.fillStyle = "white";
        con.font = "20px Arial";
        con.fillText("Level: " + this.level, 20, 30);
        con.fillText("Lives: " + play.lives, 20, 60);

        // Player
        con.drawImage(this.playerImg, this.player.x, this.player.y, this.player.w, this.player.h);

        // UFOs
        this.ufos.forEach(u => {
            if (u.alive) {
                con.drawImage(this.ufoImg, u.x, u.y, u.w, u.h);
            }
        });

        // Bullets
        con.fillStyle = "red";
        this.bullets.forEach(b => {
            con.beginPath();
            con.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            con.fill();
        });
    }
}
