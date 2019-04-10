var v0;
var v1;
var v2;

class Vec3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function init(){
    var x = [];
    var y = [];
    var z = [];

    x[0] = parseFloat($("#x0").val());
    y[0] = parseFloat($("#y0").val());
    z[0] = parseFloat($("#z0").val());

    x[1] = parseFloat($("#x1").val());
    y[1] = parseFloat(("#y1").val());
    z[1] = parseFloat($("#z1").val());

    x[2] = parseFloat($("#x2").val());
    y[2] = parseFloat($("#y2").val());
    z[2] = parseFloat($("#z2").val());

    for(var i=0; i<3; i++){
        if(x[i] == "" || y[i] == "" || z[i] == ""){
            alert("すべてのx, y, zを入力してから決定ボタンを押してください");
            return;
        }
    }
    v0 = new Vec3(x[0], y[0], z[0]);
    v1 = new Vec3(x[1], y[1], z[1]);
    v2 = new Vec3(x[2], y[2], z[2]);
}

function showTriangle(){
    if(v0 == null || v1 == null || v2 == null){
        alert("まずすべてのx, y, zを入力してから決定ボタンを押してください");
        return;
    }

    var v01 = new Vec3(v1.x-v0.x, v1.y-v0.y, v1.z-v0.z);
    var v02 = new Vec3(v2.x-v0.x, v2.y-v0.y, v2.z-v0.z);

    $(".view").html("面積は" + calcTriangle(v01, v02));
}

function calcTriangle(v01, v02){
    return Math.sqrt((Math.pow(v01.x, 2) + Math.pow(v01.y, 2) + Math.pow(v01.z, 2))
                        *(Math.pow(v02.x, 2) + Math.pow(v02.y, 2) + Math.pow(v02.z, 2)) 
                        - Math.pow((v01.x*v02.x + v01.y*v02.y + v01.z*v02.z), 2))/2;
}