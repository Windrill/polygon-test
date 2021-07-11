// what is a 3d cross - 3d dot like.....what does that num even mean
function getangle(x, y) {
  let len = (x) => Math.sqrt(x.x*x.x + x.y*x.y);
  let dot = (x,y) => x.x*y.x + x.y*y.y;
  let cross = (x,y) => x.x*y.y - y.x*x.y;
  //console.log(x, y, x.x, dot(x,y));
  return Math.acos(dot(x,y)/(len(x)*len(y)));
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