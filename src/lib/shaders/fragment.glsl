varying vec3 vColor;
varying float vAlpha;

void main() {
    // Circle shape
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter;
    strength = pow(strength, 2.0);

    // Glow effect
    vec3 color = vColor * strength;
    
    gl_FragColor = vec4(color, strength * vAlpha);
}
