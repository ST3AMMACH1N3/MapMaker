var canv, input, gridBox, coordBox, sel, centerButton, testButton, paragraph;

function setup() {
	//create the canvas
	canv = createCanvas(600,600);
	canv.position(5, 5);
	
	//make it so you can only draw when the mouse is over the canvas
	onScreen = false;
	canv.mouseOut(toggleOnScreen);
	canv.mouseOver(toggleOnScreen);
	
	// creates an input box under the canvas and sets the default grid = 16
	input = createInput();
	input.position(5, height+10);
	input.value(16);
	
	//creates an checkbox for if you want grid/snap on or not
	gridBox = createCheckbox("Grid/Snap", true);
	gridBox.position(190, height+10);
	
	//creates an checkbox for if you want text next to blocks or not
	coordBox = createCheckbox("Coordinates", false);
	coordBox.position(290, height+10);
	
	//creates a selector box to switch between type of block
	sel = createSelect();
	sel.position(405, height+10);
	sel.option("block");
	sel.option("teleporter");
	sel.option("player");
	
	//creates a button to recenter camera
	centerButton = createButton("Reset Camera");
	centerButton.position(504, height+10);
	centerButton.mousePressed(resetCamera);
	
	//creates a button to test the map
	testButton = createButton("Test Game");
	testButton.position(5, height + 40);
	testButton.mousePressed(testGame);
	
	//creates an output to recreate the design in game
	paragraph = createP("This is where the output will be")
	paragraph.position(width + 12, 0)
	paragraph.size(350,700)
	
	//make an array for the blocks to go into
	blocks = [];
	
	//make an array for the teleporters to go into
	teleporters = [];
	
	//make an array for the players to go into
	players = [];
	
	//make a new camera object so I can control it's placement/movement
	cam = new Camera();
	
	//create the variables for the box creation
	initx = 0;
	inity = 0;
	initw = 4;
	inith = 4;
	
	//mousex and mousey are mouseX and mouseY relative to the cam
	mousex = mouseX;
	mousey = mouseY;
	
	//set up the grid value and the snap and drawing booleans
	drawing = false;
	moving = false;
	grid = 16;
	testing = false;
}

function draw () {
	//draw background
	background(150);
	
	//update camera position and view the camera
	if (!(testing)) {
		cam.update();
	}
	cam.show();
	
	//if the text in the grid box is a number set the grid size to it, otherwise set it to the default
	if (!(input.value() == "")) {
		grid = input.value();
	} else {
		grid = 16;
	}
	
	//set the mousex and mousey to the mouseX and mouseY relative to camera
	mousex = cam.x + mouseX;
	mousey = cam.y + mouseY;
	
	//check if the user wants it snapped to the grid
	if (gridBox.checked()) {
		for (var i = 0; i < width / grid; i++) {
			if (!(testing)) {
				push();
				stroke(200)
				strokeWeight(1);
				line((cam.x - cam.x % grid) + i * grid, cam.y, (cam.x - cam.x % grid) + i * grid, cam.y + height);
				line(cam.x, (cam.y - cam.y % grid) + i * grid, cam.x + width, (cam.y - cam.y % grid) + i * grid);
				pop();
			}
		}
	}
	
	//draw all of the blocks you created
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].show();
	}
	
	//draw all of the teleporters you created
	for (var i = 0; i < teleporters.length; i++) {
		teleporters[i].show();
	}
	
	//draw and update all of the players you created
	for (var i = 0; i < players.length; i++) {
		players[i].show();
		if (testing) {
			players[i].update();	
		} else {
			players[i].x = 	players[i].placedx
			players[i].y = 	players[i].placedy
		}
	}
	
	//if you are holding the right mouse button draw the bod you are trying to create
	if (drawing) {
		
		//if snap is on, make sure the box snaps to the grid
		if (gridBox.checked()){
			if (abs(initx - mousex) % grid < grid / 2) {
				initw = abs(initx - mousex) - abs(initx - mousex) % grid;
			} else {
				initw = abs(initx - mousex) + (grid - abs(initx - mousex) % grid);
			}
			
			//if you are holding down shift, make the block you are drawing a square
			if (keyIsDown(SHIFT)) {
				inith = initw
			} else {
				if (abs(inity - mousey) % grid < grid / 2) {
					inith = abs(inity - mousey) - abs(inity - mousey) % grid;
				} else {
					inith = abs(inity - mousey) + (grid - abs(inity - mousey) % grid);
				}
			}
		} else {
			
			//if  snap is off draw the box exactly as the mouse goes
			initw = abs(initx - mousex);
			if (keyIsDown(SHIFT)) {
				inith = initw;
			} else {
				inith = abs(inity - mousey);
			}
		}
		
		//draw the box you are drawing
		push();
		stroke(0, 0, 0, 150);
		strokeWeight(2);
		fill(255, 255, 255, 150);
		rect(initx, inity, initw, inith);
		pop();
	}
}

