import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

let deltaTime = 0;
let rotation = 0.0;


main();

async function main() {
	const canvas = document.querySelector("#glcanvas");
	const gl = canvas.getContext("webgl2");
	
	if (gl === null) {
		alert("Unable to initialize WebGL 2.0.");
		return;
	}
	// const ext = gl.getExtension("ANGLE_instanced_arrays");
	// if (ext === null) {
	// 	alert("WebGL Instanced Arrays not supported.");
	// }

	const vertexShaderSource = await loadShaderFile("vertex.glsl");
	const fragmentShaderSource = await loadShaderFile("fragment.glsl");

	const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
			faceMatrix: gl.getAttribLocation(shaderProgram, "aFaceMatrix")
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
		}
	};
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	const buffers = initBuffers(gl);

	let then = 0;

	function render(now) {
		now *= 0.001; // seconds
		deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, buffers, rotation);
		rotation += deltaTime;

		requestAnimationFrame(render)
	}
	requestAnimationFrame(render);
}

function initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(
			`Unable to initialize the shader program: ${gl.getProgramInfoLog(
			shaderProgram,
			)}`
		);
		return null;
	}
	
	return shaderProgram;
}

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
		);
		return null;
	}
	
	return shader;
}

async function loadShaderFile(fileName) {
	const response = await fetch("http://localhost:8000/src/shaders/" + fileName);
	const data = await response.text();
	return data;
}