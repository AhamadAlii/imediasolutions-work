import { useMemo, useCallback } from 'react';

export const useParticleMorph = (particlesCount = 25000) => {
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particlesCount);
            const theta = Math.sqrt(particlesCount * Math.PI) * phi;
            const r = 1.2;
            pos[i * 3 + 0] = r * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [particlesCount]);

    const sizes = useMemo(() => {
        const s = new Float32Array(particlesCount);
        for (let i = 0; i < particlesCount; i++) {
            s[i] = Math.random();
        }
        return s;
    }, [particlesCount]);

    const getShapePositions = useCallback((shapeType) => {
        const pos = new Float32Array(particlesCount * 3);

        switch (shapeType) {
            case 'video': // Swirling Vortex Only (Removed Play Button Arrow)
                for (let i = 0; i < particlesCount; i++) {
                    // Swirling Vortex
                    const angle = i * 0.05 + Math.random() * 0.5;
                    const r = 0.5 + Math.log(1 + i * 0.0001) * 1.2; // Scaled down to ~1.7 max
                    pos[i * 3 + 0] = Math.cos(angle) * r;
                    pos[i * 3 + 1] = Math.sin(angle) * r;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
                }
                break;

            case 'ai': // Head Silhouette + Neural Circuits
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.7) {
                        // Head Silhouette distribution
                        const t = (i / (particlesCount * 0.7)) * Math.PI * 2;
                        // Parametric head-ish shape
                        const r = 1.3 + 0.3 * Math.sin(t) * Math.cos(t * 2); // Scale to ~1.6
                        pos[i * 3 + 0] = Math.cos(t) * r;
                        pos[i * 3 + 1] = Math.sin(t) * r + 0.1;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
                    } else {
                        // Internal Neural Nodes
                        pos[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
                        pos[i * 3 + 1] = (Math.random() - 0.5) * 1.8 + 0.2;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
                    }
                }
                break;

            case 'influencer': // Network Star Graph
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.2) {
                        // Central Node (Sphere)
                        const phi = Math.acos(-1 + (2 * i) / (particlesCount * 0.2));
                        const theta = Math.sqrt(particlesCount * 0.2 * Math.PI) * phi;
                        const r = 0.5; // Scale up central node
                        pos[i * 3 + 0] = r * Math.cos(theta) * Math.sin(phi);
                        pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
                        pos[i * 3 + 2] = r * Math.cos(phi);
                    } else if (i < particlesCount * 0.6) {
                        // Orbiting Nodes (5 distinct nodes)
                        const nodeIdx = i % 5;
                        const angle = (nodeIdx * Math.PI * 2) / 5;
                        const rNode = 1.6; // Scale down to 1.6
                        const phi = Math.acos(-1 + (2 * i) / (particlesCount * 0.4));
                        const theta = Math.sqrt(particlesCount * 0.4 * Math.PI) * phi;
                        const rSize = 0.2;
                        pos[i * 3 + 0] = Math.cos(angle) * rNode + rSize * Math.cos(theta) * Math.sin(phi);
                        pos[i * 3 + 1] = Math.sin(angle) * rNode + rSize * Math.sin(theta) * Math.sin(phi);
                        pos[i * 3 + 2] = rSize * Math.cos(phi);
                    } else {
                        // Connecting Lines (dotted)
                        const lineIdx = i % 5;
                        const startAngle = (lineIdx * Math.PI * 2) / 5;
                        const t = Math.random();
                        pos[i * 3 + 0] = Math.cos(startAngle) * 1.6 * t;
                        pos[i * 3 + 1] = Math.sin(startAngle) * 1.6 * t;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
                    }
                }
                break;

            case 'event': // Calendar inside Spiral Galaxy
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.4) {
                        // Square Calendar Outline
                        const edge = i % 4;
                        const t = Math.random() * 2.0 - 1.0;
                        const s = 1.1; // Scale down calendar
                        if (edge === 0) { pos[i * 3 + 0] = t * s; pos[i * 3 + 1] = s; }
                        else if (edge === 1) { pos[i * 3 + 0] = t * s; pos[i * 3 + 1] = -s; }
                        else if (edge === 2) { pos[i * 3 + 0] = s; pos[i * 3 + 1] = t * s; }
                        else { pos[i * 3 + 0] = -s; pos[i * 3 + 1] = t * s; }
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
                    } else {
                        // Logarithmic Spiral Galaxy
                        const angle = i * 0.02;
                        const rBase = 0.4;
                        const r = rBase * Math.exp(0.2 * (angle % (Math.PI * 4)));
                        const jitter = Math.random() * 0.4;
                        const finalR = Math.min(r + jitter, 1.7); // Cap at 1.7
                        pos[i * 3 + 0] = Math.cos(angle) * finalR;
                        pos[i * 3 + 1] = Math.sin(angle) * finalR;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
                    }
                }
                break;

            case 'web': // Browser Window + Code Lines
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.3) {
                        // Browser Frame
                        const edge = i % 4;
                        const t = Math.random() * 2.0 - 1.0;
                        const sx = 1.7; // Scale down fit box
                        const sy = 1.1;
                        if (edge === 0) { pos[i * 3 + 0] = t * sx; pos[i * 3 + 1] = sy; }
                        else if (edge === 1) { pos[i * 3 + 0] = t * sx; pos[i * 3 + 1] = -sy; }
                        else if (edge === 2) { pos[i * 3 + 0] = sx; pos[i * 3 + 1] = t * sy; }
                        else { pos[i * 3 + 0] = -sx; pos[i * 3 + 1] = t * sy; }
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
                    } else {
                        // Internal Code Lines (horizontal segments)
                        const lineIdx = Math.floor(i / (particlesCount * 0.04));
                        const y = 1.0 - (lineIdx % 10 * 0.22);
                        const t = Math.random() * 1.8 - 0.9;
                        pos[i * 3 + 0] = t * 1.7;
                        pos[i * 3 + 1] = y;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
                    }
                }
                break;

            case 'social': // Dashboard Window with Hex Pattern
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.3) {
                        // Rectangular Frame
                        const edge = i % 4;
                        const t = Math.random() * 2.0 - 1.0;
                        const s = 1.6; // Scale down social
                        if (edge === 0) { pos[i * 3 + 0] = t * s; pos[i * 3 + 1] = s; }
                        else if (edge === 1) { pos[i * 3 + 0] = t * s; pos[i * 3 + 1] = -s; }
                        else if (edge === 2) { pos[i * 3 + 0] = s; pos[i * 3 + 1] = t * s; }
                        else { pos[i * 3 + 0] = -s; pos[i * 3 + 1] = t * s; }
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
                    } else {
                        // Hexagonal Particle Lattice (sampling a grid)
                        const row = Math.floor(Math.sqrt(i)) % 15;
                        const col = i % 15;
                        const x = (col - 7.5) * 0.2 + (row % 2 === 0 ? 0.1 : 0);
                        const y = (row - 7.5) * 0.18;
                        // Wave displacement
                        const wave = Math.sin(x * 2.0 + y * 2.0) * 0.1;
                        pos[i * 3 + 0] = x;
                        pos[i * 3 + 1] = y + wave;
                        pos[i * 3 + 2] = Math.cos(x * 3.0) * 0.1;
                    }
                }
                break;

            case 'app': // Smartphone Border + Floating UI
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.5) {
                        // Smartphone Outline (Rounded Rect)
                        const t = (i / (particlesCount * 0.5)) * Math.PI * 2;
                        const sx = 0.8;
                        const sy = 1.6; // Scale down phone
                        const r = 0.1;
                        const x = Math.sign(Math.cos(t)) * sx + Math.cos(t) * r;
                        const y = Math.sign(Math.sin(t)) * sy + Math.sin(t) * r;
                        pos[i * 3 + 0] = x;
                        pos[i * 3 + 1] = y;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
                    } else {
                        // Floating UI Panels (4 small rects)
                        const panelIdx = i % 4;
                        const px = (panelIdx % 2 === 0 ? 1.2 : -1.2);
                        const py = (panelIdx < 2 ? 0.9 : -0.9);
                        const size = 0.35;
                        pos[i * 3 + 0] = px + (Math.random() - 0.5) * size;
                        pos[i * 3 + 1] = py + (Math.random() - 0.5) * size;
                        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
                    }
                }
                break;

            case 'hero': // Atomic Energy Core
                for (let i = 0; i < particlesCount; i++) {
                    if (i < particlesCount * 0.3) {
                        // Core Central Sphere (Dense)
                        const phi = Math.acos(-1 + (2 * i) / (particlesCount * 0.3));
                        const theta = Math.sqrt(particlesCount * 0.3 * Math.PI) * phi;
                        const r = 0.8 + Math.random() * 0.2; // Scale up core
                        pos[i * 3 + 0] = r * Math.cos(theta) * Math.sin(phi);
                        pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
                        pos[i * 3 + 2] = r * Math.cos(phi);
                    } else {
                        // 5 Intersecting Elliptical Orbits
                        const orbitIdx = i % 5;
                        const t = Math.random() * Math.PI * 2;
                        const a = 1.7; // Scale down hero orbits
                        const b = 0.9;

                        let x = Math.cos(t) * a;
                        let y = Math.sin(t) * b;
                        let z = (Math.random() - 0.5) * 0.05;

                        if (orbitIdx === 1) {
                            const tmp = x; x = z; z = y; y = tmp;
                        } else if (orbitIdx === 2) {
                            const tmp = y; y = z; z = tmp;
                        } else if (orbitIdx === 3) {
                            const angle = Math.PI / 4;
                            const x1 = x * Math.cos(angle) - z * Math.sin(angle);
                            const z1 = x * Math.sin(angle) + z * Math.cos(angle);
                            x = x1; z = z1;
                        } else if (orbitIdx === 4) {
                            const angle = -Math.PI / 4;
                            const y1 = y * Math.cos(angle) - z * Math.sin(angle);
                            const z1 = y * Math.sin(angle) + z * Math.cos(angle);
                            y = y1; z = z1;
                        }

                        pos[i * 3 + 0] = x;
                        pos[i * 3 + 1] = y;
                        pos[i * 3 + 2] = z;
                    }
                }
                break;

            default:
                for (let i = 0; i < particlesCount; i++) {
                    const phi = Math.acos(-1 + (2 * i) / particlesCount);
                    const theta = Math.sqrt(particlesCount * Math.PI) * phi;
                    const r = 1.3;
                    pos[i * 3 + 0] = r * Math.cos(theta) * Math.sin(phi);
                    pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
                    pos[i * 3 + 2] = r * Math.cos(phi);
                }
        }
        return pos;
    }, [particlesCount]);

    return { positions, sizes, getShapePositions };
};
