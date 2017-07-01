var canv, input, gridBox, coordBox, sel, centerButton, testButton, saveButton, paragraph;

function setup() {
	//create the canvas
	canv = createCanvas(600,600);
	canv.position(5, 5);
	
	//make it so when you drag a file onto the screen it loads the map
	canv.drop(gotFile);
	
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
	
	//creates a button to save the map to a file
	saveButton = createButton("Save Map");
	saveButton.position(width + 12, 5);
	saveButton.mousePressed(saveMap);
	
	//creates an paragraph output on the webpage to recreate the design in game
	paragraph = createP("This is where the output will be");
	paragraph.position(width + 12, 15);
	paragraph.size(350,700);
	
	//make an array of strings for the output
	stringArray = [];
	
	//make and array for everything you create
	everything = [];
	
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
	grid = 16;
	
	//set up the variables for moving objects
	UnderMouse = -1;
	moving = false;
	
	//set up the variable to determine if you are testing or not
	testing = false;
	
	//create and id and counter variable for teleporters
	identifier = 0;
	tempId = 0;
	missingIds = [];
	first = true;
}

function draw () {
	//draw background
	background(150);
	
	//update camera position and view the camera
	cam.update();
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
			players[i].yspeed = 0;
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
		rectMode(CORNERS)
		if (initx < mousex && inity < mousey) {
			rect(initx, inity, initx + initw, inity + inith);
		} else if (initx > mousex && inity < mousey) {
			rect(initx, inity, initx - initw, inity + inith);
		}
		else if (initx < mousex && inity > mousey) {
			rect(initx, inity, initx + initw, inity-inith);
		} else {
			rect(initx, inity, initx-initw, inity-inith);
		}
		pop();
	}
	if (moving) {
		movingItem();
	} else {
		//update what is under the mouse
		UnderMouse = lastItemUnderMouse()
	}
}

function mousePressed() {
	//if left mouse pressed set the top-left corner of the rectangle to that mouse position
	if (onScreen) {
		if (mouseButton == LEFT) {
			if ((UnderMouse == -1)) {
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
			} else {
				moving = true;
			}
		}
	}
}

function mouseReleased() {
	
	//finish the things you started with your left click
	if (mouseButton == LEFT) {
		if (!(moving)) {
			if (drawing) {
				drawing = false;
				if (sel.value() == "block") {
					if (initw > 0 && inith > 0) {
						if (initx < mousex && inity < mousey) {
							blocks.push(new Block(initx, inity, initw, inith));
						} else if (initx > mousex && inity < mousey) {
							blocks.push(new Block(initx-initw, inity, initw, inith));
						} else if (initx < mousex && inity > mousey) {
							blocks.push(new Block(initx, inity-inith, initw, inith));
						} else {
							blocks.push(new Block(initx-initw, inity-inith, initw, inith));
						}
						everything.push(blocks[blocks.length - 1]);
					}
				} else if (sel.value() == "teleporter") {
					if (initw > 0 && inith > 0) {
						if (initx < mousex && inity < mousey) {
							teleporters.push(new Teleporter(initx, inity, initw, inith, identifier));
						} else if (initx > mousex && inity < mousey) {
							teleporters.push(new Teleporter(initx-initw, inity, initw, inith, identifier));
						} else if (initx < mousex && inity > mousey) {
							teleporters.push(new Teleporter(initx, inity-inith, initw, inith, identifier));
						} else {
							teleporters.push(new Teleporter(initx-initw, inity-inith, initw, inith, identifier));
						}
						everything.push(teleporters[teleporters.length - 1]);
						if (!(identifier == tempId)) {
							if (missingIds.length > 1){
								missingIds.splice(0,1);
								identifier = missingIds[0];
							} else if (missingIds.length == 1) {
								missingIds.splice(0,1);
								identifier = tempId;
							} else {
								identifier = tempId;
							}
						} else {
							if (first) {
								first = false;
							} else {
								first = true;
								identifier += 1;
								tempId = identifier;
							}
						}
					}
				}
			}
			if (sel.value() == "player") {
				if (onScreen) {
					players.push(new Player(mousex, mousey));
					everything.push(players[players.length - 1]);
				}
			}
		} else {
			moving = false;
		}
	}
	
	//if the right mouse button is released delete the top block under the mouse cursor*** changed to backspace
	if (mouseButton == RIGHT) {
		
	}
}

