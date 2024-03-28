function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);
    const colorBuffer = initColorBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);
    const faceBuffer = initFaceBuffer(gl);

    return {
        position: positionBuffer,
        color: colorBuffer,
        index: indexBuffer,
        face: faceBuffer
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

    return positionBuffer;
}

function initColorBuffer(gl) {

    const colors = [
        1.0, 0.0, 0.0, 1.0, // red
        0.0, 1.0, 0.0, 1.0, // green
        0.0, 0.0, 1.0, 1.0, // blue
        1.0, 1.0, 0.0, 1.0, // yellow
        1.0, 0.0, 1.0, 1.0, // magenta
        0.0, 1.0, 1.0, 1.0, // cyan
    ];

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

function initIndexBuffer(gl) {
    const indices = [0, 1, 2, 3];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW);

    return indexBuffer;
}

function initFaceBuffer(gl) {
    let faceMatrices = []
    for (let i = 0; i < 6; i++) {
        faceMatrices = faceMatrices.concat(...getFaceTransformation(i));
    }
    const faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceMatrices), gl.STATIC_DRAW);

    return faceBuffer;
}

function getFaceTransformation(face) {
    const mat = mat4.create();
    switch(face % 6) {
        case 0:
            mat4.translate(mat, mat, [0, 0, 0.5]);
            break;
        case 1: 
            mat4.translate(mat, mat, [0, 0.5, 0]);
            mat4.rotate(mat, mat, Math.PI * 0.5, [1, 0, 0]);
            break;
        case 2: 
            mat4.translate(mat, mat, [0, 0, -0.5]);
            mat4.rotate(mat, mat, Math.PI, [1, 0, 0]); 
            break;
        case 3: 
            mat4.translate(mat, mat, [0, -0.5, 0]);
            mat4.rotate(mat, mat, Math.PI * 1.5, [1, 0, 0]);
            break;
        case 4: 
            mat4.translate(mat, mat, [0.5, 0, 0]);
            mat4.rotate(mat, mat, Math.PI * 0.5, [0, 1, 0]); 
            break;
        case 5: 
            mat4.translate(mat, mat, [-0.5, 0, 0]);
            mat4.rotate(mat, mat, Math.PI * 1.5, [0, 1, 0]); 
            break;
    }
    return mat.map((n) => Math.round(n*2)/2); // can be rounded, as it will always be -1, -0.5, 0, +0.5, or +1
}

export { initBuffers };