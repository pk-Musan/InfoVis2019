function main(){
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 10);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);


    var vertices = [
        [-1, 1, 1],
        [-1, -1, 1],
        [1, -1, 1],
        [1, 1, 1],
        [-1, 1, -1],
        [-1, -1, -1],
        [1, -1, -1],
        [1, 1, -1]
    ];

    var faces = [
        [0, 1, 2],
        [0, 2, 3],
        [4, 5, 1],
        [4, 1, 0],
        [7, 6, 5],
        [7, 5, 4],
        [3, 2, 6],
        [3, 6, 7],
        [4, 0, 3],
        [4, 3, 7],
        [1, 5, 6],
        [1, 6, 2]
    ];

    var geometry = new THREE.Geometry();
    var v = [];
    for(var i=0; i<vertices.length; i++){
        v[i] = new THREE.Vector3().fromArray(vertices[i]);
        geometry.vertices.push(v[i]);
    }

    var f = [];
    for(var i=0; i<faces.length; i++){
        var id = faces[i];
        f[i] = new THREE.Face3(id[0], id[1], id[2]);
        geometry.faces.push(f[i]);
    }

    geometry.computeFaceNormals();
    /*
    var id = [
        faces[0],
        faces[1],
        faces[2],
        faces[3],
        faces[4],
        faces[5]
    ];
    */
    //var material = new THREE.MeshLambertMaterial({color: 0xffffff});
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
/*
    var light = new THREE.PointLight(0xff0000);
    light.position.set(20, 20, 20);
    scene.add(light);
*/
    loop();

    function loop(){
        requestAnimationFrame(loop);
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
}