function keyPressed() {
	
	if (keyCode == CONTROL) {
		
	}
	
	//if backspace is pressed delete the top block under the mouse cursor
	if (keyCode == BACKSPACE || keyCode == DELETE) {
		var deleted = false;
		
		if (!(UnderMouse == -1)) {
			for (var i = blocks.length-1; i >= 0; i--){
				if (blocks[i] == everything[UnderMouse]) {
					blocks.splice(i,1);
					everything.splice(UnderMouse, 1);
					deleted = true;
					break;
				}
			}
		
			if (!(deleted)) {
				for (var i = teleporters.length-1; i >= 0; i--){
					if (teleporters[i] == everything[UnderMouse]) {
						if (teleporters[i].id == tempId){
							first = true;
						} else {
							missingIds.push(teleporters[i].id);
							missingIds.sort();
							identifier = missingIds[0];
						}
						teleporters.splice(i,1);
						everything.splice(UnderMouse, 1);
						deleted = true;
						break;
					}
				}	
			}
		
			if (!(deleted)) {
				for (var i = players.length-1; i >= 0; i--){
					if (players[i] == everything[UnderMouse]) {
						players.splice(i,1);
						everything.splice(UnderMouse, 1);
						deleted = true;
						break;
					}
				}	
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

//output the code that makes the blocks to the paragraph
function createOutput() {
	paragraph.html("")
	for (var i = 0; i < blocks.length; i++) {
		paragraph.html(paragraph.html() + "blocks.push(new Block(" + blocks[i].x + ", " + blocks[i].y + ", " + blocks[i].w + ", " + blocks[i].h + ")); ");
	}
	for (var i = 0; i < teleporters.length; i++) {
		paragraph.html(paragraph.html() + "teleporters.push(new Teleporter(" + teleporters[i].x + ", " + teleporters[i].y + ", " + teleporters[i].w + ", " + teleporters[i].h + ", " + teleporters[i].id + ")); ");
	}
	for (var i = 0; i < players.length; i++) {
		paragraph.html(paragraph.html() + "players.push(new Player(" + players[i].placedx + ", " + players[i].placedy + ")); ");
	}
}

//output the code that makes the blocks to a map file
function saveMap() {
	stringArray = [];
	for (var i = 0; i < blocks.length; i++) {
		stringArray.push("blocks.push(new Block(" + blocks[i].x + ", " + blocks[i].y + ", " + blocks[i].w + ", " + blocks[i].h + "));");
	}
	for (var i = 0; i < teleporters.length; i++) {
		stringArray.push("teleporters.push(new Teleporter(" + teleporters[i].x + ", " + teleporters[i].y + ", " + teleporters[i].w + ", " + teleporters[i].h + ", " + teleporters[i].id + "));");
	}
	for (var i = 0; i < players.length; i++) {
		stringArray.push("players.push(new Player(" + players[i].placedx + ", " + players[i].placedy + "));");
	}
	save(stringArray, 'map.txt');
}

//toggle between whether the mouse is on or off screen so you can't accidentally make blocks
function toggleOnScreen() {
	if (onScreen) {
		onScreen = false;
	} else {
		onScreen = true;
	}
}

//reset the cam to the top left corner
function resetCamera() {
	cam.x = 0;
	cam.y = 0;
}

//load the phyics and allow controlling of the player
function testGame() {
	if (testing) {
		testing = false;
		testButton.html("Test Game")
		for (var i = 0; i < teleporters.length; i++) {
			teleporters[i].canTeleport = true;	
		}
	} else {
		testing = true;
		testButton.html("Stop Testing")
	}
}

//find the index of top item under the mouse
function lastItemUnderMouse() {
	
	var indexLatest = -1;
	
	for (var i = blocks.length-1; i >= 0; i--) {
		if (mousex > blocks[i].x && mousex < blocks[i].x + blocks[i].w && mousey > blocks[i].y && mousey < blocks[i].y + blocks[i].h) {
			for (var j = everything.length; j >= 0; j--) {
				if (everything[j] == blocks[i]) {
					if (indexLatest < j) {
						indexLatest = j;	
					}
				}
			}
		}
	}
		
	for (var i = teleporters.length-1; i >= 0; i--) {
		if (mousex > teleporters[i].x && mousex < teleporters[i].x + teleporters[i].w && mousey > teleporters[i].y && mousey < teleporters[i].y + teleporters[i].h) {
			for (var j = everything.length; j >= 0; j--) {
				if (everything[j] == teleporters[i]) {
					if (indexLatest < j) {
						indexLatest = j;	
					}
				}
			}
		}
	}
		
	for (var i = players.length-1; i >= 0; i--) {
		if (mousex > players[i].x - players[i].w / 2 && mousex < players[i].x + players[i].w / 2 && mousey > players[i].y - players[i].w / 2 && mousey < players[i].y + players[i].w / 2) {
			for (var j = everything.length; j >= 0; j--) {
				if (everything[j] == players[i]) {
					if (indexLatest < j) {
						indexLatest = j;	
					}
				}
			}
		}
	}
	
	return indexLatest;
}

//move the item that you are dragging to where your mouse is
function movingItem() {
	
	var moved = false;
	
	if (!(UnderMouse == -1)) {
		for (var i = blocks.length-1; i >= 0; i--){
			if (blocks[i] == everything[UnderMouse]) {
				if (gridBox.checked()) {
					if ((mousex - blocks[i].w / 2) % grid < grid / 2) {
						blocks[i].x = mousex - blocks[i].w / 2 - ((mousex - blocks[i].w / 2) % grid)
					} else {
						blocks[i].x = mousex - blocks[i].w / 2 + (grid - (mousex - blocks[i].w / 2) % grid)
					}
					if ((mousey - blocks[i].h / 2) % grid < grid / 2) {
						blocks[i].y = mousey - blocks[i].h / 2 - ((mousey - blocks[i].h / 2) % grid)
					} else {
						blocks[i].y = mousey - blocks[i].h / 2 + (grid - (mousey - blocks[i].h / 2) % grid)
					}
				} else {
					blocks[i].x = mousex - blocks[i].w / 2;
					blocks[i].y = mousey - blocks[i].h / 2;
				}
				moved = true;
				break;
			}
		}
		
		if (!(moved)) {
			for (var i = teleporters.length-1; i >= 0; i--){
				if (teleporters[i] == everything[UnderMouse]) {
					if (gridBox.checked()) {
						if ((mousex - teleporters[i].w / 2) % grid < grid / 2) {
							teleporters[i].x = mousex - teleporters[i].w / 2 - ((mousex - teleporters[i].w / 2) % grid)
						} else {
							teleporters[i].x = mousex - teleporters[i].w / 2 + (grid - (mousex - teleporters[i].w / 2) % grid)
						}
						if ((mousey - teleporters[i].h / 2) % grid < grid / 2) {
							teleporters[i].y = mousey - teleporters[i].h / 2 - ((mousey - teleporters[i].h / 2) % grid)
						} else {
							teleporters[i].y = mousey - teleporters[i].h / 2 + (grid - (mousey - teleporters[i].h / 2) % grid)
						}
					} else {
						teleporters[i].x = mousex - teleporters[i].w / 2;
						teleporters[i].y = mousey - teleporters[i].h / 2;
					}
					moved = true;
					break;
				}
			}	
		}
		
		if (!(moved)) {
			for (var i = players.length-1; i >= 0; i--){
				if (players[i] == everything[UnderMouse]) {
					players[i].placedx = mousex;
					players[i].placedy = mousey;
					moved = true;
					break;
				}
			}	
		}
	}
}

//put the lines of the file into an array, then call parse
function gotFile(file) {
	var r = confirm("You are about to overwrite your current map!");
	if (r) {
		var string = file.data;
		var array = [];
		var sub = "";
		if (file.type == 'text') {
			for (var i = 0; i < string.length; i++) {
				if (!(string[i] == ";") && !(string[i] == "\n")) {
					sub += string[i];
				} else {
					if (!(sub == "")) {
						array.push(sub);
						sub = "";
					}
				}
			}
			parse(array);
		}
	}
}

//take each line of the file, determine what it is trying to create, parse out the information, and create the objects described in the file
function parse(list) {
	var array = list;
	var sub, num, objType, x, y, w, h, id;
	for (var i = 0; i < array.length; i++) {
		num = "";
		sub = array[i];
		x = null;
		y = null;
		w = null;
		h = null;
		id = null;
		if (array[i][0] == "b") {
			objType = "block";
		} else if (array[i][0] == "t") {
			objType = "teleporter";
		} else if (array[i][0] == "p") {
			objType = "player";
		}
		for (var j = 0; j < sub.length; j++) {
			if (!(sub[j] == "") && !(sub[j] == " ") && !(isNaN(sub[j]))) {
				num += sub[j];
			} else {
				if (!(num == "")) {
					if (x == null) {
						x = parseInt(num);
					} else if (y == null) {
						y = parseInt(num);
					} else if (w == null) {
						w = parseInt(num);
					} else if (h == null) {
						h = parseInt(num);
					} else if (id == null) {
						id = parseInt(num);
					}
					num = "";
				}
			}
		}
		if (objType == "block") {
			blocks.push(new Block(x, y, w, h));
			everything.push(blocks[blocks.length - 1]);
		} else if (objType == "teleporter") {
			teleporters.push(new Teleporter(x, y, w, h, id));
			everything.push(teleporters[teleporters.length - 1]);
		} else if (objType == "player") {
			players.push(new Player(x, y));
			everything.push(players[players.length - 1]);
		}
	}
}