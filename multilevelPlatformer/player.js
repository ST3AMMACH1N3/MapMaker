function Player(x, y) {
	this.x = x;
	this.y = y;
	this.w = 20;
	this.yspeed = 0;
	this.hspeed = 0;
	this.accel = 0.5;
	
	this.update = function() {
		this.yspeed += this.accel;
		this.y += this.yspeed;
		this.fall(this.yspeed);
		if (keyIsDown(65)) {
			this.move(-5)
		}
		if (keyIsDown(68)) {
			this.move(5)
		}
	}
	
	this.show = function() {
		stroke(0);
		strokeWeight(1);
		fill(255,0,0);
		push();
		rectMode(CENTER);
		rect(this.x, this.y, this.w, this.w);
		pop();
		strokeWeight(4);
		point(this.x,this.y);
	}
	
	this.jump = function() {
		this.yspeed = -12;
	}
	
	this.move = function(hor) {
		var canMove = true;
		for (var i = 0; i < blocks.length; i++) {
			if (this.y + this.w / 2 > blocks[i].y && this.y - this.w / 2 < blocks[i].y + blocks[i].h) {
				if (hor > 0 && (this.x + this.w / 2 + hor < blocks[i].x || this.x - this.w / 2 > blocks[i].x + blocks[i].w)) {
					
				} else if (hor < 0 && (this.x - this.w / 2 + hor > blocks[i].x + blocks[i].w || this.x + this.w / 2 < blocks[i].x)) {
						
				} else {
					canMove = false;
					if (hor < 0 && this.x > blocks[i].x) {
						this.x = blocks[i].x + blocks[i].w + this.w / 2 + 1;
					} else if (hor > 0 && this.x < blocks[i].x) {
						this.x = blocks[i].x - this.w / 2 - 1;
					}
				}
			}
		}
		if (canMove) {
			this.x += hor
		}
	}
	
	this.fall = function(ver) {
		var canFall = true;
		for (var i = 0; i < blocks.length; i++) {
			if (this.x + this.w / 2 > blocks[i].x && this.x - this.w / 2 < blocks[i].x + blocks[i].w) {
				if (this.y < blocks[i].y) {
					if (this.y + this.w / 2 + ver >= blocks[i].y) {
						canFall = false;
						this.yspeed = 0;
						this.accel = 0;
						this.y = blocks[i].y - this.w / 2;
					}
				} else if (this.y - this.w / 2 + ver < blocks[i].y + blocks[i].h) {
					this.y = blocks[i].y + blocks[i].h + this.w / 2;
					this.yspeed = 0;
				}
			}
		}
		if (canFall) {
			this.accel = 0.5;
		}
	}
}