function Teleporter(x, y, w, h) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	
	this.show = function() {
		stroke(0);
		strokeWeight(2);
		fill(0, 255, 0);
		rect(this.x,this.y,this.w,this.h);
	}
	
	this.update = function() {
		if (this.playerTouched()) {
			me.x = 50;
			me.y = level * 250;
			level += 1
		}
	}

	this.playerTouched = function() {
		if (abs(me.x - this.x - this.w / 2) < this.w && abs(me.y - this.y - this.h / 2) < this.h) {
			return true;
		}
		return false;
	}
}