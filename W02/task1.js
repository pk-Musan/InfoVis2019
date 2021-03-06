var v1;

class Vec3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getMin(){
        var min = this.x;

        if(min > this.y){
            min = this.y;
        }
        if(min > this.z){
            min = this.z
        }
        return min;
    }

    getMid(){
        var mid = this.x;
        
        if(mid > this.y && mid > this.z){
            if(this.y >= this.z) mid = this.y;
            else mid = this.z;
        }
        else if(mid < this.y && mid < this.z){
            if(this.y <= this.z) mid = this.y;
            else mid = this.z;
        }
        return mid;
    }

    getMax(){
        var max = this.x;
        
        if(max < this.y){
            max = this.y;
        }
        if(max < this.z){
            max = this.z
        }
        return max;
    }
}

function init(){
    var x;
    var y;
    var z;

    x = parseFloat($("#x").val());
    y = parseFloat($("#y").val());
    z = parseFloat($("#z").val());

    if(x == "" || y == "" || z == ""){
        alert("x, y, zをすべて入力してから決定ボタンを押してください");
    }
    else{
        v1 = new Vec3(x, y, z);
    }
}

function showMin(){
    if(v1==null){
        alert("まずx, y, zをすべて入力してから決定ボタンを押してください");
        return;
    }
    $(".view").html("min = " + v1.getMin());
}

function showMid(){
    if(v1==null){
        alert("まずx, y, zをすべて入力してから決定ボタンを押してください");
        return;
    }
    $(".view").html("mid = " + v1.getMid());
}

function showMax(){
    if(v1==null){
        alert("まずx, y, zをすべて入力してから決定ボタンを押してください");
        return;
    }
    $(".view").html("max = " + v1.getMax());
}