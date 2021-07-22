function componentToHex(c) {
  var hex = parseInt(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function randomHex() {
  return rgbToHex(Math.random()*255., Math.random()*255., Math.random()*255.);
}
function cline(x,y) {
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(x,y);
  ctx.stroke();
  ctx.closePath();
}
class Line{
  constructor(p1,p2) {
    this.p1 = p1;
    this.p2 = p2;
    p1.addNeighbor(p2);
    p2.addNeighbor(p1);
    //console.log(this.p1, this.p2);
    this.color = randomHex();
    this.lineWidth = 2;
    //this.neighbors = [];
  }
  
  getVec() {
    return this.p2.subtract(this.p1);
  }
  // 'clockwise'; note no points are copied, they're all referenced
  halfLine() {
    // remove the 2 ends, instead adding midpoint to linked obj of both
    delete this.p1.linked[this.p2.id];
    delete this.p2.linked[this.p1.id];
    
    let midpoint = new Dot((this.p1.x + this.p2.x)/2, (this.p2.y+this.p1.y)/2);
    // newline segment's p2 should link to midpoint
    this.p2.linked[midpoint.id] = midpoint;
    // midpoint should be linked to both p2, and the original p1!
    let newLine = new Line(midpoint, this.p2);
    midpoint.linked[this.p1.id] = this.p1;
    
    // thisline's segment's p1 links to midpoint
    this.p1.linked[midpoint.id] = midpoint;
    this.p2 = midpoint;
//    console.log(newLine, this.p2);
    return newLine;
  }
  getP1() { return this.p1; }
  getP2() { return this.p2; }
  draw(color, num=true) {
    // putting strokestyle after closing path will 'pollute' the stroke width for the next draw
    ctx.strokeStyle = color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.closePath();
    // if (this.lineWidth != 2)
    // console.log(this.p1.id, this.p2.id, this.lineWidth);
    if (num) {
      let p1text = this.p1.x + ", " + this.p1.y;
      let p2text = this.p2.x + ", " + this.p2.y;
      p1text = `${this.p1.id}\n(${this.p1.x.toFixed(0)},${this.p1.y.toFixed(0)})`;
      p2text = `${this.p2.id}\n(${this.p2.x.toFixed(0)},${this.p2.y.toFixed(0)})`;
      // console.log(this.p1.x, this.p1.y);
      //p2text = this.p2.id;  
      ctx.fillText(p1text, this.p1.x, this.p1.y);//, 140); <--140 is max width..
      ctx.fillText(p2text, this.p2.x, this.p2.y);
      ctx.fillStyle="#000000";

    }
    
  }
  thick(lineWidth = 5) {
    this.lineWidth = lineWidth;
  }
  //wrong f/n
  rotate(p1, theta){
    // rotate about origin....add the coords for the orig...
    let r = Math.sqrt(p1.x*p1.x + p1.y*p1.y);
    let dx = r * Math.cos(theta);
    let dy = r * Math.sin(theta);
    p1.x += dx;
    p1.y += dy;
  }
  angleBetweenLines(other) {
    let common = (this.p1.equals(other.p1) ? this.p1 : 
    this.p1.equals(other.p2) ? this.p1 : 
    this.p2.equals(other.p2) ? this.p2 : 
    this.p2.equals(other.p1) ? this.p2 : null);
    if (!common) {
      console.log("Warning: There are no points in common for these 2 lines");
      return -1;
    }
    let l1Other = this.p1.equals(common) ? this.p2 : this.p1;
    let l2Other = other.p1.equals(common) ? other.p2 : other.p1;
    let v1 = l1Other.subtract(common);
    let v2 = l2Other.subtract(common); // for example, 50, 86
    // from 100,0 to 50, 56 ---> 
    let a = getangle(v2, v1); // opposite of c....a: 60, c: -60
    let c = angleBetweenVectors(v2, v1);
    // cRad is based on the first edge reached, which does not satisfy what we want to draw
    // this is also angle between vectors, firstend-polarAngle
    let cRad = ANG2RAD(c);
    return cRad;
  }

  // btw to measure angle between vectors...need to measure p1-p2, p2-p3 or p1-p2, p3-p2???
  // this angle-between-vectors assume that both vectors have origins at (0,0), if it's not a 0,0, the angle measured is really in the wrong direction
  /*
B <----------- A
 <
  \
   \
    \
     \
      \
       \
        C      hence should be B-A, B-C
  */
 // angle from this to other
  drawAngle(other) {
    other.thick(9);
    this.thick(9);
    let common = (this.p1.equals(other.p1) ? this.p1 : 
                  this.p1.equals(other.p2) ? this.p1 : 
                  this.p2.equals(other.p2) ? this.p2 : 
                  this.p2.equals(other.p1) ? this.p2 : null);
    if (!common) {
      console.log("Warning: There are no points in common for these 2 lines");
    }
    let l1Other = this.p1.equals(common) ? this.p2 : this.p1;
    let l2Other = other.p1.equals(common) ? other.p2 : other.p1;
    let v1 = l1Other.subtract(common);
    let v2 = l2Other.subtract(common); // for example, 50, 86
    // from 100,0 to 50, 56 ---> 
    let a = getangle(v2, v1); // opposite of c....a: 60, c: -60
    let c = angleBetweenVectors(v2, v1);
    // cRad is based on the first edge reached, which does not satisfy what we want to draw
    // this is also angle between vectors, firstend-polarAngle
    let cRad = ANG2RAD(c);

    // Basing on commonPoint!
    // we want to draw: between the 2 edges based on the 1st and 2nd edges only
    // get the 2 angles then you'll get their difference
    let [firstR, firstend] = c2p(v1.x, v1.y); 
    let [secondR, polarAngle] = c2p(v2.x, v2.y);
    // console.log(p2c(secondR,polarAngle),v2.x,v2.y, secondR, polarAngle);
    let rad = 18;
    // need to be between first and second angle
    let deg = firstend + (polarAngle- firstend)/2;
    let [btwnX, btwnY] = p2c(rad * 2.5, deg);
    // console.log(RAD2ANG(firstend), RAD2ANG(polarAngle), RAD2ANG((firstend + polarAngle)/2), btwnX, btwnY);

    // ctx.font = ctx.font.replace(/\d+px/, "12px");
    ctx.beginPath();
    // oh this x,y is at the topleft corner of the cirlce!
    let clockwise = cRad > 0 ? true : false;
    // console.log(p2c(1, ANG2RAD(300)), p2c(1, ANG2RAD(210)), p2c(1, ANG2RAD(120)), p2c(1, ANG2RAD(30)));
    // console.log(RAD2ANG(polarAngle), RAD2ANG(firstend), RAD2ANG(ccRad));
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(
      common.x, common.y,
      rad*2,
      firstend,
      polarAngle,
      clockwise);
    ctx.stroke();
    ctx.closePath();
    // this arc is from firstend....
    ctx.fillText(
      c.toFixed(0),
      // RAD2ANG(deg).toFixed(0),
      common.x + btwnX, common.y + btwnY);
  }
}

class Face {
  constructor(v_idx, polygon, draw_area = true) {
    this.v_idx = v_idx;
    this.draw_area = draw_area;
  }
  draw() {
    // draw with color? /lol i dont want to
    // find out midpoint of face...
  }
}
