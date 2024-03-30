# version 300 es
in vec4 position;
in vec4 color;
in vec2 texCoord;

uniform mat4 transformation;
uniform mat4 projection;

out lowp vec4 f_color;
out highp vec2 f_texCoord;
out highp vec3 f_lighting;

mat4 fullTransformation;
mat4 normalMatrix;
mat4 getFaceMatrix();

void main() {
	fullTransformation = transformation * getFaceMatrix();
	normalMatrix = transpose(inverse(fullTransformation));
	gl_Position = projection * fullTransformation * position;
	f_color = color;
	f_texCoord = texCoord;

	highp vec3 ambientLight = vec3(0.3);
	highp vec3 directionalColor = vec3(1);
	highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

	highp vec4 transformedNormal = normalMatrix * vec4(0, 0, 1, 1);

	highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
	f_lighting = ambientLight + (directionalColor * directional);
}

mat4 getFaceMatrix() {
	mat4 mat;
	mat[3][3] = 1.0;
	if (gl_InstanceID % 6 <= 3) {
		mat[1][1] = 1.0;
	} else {
		mat[0][0] = 1.0;
	}
	switch(gl_InstanceID % 6) {
		case 0: mat = mat4(1); mat[3][2] = 0.5; break;
		case 1: mat[0][2] = -1.0; mat[2][0] = 1.0; mat[3][0] = 0.5; break;
		case 2: mat[0][0] = -1.0; mat[2][2] = -1.0; mat[3][2] = -0.5; break;
		case 3: mat[0][2] = 1.0; mat[2][0] = -1.0; mat[3][0] = -0.5; break;
		case 4: mat[1][2] = -1.0; mat[2][1] = 1.0; mat[3][1] = 0.5; break;
		case 5: mat[1][2] = 1.0; mat[2][1] = -1.0; mat[3][1] = -0.5; break;
	}
	return mat;
}