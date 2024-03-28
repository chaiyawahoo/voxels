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

	const shaderSources = await getShaderSources("voxel");

	const shaderProgram = initShaderProgram(gl, shaderSources.vertex, shaderSources.fragment);
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
			vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
			faceMatrix: gl.getAttribLocation(shaderProgram, "aFaceMatrix")
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			transformationMatrix: gl.getUniformLocation(shaderProgram, "uTransformationMatrix")
		}
	};
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

async function getShaderSources(shaderName) {
	const vertexShader = await loadFile(shaderName + ".vert.glsl");
	const fragmentShader = await loadFile(shaderName + ".frag.glsl");
	return {
		vertex: vertexShader,
		fragment: fragmentShader
	}
}

async function loadFile(fileName) {
	const response = await fetch("src/shaders/" + fileName);
	const data = await response.text();
	return data;
}