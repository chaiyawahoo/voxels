#version 300 es
// in lowp vec4 f_color;
uniform sampler2D sampler;

in highp vec2 f_texCoord;

out highp vec4 fragColor;

void main() {
	// gl_FragColor = vColor;
	fragColor = texture(sampler, f_texCoord);
}