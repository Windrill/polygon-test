// what is a 3d cross - 3d dot like.....what does that num even mean
function getangle(x, y) {
  let len = (x) => Math.sqrt(x.x*x.x + x.y*x.y);
  let dot = (x,y) => x.x*y.x + x.y*y.y;
  let cross = (x,y) => x.x*y.y - y.x*x.y;
  //console.log(x, y, x.x, dot(x,y));
  return Math.acos(dot(x,y)/(len(x)*len(y)));
}
