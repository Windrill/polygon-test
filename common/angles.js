let len = (x) => Math.sqrt(x.x*x.x + x.y*x.y);
let dot = (x,y) => x.x*y.x + x.y*y.y;
let cross = (x,y) => x.x*y.y - y.x*x.y;
let scale = (x, a) => { x.x *= a; x.y *=a;};
let clone = (x) => { return {x:x.x, y:x.y}};

class Rad {
  Rad(num) {
    this.value = num;
  }
  toString() {
    return RAD2ANG(this.value);
  }
}

// radians....
function p2c(r, a) {
  return [r*Math.cos(a), r*Math.sin(a)];
}
function c2p(x, y) {
  let r = len({x:x, y:y});
  let yang = Math.acos(x/r);
  let xang = Math.asin(y/r);
// if (x < 100)
  // console.log(x, y, Math.atan2(y,x), r, yang, xang);
  return [r, yang];
}

// what is a 3d cross - 3d dot like.....what does that num even mean
function getangle(x, y) {
  // console.log(x.x, x.y, y.x, y.y)
  // console.log(dot(x,y), len(x) * len(y));
  return RAD2ANG(Math.acos(dot(x,y)/(len(x)*len(y))));
}

function angleBetweenVectors(l1, l2) {
  if (typeof(l1.x) == "undefined" || 
      typeof(l1.y) == "undefined" || 
      typeof(l2.x) == "undefined" || 
      typeof(l2.y) == "undefined"
      ) {
    console.log("Angle input invalid, parameter format must be objects with members a.x, a.y!");
    return;
  }
  let c1 = clone(l1);
  let c2 = clone(l2);
  if (len(c1) < 0.01) c1.scale(100);
  if (len(c2) < 0.01) c2.scale(100);
  if (len(c1) * len(c2) < 0.001) {
    console.log("Vectors lengths are too small even after scaling.");
    return;
  }
  let magAB = len(c1) * len(c2);
  let sinTheta = cross(c1, c2) / magAB;
  let cosTheta = dot(c1, c2) / magAB;
  let theta = Math.atan2(sinTheta, cosTheta);
  return RAD2ANG(theta);
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