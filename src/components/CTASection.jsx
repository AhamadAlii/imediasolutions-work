'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-black py-40 px-6 relative overflow-hidden group"
        >
            {/* FLUID BACKGROUND */}
            <div
                className="absolute inset-0 opacity-40 blur-[120px] transition-all duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(58, 61, 145, 0.8) 0%, transparent 60%)`,
                }}
            />

            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10 border border-white/5 rounded-[4rem] py-32 bg-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-2xl">
                {/* Secondary light for the box */}
                <div
                    className="absolute inset-0 opacity-20 blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(75, 78, 189, 0.4) 0%, transparent 50%)`,
                    }}
                />

                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16 leading-[1.1] max-w-4xl px-8">
                    We turn bold ideas into <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100 italic">powerful digital realities.</span>
                </h2>

                <button className="group/btn relative px-10 py-5 bg-[#4B4EBD] text-white rounded-full font-bold text-xs tracking-widest overflow-hidden transition-all hover:scale-105 hover:bg-[#5C5FED]">
                    <span className="relative z-10 flex items-center gap-3">
                        LET'S WORK TOGETHER <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </button>
            </div>
        </section>
    );
};

export default CTASection;
