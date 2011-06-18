var container, stats;

var camera, scene, renderer;

var cube= [];
var numberOfCubesColumn = 3;
var numberOfCubesRow = 3;
var plane;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

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
      cube[row][columns] = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
    	cube[row][columns].position.y = 150 + (row *205);
    	cube[row][columns].position.x = 250 + (columns * 105);
  	  cube[row][columns].overdraw = true;
    	scene.addObject( cube[row][columns]);
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

//

function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

	}
}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {
  for (var row =0; row < numberOfCubesRow; row ++) {
    for (var i = -1; i < numberOfCubesColumn-1; i++) {
      //cube[0][i].rotation.y += ( targetRotation - cube[0][i].rotation.y ) * 0.05;
      var column = i + 1;
      cube[row][column].position.x = (200 * (i)) * Math.cos(targetRotation);
      cube[row][column].position.z = (200 * (i)) * Math.sin(targetRotation);
      cube[row][column].rotation.y = -targetRotation;
    }
  }
  renderer.render( scene, camera );
}
