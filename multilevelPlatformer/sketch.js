function setup() {
	createCanvas(600,600);
	level = 1;
	blocks = [];
	teleporters = [];
	blocks.push(new Block(0, 200, width, 20));
	blocks.push(new Block(width / 2 + 9, height - 150, 50, 50));
	blocks.push(new Block(width / 2 + 9, height / 2, 50, 50));
	blocks.push(new Block(width / 2 - 109, height / 2 + 75, 50, 50));
	teleporters.push(new Teleporter(width - 100, 50, 30, 30));
	teleporters.push(new Teleporter(width - 100, 450, 30, 30));
	blocks.push(new Block(0, 500, width, 20)); 
	me = new Player(width / 2, 50);
}

function draw () {
	background(150);
	camera(me.x - width / 2, 0, 50)
	for (var i = 0; i < blocks.length; i++){
		blocks[i].show();
	}
	for (var i = 0; i < teleporters.length; i++){
		teleporters[i].show();
		teleporters[i].update();
	}
	me.update();
	me.show();
}

function keyPressed() {
	if (keyCode == 32 && me.accel == 0) {
		me.jump();
	}
}