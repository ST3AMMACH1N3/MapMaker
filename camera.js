function Camera() {
	//intialize the camera's position and speed
	this.x = 0;
	this.y = 0;
	this.z = 50;
	this.speed = 5;
	
	//update the cameras positioning
	this.update = function() {
		
		//if it's in testing mode move the camera with the player
		if (testing) {
			if (players[0].x > this.x + (width * 2) / 3) {
				if (players[0].x > this.x + width) {
					this.x = players[0].x - width / 2;
				} else {
					this.x += 5;
				}
			}
			if (players[0].x < this.x + width / 3) {
				if (players[0].x < this.x) {
					this.x = players[0].x - width / 2;
				} else {
					this.x -= 5;
				}
			}
			if (players[0].y > this.y + (height * 7) / 8) {
				if (players[0].y > this.y + height) {
					this.y = players[0].y - (height *  7) / 8;
				} else {
					this.y += players[0].yspeed + 1;
				}
			}
			if (players[0].y < this.y + height / 3) {
				if (players[0].y < this.y) {
					this.y = players[0].y - (height *  7) / 8;
				} else {
					this.y -= 5;
				}
			}
		} else { //otherwise move the camera corresponding to keys pressed
			//A
			if (keyIsDown(65)) {
				this.x -= this.speed;
			}
			//D
			if (keyIsDown(68)) {
				this.x += this.speed;
			}
			//W
			if (keyIsDown(87)) {
				this.y -= this.speed;
			}
			//S
			if (keyIsDown(83)) {
				this.y += this.speed;
			}
		}
	}
	
	//show the camera
	this.show = function() {
		camera(cam.x, cam.y, cam.z)
	}
}