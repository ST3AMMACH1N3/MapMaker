function Teleporter(x, y, w, h, id) {
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.id = id
	
	this.show = function() {
		stroke(0);
		strokeWeight(2);
		fill(0, 255, 0);
		rect(this.x,this.y,this.w,this.h);
		
		//draw the text above it's top-left corner showing it's x, y, width, and height
		if (coordBox.checked()) {
			fill(0);
			textSize(12);
			text("(" + this.x + ", " + this.y + ")", this.x - 56, this.y - 16, 120, 120);
			text(this.w, this.x + this.w / 2 - 12, this.y - 16, 120, 120);
			text(this.h, this.x + this.w + 6, this.y + this.h / 2 - 12, 120, 120);
		}
	}
}
