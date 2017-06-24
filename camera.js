function Camera() {
	//intialize the camera's position and speed
	this.x = 0;
	this.y = 0;
	this.z = 50;
	this.speed = 5;
	
	//move the camera corresponding to keys pressed
	this.update = function() {
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
	
	//show the camera
	this.show = function() {
		camera(cam.x, cam.y, cam.z)
	}
}