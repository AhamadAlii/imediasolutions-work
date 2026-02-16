import { useMemo, useCallback } from 'react';

export const useParticleMorph = (particlesCount = 25000) => {
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        // Initialize as the hero eye shape so it's visible on first render
        const eyeScaleX = 1.68;
        const eyeScaleY = 1.56;
        const j = (s) => (Math.random() - 0.5) * s;
        for (let i = 0; i < particlesCount; i++) {
            const p = i / particlesCount;
            if (p < 0.48) {
                const t = (p / 0.48) * Math.PI * 2;
                const x = 1.65 * Math.cos(t);
                const y = 0.72 * Math.sin(t) * (1.0 - 0.25 * Math.cos(2.0 * t));
                pos[i * 3 + 0] = (x + j(0.03)) * eyeScaleX;
                pos[i * 3 + 1] = (y + j(0.03)) * eyeScaleY;
                pos[i * 3 + 2] = j(0.05);
            } else if (p < 0.76) {
                const t = ((p - 0.48) / 0.28) * Math.PI * 2;
                const r = 0.46 + j(0.04);
                pos[i * 3 + 0] = (Math.cos(t) * r + j(0.02)) * eyeScaleX;
                pos[i * 3 + 1] = (Math.sin(t) * r + j(0.02)) * eyeScaleY;
                pos[i * 3 + 2] = j(0.04);
            } else if (p < 0.9) {
                const t = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * 0.18;
                pos[i * 3 + 0] = (Math.cos(t) * r + j(0.015)) * eyeScaleX;
                pos[i * 3 + 1] = (Math.sin(t) * r + j(0.015)) * eyeScaleY;
                pos[i * 3 + 2] = j(0.03);
            } else {
                const t = Math.random();
                const side = i % 2 === 0 ? 1 : -1;
                const x = -1.2 + t * 2.4;
                const y = side * (0.22 + 0.12 * Math.cos((x / 1.2) * Math.PI));
                pos[i * 3 + 0] = (x + j(0.02)) * eyeScaleX;
                pos[i * 3 + 1] = (y + j(0.02)) * eyeScaleY;
                pos[i * 3 + 2] = j(0.04);
            }
        }
        return pos;
    }, [particlesCount]);

    const sizes = useMemo(() => {
        const s = new Float32Array(particlesCount);
        for (let i = 0; i < particlesCount; i++) {
            s[i] = 0.16 + Math.random() * 0.32;
        }
        return s;
    }, [particlesCount]);

    const phases = useMemo(() => {
        const p = new Float32Array(particlesCount);
        for (let i = 0; i < particlesCount; i++) {
            p[i] = Math.random() * Math.PI * 2;
        }
        return p;
    }, [particlesCount]);

    const getShapePositions = useCallback((shapeType) => {
        const pos = new Float32Array(particlesCount * 3);
        const set = (i, x, y, z = 0) => {
            pos[i * 3 + 0] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        };
        const j = (s) => (Math.random() - 0.5) * s;

        switch (shapeType) {
            case 'video':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.42) {
                        const t = (p / 0.42) * Math.PI * 2;
                        const w = 1.25;
                        const h = 0.82;
                        const r = 0.18;
                        const x = Math.sign(Math.cos(t)) * (w - r) + r * Math.cos(t) - 0.2;
                        const y = Math.sign(Math.sin(t)) * (h - r) + r * Math.sin(t);
                        set(i, x + j(0.04), y + j(0.04), j(0.06));
                    } else if (p < 0.65) {
                        const t = ((p - 0.42) / 0.23) * Math.PI * 2;
                        const r = 0.4 + j(0.05);
                        set(i, 0.28 + Math.cos(t) * r, Math.sin(t) * r, j(0.08));
                    } else {
                        const t = Math.random();
                        const edge = i % 3;
                        if (edge === 0) set(i, -0.28 + t * 0.74, -0.4 + t * 0.4, j(0.04));
                        if (edge === 1) set(i, -0.28 + t * 0.74, 0.4 - t * 0.4, j(0.04));
                        if (edge === 2) set(i, -0.28 + j(0.03), -0.4 + t * 0.8, j(0.04));
                    }
                }
                break;

            case 'ai':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.4) {
                        const t = (p / 0.4) * Math.PI * 2;
                        let x = -0.22 + 0.95 * Math.cos(t) + 0.16 * Math.cos(2.2 * t);
                        const y = 0.03 + 1.08 * Math.sin(t);
                        if (x > 0.65) x += 0.35 * Math.max(0, Math.cos(t));
                        set(i, x + j(0.04), y + j(0.04), j(0.06));
                    } else if (p < 0.72) {
                        const col = Math.floor(Math.random() * 7);
                        const row = Math.floor(Math.random() * 8);
                        const gx = -0.78 + col * 0.24;
                        const gy = 0.72 - row * 0.22;
                        set(i, gx + j(0.06), gy + j(0.06), j(0.06));
                    } else {
                        const t = (p - 0.72) / 0.28;
                        if (i % 3 === 0) set(i, 1.05 + t * 0.95 + j(0.04), 0.28 - t * 0.56 + j(0.05), j(0.05));
                        else set(i, 1.95 + j(0.06), -0.2 + Math.random() * 0.4 + j(0.03), j(0.06));
                    }
                }
                break;

            case 'influencer':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.18) {
                        const t = p / 0.18;
                        const phi = Math.acos(-1 + 2 * t);
                        const theta = Math.sqrt(particlesCount * Math.PI) * phi;
                        const r = 0.34;
                        set(i, r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
                    } else if (p < 0.48) {
                        const node = i % 8;
                        const a = (node / 8) * Math.PI * 2;
                        const r = 1.45;
                        const tr = Math.random() * Math.PI * 2;
                        set(i, Math.cos(a) * r + Math.cos(tr) * 0.14, Math.sin(a) * r + Math.sin(tr) * 0.14, j(0.05));
                    } else if (p < 0.8) {
                        const node = i % 8;
                        const a = (node / 8) * Math.PI * 2;
                        const t = Math.random();
                        set(i, Math.cos(a) * 1.45 * t + j(0.025), Math.sin(a) * 1.45 * t + j(0.025), j(0.03));
                    } else {
                        const a = (i / particlesCount) * Math.PI * 2 * 7;
                        const r = 1.0 + 0.45 * Math.sin(a * 2.4);
                        set(i, Math.cos(a) * r + j(0.02), Math.sin(a) * r + j(0.02), j(0.05));
                    }
                }
                break;

            case 'event':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.34) {
                        const e = i % 4;
                        const t = Math.random() * 2 - 1;
                        const sx = 1.08;
                        const sy = 0.9;
                        if (e === 0) set(i, t * sx, sy, j(0.05));
                        else if (e === 1) set(i, t * sx, -sy, j(0.05));
                        else if (e === 2) set(i, sx, t * sy, j(0.05));
                        else set(i, -sx, t * sy, j(0.05));
                    } else if (p < 0.56) {
                        const row = Math.floor(Math.random() * 4);
                        const col = Math.floor(Math.random() * 5);
                        set(i, -0.68 + col * 0.34 + j(0.05), 0.42 - row * 0.26 + j(0.05), j(0.04));
                    } else {
                        const t = (p - 0.56) / 0.44;
                        const arm = i % 10;
                        const a = (arm / 10) * Math.PI;
                        const r = 0.35 + t * 1.45;
                        set(i, Math.cos(a) * r + j(0.03), 0.9 + Math.sin(a) * r + j(0.03), j(0.07));
                    }
                }
                break;

            case 'web':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.28) {
                        const e = i % 4;
                        const t = Math.random() * 2 - 1;
                        const sx = 1.65;
                        const sy = 1.0;
                        if (e === 0) set(i, t * sx, sy, j(0.04));
                        else if (e === 1) set(i, t * sx, -sy, j(0.04));
                        else if (e === 2) set(i, sx, t * sy, j(0.04));
                        else set(i, -sx, t * sy, j(0.04));
                    } else if (p < 0.35) {
                        const c = i % 3;
                        set(i, -1.32 + c * 0.24 + j(0.04), 0.8 + j(0.03), j(0.03));
                    } else if (p < 0.78) {
                        const line = Math.floor(Math.random() * 8);
                        const len = 0.45 + Math.random() * 1.85;
                        set(i, -1.32 + Math.random() * len, 0.52 - line * 0.2 + j(0.025), j(0.03));
                    } else {
                        const t = Math.random();
                        const side = i % 2 === 0 ? -1 : 1;
                        set(i, 1.2 + side * 0.18 + j(0.02), -0.76 + t * 0.24 + j(0.02), j(0.03));
                    }
                }
                break;

            case 'social':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.26) {
                        const e = i % 4;
                        const t = Math.random() * 2 - 1;
                        const sx = 1.5;
                        const sy = 0.95;
                        if (e === 0) set(i, t * sx, sy, j(0.04));
                        else if (e === 1) set(i, t * sx, -sy, j(0.04));
                        else if (e === 2) set(i, sx, t * sy, j(0.04));
                        else set(i, -sx, t * sy, j(0.04));
                    } else if (p < 0.72) {
                        const row = Math.floor(Math.random() * 11);
                        const col = Math.floor(Math.random() * 12);
                        const x = (col - 5.5) * 0.2 + (row % 2 ? 0.1 : 0);
                        const y = (row - 5) * 0.17;
                        set(i, x + j(0.03), y + j(0.03), Math.sin(x * 2.5) * 0.07);
                    } else {
                        const a = (i / particlesCount) * Math.PI * 2 * 5;
                        const r = 0.32 + (a / (Math.PI * 10)) * 1.18;
                        set(i, Math.cos(a) * r + j(0.02), Math.sin(a) * r + j(0.02), j(0.05));
                    }
                }
                break;

            case 'app':
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.42) {
                        const t = (p / 0.42) * Math.PI * 2;
                        const sx = 0.84;
                        const sy = 1.52;
                        const r = 0.14;
                        const x = Math.sign(Math.cos(t)) * (sx - r) + r * Math.cos(t);
                        const y = Math.sign(Math.sin(t)) * (sy - r) + r * Math.sin(t);
                        set(i, x + j(0.025), y + j(0.025), j(0.04));
                    } else if (p < 0.52) {
                        set(i, (Math.random() - 0.5) * 0.34, 1.35 + j(0.03), j(0.03));
                    } else if (p < 0.84) {
                        const card = i % 6;
                        const a = (card / 6) * Math.PI * 2;
                        const cx = Math.cos(a) * 1.65;
                        const cy = Math.sin(a) * 1.2;
                        set(i, cx + j(0.2), cy + j(0.14), j(0.07));
                    } else {
                        const card = i % 6;
                        const a = (card / 6) * Math.PI * 2;
                        const t = Math.random();
                        set(i, Math.cos(a) * 1.65 * t + j(0.02), Math.sin(a) * 1.2 * t + j(0.02), j(0.03));
                    }
                }
                break;

            case 'hero':
                const eyeScaleX = 1.68;
                const eyeScaleY = 1.56;
                for (let i = 0; i < particlesCount; i++) {
                    const p = i / particlesCount;
                    if (p < 0.48) {
                        // Outer almond contour.
                        const t = (p / 0.48) * Math.PI * 2;
                        const x = 1.65 * Math.cos(t);
                        const y = 0.72 * Math.sin(t) * (1.0 - 0.25 * Math.cos(2.0 * t));
                        set(i, (x + j(0.03)) * eyeScaleX, (y + j(0.03)) * eyeScaleY, j(0.05));
                    } else if (p < 0.76) {
                        // Iris ring.
                        const t = ((p - 0.48) / 0.28) * Math.PI * 2;
                        const r = 0.46 + j(0.04);
                        set(
                            i,
                            (Math.cos(t) * r + j(0.02)) * eyeScaleX,
                            (Math.sin(t) * r + j(0.02)) * eyeScaleY,
                            j(0.04)
                        );
                    } else if (p < 0.9) {
                        // Pupil core.
                        const t = Math.random() * Math.PI * 2;
                        const r = Math.sqrt(Math.random()) * 0.18;
                        set(
                            i,
                            (Math.cos(t) * r + j(0.015)) * eyeScaleX,
                            (Math.sin(t) * r + j(0.015)) * eyeScaleY,
                            j(0.03)
                        );
                    } else {
                        // Subtle upper/lower arcs to read as eyelids.
                        const t = Math.random();
                        const side = i % 2 === 0 ? 1 : -1;
                        const x = -1.2 + t * 2.4;
                        const y = side * (0.22 + 0.12 * Math.cos((x / 1.2) * Math.PI));
                        set(i, (x + j(0.02)) * eyeScaleX, (y + j(0.02)) * eyeScaleY, j(0.04));
                    }
                }
                break;

            case 'scattered':
                for (let i = 0; i < particlesCount; i++) {
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const r = 6 + Math.random() * 6; // far outward
                    set(i, r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
                }
                break;

            default:
                for (let i = 0; i < particlesCount; i++) {
                    const phi = Math.acos(-1 + (2 * i) / particlesCount);
                    const theta = Math.sqrt(particlesCount * Math.PI) * phi;
                    const r = 1.3;
                    set(i, r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
                }
        }

        return pos;
    }, [particlesCount]);

    return { positions, sizes, phases, getShapePositions };
};
