let p_id = 0;
class Dot {
  constructor(x,y, r=10, polygon=null) {
    this.id = p_id++;
    // a list of points
    this.linked = {};
    this.x = x;
    this.y = y;
    this.polygon = polygon;
    // for the exagerrated representation
    this.circleRadius = r;
    this.color = randomHex();
  }
  clone() {
    let d = new Dot();
    p_id--;
    Object.assign(d.linked, this.linked);
    d.x = this.x;
    d.y = this.y;
    d.circleRadius = this.circleRadius;
    return d;
  }
  draw(hover=false, clicked=false) {
    // draw a circle on purpose, to mak it bigger
    ctx.beginPath();
    
    ctx.arc(this.x, this.y, this.circleRadius, 0, Math.PI * 2, true); // Outer circle
    if (clicked) {
      ctx.fillStyle = "#1100aa";
    } else {
      ctx.fillStyle="#ffffff";
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }
  *getOneLinked() {
    let allLinked = Object.keys(this.linked);
    for (let i=0;i<allLinked.length;i++) {
      yield this.linked[allLinked[i]];
    }

  }
  addNeighbor(other) {
    this.linked[other.id] = other;
    // lol should i actually return other
  }
  moveto(e) {
    let pos = {x: e.clientX, y: e.clientY};
    this.x = pos.x;
    this.y = pos.y;
    if (this.polygon)
    this.polygon.recalc();
  }
  within(e) {
    let pos = {x: e.clientX, y: e.clientY};
    //console.log(Math.sqrt(Math.pow(this.x-pos.x,2)+Math.pow(this.y-pos.y, 2)), this.x, pos.x);
    let r = this.circleRadius/2;
    // make this a polygon in the future....
    if (Math.sqrt(Math.pow(this.x+r-pos.x,2)+Math.pow(this.y+r-pos.y, 2)) < this.circleRadius) {
      return true;
    }
  }
  move(a) {
    this.x += a.x;
    this.y += a.y;
  }
  // radian huh
  rotat(theta, o1={x:0,y:0}){
    let angle = Math.atan((this.y-o1.y)/(this.x-o1.x));
    if (angle < -Math.PI/2) {
      console.log("Smaller than.....");
      angle = -Math.PI/2;
    }
    if (angle > Math.PI/2) {
      console.log("...");
      angle = Math.PI/2;
    }
    
    let r = Math.sqrt((this.x-o1.x)*(this.x-o1.x) + (this.y-o1.y)*(this.y-o1.y));
    if (Math.abs(this.x-o1.x) < 0.1 || (this.y-o1.y)/(this.x-o1.x) > r*10) { // i dont want infinity eh
    console.log("!!", this.x-o1.x);
      angle = Math.PI/2;
    }
    // evaluate the sin function at the angle coord since its rate of change is the one at that spot
    let dx = r * Math.cos(angle+theta);//-this.x;
    let dy = r * Math.sin(angle+theta);//-this.y;
    console.log(this.x, dx, this.y, dy, RAD2ANG(Math.cos(angle+theta)), RAD2ANG(Math.sin(angle+theta)));
    //if (angle < -1)
    if (Math.abs(this.y-o1.y) < 0.1) {// i dont want infinity eh
    //console.log("Catching a y");
    //console.log(this.x, this.y, (this.x-o1.x), (this.y-o1.y), (this.y-o1.y)/(this.x-o1.x), angle, dx, dy);
    angle = 0;
    }
    
    this.x=dx;this.y=dy;
  }
  rotate(theta, o1={x:0,y:0}){
    let angle = Math.atan2(this.y-o1.y,(this.x-o1.x));
    let r = Math.sqrt((this.x-o1.x)*(this.x-o1.x) + (this.y-o1.y)*(this.y-o1.y));
    let dx = (r * Math.cos(angle+theta)+o1.x)-(r * Math.cos(angle)+o1.x);//-this.x;
    let dy = (r * Math.sin(angle+theta)+o1.y)-(r * Math.sin(angle)+o1.y);//-this.y;
   // console.log(this.x, dx, this.y, dy, Math.cos(angle+theta)*R2D, Math.sin(angle+theta)*R2D);
    this.x+=dx;this.y+=dy;
  }
  subtract(other) {
    return {x: this.x - other.x, y: this.y - other.y};
  }
  equals(other) {
    let neg = (x,y) => (x-y<0.0001 && x-y > 0);
    return this.id == other.id || (neg(this.x, other.x) && neg(this.y, other.y));
  }
}