function mousePressed() {
	//if left mouse pressed set the top-left corner of the rectangle to that mouse position
	if (onScreen) {
		if (mouseButton == LEFT) {
			if (!(sel.value() == "player")) {
				if (gridBox.checked()) {
					if (mousex % grid < grid / 2) {
						initx = mousex - mousex % grid
					} else {
						initx = mousex + (grid - mousex % grid);
					}
					if (mousey % grid < grid / 2) {
						inity = mousey - mousey % grid;
					} else {
						inity = mousey + (grid - mousey % grid);
					}
				} else {
					initx = mousex;
					inity = mousey;
				}
				drawing = true;
			}
		}
	}
}

function mouseReleased() {
	//if the left mouse button is released create the block you were drawing
	if (onScreen) {
		if (mouseButton == LEFT) {
			drawing = false;
			if (sel.value() == "block") {
				if (initw > 0 && inith > 0) {
					blocks.push(new Block(initx, inity, initw, inith))
				}
			} else if (sel.value() == "teleporter") {
				teleporters.push(new Teleporter(initx, inity, initw, inith))
			} else if (sel.value() == "player") {
				players.push(new Player(mousex, mousey))
			}
		}
	}
	
	//if the right mouse button is released delete the top block under the mouse cursor*** changed to backspace
	if (mouseButton == RIGHT) {
		
	}
}

function keyPressed() {
	//if you press control it toggles the grid
	if (keyCode == CONTROL) {
		if (snap) {
			snap = false;
		} else {
			snap = true;
		}
	}
	
	//if backspace is pressed delete the top block under the mouse cursor
	if (keyCode == BACKSPACE) {
		for (var i = blocks.length-1; i >= 0; i--) {
			if (mousex > blocks[i].x && mousex < blocks[i].x + blocks[i].w && mousey > blocks[i].y && mousey < blocks[i].y + blocks[i].h) {
				blocks.splice(i,1);
				break;
			}
		}
		
		for (var i = teleporters.length-1; i >= 0; i--) {
			if (mousex > teleporters[i].x && mousex < teleporters[i].x + teleporters[i].w && mousey > teleporters[i].y && mousey < teleporters[i].y + teleporters[i].h) {
				teleporters.splice(i,1);
				break;
			}
		}
		
		for (var i = players.length-1; i >= 0; i--) {
			if (mousex > players[i].x - players[i].w / 2 && mousex < players[i].x + players[i].w / 2 && mousey > players[i].y - players[i].w / 2 && mousey < players[i].y + players[i].w / 2) {
				players.splice(i,1);
				break;
			}
		}
	}
	
	//call the function to output the code of the blocks
	if (keyCode == ENTER) {
		createOutput();
	}
	
	if (keyCode == 32) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].accel == 0) {
				players[i].jump();
			}
		}
	}
}

//out put the code that makes the blocks to the paragraph
function createOutput() {
	paragraph.html("")
	for (var i = 0; i < blocks.length; i++) {
		paragraph.html(paragraph.html() + "blocks.push(new Block(" + blocks[i].x + ", " + blocks[i].y + ", " + blocks[i].w + ", " + blocks[i].h + ")); ")
	}
	for (var i = 0; i < teleporters.length; i++) {
		paragraph.html(paragraph.html() + "teleporters.push(new Teleporter(" + teleporters[i].x + ", " + teleporters[i].y + ", " + teleporters[i].w + ", " + teleporters[i].h + ")); ")
	}
}

//toggle between whether the mouse is on or off screen so you can't accidentally make blocks
function toggleOnScreen() {
	if (onScreen) {
		onScreen = false;
	} else {
		onScreen = true;
	}
}

function resetCamera() {
	cam.x = 0;
	cam.y = 0;
}

function testGame() {
	if (testing) {
		testing = false;
		testButton.html("Test Game")
	} else {
		testing = true;
		testButton.html("Stop Testing")
	}
}
