
class cdrawable {
  constructor() {
    this.register_shape = [];
    this.edges = [];

    this.otherCalls = []; // 'debug' calls...
  }
  // pushes actually there's just going to be 1 link per 2 lines???
  // no i think there are 2 links per 2 lines! 
  getLinkedLines(point) {
    let rets = [];
    for (let i=0;i<this.edges.length;i++) {
      if (point.id == this.edges[i].p1.id
        // || point.id == this.edges[i].p2.id
      )
         rets.push(this.edges[i]);
    }
    return rets;
  }
  registerOtherFn(fn, ...args) {
    console.log((args));
    // this.otherCalls.push(fn.bind(args[0], ...args));
    // this.otherCalls.push(fn.bind(this, args[1], args[2]));
    this.otherCalls.push(fn.bind(...args));
  }
  // should be 'area' feature.....add to cdrawable, to call all the area 'action' function, to achieve extensible-without-modification
// calculates area for shape
  // only works for convex shapes, as it only retains point information
  // draw every time
  drawArea() {
    // if (this.register_shape.length == 0) {
    //   console.log("no need to draw area because this polygon did not register to draw");
    // }
    if (!this.register_shape) return;
    for (let i=0;i<this.register_shape.length;i++) {
      this.register_shape[i].draw();
    }
  }

  draw() {
    if (this.sides==0) {
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
      ctx.closePath();
    } else {
      for(let v=0;v<this.edges.length;v++) {
        this.edges[v].draw(this.edges[v].color);
      }
    } // end else
    for (let a in this.points) {
      //console.log(this.points[i].x,this.points[i].y);
      //(this.points[i]).rotate(0);
      //atan2: - pi to pi, inclusive
      // (this.points[a]).rotate(0.0, {x:100,y:100 });
    }
    this.drawArea();
    for (let a=0;a<this.otherCalls.length;a++) {
      this.otherCalls[a]();
    }
  }
}
// Explicitly managed edges...???
// Don't 

// okay, in the 2d world, define polygon as a collection of vertices/points!
// convex polygon
class Polygon extends cdrawable {
  // one time initialization to define 'shapes' in the polygon you want to track
  regShape(inputs) {
    this.register_shape.push(new PolygonArea(this, inputs));
  }
  recalc() {
    for (let i=0;i<this.register_shape.length;i++) {
      this.register_shape[i].recalc();
    }
  }
  getMidpoint() {
    return {x:this.x, y:this.y};
  }
  constructor(ctx,x=100,y=100,r=5, sides=0) {
    super();
    console.log("Creating polygon with ", sides, " sides");
    console.log(arguments);
    // convex polygon intersection? no issue....since, it checks all edges........// and check smth completely inside another?
    this.points = {};
    // all 'shapes' with areas, you put it here
    // make it such that x,y is midpoint
    this.x = x ;
    this.y = y ;
    this.r = r;
    this.sides = sides;
    if (this.sides > 0) {
      // traverse around for the edge?
      const step=2*Math.PI/this.sides;
      let px, py;
      let orgPoint;
      let d1;
      let d2;
      for(let i=0;i<sides;i++) {
        px = (this.x) + r*Math.cos(i*step);
        py = (this.y) + r*Math.sin(i*step);
        console.log(px, py);
        d1 = new Dot(px, py);
        this.points[d1.id] = d1;

        // Push edges
        if (i == 0) {
          orgPoint = d1;
          //this.edges.push(new Line(this.points[this.points.length-1], this.points[this.points.length-2]));
        } else {
          // drawing from 'right' to 'left' since i'm turning clockwise
          this.edges.push(new Line(d1, d2));
        }
        d2 = d1;
      } // End looping through sides
      this.edges.push(new Line(d1, orgPoint));
    } // End drawing sided polygon
  } // end constructor

