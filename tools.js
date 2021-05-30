// what is a 3d cross - 3d dot like.....what does that num even mean
let RAD2ANG = (x)=>180*x/Math.PI;
function getangle(x, y) {
  let len = (x) => Math.sqrt(x.x*x.x + x.y*x.y);
  let dot = (x,y) => x.x*y.x + x.y*y.y;
  let cross = (x,y) => x.x*y.y - y.x*x.y;
  //console.log(x, y, x.x, dot(x,y));
  return Math.acos(dot(x,y)/(len(x)*len(y)));
}
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
// for html5
class Color {
  static getDiff(num, style='random') {
    let colors = [];
    for (let i=0;i<num;i++) {
      colors.push(randomHex());
    }
    return colors;
  }
}
// register_click, hover, click, move
function see_fn(obj){
  console.log(typeof obj.hover === 'function');
  //if ((typeof obj.hover === 'function')) {
    //RegisterClick(obj);
//}
}
// 'delegation'?
class RegisterClick {
  constructor(obj){
    //console.log("should be added upon constructor");
    this.obj = obj;
    this.hover = false;
    this.click = false;
    register_call.add(this);
    draw_call.add(this);    
  }
  clicked() {
    this.click = true;
    console.log("Click");
  }
  released() {
    this.click = false;
  }
  hovered() {
    this.hover = true;
  }
  moveout() {
    this.hover = false;
  }
  // wrapper....explicit expose for i guess
  within(e) {
    return this.obj.within(e);
  }
  draw() {
    return this.obj.draw(this.hover, this.click);
  }
  moveto(e) {
    if (this.click)
      return this.obj.moveto(e);
  }
}
let p_id = 0;
class Dot {
  constructor(x,y, r=10, polygon=null) {
    this.id = p_id++;
    this.linked = {};
    this.x = x;
    this.y = y;
    this.polygon = polygon;
    // for the exagerrated representation
    this.circleRadius = r;
    this.color = randomHex();
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
  addNeighbor(other) {
    this.linked[other.id] = other;
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
}
class Line{
  constructor(p1,p2) {
    this.p1 = p1;
    this.p2 = p2;
    p1.addNeighbor(p2);
    p2.addNeighbor(p1);
    //console.log(this.p1, this.p2);
    this.color = randomHex();
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
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();    
    ctx.strokeStyle = color;
    //console.log(color);
    ctx.lineWidth = 2;
    if (num) {
      let p1text = this.p1.x + ", " + this.p1.y;
      let p2text = this.p2.x + ", " + this.p2.y;
      p1text = `${this.p1.id}\n(${this.p1.x.toFixed(0)},${this.p1.y.toFixed(0)})`;
      p2text = `${this.p2.id}\n(${this.p2.x.toFixed(0)},${this.p2.y.toFixed(0)})`;
      //p2text = this.p2.id;  
      ctx.fillText(p1text, this.p1.x, this.p1.y);//, 140); <--140 is max width..
      ctx.fillText(p2text, this.p2.x, this.p2.y);
      ctx.fillStyle="#000000";

    }
  //  ctx.closePath();
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

  function protate(p1, theta, o1={x:0,y:0}){
    let angle = Math.atan2(p1.y-o1.y,(p1.x-o1.x));
    let r = Math.sqrt((p1.x-o1.x)*(p1.x-o1.x) + (p1.y-o1.y)*(p1.y-o1.y));
    let dx = (r * Math.cos(angle+theta)+o1.x)-(r * Math.cos(angle)+o1.x);//-this.x;
    let dy = (r * Math.sin(angle+theta)+o1.y)-(r * Math.sin(angle)+o1.y);//-this.y;
    //console.log("ROT", dx, dy, p1.x+dx, p1.y+dy);
   //console.log(this.x, dx, this.y, dy, Math.cos(angle+theta)*R2D, Math.sin(angle+theta)*R2D);
    p1.x+=dx;p1.y+=dy;
    
  }
class PolygonArea {
  constructor(polygon, trianglearr) {
    this.area = 0;
    this.midpoint = {x:0,y:0};
    this.trianglearr = trianglearr;
    //console.log(this.trianglearr);
    this.polygon = polygon;
    this.recalculate = true;
    if (this.trianglearr.length < 3) throw Exception("Triangle cannot have length < 3");
  }
  
  trianglearea(p1, p2, p3) {
    let t1 = {x:p1.x-p2.x, y:p1.y-p2.y};
    // p2 is zeroed
    let t3 = {x:p3.x-p2.x, y:p3.y-p2.y};
    //t1.x*=0.01;t1.y*=0.01;
    //t3.x*=0.01;t3.y*=0.01;
    
    let a = getangle({x:10,y:0}, t3); // line up on x axis
    //console.log(t1.x, t1.y, t3.x, t3.y, RAD2ANG(a));
    // er, well.........anti-clockwise needs work
    protate(t3, -1*a);
    // a should be rotating around b....
    protate(t1, -1*a);
    //console.log(t1.x, t1.y, t3.x, t3.y, RAD2ANG(a));
    //console.log(t1, t3);
    let b = getangle(t1, t3);
    if(b > Math.PI/2) b = Math.PI-b;
    let t1_mag = Math.sqrt(((t1.x-t3.x)*(t1.x-t3.x))+((t1.y-t3.y)*(t1.y-t3.y)));
    //console.log(t1.y/t1_mag, t1_mag);
    //console.log(t1.y, t3.x, t1.y * t3.x / 2);
    //let straight = (Math.asin(t1.y/t1_mag)*t1_mag);
    //console.log(b, t1_mag, straight);
    //console.log(straight*t3.x/2);
    // rotate p3... to be parallel...
    //  let dot = (x,y) => x.x*y.x + x.y*y.y;
    //let cross = (x,y) => x.x*y.y - y.x*x.y;
    //return straight*t3.x/2;
    return t1.y * t3.x / 2;
  }
  calculate() {
    let a = 0;
    this.midpoint.x = 0;
    this.midpoint.y = 0;
    for (let i=0;i<this.trianglearr.length;i++) {
      this.midpoint.x += this.polygon.points[this.trianglearr[i]].x;
      this.midpoint.y += this.polygon.points[this.trianglearr[i]].y;
    }
    this.midpoint.x /= this.trianglearr.length;
    this.midpoint.y /= this.trianglearr.length;
    
    // add 2, abc --> cxx....
    for (let i=0;i<this.trianglearr.length-2;i+=2) {
      //console.log(dotvec[i], this.points[dotvec[i]], this.points[dotvec[i+1]], this.points[dotvec[i+2]]);
      let area = this.trianglearea(this.polygon.points[this.trianglearr[i]],this.polygon.points[this.trianglearr[i+1]],this.polygon.points[this.trianglearr[i+2]]);
      a += Math.abs(area);
    }
    this.area = a;
    console.log(this.area);
    this.recalculate = false;
    return a;  
  }
  draw(){
    if (this.recalculate) { this.calculate(); }
    ctx.fillText((this.area*100/19253).toFixed(1), this.midpoint.x, this.midpoint.y);
    ctx.fillStyle = "#1100aa";
  }
  recalc() {
    this.recalculate = true;
  }
}
// okay, in the 2d world, define polygon as a collection of vertices/points!
class Polygon {
  // calculates area for shape
  // only works for convex shapes, as it only retains point information
  // draw every time
  drawArea() {
    for (let i=0;i<this.register_shape.length;i++) {
    this.register_shape[i].draw();
      //recalc();
      }
  }
  // one time initialization to define 'shapes' in the polygon you want to track
  regShape(inputs) {
    this.register_shape.push(new PolygonArea(this, inputs));
  }
  recalc() {
    for (let i=0;i<this.register_shape.length;i++) {
      this.register_shape[i].recalc();
    }
  }
  constructor(ctx,x=100,y=100,r=5, sides=0) {
    this.lines = [];
    this.points = [];
    // convex polygon intersection? no issue....since, it checks all edges........// and check smth completely inside another?
    this.edges = [];
    // all 'shapes' with areas, you put it here
    this.register_shape = [];
    this.x = x;
    this.y=y;
    this.r=r;
    this.sides=sides;
    if (this.sides != 0) {
      // traverse around for the edge?
      const step=2*Math.PI/this.sides;
      let px, py;
      let orgPoint;
      for(let i=0;i<sides;i++) {
        px = (x-r) + r*Math.cos(i*step);
        py = (y-r) + r*Math.sin(i*step);
        //if (i==0) {
        //  this.points.push(new Dot(y-r, x-r));
      //}
        this.points.push(new Dot(px, py));
      //console.log("init..", px, py, this.points);
        if (i == 0) {
          orgPoint = this.points[this.points.length-1];
          //this.lines.push(new Line(this.points[this.points.length-1], this.points[this.points.length-2]));
        } else {
          // drawing from 'right' to 'left' since i'm turning clockwise
          this.lines.push(new Line(this.points[this.points.length-1], this.points[this.points.length-2]));
        }
      }
      this.lines.push(new Line(this.points[this.points.length-1], orgPoint));
    } //
  } // end constructor
  calc() {
    let trav = [];
    // init trav array
    for (let i=0;i<this.points.length;i++) {  
      trav.push([]);
      for (let j=0;j<this.points.length;j++) {
        trav[i].push(0);
      }
    }
    // put all edges in this.edges; edges are consisted of 2 points, 4 points in arr i guess
    for (let v=0;v<this.points.length;v++) {
      let vObj = this.points[v];
      let objsize = Object.keys(vObj.linked).length;
      for (let n=0;n<objsize;n++) {
        if (trav[vObj.p_id][vObj.linked[n].p_id] == 0) {
          trav[vObj.p_id][vObj.linked[n].p_id] = 1;
          this.sides.push([vObj.position[0], vObj.position[1], vObj.linked[n].position[0], vObj.linked[n].position[1]]);
        }
      }
    }
  }
  looploop(p, arr=[], trav={}){
    let ret = [];
    if(trav[p.id]) {
      console.log("this shouldve been checked!!!");
      return [];
    }
    
    // check initial point
    if (arr.length > 1) {
      for (let l in p.linked) {
        if (l == arr[0]) {
          arr.push(p.id);
          arr.push(arr[0]);
          
          ///console.log("closing loop", p.id, arr); 
          trav[arr[0]] = true;
          let resa = []; //useless
          Object.assign(resa, arr);
          return [resa];    
        }
      }
    }
    
    // search for everything still
    for (let n in p.linked) {
      // if its neighbors include the initial point, stop
      if (!trav[n]) {
        trav[p.id] = true;
        //console.log("prepare loop:", p.id, n, Object.keys(trav));
        let tt = {};
        let aa = [];
        Object.assign(tt, trav);
        Object.assign(aa, arr);
        aa.push(p.id);
        let bb = this.looploop(p.linked[n], aa, tt);
        if (bb.length != 0) {
          /*for (let a in bb)
            if (a != [])  {
          
            ret.push(a);
          
            console.log(a, bb, ret);
          }*/
            ret = ret.concat(bb);
        //else if (a.length < 2) console.log(aa);
          //console.log(bb);
        }
        // i know this is a dfs....
        //console.log(p.id, bb, Object.keys(trav));
      }
    }
    //console.log(ret);
    //if (ret.length == 0)
    //  console.log(p, arr, trav);
    // i believe everything has had their turn
    //console.log("abandoning? ", p.id, ret, Object.keys(p.linked), arr, Object.keys(trav));
    return ret;
  }
  findfaces() {
    let arr = []
    for (let i=0;i<this.points.length;i++) {
      arr = arr.concat(this.looploop(this.points[i]));
      //break;
    }
    return arr;
  }
  draw() {
    if (this.sides==0) {
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
      ctx.closePath();
    } else {
      for(let v=0;v<this.lines.length;v++) {
        this.lines[v].draw(this.lines[v].color);
      }
    } // end else
    for (let i =0;i<this.points.length;i++){
      //console.log(this.points[i].x,this.points[i].y);
      //(this.points[i]).rotate(0);
      //atan2: - pi to pi, inclusive
      (this.points[i]).rotate(0.0, {x:100,y:100 });
    }
    this.drawArea();
  }
  
  rotate(r) {
        for (let i =0;i<this.points.length;i++){
      //console.log(this.points[i].x,this.points[i].y);
      //(this.points[i]).rotate(0);
      //atan2: - pi to pi, inclusive
      (this.points[i]).rotate(r, {x:100,y:100 });
    }
  }
  getVertex(i) {
    return this.points[i];
  }
  // get line segment
  getLine(i) {
    return this.lines[i];
  }
  
  splitLine(i) {
    let newLine = this.lines[i].halfLine();
    //console.log(newLine, newLine.p1);
    this.points.push(newLine.getP1());
    this.lines.push(newLine);
    
    return this.points[this.points.length-1];
  }
  
  // can be clientx pos or relative pos, depends if you put polygin on absolute or relative pos
  within(pos) {
    if (this.sides==0) {
      if (Math.sqrt(Math.pow(this.x-pos.x,2)+Math.pow(this.y-pos.y, 2)) < this.r) {
        return true;
      } 
      return false;
    } else {
      
    }
    return false;
  }
  // add a point and return it.....
  addpoint(point) {
    this.points.push(point);
    return point;
  }
  
  // err....link 2 lines within the polygon...
  linkline(i, j) {
    let l = new Line(i, j);
    this.lines.push(l);
    return l;
  }
} // end class polygon
