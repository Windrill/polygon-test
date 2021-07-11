// 'delegation'?
// Interface
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
    // assert (typeof(this.obj.within) == 'function');
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