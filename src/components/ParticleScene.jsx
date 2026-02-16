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
uniform float uHueShift;

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
    float radius = 1.25;
    if(mouseDist < radius) {
        vec3 repulsionDir = normalize(modelPosition.xyz - vec3(uMouse, 0.0));
        float force = pow((radius - mouseDist) / radius, 2.2);
        modelPosition.xyz += repulsionDir * force * 0.48;
    }

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    float sparkle = 0.92 + sin(uTime * 3.0 + aSize * 16.0) * 0.14;
    float corePulse = 1.0 + vIsCore * sin(uTime * 3.5) * 0.08;
    gl_PointSize = uSize * aSize * uPixelRatio * sparkle * corePulse;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vec3 darkBlue = vec3(0.18, 0.36, 0.78);
    vec3 deepBlue = vec3(0.12, 0.24, 0.58);
    float tint = 0.5 + 0.5 * sin((mixedPosition.y * 0.7) + uTime * 0.25);
    vColor = mix(deepBlue, darkBlue, tint);
    vColor = min(vColor * 1.55, vec3(1.0));
    vColor += vIsCore * 0.18;
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
    if (dist > 0.88) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float innerGlow = pow(core, 2.4);
    float halo = smoothstep(0.75, 0.2, dist);
    float colorShadow = pow(halo, 2.0);
    float outerShadow = smoothstep(0.88, 0.55, dist);

    float flicker = 1.0;
    if (vIsCore < 0.5) {
        flicker = 0.85 + sin(vAlpha * 100.0) * 0.15; // More prominent twinkle
    }

    vec3 finalColor = vColor * (innerGlow * 1.3 + colorShadow * 0.9 + outerShadow * 0.42);
    float finalAlpha = vAlpha * (innerGlow * 2.1 + colorShadow * 1.2 + outerShadow * 0.7) * flicker;
    gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

const HeroCrystals = ({ activeService, count = 12 }) => {
    const meshRef = useRef();
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
    }, [count]);

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
                opacity={0.28}
                transmission={0.95}
                thickness={0.5}
                roughness={0.05}
                metalness={0.9}
                emissive="#2A5AC3"
                emissiveIntensity={1.05}
                color="#3A74DD"
            />
        </instancedMesh>
    );
};

const CircuitBackground = ({ count = 1200 }) => {
    const meshRef = useRef();

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
    }, [count]);

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
                vec3 circuitColor = mix(vec3(0.0, 0.0, 0.0), vec3(0.10, 0.23, 0.56), vGlow);
                gl_FragColor = vec4(circuitColor, (0.02 + vGlow * 0.24));
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

