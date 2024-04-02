#version 300 es
//in lowp vec4 f_color;
in highp vec2 f_texCoord;
in highp vec3 f_lighting;

uniform sampler2D sampler;

out highp vec4 fragColor;

void main() {
	highp vec4 texelColor = texture(sampler, f_texCoord);
	//texelColor *= f_color;
	fragColor = vec4(texelColor.rgb * f_lighting, texelColor.a);
}