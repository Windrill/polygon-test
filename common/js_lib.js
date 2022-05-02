// Additions to array
function same_but_offset(a, b) {
  for (let i=0;i<b.length;i++) {
      if (b[i] == a[0]) {
      if (is_same(a, b, i)) return true;
    }
  }
  return false;
}
let is_same = (a, b, offset=0) => {
  return (a.length == b.length) && ((a, b, offset) => {
    for (let i=0; i<a.length;i++) {
      if (a[i] != b[((i+offset)%b.length)]) return false;
  }
    return true;
  });
};

// 'object' quick check
// can't realy wrap with a condition? eg. check this object must be 'dot'


// I don't care if my stuff is stored in Object.keys format or array format, i need a looper