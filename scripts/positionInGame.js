class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
    }

    entry(play) {
        play.lives = play.lives ?? 3;
        play.score = play.score ?? 0;
        play.sounds = play.sounds ?? new Sounds();

        // ===== PLAYER =====
        this.player = {
            x: play.width / 2 - 25,
            y: play.playBoundaries.bottom - 50,
            w: 50,
            h: 45,
            speed: 300
        };

        this.playerImg = new Image();
        this.playerImg.src = "images/man.gif";

        // ===== PLAYER BULLETS =====
        this.playerBullets = [];
        this.lastPlayerShot = 0;

        // ===== ENEMIES (4x8) =====
        this.ufos = [];
        const rows = 4;
        const cols = 8;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.ufos.push({
                    x: 140 + c * 70,
                    y: 150 + r * 55,
                    w: 48,
                    h: 36,
                    alive: true
                });
            }
        }

        this.ufoImg = new Image();
        this.ufoImg.src = "images/ufo.png";

        this.enemyBullets = [];
        this.enemyDir = 1;
        this.enemySpeed = 40 + this.level * 10;
    }

    update(play) {
        const dt = play.setting.updateSeconds;

        // ===== PLAYER MOVE =====
        if (play.pressedKeys[37]) this.player.x -= this.player.speed * dt;
        if (play.pressedKeys[39]) this.player.x += this.player.speed * dt;

        this.player.x = Math.max(
            play.playBoundaries.left,
            Math.min(this.player.x, play.playBoundaries.right - this.player.w)
        );

        // ===== PLAYER SHOOT =====
        if (play.pressedKeys[32] && Date.now() - this.lastPlayerShot > 300) {
            this.playerBullets.push({
                x: this.player.x + this.player.w / 2,
                y: this.player.y
            });
            play.sounds.playShot();
            this.lastPlayerShot = Date.now();
        }

        this.playerBullets.forEach(b => b.y -= 400 * dt);
        this.playerBullets = this.playerBullets.filter(b => b.y > 0);

        // ===== ENEMY MOVE =====
        let hitEdge = false;
        this.ufos.forEach(u => {
            if (!u.alive) return;
            u.x += this.enemyDir * this.enemySpeed * dt;
            if (u.x < play.playBoundaries.left || u.x + u.w > play.playBoundaries.right) {
                hitEdge = true;
            }
        });

        if (hitEdge) {
            this.enemyDir *= -1;
            this.ufos.forEach(u => u.y += 15);
        }

        // ===== ENEMY RANDOM SHOOT =====
        if (Math.random() < 0.02 + this.level * 0.005) {
            const shooters = this.ufos.filter(u => u.alive);
            if (shooters.length) {
                const s = shooters[Math.floor(Math.random() * shooters.length)];
                this.enemyBullets.push({
                    x: s.x + s.w / 2,
                    y: s.y + s.h
                });
            }
        }

        this.enemyBullets.forEach(b => b.y += 250 * dt);

        // ===== COLLISION PLAYER BULLET vs UFO =====
        this.playerBullets = this.playerBullets.filter(b => {
            for (const u of this.ufos) {
                if (
                    u.alive &&
                    b.x > u.x &&
                    b.x < u.x + u.w &&
                    b.y > u.y &&
                    b.y < u.y + u.h
                ) {
                    u.alive = false;
                    play.score += 25;
                    play.sounds.playPop();
                    return false;
                }
            }
            return true;
        });

        // ===== COLLISION ENEMY BULLET vs PLAYER =====
        this.enemyBullets = this.enemyBullets.filter(b => {
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

        // ===== LEVEL COMPLETE =====
        if (this.ufos.every(u => !u.alive)) {
            play.goToPosition(new TransferPosition(this.level + 1));
        }

        // ===== GAME OVER =====
        if (
            play.lives <= 0 ||
            this.ufos.some(u => u.alive && u.y + u.h >= play.playBoundaries.bottom)
        ) {
            play.goToPosition(new GameOverPosition());
        }
    }

    draw(play) {
        con.clearRect(0, 0, play.width, play.height);

        // HUD
        con.fillStyle = "white";
        con.font = "20px Arial";
        con.fillText(`Level: ${this.level}`, 20, 30);
        con.fillText(`Lives: ${play.lives}`, 20, 60);
        con.fillText(`Score: ${play.score}`, 20, 90);

        // Player
        con.drawImage(this.playerImg, this.player.x, this.player.y, this.player.w, this.player.h);

        // UFOs
        this.ufos.forEach(u => {
            if (u.alive) {
                con.drawImage(this.ufoImg, u.x, u.y, u.w, u.h);
            }
        });

        // Bullets
        con.fillStyle = "yellow";
        this.playerBullets.forEach(b => con.fillRect(b.x - 2, b.y, 4, 10));

        con.fillStyle = "red";
        this.enemyBullets.forEach(b => con.fillRect(b.x - 2, b.y, 4, 10));
    }
}
