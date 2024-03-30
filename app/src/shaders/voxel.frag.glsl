#version 300 es
in lowp vec4 f_color;
in highp vec2 f_texCoord;
in highp vec3 f_lighting;

uniform sampler2D sampler;

out highp vec4 fragColor;

void main() {
	highp vec4 texelColor = texture(sampler, f_texCoord) * f_color;
	texelColor.rgb *= f_lighting;
	fragColor = texelColor;
}