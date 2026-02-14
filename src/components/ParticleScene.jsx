'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { useParticleMorph } from '@/hooks/useParticleMorph';
import gsap from 'gsap';

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uExpansion;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uSize;

attribute vec3 positionStart;
attribute vec3 positionTarget;
attribute float aSize;

varying vec3 vColor;
varying float vAlpha;
varying float vIsCore;

void main() {
    vec3 mixedPosition = mix(positionStart, positionTarget, uProgress);
    float distFromCenter = length(mixedPosition);
    vIsCore = step(distFromCenter, 0.7);

    vec3 dir = normalize(mixedPosition);
    mixedPosition += dir * uExpansion * (1.0 - vIsCore) * 2.0;

    float shimmer = sin(uTime * 1.5 + aSize * 10.0) * 0.05;
    mixedPosition += vec3(shimmer, -shimmer, shimmer * 0.5);

    float noiseFreq = 0.4;
    float noiseAmp = 0.12;
    mixedPosition += vec3(
        sin(uTime * 0.2 + mixedPosition.y * noiseFreq) * noiseAmp,
        cos(uTime * 0.25 + mixedPosition.z * noiseFreq) * noiseAmp,
        sin(uTime * 0.3 + mixedPosition.x * noiseFreq) * noiseAmp
    );

    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    float mouseDist = distance(modelPosition.xy, uMouse);
    float radius = 1.8;
    if(mouseDist < radius) {
        vec3 repulsionDir = normalize(modelPosition.xyz - vec3(uMouse, 0.0));
        float force = pow((radius - mouseDist) / radius, 4.0);
        modelPosition.xyz += repulsionDir * force * 1.8;
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float sparkle = 0.8 + sin(uTime * 4.0 + aSize * 20.0) * 0.5;
    float corePulse = 1.0 + vIsCore * sin(uTime * 5.0) * 0.2;
    gl_PointSize = uSize * aSize * uPixelRatio * sparkle * corePulse;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vec3 purple = vec3(0.66, 0.33, 0.97);
    vec3 cyan = vec3(0.13, 0.83, 0.93);
    vColor = mix(purple, cyan, (mixedPosition.y * 0.5) + 0.5); // Wider gradient interact
    vColor += vIsCore * 0.4; // Brighter core
    vAlpha = smoothstep(12.0, 0.0, -viewPosition.z);
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;
varying float vIsCore;

void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    float glow = 1.0 - (dist * 2.0);
    glow = pow(glow, 3.0); // Restored "Neon" soft falloff

    float flicker = 1.0;
    if (vIsCore < 0.5) {
        flicker = 0.85 + sin(vAlpha * 100.0) * 0.15; // More prominent twinkle
    }

    gl_FragColor = vec4(vColor, vAlpha * glow * 1.5 * flicker);
}
`;

const PARTICLE_COUNT = 25000;

const HeroCrystals = ({ activeService }) => {
    const meshRef = useRef();
    const count = 15;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const positions = useMemo(() => {
        const pos = [];
        for (let i = 0; i < count; i++) {
            const orbit = i % 5;
            const t = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const a = 2.5 + (Math.random() - 0.5) * 0.4;
            const b = 1.2 + (Math.random() - 0.5) * 0.2;
            pos.push({ orbit, t, a, b, phase: Math.random() * Math.PI * 2, speed: 0.15 + Math.random() * 0.1 });
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (activeService !== 'hero') {
            if (meshRef.current) meshRef.current.visible = false;
            return;
        }
        if (meshRef.current) meshRef.current.visible = true;

        const time = state.clock.getElapsedTime();
        positions.forEach((p, i) => {
            const t = p.t + time * p.speed;
            let x = Math.cos(t) * p.a;
            let y = Math.sin(t) * p.b;
            let z = 0;

            if (p.orbit === 1) { const tmp = x; x = z; z = y; y = tmp; }
            else if (p.orbit === 2) { const tmp = y; y = z; z = tmp; }
            else if (p.orbit === 3) {
                const angle = Math.PI / 4;
                const x1 = x * Math.cos(angle) - z * Math.sin(angle);
                const z1 = x * Math.sin(angle) + z * Math.cos(angle);
                x = x1; z = z1;
            }

            dummy.position.set(x, y, z);
            dummy.rotation.set(time * 0.4 + p.phase, time * 0.25, time * 0.15);
            dummy.scale.setScalar(0.14 + Math.sin(time * 1.5 + p.phase) * 0.04);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
                transparent
                opacity={0.3}
                transmission={0.95}
                thickness={0.5}
                roughness={0.05}
                metalness={0.9}
                emissive="#22D3EE"
                emissiveIntensity={1.5}
                color="#A855F7"
            />
        </instancedMesh>
    );
};

const CircuitBackground = () => {
    const meshRef = useRef();
    const count = 2000;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const types = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const isVertical = Math.random() > 0.5;
            types[i] = isVertical ? 1.0 : 0.0;
            if (!isVertical) {
                const row = Math.floor(Math.random() * 40) - 20;
                const col = Math.random() * 20 - 10;
                pos[i * 3 + 0] = col;
                pos[i * 3 + 1] = row * 0.3;
                pos[i * 3 + 2] = -6;
            } else {
                const col = Math.floor(Math.random() * 40) - 20;
                const row = Math.random() * 20 - 10;
                pos[i * 3 + 0] = col * 0.4;
                pos[i * 3 + 1] = row;
                pos[i * 3 + 2] = -6;
            }
        }
        return { pos, types };
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const shader = useMemo(() => ({
        uniforms: { uTime: { value: 0 } },
        vertex: `
            uniform float uTime;
            attribute float aType;
            varying float vGlow;
            void main() {
                vec3 pos = position;
                float pulse = 0.0;
                if (aType > 0.5) {
                    pulse = smoothstep(0.15, 0.0, abs(fract(pos.y * 0.2 - uTime * 0.4) - 0.5));
                } else {
                    pulse = smoothstep(0.15, 0.0, abs(fract(pos.x * 0.2 - uTime * 0.4) - 0.5));
                }
                vGlow = pulse;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 1.5;
            }
        `,
        fragment: `
            varying float vGlow;
            void main() {
                vec3 circuitColor = mix(vec3(0.1, 0.1, 0.3), vec3(0.13, 0.83, 0.93), vGlow);
                gl_FragColor = vec4(circuitColor, (0.05 + vGlow * 0.3));
            }
        `
    }), []);

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions.pos} itemSize={3} />
                <bufferAttribute attach="attributes-aType" count={count} array={positions.types} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexShader={shader.vertex}
                fragmentShader={shader.fragment}
                uniforms={shader.uniforms}
            />
        </points>
    );
};

const Particles = ({ activeService, particleShift }) => {
    const meshRef = useRef();
    const { viewport } = useThree();
    const { positions, sizes, getShapePositions } = useParticleMorph(PARTICLE_COUNT);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uExpansion: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 12 } // Restored size for neon impact (was 8)
    }), []);

    useEffect(() => {
        if (!meshRef.current) return;
        const geometry = meshRef.current.geometry;
        const targetPos = getShapePositions(activeService);

        let startAttr = geometry.getAttribute('positionStart');
        let targetAttr = geometry.getAttribute('positionTarget');

        if (!startAttr || startAttr.array.length !== PARTICLE_COUNT * 3) {
            geometry.setAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
            startAttr = geometry.getAttribute('positionStart');
        }
        if (!targetAttr || targetAttr.array.length !== PARTICLE_COUNT * 3) {
            geometry.setAttribute('positionTarget', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
            targetAttr = geometry.getAttribute('positionTarget');
            targetAttr.set(targetPos);
            targetAttr.needsUpdate = true;
        }

        if (startAttr.array.length === targetAttr.array.length) {
            startAttr.array.set(targetAttr.array);
            startAttr.needsUpdate = true;
        }
        if (targetAttr.array.length === targetPos.length) {
            targetAttr.set(targetPos);
            targetAttr.needsUpdate = true;
        }

        uniforms.uProgress.value = 0;
        gsap.to(uniforms.uProgress, {
            value: 1,
            duration: 1.2,
            ease: 'power2.inOut',
            overwrite: true
        });
    }, [activeService, getShapePositions, uniforms]);

    useFrame((state) => {
        const { clock, mouse } = state;
        uniforms.uTime.value = clock.getElapsedTime();

        const scroll = window.scrollY / window.innerHeight;
        if (activeService === 'hero') {
            uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, Math.min(scroll * 1.5, 1.0), 0.1);
        } else {
            uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, 0, 0.1);
        }

        if (meshRef.current) {
            const targetX = -viewport.width * 0.3 * particleShift;
            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
            const targetY = -(viewport.height * 0.125) * particleShift;
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
        }

        uniforms.uMouse.value.x = (mouse.x * viewport.width) / 2;
        uniforms.uMouse.value.y = (mouse.y * viewport.height) / 2;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                transparent={true}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
};

const BackgroundGalaxy = () => {
    const meshRef = useRef();
    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 5 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pos[i * 3 + 0] = r * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.0005;
            meshRef.current.rotation.z += 0.0002;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#444466" transparent opacity={0.3} sizeAttenuation={true} />
        </points>
    );
};

const CameraRig = () => {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();

    useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 0.4, mouse.y * 0.4, 4), 0.05); // Slightly less sensitive
        camera.lookAt(0, 0, 0);
    });
    return null;
};

const ParticleScene = ({ activeService, particleShift }) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 4], fov: 75 }} gl={{ antialias: false, alpha: true }} dpr={[1, 2]}>
                <CameraRig />
                <BackgroundGalaxy />
                <CircuitBackground />
                <HeroCrystals activeService={activeService} />
                <Particles key={PARTICLE_COUNT} activeService={activeService} particleShift={particleShift} />

                <EffectComposer>
                    <Bloom
                        intensity={0.9} // Restored vibrancy (was 0.6)
                        luminanceThreshold={0.25}
                        luminanceSmoothing={0.85}
                        mipmapBlur
                    />
                    <ChromaticAberration offset={[0.0002, 0.0002]} /> // Very subtle
                    <Vignette eskil={false} offset={0.1} darkness={0.9} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default ParticleScene;
