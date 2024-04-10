# version 300 es
in vec4 position;
//in vec4 color;

uniform mat4 transformation;
uniform mat4 projection;

out lowp vec4 f_color;
out highp vec2 f_texCoord;
out highp vec3 f_lighting;

mat4 fullTransformation;
mat4 normalMatrix;
mat4 getFaceMatrix();
vec2 getTexCoord();

void main() {
	fullTransformation = transformation * getFaceMatrix();
	normalMatrix = transpose(inverse(fullTransformation));
	gl_Position = projection * fullTransformation * position;
	//f_color = color;
	f_texCoord = getTexCoord();

	highp vec3 ambientLight = vec3(0.3);
	highp vec3 directionalColor = vec3(1);
	highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

	highp vec4 transformedNormal = normalMatrix * vec4(0, 0, 1, 1);

	highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
	f_lighting = ambientLight + (directionalColor * directional);
}

mat4 getFaceMatrix2() {
	mat4 mat;
	mat[3][3] = 1.0;
	int axis = 1 - ((gl_InstanceID % 6) / 4); // avoids if statements: [0-3] = 1; [4-5] = 0
	mat[axis][axis] = 1.0;
	switch(gl_InstanceID % 6) {
		case 0: mat = mat4(1); mat[3][2] = 0.5; break;
		case 1: mat[1-axis][2] = -1.0; mat[2][1-axis] = 1.0; mat[3][1-axis] = 0.5; break;
		case 2: mat[0][0] = -1.0; mat[2][2] = -1.0; mat[3][2] = -0.5; break;
		case 3: mat[1-axis][2] = 1.0; mat[2][1-axis] = -1.0; mat[3][1-axis] = -0.5; break;
		case 4: mat[1-axis][2] = -1.0; mat[2][1-axis] = 1.0; mat[3][1-axis] = 0.5; break;
		case 5: mat[1-axis][2] = 1.0; mat[2][1-axis] = -1.0; mat[3][1-axis] = -0.5; break;
	}
	return mat;
}

mat4 getFaceMatrix() {
	mat4 mat = mat4(1);
	int axis = 1 - ((gl_InstanceID % 6) / 4); // avoids if statements: [0-3] = 1; [4-5] = 0
	int frontback = axis * (1 - gl_InstanceID % 2); // 0, 2 = 1; 1, 3, 4, 5 = 0;
	int notfrontback = 1 - frontback; // 0, 2 = 0; 1, 3, 4, 5 = 1;
	int m0022 = frontback * (1 - gl_InstanceID % 6); // 0 = 1; 2 = -1; else 0
	int onefour2 = notfrontback * (((gl_InstanceID * 2) % 6) % 4); // 0,2,3,5 = 0; 1,4 = 2;
	int threefive2 = notfrontback * (2 - onefour2); // 0,1,2,4 = 0; 3,5 = 2;
	
	mat[0][0] = float(m0022);
	mat[1][1] = float(frontback);
	mat[2][2] = float(m0022);
	mat[3][2] = float(m0022) * 0.5;
	mat[1-axis][2] = float(notfrontback - onefour2);
	mat[2][1-axis] = float(notfrontback - threefive2);
	mat[3][1-axis] = mat[2][1-axis] * 0.5;
	mat[axis][axis] = 1.0;

	return mat;
}

vec2 getTexCoord() {
	int x, y;
	x = (gl_VertexID + 3) % 4 / 2; // 0 = 1; 1 = 0; 2 = 0; 3 = 1;
	y = gl_VertexID % 4 / 2; // [0-1] = 0; [2-3] = 1;
	return vec2(x, y);
}