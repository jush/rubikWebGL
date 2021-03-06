var container, stats;

var camera, scene, renderer;

var cube= [];
var numberOfCubesColumn = 3;
var numberOfCubesRow = 3;
var numberOfCubesDepth = 3;
var plane;

var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseIsDown = 0;
var currentRotationX = 0;
var currentRotationY = 0;
var currentRotationZ = 0;
var objectiveRotationX = 0;
var objectiveRotationY = 0;
var objectiveRotationZ = 0;
var layerRotationX = 0;
var layerRotationY = 2;
var layerRotationZ = 2;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;



init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = 'Drag to spin the cube';
	container.appendChild( info );

	camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.y = 1000;
	camera.position.z = 700;
	camera.position.x = 150;
	camera.target.position.y = 400;
	camera.target.position.x = 150;

	scene = new THREE.Scene();

	// Cube

	var materials = [];

     // Let's add the materials to the cube faces
	for ( var i = 0; i < 6; i ++ ) {

		materials.push( [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) ] );

	}

  var positionX = 0;
  for (var row = 0; row < numberOfCubesRow; row++) {
    cube[row] = [];
    for (var columns = 0; columns < numberOfCubesColumn; columns++) {
      cube[row][columns] = [];
      for (var depth = 0; depth < numberOfCubesDepth; depth++) {
        cube[row][columns][depth] = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
        cube[row][columns][depth].overdraw = true;
        scene.addObject( cube[row][columns][depth]);
      }
    }
    console.log(cube);
  }

	// Plane Shadow
	plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
	plane.rotation.x = - 90 * ( Math.PI / 180 );
	plane.overdraw = true;
	scene.addObject( plane );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

// This gets as parameters the 2 coordinates of the piece that are not the
// normal vector (eg, if the rotation is around X, give Y and Z.)
// TODO: Make this independant of the order of the rubik cube.
function get_angle_for_piece(x, y) {
    step = Math.PI/4;
    if (x == 0 && y == 0) return step;
    if (x == 1 && y == 0) return 2*step;
    if (x == 2 && y == 0) return 3*step;
    if (x == 2 && y == 1) return 4*step;
    if (x == 2 && y == 2) return 5*step;
    if (x == 1 && y == 2) return 6*step;
    if (x == 0 && y == 2) return 7*step;
    return 0;
}

function get_rotation_step(cur, obj) {
    var diff = obj - cur;
    var steps = 200; // TODO: This should be tuned for slower machines.

    if (diff < 0.01) return obj;
    else return cur + (obj - cur) / steps;
}

function render() {
  for (var row = 0; row < numberOfCubesRow; row ++) {
    for (var col = 0; col < numberOfCubesColumn; col++) {
      for (var depth = 0; depth < numberOfCubesDepth; depth++) {
        var z = (215 * (depth - 1));
        var y = (215 * (row - 1));
        var x = (215 * (col - 1));


        if (currentRotationY != objectiveRotationY) {
            currentRotationY = get_rotation_step(currentRotationY, objectiveRotationY);
            if (row == layerRotationY) {
                var mod = Math.sqrt(x*x + z*z);
                var pos_angle = get_angle_for_piece(col, depth);
                z = mod * Math.sin(pos_angle + currentRotationY);
                x = mod * Math.cos(pos_angle + currentRotationY);
                cube[row][col][depth].rotation.y = -currentRotationY;
            }
        } else if (currentRotationX != objectiveRotationX) {
            currentRotationX = get_rotation_step(currentRotationX, objectiveRotationX);
            if (col == layerRotationX) {
                var mod = Math.sqrt(y*y + z*z);
                var pos_angle = get_angle_for_piece(depth, row);
                y = mod * Math.sin(pos_angle + currentRotationX);
                z = mod * Math.cos(pos_angle + currentRotationX);
                cube[row][col][depth].rotation.x = -currentRotationX;
            }
        } else if (currentRotationZ != objectiveRotationZ) {
            currentRotationZ = get_rotation_step(currentRotationZ, objectiveRotationZ);
            if (depth == layerRotationZ) {
                var mod = Math.sqrt(x*x + y*y);
                var pos_angle = get_angle_for_piece(row, col);
                x = mod * Math.sin(pos_angle + currentRotationZ);
                y = mod * Math.cos(pos_angle + currentRotationZ);
                cube[row][col][depth].rotation.z = -currentRotationZ;
            }
        }

        cube[row][col][depth].position.x = x;
        cube[row][col][depth].position.y = y;
        cube[row][col][depth].position.z = z;
      }
    }
  }

  renderer.render( scene, camera );
}
