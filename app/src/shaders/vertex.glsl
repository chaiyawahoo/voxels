attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute mat4 aFaceMatrix;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aFaceMatrix * aVertexPosition;
	vColor = aVertexColor;
}