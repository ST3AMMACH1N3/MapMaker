function Teleporter(x, y, w, h, id) {
	//initialize the teleporters variables
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	//the id is how the teleporter knows which ones correspond
	this.id = id;
	this.color = map(id, 0, 10, 0, 255);
	this.canTeleport = true;
	
	//check if the player is touching the teleporter. if he wasn't but now is, teleport him. otherwise do nothing
	this.update = function() {
		var i = this.checkCollision();
		if (!(i == -1)) {
			if (this.canTeleport) {
				for (var j = 0; j < teleporters.length; j++) {
					if (teleporters[j].id == this.id && !(teleporters[j] == this)) {
						teleporters[j].canTeleport = false;
						players[i].x = teleporters[j].x + teleporters[j].w / 2;
						players[i].y = teleporters[j].y + teleporters[j].h / 2;
						players[i].yspeed = 0;
					}
				}
			}
		} else {
			this.canTeleport = true;
		}
	}
	
	//draw the teleporter to the screen and call the update function
	this.show = function() {
		this.update();
		push();
		stroke(0);
		strokeWeight(2);
		colorMode(HSB)
		fill(this.color, 100, 100);
		rect(this.x,this.y,this.w,this.h);
		pop();
		
		//draw the text above it's top-left corner showing it's x, y, width, and height
		if (coordBox.checked()) {
			fill(0);
			textSize(12);
			text("(" + this.x + ", " + this.y + ")", this.x - 56, this.y - 16, 120, 120);
			text(this.w, this.x + this.w / 2 - 12, this.y - 16, 120, 120);
			text(this.h, this.x + this.w + 6, this.y + this.h / 2 - 12, 120, 120);
		}
	}
	
	//check to see if a player is touch the teleporter and if it is, return the players index
	this.checkCollision = function() {
		for (var i = 0; i < players.length; i++) {
			if (players[i].x + players[i].w / 2 > this.x && players[i].x - players[i].w / 2 < this.x + this.w) {
				if (players[i].y + players[i].h / 2 > this.y && players[i].y - players[i].h / 2 < this.y + this.h) {
					return i;	
				}
			}
		}
		return -1;
	}
}
