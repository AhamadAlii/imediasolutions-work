'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    const containerRef = useRef(null);
    const bottomLineRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [waveIndex, setWaveIndex] = useState(0);
    const [hoverWave, setHoverWave] = useState(-1);
    const topWords = ['We', 'turn', 'bold', 'ideas', 'into'];
    const bottomWords = ['powerful', 'digital', 'realities.'];

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    useEffect(() => {
        const id = setInterval(() => {
            setWaveIndex((prev) => (prev + 1) % bottomWords.length);
        }, 1500);
        return () => clearInterval(id);
    }, [bottomWords.length]);

    const handleBottomHover = (e) => {
        if (!bottomLineRef.current) return;
        const rect = bottomLineRef.current.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const idx = Math.min(bottomWords.length - 1, Math.max(0, Math.floor(relX * bottomWords.length)));
        setHoverWave(idx);
    };

    const mouseX = (mousePos.x - 50) / 50;
    const mouseY = (mousePos.y - 50) / 50;

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-black py-20 md:py-40 px-4 md:px-6 relative overflow-hidden group"
        >
            {/* FLUID BACKGROUND */}
            <div
                className="absolute inset-0 opacity-40 blur-[120px] transition-all duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(58, 61, 145, 0.8) 0%, transparent 60%)`,
                }}
            />

            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10 border border-white/5 rounded-[2rem] md:rounded-[4rem] py-16 md:py-32 px-6 bg-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-2xl">
                {/* Secondary light for the box */}
                <div
                    className="absolute inset-0 opacity-20 blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(75, 78, 189, 0.4) 0%, transparent 50%)`,
                    }}
                />

                <h2 className="luxe-heading text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-white mb-10 md:mb-16 leading-[1.1] md:leading-[1.04] max-w-4xl">
                    <span className="block">
                        {topWords.map((word, index) => (
                            <span
                                key={word}
                                className="fluid-word"
                                style={{
                                    transform: `translate3d(${mouseX * (index + 1) * 1.6}px, ${mouseY * (index + 1) * 0.9}px, 0)`
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                    <span
                        ref={bottomLineRef}
                        onMouseMove={handleBottomHover}
                        onMouseLeave={() => setHoverWave(-1)}
                        className="mt-2 block italic"
                    >
                        {bottomWords.map((word, index) => (
                            <span
                                key={word}
                                className={`wave-word ${waveIndex === index || hoverWave === index ? 'wave-active' : ''}`}
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                </h2>

                <button className="luxe-button luxe-button-primary py-4 md:py-6 px-8 md:px-12 scale-100 md:scale-110 text-[10px] md:text-[11px]">
                    LET'S CREATE SOMETHING EXTRAORDINARY
                </button>
            </div>

            <style jsx>{`
                .fluid-word {
                    display: inline-block;
                    margin-right: 0.42em;
                    transition: transform 180ms ease-out;
                    will-change: transform;
                }

                .wave-word {
                    display: inline-block;
                    margin-right: 0.38em;
                    opacity: 0.95;
                    transform: translateY(0px) scale(1);
                    color: #a7b6ff;
                    text-shadow: 0 0 10px rgba(120, 142, 255, 0.35);
                }

                .wave-active {
                    animation: fluidPulse 680ms cubic-bezier(0.22, 1, 0.36, 1);
                }

                @keyframes fluidPulse {
                    0% {
                        transform: translateY(0px) scale(1);
                        filter: blur(0px);
                        opacity: 0.9;
                    }
                    35% {
                        transform: translateY(-7px) scale(1.05);
                        filter: blur(0.6px);
                        opacity: 1;
                    }
                    70% {
                        transform: translateY(2px) scale(0.98);
                        filter: blur(0px);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0px) scale(1);
                        filter: blur(0px);
                        opacity: 0.9;
                    }
                }
            `}</style>
        </section>
    );
};

export default CTASection;
