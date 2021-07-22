tested:
- polyton mesh consists of vertices (VV) and lines, not coupled/sorted
- faces are implied, and calculated through looping vertices
- line segmenting

next:
- group common functions (triangle area, w/ options eg. point/angle/line)
- check color-picker common code
- triangulation: anything other than 'ear picking'? also, check positive/negative degrees for concave polygons
- decision to update 'area' and other 'calculations', register polygon to those updates

cHANGES IN Structure..
make the point array behave just like a linked map, since it's an array anyways
edges (for ngon) are currently implemented as a matrix + key-value, sorted low-id <-> high-id point

computation practices
should go in another file. eg, (single) polygon outline tracing


todo
make all rendering text a type and check for collisions for all texts at runtime
constructor (text, x, y) <---maybe add a relative reference point, so the supplementary line points away from the reference point n doesnt cross the point
add_reference_point(x,y)
if collide, use some indicator...