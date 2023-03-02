window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (f) {
        return setTimeout(f, 1000 / 60)
    }

let keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


class Game {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.sprites = [];
    }

    update() {
        let lSpritesLength = this.sprites.length;
        let canvas = this.canvas;
        for (let i = 0; i < lSpritesLength; i++)
            this.sprites[i].update(canvas);

    }
    addSprites(pSprites) {
        this.sprites.push(pSprites);
    }
    draw() {
        this.ctx.fillStyle = "#2a9df4";
        this.pedal = pedal;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let lSpritesLength = this.sprites.length;
        for (let i = 0; i < lSpritesLength; i++)
            this.sprites[i].draw(this.ctx);

        this.drawScore(this.pedal.score, this.canvas.width / 2 - 15, 60);
    }
    drawScore(text, x, y) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "60px fantasy";
        this.ctx.fillText(text, x, y);
    }
}

class Sprite {
    constructor() {}
    update() {}
    draw(pCtx) {}
}

class Brick extends Sprite {
    constructor() {
        super();
        this.row = 9;
        this.column = 5;
        this.bW = 75;
        this.bH = 15;
        this.bX = 0;
        this.bY = 0;
        this.bricks = [];

        for (var i = 0; i < this.row; i++) {
            this.bricks[i] = [];
            for (var j = 0; j < this.column; j++) {
                this.bricks[i][j] = {
                    x: 0,
                    y: 0,
                    brickFound: 1
                };
            }
        }
    }

    update() {}

    draw(ctx) {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.column; j++) {
                if (this.bricks[i][j].brickFound == 1) {
                    this.bX = i * this.bW + i * 7 + 36;
                    this.bY = j * this.bH + j * 7 + 80;
                    this.bricks[i][j].x = this.bX;
                    this.bricks[i][j].y = this.bY;
                    ctx.beginPath();
                    ctx.rect(this.bX, this.bY, this.bW, this.bH);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
}

class Ball extends Sprite {
    constructor(canvas, pedal, brick) {
        super();
        this.cX = canvas.width / 2;
        this.cY = canvas.height - 30;
        this.radius = 8;
        this.color = '#fff';
        this.dx = 1;
        this.dy = 1;
        this.canvas = canvas;
        this.pedal = pedal;
        this.brick = brick;
    }

    update(canvas) {
        this.cX += this.dx;
        this.cY += this.dy;

        if (this.cY - this.radius < 0) {
            this.dy = 1;
        }

        if (this.cY + this.radius >= 600) {
            this.reset(canvas);
        }

        if (this.cX - this.radius <= 0 || this.cX + this.radius >= canvas.width) {
            this.dx = -this.dx;
        }

        if ((this.cX < this.pedal.pX + this.pedal.width) && (this.cX > this.pedal.pX) &&
            (this.cY < this.pedal.pY + this.pedal.height) &&
            (this.cY + this.radius > this.pedal.pY)) {
            this.dy = -1;
        }


        for (var i = 0; i < this.brick.row; i++) {
            for (var j = 0; j < this.brick.column; j++) {

                if (this.brick.bricks[i][j].brickFound == 1) {
                    if (this.cX > this.brick.bricks[i][j].x && this.cX < this.brick.bricks[i][j].x + this.brick.bW &&
                        this.cY > this.brick.bricks[i][j].y && this.cY < this.brick.bricks[i][j].y + this.brick.bH) {
                        this.dy = -this.dy;
                        this.brick.bricks[i][j].brickFound = 0;
                        this.pedal.score += 1;
                    }

                    if(this.pedal.score == this.brick.row * this.brick.column) {
                        this.reset();
                    }
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.cX, this.cY, this.radius, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    reset() {
        this.cX = this.canvas.width / 2;
        this.cY = this.canvas.height - 30;


        this.pedal.pX = (this.canvas.width - this.pedal.width) / 2;
        this.pedal.pY = this.canvas.height - this.pedal.height - 25;
        this.pedal.score = 0;

        this.dx = this.dx;
        this.dy = -this.dy;
        this.pedal.dx = 1;

        for (var i = 0; i < this.brick.row; i++) {
            for (var j = 0; j < this.brick.column; j++) {
                this.brick.bricks[i][j].brickFound = 1;
            }
        }
    }
}

class Pedal extends Sprite {

    constructor(canvas, ball) {
        super();
        this.width = 75;
        this.height = 15;
        this.pX = (canvas.width - this.width) / 2;
        this.pY = canvas.height - this.height - 25;
        this.color = '#fff';
        this.dx = 1;
        this.score = 0;
        this.ball = ball;

    }

    update(canvas) {

        if (37 in keysDown) { // Player holding left
            this.pX--;
        }
        if (39 in keysDown) { // Player holding right
            this.pX++;
        }

        var maxX = canvas.width - this.width;
        var minX = 0;

        this.pX = Math.min(this.pX, maxX);
        this.pX = Math.max(this.pX, minX);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pX, this.pY, this.width, this.height);
    }
}


let myGame = new Game();

let pedal = new Pedal(myGame.canvas);
let brick = new Brick(myGame.canvas);
let ball = new Ball(myGame.canvas, pedal, brick);

myGame.addSprites(ball);
myGame.addSprites(pedal);
myGame.addSprites(brick);

function animate() {
    let now = Date.now();
    let delta = now - then;

    myGame.update(delta / 1000);
    myGame.draw();
    requestAnimationFrame(animate);

    then = now;
}
let then = Date.now();
animate();


