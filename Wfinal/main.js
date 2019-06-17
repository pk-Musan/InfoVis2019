var isovalue = 128;
var a, b, c, d;
var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();
var surfaces;

function main()
{
    screen.init(volume, {
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.8,
      targetDom: document.getElementById('display'),
      enableAutoResize: false
    });

    var bounds = Bounds( volume );
    screen.scene.add( bounds );
    
    setIsovalue();
    setSliceValue();

    surfaces = Isosurfaces( volume, isovalue );
    //surfaces = Slice(volume, 128, a, b, c, d);
    screen.scene.add( surfaces );
    
    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener('resize', function() {
      screen.resize([ window.innerWidth * 0.6, window.innerHeight ]);
    });

    screen.loop();
}

function setIsovalue(){
    isovalue = document.getElementById("isovalue-input").value;
    document.getElementById("isovalue-show").innerHTML = isovalue;
}

function setSliceValue(){
    a = parseInt(document.getElementById("a-input").value);
    document.getElementById("a-show").innerHTML = a;

    b = parseInt(document.getElementById("b-input").value);
    document.getElementById("b-show").innerHTML = b;

    c = parseInt(document.getElementById("c-input").value);
    document.getElementById("c-show").innerHTML = c;

    d = parseInt(document.getElementById("d-input").value);
    document.getElementById("d-show").innerHTML = d;
}

function changeValue(){
    screen.scene.remove(surfaces);
    checked_iso = document.getElementById("isovalue").checked;
    checked_slice = document.getElementById("slice").checked;
    
    if(checked_iso && !checked_slice)
        surfaces = Isosurfaces(volume, isovalue);
    else if(!checked_iso && checked_slice)
        surfaces = Slice(volume, 128, a, b, c, d);
    else{
        alert("isosurfaceかsliceの片方にだけチェックを入れてください");
        return
    }
    screen.scene.add(surfaces);
}