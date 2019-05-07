function main(){
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 5);
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
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
/*
    var light = new THREE.PointLight(0xff0000);
    light.position.set(20, 20, 20);
    scene.add(light);
*/

    var colorflag = []
    for(var i=0; i<faces.length; i++) colorflag[i] = false;

    document.addEventListener('mousedown', mouse_down_event);
    loop();

    function loop(){
        requestAnimationFrame(loop);
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.007;
        cube.rotation.z += 0.003;
        renderer.render(scene, camera);
    }

    function mouse_down_event(event){
        var x_window = event.clientX;
        var y_window = event.clientY;

        var vx = renderer.domElement.offsetLeft;
        var vy = renderer.domElement.offsetTop;
        var vw = renderer.domElement.width;
        var vh = renderer.domElement.height;

        var x_NDC = 2 * (x_window - vx) / vw - 1;
        var y_NDC = -(2 * (y_window - vy) / vh - 1);

        var origin = new THREE.Vector2(x_NDC, y_NDC);
        console.log(origin.x, origin.y);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(origin, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if(intersects.length > 0){
            console.log(colorflag[intersects[0].faceIndex]);
            if(!colorflag[intersects[0].faceIndex]){
                var random0;
                var random1;
                var random2;
                while(true){
                    random0 = Math.random();
                    random1 = Math.random();
                    random2 = Math.random();

                    if(!(random0 == 1 && random1 == 1 && random2 == 1))
                        break;
                }
                intersects[0].face.color.setRGB(random0, random1, random2);
                colorflag[intersects[0].faceIndex] = true;
            }
            else{
                intersects[0].face.color.setRGB(1, 1, 1);
                colorflag[intersects[0].faceIndex] = false;
            }
            intersects[0].object.geometry.colorsNeedUpdate = true;
            //cube.geometry.colorsNeedUpdate = true;
        }

        //console.log(cube.geometry.faces);
    }
}