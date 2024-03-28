function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const transformationMatrix = mat4.create();

    mat4.translate(transformationMatrix, transformationMatrix, [0.0, 0.0, -5.0]);
    mat4.rotate(transformationMatrix, transformationMatrix, deltaTime, [0.1, 1.0, 0.8]);

    setPositionAttribute(gl, programInfo, buffers);
    setColorAttribute(gl, programInfo, buffers);
    setFaceAttribute(gl, programInfo, buffers);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.transformationMatrix,
        false,
        transformationMatrix
    );

    {
        const vertexCount = 4;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElementsInstanced(gl.TRIANGLE_FAN, vertexCount, type, offset, 6);
    }
}

function setPositionAttribute(gl, programInfo, buffers) {
    const numComponents = 3;
    const type = gl.FLOAT
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.vertexAttribDivisor(programInfo.attribLocations.vertexPosition, 0) // update per vertex
}

function setColorAttribute(gl, programInfo, buffers) {
    const numComponents = 4;
    const type = gl.FLOAT
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    gl.vertexAttribDivisor(programInfo.attribLocations.vertexColor, 1); // update per instance
}

function setFaceAttribute(gl, programInfo, buffers) {
    const numComponents = 4;
    const type = gl.FLOAT
    const normalize = false;
    const stride = 4 * 16;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.face);
    for (let i = 0; i < 4; i++) {
        const location = programInfo.attribLocations.faceMatrix + i;
        const offset = i * 16;
        gl.vertexAttribPointer(
            location,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(location);
        gl.vertexAttribDivisor(location, 1);
    }
}

export { drawScene };