const Particles = ({ activeService, particleShiftRef, particleCount, perfTier, isMobile }) => {
    const meshRef = useRef();
    const currentShapeRef = useRef(null);
    const morphTweenRef = useRef(null);
    const pointerRef = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();
    const { positions, sizes, getShapePositions } = useParticleMorph(particleCount);
    const scrollProgressRef = useRef(0);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uExpansion: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, perfTier === 'high' ? 1.25 : 1) },
        uSize: { value: perfTier === 'high' ? 6.6 : 5.8 },
        uHueShift: { value: 0 }
    }), [perfTier]);

    useEffect(() => {
        const updateScroll = () => {
            scrollProgressRef.current = window.scrollY / window.innerHeight;
        };

        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    useEffect(() => {
        const updatePointer = (event) => {
            pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
        };

        window.addEventListener('pointermove', updatePointer, { passive: true });
        return () => window.removeEventListener('pointermove', updatePointer);
    }, []);

    useEffect(() => {
        return () => {
            if (morphTweenRef.current) morphTweenRef.current.kill();
        };
    }, []);

    useEffect(() => {
        if (!meshRef.current) return;
        const geometry = meshRef.current.geometry;
        const targetPos = getShapePositions(activeService);
        const attrLength = particleCount * 3;

        let startAttr = geometry.getAttribute('positionStart');
        let targetAttr = geometry.getAttribute('positionTarget');

        if (!startAttr || startAttr.array.length !== attrLength) {
            geometry.setAttribute('positionStart', new THREE.BufferAttribute(new Float32Array(attrLength), 3));
            startAttr = geometry.getAttribute('positionStart');
        }
        if (!targetAttr || targetAttr.array.length !== attrLength) {
            geometry.setAttribute('positionTarget', new THREE.BufferAttribute(new Float32Array(attrLength), 3));
            targetAttr = geometry.getAttribute('positionTarget');
        }

        // Capture the exact currently visible shape before starting a new morph.
        let fromShape = currentShapeRef.current;
        const progress = uniforms.uProgress.value;
        if (progress > 0 && progress < 1 && targetAttr.array.length === startAttr.array.length) {
            fromShape = new Float32Array(attrLength);
            for (let i = 0; i < attrLength; i++) {
                startAttr.array[i] = startAttr.array[i] * (1 - progress) + targetAttr.array[i] * progress;
                fromShape[i] = startAttr.array[i];
            }
        }

        if (!fromShape || fromShape.length !== attrLength) {
            fromShape = positions.slice(0);
        }

        startAttr.array.set(fromShape);
        startAttr.needsUpdate = true;

        targetAttr.array.set(targetPos);
        targetAttr.needsUpdate = true;
        currentShapeRef.current = fromShape;

        if (morphTweenRef.current) morphTweenRef.current.kill();
        uniforms.uProgress.value = 0;
        morphTweenRef.current = gsap.to(uniforms.uProgress, {
            value: 1,
            duration: 1.15,
            ease: 'power2.inOut',
            overwrite: true,
            onComplete: () => {
                currentShapeRef.current = targetPos.slice(0);
            }
        });
    }, [activeService, getShapePositions, particleCount, positions, uniforms]);

    useFrame((state) => {
        const { clock } = state;
        uniforms.uTime.value = clock.getElapsedTime();
        const hueMap = {
            hero: 0.02,
            video: 0.12,
            ai: 0.22,
            influencer: 0.34,
            event: 0.45,
            web: 0.58,
            social: 0.7,
            app: 0.84
        };
        const targetHue = hueMap[activeService] ?? 0;
        uniforms.uHueShift.value = THREE.MathUtils.lerp(uniforms.uHueShift.value, targetHue, 0.08);

        const scroll = scrollProgressRef.current;
        if (activeService === 'hero') {
            uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, Math.min(scroll * 1.5, 1.0), 0.1);
        } else {
            uniforms.uExpansion.value = THREE.MathUtils.lerp(uniforms.uExpansion.value, 0, 0.1);
        }

        if (meshRef.current) {
            const shiftAmount = particleShiftRef.current.x;

            if (isMobile && activeService !== 'hero') {
                // Mobile stacked layout (BLUEPRINT): 15% Title | 35% Shape | 50% Card
                // Shape zone is from 15% to 50% height. Center of shape zone is at 32.5% height.
                // Standard center is 50%. So shift UP by 17.5% (0.175 viewport heights).
                // Actually 0.5 - 0.325 = 0.175.
                const targetX = 0;
                meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
                const targetY = viewport.height * 0.175;
                meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
            } else {
                // Desktop or Hero view
                // Desktop BLUEPRINT: 10% Header | 90% (Shape 40% / Cards 60%)
                // Shape zone height is 90% (starts at 10%). Center is at 55% height.
                // Standard center is 50%. So shift DOWN by 5% (0.05 viewport heights).
                const heroBiasX = activeService === 'hero' ? viewport.width * 0.24 : 0;
                const shiftX = activeService === 'hero' ? 0.3 : 0.3; // Match 40/60 split
                const targetX = heroBiasX - viewport.width * shiftX * shiftAmount;
                meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);

                const targetY = activeService === 'hero' ? 0 : -(viewport.height * 0.05);
                meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
            }

            if (activeService === 'hero') {
                const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.018;
                meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, pulse, 0.08);
                meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1 / pulse, 0.08);
                meshRef.current.rotation.z = THREE.MathUtils.lerp(
                    meshRef.current.rotation.z,
                    Math.sin(clock.getElapsedTime() * 0.65) * 0.02,
                    0.08
                );
            } else {
                // COMPRESS SHAPE: Scale down to fit in smaller zones
                // On mobile, height is only 35vh. Standard shape fits 100vh.
                // On desktop, width is only 40vw.
                const targetScale = isMobile ? 0.65 : 1;
                meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
                meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
                meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
            }
        }

        uniforms.uMouse.value.x = (pointerRef.current.x * viewport.width) / 2;
        uniforms.uMouse.value.y = (pointerRef.current.y * viewport.height) / 2;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-aSize" count={particleCount} array={sizes} itemSize={1} />
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

const BackgroundGalaxy = ({ count = 1200 }) => {
    const meshRef = useRef();
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
    }, [count]);

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
            <pointsMaterial size={0.05} color="#0B0D12" transparent opacity={0.12} sizeAttenuation={true} />
        </points>
    );
};

const CameraRig = () => {
    const { camera } = useThree();
    const target = useMemo(() => new THREE.Vector3(0, 0, 4), []);

    useFrame(() => {
        camera.position.lerp(target, 0.12);
        camera.lookAt(0, 0, 0);
    });
    return null;
};

const ParticleScene = ({ activeService, particleShift, isMobile }) => {
    const perfTier = useMemo(() => {
        if (typeof window === 'undefined') return 'medium';
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const cores = navigator.hardwareConcurrency || 4;
        const memory = navigator.deviceMemory || 4;
        const isDeviceMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        if (reducedMotion || isDeviceMobile || cores <= 4 || memory <= 4) {
            return 'low';
        }

        if (cores <= 8 || memory <= 8) {
            return 'medium';
        }

        return 'high';
    }, []);

    const particleCount = perfTier === 'high' ? 10500 : perfTier === 'medium' ? 8000 : 5600;
    const circuitCount = perfTier === 'high' ? 1200 : 800;
    const galaxyCount = perfTier === 'high' ? 1000 : 700;
    const crystalCount = perfTier === 'high' ? 12 : 8;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 4], fov: 75 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                dpr={perfTier === 'high' ? [1, 1.25] : [1, 1]}
            >
                <CameraRig />
                <BackgroundGalaxy count={galaxyCount} />
                <CircuitBackground count={circuitCount} />
                <HeroCrystals activeService={activeService} count={crystalCount} />
                <Particles
                    key={particleCount}
                    activeService={activeService}
                    particleShiftRef={particleShift}
                    particleCount={particleCount}
                    perfTier={perfTier}
                    isMobile={isMobile}
                />

                {perfTier !== 'low' ? (
                    <EffectComposer>
                        <Bloom
                            intensity={perfTier === 'high' ? 0.96 : 0.74}
                            luminanceThreshold={0.22}
                            luminanceSmoothing={0.85}
                            mipmapBlur
                        />
                        <ChromaticAberration offset={[0.00002, 0.00002]} />
                        <Vignette eskil={false} offset={0.06} darkness={0.28} />
                    </EffectComposer>
                ) : null}
            </Canvas>
        </div>
    );
};

export default ParticleScene;
