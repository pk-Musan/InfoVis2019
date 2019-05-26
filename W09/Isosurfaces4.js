function Isosurfaces( volume, isovalue )
{
    var geometry = new THREE.Geometry();
    //var material = new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,
        vertexShader: document.getElementById('shader.vert').text,
        fragmentShader: document.getElementById('shader.frag').text,
    }); 

    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;

    var cmap = [];
    for(var i=0; i<256; i++){
        var S = i / 255.0 // [0, 1]
        
        var R = Math.max(Math.cos((S-1.0) * Math.PI), 0.0);
        var G = Math.max(Math.cos((S-0.5) * Math.PI), 0.0);
        var B = Math.max(Math.cos(S * Math.PI), 0.0);

        var color = new THREE.Color(R, G, B);
        cmap.push([S, '0x' + color.getHexString()]);
    }

    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
                var indices = cell_node_indices( x, y, z );
                var index = table_index( indices, 1/volume.resolution.x, -1/volume.resolution.y, 2*1/volume.resolution.z, -1 );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+1];
                    var eid2 = lut.edgeID[index][j+2];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );

                    val = [];
                    val[0] = getVolumeValues(v0);
                    val[1] = getVolumeValues(v1);
                    val[2] = getVolumeValues(v2);
                    val[3] = getVolumeValues(v3);
                    val[4] = getVolumeValues(v4);
                    val[5] = getVolumeValues(v5);

                    var v01 = interpolated_vertex( v0, v1, 0, 0 );
                    var v23 = interpolated_vertex( v2, v3, 0, 0 );
                    var v45 = interpolated_vertex( v4, v5, 0, 0 );

                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    //vol = volume.values[cell_index];
                    //console.log("values: "+vol[0])

                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;

                    var validValueSum = 0;
                    var count = 0;
                    var averageValue = 0;

                    val.forEach(function(elm){
                        if(elm > isovalue){
                            validValueSum += elm;
                            count++;
                        }
                    })

                    if(count > 0){
                        averageValue = parseInt(validValueSum/count);
                    }

                    var face = new THREE.Face3(id0, id1, id2);
                    face.color.set(new THREE.Color().setHex(cmap[averageValue][1])); 
                    geometry.faces.push(face);
                }
                
            }
            //cell_index++;
        }

        if(z == volume.resolution.z - 2){
            //console.log("z+1");
            for ( var y2 = 0; y2 < volume.resolution.y - 1; y2++ )
            {
                for ( var x2 = 0; x2 < volume.resolution.x - 1; x2++ )
                {
                    var indices = cell_node_indices( x2, y2, z+1 );
                    var index = table_index( indices, 1/volume.resolution.x, -1/volume.resolution.y, 2*1/volume.resolution.z, -1 );
                    if ( index == 0 ) { continue; }
                    if ( index == 255 ) { continue; }

                    for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                    {
                        var eid0 = lut.edgeID[index][j];
                        var eid1 = lut.edgeID[index][j+1];
                        var eid2 = lut.edgeID[index][j+2];

                        var vid0 = lut.vertexID[eid0][0];
                        var vid1 = lut.vertexID[eid0][1];
                        var vid2 = lut.vertexID[eid1][0];
                        var vid3 = lut.vertexID[eid1][1];
                        var vid4 = lut.vertexID[eid2][0];
                        var vid5 = lut.vertexID[eid2][1];

                        var v0 = new THREE.Vector3( x2 + vid0[0], y2 + vid0[1], z + vid0[2] );
                        var v1 = new THREE.Vector3( x2 + vid1[0], y2 + vid1[1], z + vid1[2] );
                        var v2 = new THREE.Vector3( x2 + vid2[0], y2 + vid2[1], z + vid2[2] );
                        var v3 = new THREE.Vector3( x2 + vid3[0], y2 + vid3[1], z + vid3[2] );
                        var v4 = new THREE.Vector3( x2 + vid4[0], y2 + vid4[1], z + vid4[2] );
                        var v5 = new THREE.Vector3( x2 + vid5[0], y2 + vid5[1], z + vid5[2] );

                        val = [];
                        val[0] = getVolumeValues(v0);
                        val[1] = getVolumeValues(v1);
                        val[2] = getVolumeValues(v2);
                        val[3] = getVolumeValues(v3);
                        val[4] = getVolumeValues(v4);
                        val[5] = getVolumeValues(v5);

                        var v01 = interpolated_vertex( v0, v1, 0, 0 );
                        var v23 = interpolated_vertex( v2, v3, 0, 0 );
                        var v45 = interpolated_vertex( v4, v5, 0, 0 );

                        geometry.vertices.push( v01 );
                        geometry.vertices.push( v23 );
                        geometry.vertices.push( v45 );

                        //vol = volume.values[cell_index];
                        //console.log("values: "+vol[0])

                        var id0 = counter++;
                        var id1 = counter++;
                        var id2 = counter++;

                        var validValueSum = 0;
                        var count = 0;
                        var averageValue = 0;

                        val.forEach(function(elm){
                            if(elm > isovalue){
                                validValueSum += elm;
                                count++;
                            }
                        })

                        if(count > 0){
                            averageValue = parseInt(validValueSum/count);
                        }

                        var face = new THREE.Face3(id0, id1, id2);
                        face.color.set(new THREE.Color().setHex(cmap[averageValue][1])); 
                        geometry.faces.push(face);
                    }
                }
            }
        }

        //cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();

    return new THREE.Mesh( geometry, material );

    function getVolumeValues(v){
        return volume.values[parseInt(v.x + v.y*volume.resolution.x + v.z*volume.resolution.x*volume.resolution.y)][0];
    }

    function cell_node_indices( x, y, z )
    {
        var id0 = new THREE.Vector3(x, y, z);
        var id1 = new THREE.Vector3(x+1, y, z);
        var id2 = new THREE.Vector3(x+1, y+1, z);
        var id3 = new THREE.Vector3(x, y+1, z);
        var id4 = new THREE.Vector3(x, y, z+1);
        var id5 = new THREE.Vector3(x+1, y, z+1);
        var id6 = new THREE.Vector3(x+1, y+1, z+1);
        var id7 = new THREE.Vector3(x, y+1, z+1);

        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices, i_x, i_y, i_z, t )
    {
        var s0 = i_x*indices[0].x + i_y*indices[0].y + i_z*indices[0].z + t;
        var s1 = i_x*indices[1].x + i_y*indices[1].y + i_z*indices[1].z + t;
        var s2 = i_x*indices[2].x + i_y*indices[2].y + i_z*indices[2].z + t;
        var s3 = i_x*indices[3].x + i_y*indices[3].y + i_z*indices[3].z + t;
        var s4 = i_x*indices[4].x + i_y*indices[4].y + i_z*indices[4].z + t;
        var s5 = i_x*indices[5].x + i_y*indices[5].y + i_z*indices[5].z + t;
        var s6 = i_x*indices[6].x + i_y*indices[6].y + i_z*indices[6].z + t;
        var s7 = i_x*indices[7].x + i_y*indices[7].y + i_z*indices[7].z + t;

        var index = 0;
        if ( s0 > 0 ) { index |=   1; }
        if ( s1 > 0 ) { index |=   2; }
        if ( s2 > 0 ) { index |=   4; }
        if ( s3 > 0 ) { index |=   8; }
        if ( s4 > 0 ) { index |=  16; }
        if ( s5 > 0 ) { index |=  32; }
        if ( s6 > 0 ) { index |=  64; }
        if ( s7 > 0 ) { index |= 128; }

        return index;
    }

    function interpolated_vertex( v0, v1, val0, val1)
    {
        return new THREE.Vector3().addVectors( v0.multiplyScalar( val0+1 ), v1.multiplyScalar( val1+1 )).divideScalar( val0+val1+2 );
    }
}