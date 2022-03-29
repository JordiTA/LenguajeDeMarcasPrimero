const scene_w = 640;
const scene_h = 480;

let player_init_x = 40;
let score=0;


let bgTiles;
let bgGraphics;



let player;
let enemies = [];
let bullets = [];
let up_key;
let down_key;
let space_key;
let canshoot=true;
let scoreingame;
const BULLET_INIT_X = -1000;
const BULLET_INIT_Y = -1000;

const MAX_ENEMIES = 128;
const MAX_BULLETS = 3;

const SCREEN_MARGIN = 32;

function preload () {
	console.log("Preload");
	this.load.image("background", "stars.jpg");
	this.load.image("player", "PNG/Default/ship_A.png");
	this.load.image("enemy", "PNG/Default/meteor_large.png");
	this.load.image("bullet", "PNG/Default/star_small.png");
	this.load.image("particles","explosion.png");
	this_game=this;
}

function create () {
	enemies = [];
	score=0;
	bullets = [];
	canshoot = true;
	
	
	bgGraphics = this.make.graphics({ x:0, y:0, add: false});
	bgGraphics.generateTexture("background",626,375);
	bgTiles = this.add.tileSprite(400, 300, 800, 600,'background');
	
	particle = this.add.particles("particles");
	player = this.physics.add.image(player_init_x, scene_h/2, "player");
	player.setAngle(90);
	player.setSize(20,20);
	scoreingame = this.add.text(50,10,"Points:0 ",{fontFamilt: 'sans-serif', color: '#fff', fontSize:'20px'});
	particle.createEmitter({
		alpha:{start:1, end:0},
		scale : {start: 0.01, end: 0.2},
		speed: 10,
		angle : {min: -85, max: -95},
		rotate: {min: -180, max: 180},
		blendMode:'ADD',
		frequency : 200,
		lifespan:500,
	
		on:false
	
	});



	for (let i = 0; i < MAX_ENEMIES; i++){
		let x = Math.random()*scene_w*10 + scene_w/2;
		let y = Math.random()*scene_h;

		console.log(x,y);

	 	enemies.push(this.physics.add.image(x, y, "enemy"));
		enemies[i].setSize(40,40);
	}


	for (let i = 0; i < MAX_BULLETS; i++){
		bullets.push(this.physics.add.image(BULLET_INIT_X, BULLET_INIT_Y, "bullet"));

		bullets[i].moving = false;
		bullets[i].setSize(10,10);
	}


	enemies.forEach(function(element){
	this_game.physics.add.overlap (player,element,function(p,c){
		this_game.scene.restart();
	},null, this_game);
	});
	enemies.forEach(function(element){
	this_game.physics.add.overlap (bullets,element,function(b,e){
	
		particle.emitParticleAt(element.x,element.y);
		element.destroy();
		score ++;
		scoreingame.setText('Points:' + score);
		b.x=BULLET_INIT_X;
		b.y=BULLET_INIT_Y;
		b.moving=false;
	},null, this_game);
	
	});


	
	
	up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
	space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);



}

function update () {

bgTiles.tilePositionX+=0.9;

	if (up_key.isDown){
		if(player.y>= 0){
		player.y= player.y-3;
		}
		
		
	
	}
	else if (down_key.isDown){
		if(player.y <= scene_h){
		player.y = player.y+3;
		}
	
	}

	if (space_key.isDown && canshoot){
		let found = false;
		canshoot = false;

		for (let i = 0; i < MAX_BULLETS && !found; i++){
			if (!bullets[i].moving){
				bullets[i].moving = true;
				bullets[i].x = player.x;
				bullets[i].y = player.y;

				found = true;
			}
		}
	}
	if (space_key.isUp){
		canshoot=true;
	}


	for (let i = 0; i < MAX_BULLETS; i++){
		if (bullets[i].moving){
			bullets[i].x =bullets[i].x+3;

			if (bullets[i].x >= scene_w + SCREEN_MARGIN){
				bullets[i].x = BULLET_INIT_X;
				bullets[i].y = BULLET_INIT_Y;

				bullets[i].moving = false;
			}
		}
	}

	for (let i = 0; i < MAX_ENEMIES; i++){
		enemies[i].x= enemies[i].x-2;
	}
	
}
const config = {
	type: Phaser.CANVAS,
	width: scene_w,
	height: scene_h,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug:false,
//			gravity: { x: 10 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

let game = new Phaser.Game(config);


