function Block(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	this.show = function() {
		stroke(0);
		strokeWeight(2);
		fill(255);
		rect(this.x,this.y,this.w,this.h);
	}
}