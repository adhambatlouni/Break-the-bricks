window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} 

	
	let keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	
	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

class Game{
	
	constructor(){
		this.canvas = document.getElementById("myCanvas");
		this.ctx = this.canvas.getContext("2d");
		this.sprites = [];

	}
	update(){
		let lSpritesLength = this.sprites.length;
		let canvas = this.canvas;
		for (let i = 0;i < lSpritesLength; i++)
			this.sprites[i].update(canvas);
			
	}
	addSprites(pSprites){
		this.sprites.push(pSprites);
	}
	draw(){
	 this.ctx.fillStyle = "#2a9df4"; 
        
         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	// 	let lSpritesLength = this.sprites.length;
	// 	for (let i = 0;i < lSpritesLength; i++)
	// 		this.sprites[i].draw(this.ctx);
	}
	
}

class Sprite{
	constructor(){
	}
	update(){
	}
	draw(pCtx){
	}
}

class Ball extends Sprite{
	constructor(canvas){
		super();
		this.cX = canvas.width / 2;
		this.cY = canvas.height / 2;
		this.radius = 7;
		this.color = '#fff';
		this.dx = 1;
		this.dy = 1;
		this.canvas = canvas;
		
	}
	update(){	
	}

	draw(ctx){
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.cX, this.cY, this.radius, 2*Math.PI);
		ctx.closePath();
        ctx.fill();     
	}
}

// class Pedal extends Sprite{
// 	constructor(canvas){
// 		super();
// 		this.pH = 15; 
// 		this.pW = 80; 
// 		this.pX = (this.canvas.width - this.pW) / 2
// 		this.color = "#fff";
		
// 	}
// 	update(){
			
// 	}

// 	draw(ctx){
// 		ctx.beginPath();
// 		ctx.rect(this.pX, this.canvas.height - this.pH, this.pW, this.pH);
// 		ctx.fillStyle = "#fff";
// 		ctx.fill();
// 		ctx.closePath();     
// 	}
// }

class Bricks extends Sprite{

    constructor(){
        super();
		this.brickRows = 3;
		this.brickCol = 9;
  	    this.bW = 75;
		this.bH = 20; 
		this.color = "#fff";
		this.bPadding = 10;
		this.bOffsetTop = 30;
  	    this.bOffsetLeft = 30;
		this.bricks = [];
    }

    update(){
    }

	draw(brickRows, brickCol, bPadding, bOffsetLeft, bOffsetTop){
		for (let i = 0; i < brickCol; i++) {
			for (let j = 0; j < brickRows; j++) {
			   bricks.push({
				 x : (i * (bbW + bPadding)) + bOffsetLeft,
				 y : (j * (bH + bPadding)) + bOffsetTop,
				 status : 1
			   });
			}
		}

		bricks.forEach(function(brick) {
			if (!brick.status) return;
			
			ctx.beginPath();
			ctx.rect(brick.x, brick.y, bW, bH);
			ctx.fillStyle = "#1B5E20";
			ctx.fill();
			ctx.closePath();
		  });
    }
}

let myGame = new Game();
let ball = new Ball(myGame.canvas);

//let bricks = new Bricks();
//myGame.addSprites(bricks);
myGame.addSprites(ball);

function animate(){
	let now = Date.now();
    let delta = now - then;

	myGame.update(delta/1000);
	myGame.draw();
	requestAnimationFrame(animate);

    then = now;
}
let then = Date.now();
animate();