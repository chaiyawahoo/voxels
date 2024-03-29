# version 300 es
in vec4 position;
// in vec4 color;
in vec2 texCoord;
in mat4 face;

uniform mat4 transformation;
uniform mat4 projection;

// out lowp vec4 f_color;
out highp vec2 f_texCoord;

void main() {
	gl_Position = projection * transformation * face * position;
	// f_color = color;
	f_texCoord = texCoord;
}