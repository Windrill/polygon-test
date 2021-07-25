// closeness indicator for d1,d2 from d1 to d2
function clockwisecloseness360(d1, d2) {
  return (d1-d2 + 360) % (360);
  // return (d1 + Math.PI*2) % Math.PI*2;
}
// quadrant sensitive...
function angle360(p1, p2) {
  let diff = p1.subtract(p2); // y axis is flipped
  diff.y *= -1;
  let ang = (vecangle(diff));
  console.log(diff, ang);

  // if (diff.x < 0 && -1*diff.y > 0) {
  //   // 90 - 180
  //   ang += Math.PI/2;
  // } else if (diff.x < 0 && -1*diff.y < 0) {
  //   ang += Math.PI;
  // } else if (diff.x > 0 && -1*diff.y < 0) {
  //   ang += Math.PI * 3/2;
  // }
  return ang;
}
function getNgonOutline(ngon, startpoint=null) {
  if (ngon.constructor.name !== "anygon") { console.log("Getting outline of non-ngon is not supported!"); return; }
  // assuming startpoint is valid if present...

  let p1 = startpoint;
  if (!p1) p1 = ngon.getOnePoint();
  // for the first point, how do you know it is an extremity? how do you know the sides of this extremity???
  // now start tracing:
  /* for each point, find a next leftmost point, then the leftmost
  ?? 
  */
 let traversed = {[p1.id]:1};
  let rightmost = null;
  let rightAng;
  let lines = [];
    let a = 0;//vecangle(p1);
  while (p1) {
    let aa = a;
    for (let p in p1.linked) {
      let linkedDot = p1.linked[p];
      // console.log(p1, linkedDot);
      // console.log(p, Object.keys(p1.linked), linkedDot)
      // let ang = vecangle(p1.subtract(linkedDot));
      let ang = angle360(linkedDot, p1);
      let aang = clockwisecloseness360(a, ang);
      // let aang = clockwisecloseness(ang);
      console.log(p1.id, linkedDot.id, (ang), a , aang, traversed[linkedDot.id]);
      if ((!rightmost || rightAng > aang) && !traversed[linkedDot.id]) {
        rightmost = linkedDot;
        rightAng = aang;
        aa = ang;
        // console.log(rightmost.id, rightAng);
      }
    }
    if (!rightmost) {
      console.log("All traversed");
      break;
    }
    // lines.push
    console.log(`Rightmost ${rightmost.id} of ${p1.id}`);
    a = aa;
    traversed[rightmost.id] = 1;
    p1 = rightmost;
    rightmost = null;
  } //end while
console.log(lines);
  // for (let t in traversed) {
  //   console.log(t);
  // }
  
}
function trace() {

}
// c is left of ab
function left(a, b, c, debug=false) {
  if (debug) 
    console.log(`${a.x}`);
  return ((b.x - a.x) * (c.y - a.y) - ((b.y - a.y) * (c.x - a.x))) > 0;
}