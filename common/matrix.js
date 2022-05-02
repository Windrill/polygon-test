function matMultVector(v2) {
		let vv = v2;
		if (v2.length < 3) {
			vv = [v2[0], v2[1], 1];
		}

		let res = [0,0,0];
		// no transpose or shape here, assume v2 is flat shape
		for (let i=0;i<3;i++) {
			res[i] = vv[0]*this.m[0][i] + vv[1]*this.m[1][i] + vv[2]*this.m[2][i];
		}
		return res;
	}


class Matrix {
	// affine
	constructor() {
		this.m = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]];
		this.lastOperation = []; // save multiplication interp????? from a to b using x op.
	}

	multVector(v2) {
		let vv = v2;
		if (v2.length < 3) {
			vv = [v2[0], v2[1], 1];
		}

		let res = [0,0,0];
		// no transpose or shape here, assume v2 is flat shape
		for (let i=0;i<3;i++) {
			res[i] = vv[0]*this.m[0][i] + vv[1]*this.m[1][i] + vv[2]*this.m[2][i];
		}
		return res;
	}

	rotate(v2, angle) {
		// clockwise
		let clock = [
		[Math.cos(t), Math.sin(t),0],
		[-Math.sin(t), Math.cos(t),0],
		[0,0,1]
		];
		return this.multVector(v2, angle)

	}

	// let m00, m01, m02,
	//     m10, m11, m12,
	//     m20, m21, m22;
}
class ShapeMatrix extends Matrix {
	constructor(shape) {
		super();
		this.shape = shape;
		// transformed shape caching??

		// this.shapeClone = new Polygon(this.shape);
		// this.shapeClone = Object.create(this.shape);
		// console.log(this.shapeClone);
		// console.log(this.shapeClone.getpoints)
		// this.shapeClone = Object.assign(this.shapeClone, this.shape);
		// console.log(this.shapeClone);
		// console.log(this.shapeClone); //looks like the clone is successful
	}
	getcenter() {
		return this.shape.getcenter();
	}
	getProjected() {
		return this.shape;
	}
	settrans(x,y) {
		this.m = [
		[1,0,0],
		[0,1,0],
		[x,y,1]
		];
	}
	// x,y center of scale
	setscale(s, x=0,y=0) {
		console.log(x,y);	
		this.m = [
		[s,0,0],
		[0,s,0],
		[-x*(s-1),-y*(s-1),1]
		];
	}
	setid() {
	this.m = [
		[1,0,0],
		[0,1,0],
		[0,0,1]
		];
	}
	setrotate(angle) {
		let t = angle;
		console.log(Math.cos(t));
		this.m = [
		[Math.cos(t), Math.sin(t),0],
		[-Math.sin(t), Math.cos(t),0],
		[0,0,1]
		];
	}
	update() {
		let points = this.shape.getpoints();
		for(let kp in Object.keys(points)) {
			let p = points[kp];
			let srcp = this.shape.getPoint(p.id);
			let v = this.multVector([srcp.x,srcp.y]);
			console.log(v);
			p.x = v[0];
			p.y = v[1];
			//p.id
		}
	}
}