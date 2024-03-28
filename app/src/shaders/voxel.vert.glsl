attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute mat4 aFaceMatrix;

uniform mat4 uTransformationMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = uProjectionMatrix * uTransformationMatrix * aFaceMatrix * aVertexPosition;
	vColor = aVertexColor;
}