'use client';

import React from 'react';
import { Palette, Sparkles, Rocket, Smartphone, Code2, Globe, Cpu, Zap } from 'lucide-react';

const brands = [
    { name: 'LOWE\'S', icon: <Globe className="w-8 h-8" /> },
    { name: 'Cognizant', icon: <Cpu className="w-8 h-8" /> },
    { name: 'Trimble', icon: <Zap className="w-8 h-8" /> },
    { name: 'e2open', icon: <Globe className="w-8 h-8" /> },
    { name: 'TOYOTA', icon: <Cpu className="w-8 h-8" /> },
    { name: 'OWASP', icon: <Globe className="w-8 h-8" /> },
    { name: 'Injazat', icon: <Zap className="w-8 h-8" /> },
];

const BrandsMarquee = () => {
    return (
        <section className="bg-black py-40 overflow-hidden relative">
            <div className="max-w-7xl mx-auto text-center mb-24 cursor-default">
                <h2 className="text-4xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
                <p className="text-gray-500 text-sm font-light uppercase tracking-widest">
                    Powering Innovation for Companies Worldwide
                </p>
            </div>

            {/* CURVED MARQUEE CONTAINER */}
            <div className="relative w-full overflow-hidden">
                <div className="marquee-curve absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at 50% 100%, transparent 60%, black 100%)',
                        transform: 'scaleY(0.4) translateY(50%)'
                    }}
                />

                <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-12">
                    {[...brands, ...brands, ...brands].map((brand, i) => (
                        <div key={i} className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500 group">
                            <div className="text-gray-400 group-hover:text-indigo-400 transition-colors">
                                {brand.icon}
                            </div>
                            <span className="text-3xl font-bold text-white tracking-tighter uppercase whitespace-nowrap">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>
        </section>
    );
};

export default BrandsMarquee;
