import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

let deltaTime = 0;

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
			vertexPosition: gl.getAttribLocation(shaderProgram, "position"),
			//vertexColor: gl.getAttribLocation(shaderProgram, "color"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "projection"),
			transformationMatrix: gl.getUniformLocation(shaderProgram, "transformation"),
			sampler: gl.getUniformLocation(shaderProgram, "sampler")
		}
	};
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE)
    gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const buffers = initBuffers(gl);

	const texture = loadTexture(gl, "dirt.png");
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	let then = 0;

	function render(now) {
		now *= 0.001; // seconds
		deltaTime = now - then;
		then = now;

		drawScene(gl, programInfo, buffers, texture, now);

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
	const vertexShader = await getShaderSource(shaderName + ".vert.glsl");
	const fragmentShader = await getShaderSource(shaderName + ".frag.glsl");
	return {
		vertex: vertexShader,
		fragment: fragmentShader
	}
}

async function getShaderSource(fileName) {
	const response = await fetch("src/shaders/" + fileName);
	const data = await response.text();
	console.log(data);
	return data;
}

function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]); // blue
	gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		width,
		height,
		border,
		srcFormat,
		srcType,
		pixel
	);

	const image = new Image();
	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			srcFormat,
			srcType,
			image
		);

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // disable bi-linear filtering: sharpen pixels
	};
	loadImage(image, url);

	return texture;
}

async function loadImage(image, url) {
	image.src = "images/" + url;
}

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}