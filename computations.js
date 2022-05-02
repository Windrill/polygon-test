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
  // console.log(diff, ang);
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
  */
  let firstPoint = p1; // for closing the loop
  let done = false;
  let traversed = {[p1.id]:1};
  let rightmost = null;
  let rightAng;
  let lines = [p1.id];
  let lastAngle = 180;//vecangle(p1);
  while (p1) {
    let newAngle = lastAngle;
    for (let p in p1.linked) {
      let linkedDot = p1.linked[p];
      // console.log(p, Object.keys(p1.linked), linkedDot)
      let ang = angle360(linkedDot, p1);
      let aang = clockwisecloseness360(lastAngle, ang);
      // 
      // console.log(p1.id, linkedDot.id, (ang), lastAngle , aang, traversed[linkedDot.id]);
      if (Object.keys(traversed).length > 2 && linkedDot.id == firstPoint.id) {
        done = true;
      }
      if ((!rightmost || rightAng > aang) && !traversed[linkedDot.id]) {
        rightmost = linkedDot;
        rightAng = aang;
        newAngle = ang;;
      }
    }
    if (!rightmost || done) {
      console.log("All edges in outline are traversed or closed polygon");
      break;
    }
    lines.push(rightmost.id);
    console.log(`Rightmost ${rightmost.id} of ${p1.id}`);
    lastAngle = newAngle;
    traversed[rightmost.id] = 1;
    p1 = rightmost;
    rightmost = null;
  } //end while
  console.log(lines);
  lines.push(lines[0]);
  return lines;
// ngon.getLine(p1, p2)
  // for (let t in traversed) {
  //   console.log(t);
  // }
}

// c is left of ab
function left(a, b, c, debug=false) {
  if (debug) 
    console.log(`${a.x}`);
  return ((b.x - a.x) * (c.y - a.y) - ((b.y - a.y) * (c.x - a.x))) > 0;
}