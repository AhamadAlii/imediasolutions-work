varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;

uniform float uTime;
uniform float uProgress;
uniform float uExpansion;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 positionTarget;
attribute float aSize;

void main() {
    vUv = uv;
    
    // Interpolate between current and target position
    vec3 mixedPosition = mix(position, positionTarget, uProgress);
    
    // Abstract floating blob effect using noise (simplified with sin/cos)
    mixedPosition.x += sin(mixedPosition.y * 2.0 + uTime) * 0.1 * (1.0 - uProgress);
    mixedPosition.y += cos(mixedPosition.x * 2.0 + uTime) * 0.1 * (1.0 - uProgress);
    mixedPosition.z += sin(mixedPosition.x * 2.0 + uTime) * 0.1 * (1.0 - uProgress);

    // Mouse interaction
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    
    // Very simple repulsion
    float dist = distance(modelPosition.xy, uMouse);
    if(dist < 0.5) {
        float force = (0.5 - dist) * 0.2;
        modelPosition.xy += normalize(modelPosition.xy - uMouse) * force;
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    // Size calculation — shrink particles as they scatter
    float expansionScale = 1.0 - uExpansion * 0.85;
    gl_PointSize = uSize * aSize * uPixelRatio * expansionScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = mix(vec3(0.5, 0.2, 1.0), vec3(0.2, 0.5, 1.0), mixedPosition.y + 0.5);
    vAlpha = (1.0 / - viewPosition.z) * 2.0 * (1.0 - uExpansion * 0.9);
}