  calc() {
    let trav = {};
    
    // put all edges in this.edges; edges are consisted of 2 points, 4 points in arr i guess
    for (let v=0;v<pointsLength;v++) {
      let vObj = this.points[v];
      let objsize = Object.keys(vObj.linked).length;
      for (let n=0;n<objsize;n++) {
        if (!trav[vObj.p_id] || !trav[vObj.p_id][vObj.linked[n].p_id]) {
          trav[vObj.p_id] = {};
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
    for (let i in this.points) {
      arr = arr.concat(this.looploop(this.points[i]));
    }
    return arr;
  }
  
  rotate(r, o={x:100, y:100}) {
    for (let a in this.points) {
      //(this.points[i]).rotate(0);
      //atan2: - pi to pi, inclusive
      (this.points[a]).rotate(r, o);
    }
  }
  getPoint(id) {
    return this.points[id];
  }
  getOnePoint() {
    return this.points[Object.keys(this.points)[0]];
  }
  // get line segment
  getLine(i) {
    return this.edges[i];
  }
  
  splitLine(i) {
    let newLine = this.edges[i].halfLine();
    //console.log(newLine, newLine.p1);
    let d1 = newLine.getP1();
    this.points[d1.id] = d1;
    this.edges.push(newLine);
    
    return this.points[d1.id];
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
    this.points[point.id] = point;
    // need to update edges!!!
    // if the edge doesn't exist in a polygon, need to add them?
    return point;
  }
  
  // err....link 2 lines within the polygon...
  linkline(i, j) {
    let l = new Line(i, j);
    this.edges.push(l);
    return l;
  }
} // end class polygon

class anygon extends Polygon {
  // don't steal all constructors yet
  constructor(...args) {
    //ctx=null,x=100,y=100,r=5, sides=0
    super(...args); // lol let polygon call cdrawable's constructor then
    
    this.sides = -1;
    // passively managed....or not managed
    // passively managed hence follows points! you must add all neighboring points to the anygon, anygon won't search the rest of connected points to edges
    this.edgeMatrix = {};
    // points are still in an array???!
  }

  // Oh be assured that the edge will only exist as 'low-id', 'high-id'
  getLine(p1, p2) {
    // search in edge matrix
    let a = p1, b = p2;
    if (p1.id > p2.id)
      a = p2; b = p1;

    if (this.edgeMatrix[a.id]) {
      if (!this.edgeMatrix[a.id][b.id]) return null;
      return this.edges(this.edgeMatrix[a.id][b.id]);
    }
  }

  // won't add any points here...will just get all its immediate edges..
  registerEdges(...args) {
    for (let i=0;i<args.length;i++) {
      if (args[i].constructor.name === "Dot") {
        // this.points.push(args[i]);
        // lol, put sorted edges from low-id to high-id in edges cache
        let lObj = args[i].linked;
        // console.log(lObj); // all neighbors
        let id1 = args[i].id;
        for (let l in lObj) {
          let id2 = lObj[l].id; //id2: 6, l: "6"
          // wanna link?
          if (id2 < id1) {
            // link from their perspective
            // console.log("registering....from", lObj[l].id);
            this.registerEdges(lObj[l]);
          }
          if (!this.edgeMatrix[id1]) this.edgeMatrix[id1] = {};
          // if edg already recorded, then dont record
          if (this.edgeMatrix[id1][id2]) {
            continue;
          } else {
            // console.log(args[i], lObj[l]);
            this.edgeMatrix[id1][id2] = this.edges.length;
            this.edges.push(new Line(args[i], lObj[l])); // smaller id to larger id
          }
        }
      }
      
    }
  } // end addpoints
  // point or id...
  highlightLine(id1, id2, thickness=5) {
    let i1=0; let i2=0;
    if (isNaN(id1) && id1.constructor.name === "Dot") {
      i1=id1.id;
      i2 = id2.id;
    }
    else if (!isNaN(id1)) {
      i1 = id2; i2 = id2;
    } else {
      console.log("Wrong input!! Line is not number or dot"); return;
    }
    //end type-based check....
    let ids = [i1,i2];
    if (i1 > i2) ids = [i2, i1];
    if (this.edgeMatrix[ids[0]] && this.edgeMatrix[ids[0]][ids[1]]) {
      let edgePos = this.edgeMatrix[ids[0]][ids[1]];
      console.log(edgePos);
      this.edges[edgePos].thick(thickness);
    } else {
      console.log("cannot find the edge in this ngon!!", ids, this.edgeMatrix[ids[0]]);
    }
  }
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
  // calculate polygon area
  calculate() {
    let a = 0;
    this.midpoint.x = 0;
    this.midpoint.y = 0;
    // console.log(this.trianglearr);
    // console.log(this.polygon.points);
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
    // console.log(this.area);
    this.recalculate = false;
    return a;
  }
  draw(){
    if (this.recalculate) { this.calculate(); }
    ctx.fillText((this.area*100/20000).toFixed(1), this.midpoint.x, this.midpoint.y);
    ctx.fillStyle = "#1100aa";
  }
  recalc() {
    this.recalculate = true;
  }
}
