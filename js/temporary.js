// get the cube which was interacted
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );

	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

	var intersects = ray.intersectObjects( cube );

	if ( intersects.length > 0 ) {
		var smallCube = intersects[ 0 ].object;
	}

// there needs to be a projector defined
	projector = new THREE.Projector();

// and also the cube needs to be flat array
// for the two dimensional version i used something like
  for (var row = 0; row < numberOfCubes; row++) {
    for (var column = 0; column < numberOfCubes; column++) {
      cube[row * numberOfCubes + column] = ...
		}
	}

