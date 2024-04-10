function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);
    //const colorBuffer = initColorBuffer(gl);
    //const texCoordBuffer = initTexCoordBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);

    return {
        position: positionBuffer,
        //color: colorBuffer,
        index: indexBuffer
    };
}

function initPositionBuffer(gl) {
    const positions = [
        -0.5, -0.5, 0, // bl
        +0.5, -0.5, 0, // br
        +0.5, +0.5, 0, // tr
        -0.5, +0.5, 0  // tl
    ];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

//function initColorBuffer(gl) {

//    const colors = [
//        // 1.0, 0.0, 0.0, 1.0, // front: red
//        // 0.0, 1.0, 0.0, 1.0, // right: green
//        // 0.0, 0.0, 1.0, 1.0, // back: blue
//        // 1.0, 1.0, 0.0, 1.0, // left: yellow
//        // 1.0, 0.0, 1.0, 1.0, // top: magenta
//        // 0.0, 1.0, 1.0, 1.0, // bottom: cyan
//        1.0, 1.0, 1.0, 1.0 // white
//    ];

//    const colorBuffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//    return colorBuffer;
//}

function initIndexBuffer(gl) {
    const indices = [0, 1, 2, 3];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
}

export { initBuffers };