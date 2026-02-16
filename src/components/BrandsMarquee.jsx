'use client';

import React, { useMemo } from 'react';

const brands = ['Trimble', 'e2open', 'TOYOTA', 'OWASP', 'Injazat', "LOWE'S", 'Cognizant'];
const arcLift = [-10, -26, -40, -48, -40, -26, -10];

const BrandsMarquee = () => {
    const looped = useMemo(() => [...brands, ...brands], []);

    return (
        <section className="bg-black py-28 md:py-36 overflow-hidden relative">
            <div className="max-w-7xl mx-auto text-center mb-14 md:mb-18 cursor-default px-6">
                <h2 className="luxe-heading text-5xl md:text-7xl font-semibold text-white mb-3">Trusted by Industry Leaders</h2>
                <p className="text-white/80 text-base md:text-2xl font-light">
                    Powering Innovation for Companies Worldwide
                </p>
            </div>

            <div className="arc-stage">
                <div className="arc-glow pointer-events-none" />

                <div className="arc-track">
                    {looped.map((name, i) => (
                        <span
                            key={`${name}-${i}`}
                            className="arc-item"
                            style={{ '--lift': `${arcLift[i % brands.length]}px` }}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .arc-stage {
                    position: relative;
                    height: 220px;
                    overflow: hidden;
                }

                .arc-glow {
                    position: absolute;
                    left: 50%;
                    bottom: 26px;
                    transform: translateX(-50%);
                    width: min(86vw, 1120px);
                    height: 90px;
                    border-radius: 999px;
                    background:
                        radial-gradient(ellipse at center, rgba(162, 172, 255, 0.52) 0%, rgba(45, 60, 185, 0.26) 36%, rgba(0, 0, 0, 0) 74%);
                    filter: blur(4px);
                }

                .arc-track {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 36px;
                    display: flex;
                    align-items: flex-end;
                    gap: clamp(56px, 6vw, 100px);
                    width: max-content;
                    white-space: nowrap;
                    animation: arcSlide 24s linear infinite;
                    padding-left: 32px;
                }

                .arc-item {
                    display: inline-block;
                    transform: translateY(var(--lift));
                    font-size: clamp(24px, 2.8vw, 42px);
                    font-weight: 800;
                    letter-spacing: 0.01em;
                    color: rgba(255, 255, 255, 0.92);
                    text-shadow: 0 0 16px rgba(70, 88, 255, 0.24);
                }

                @keyframes arcSlide {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @media (max-width: 900px) {
                    .arc-stage {
                        height: 180px;
                    }

                    .arc-track {
                        bottom: 30px;
                        gap: 44px;
                        animation-duration: 20s;
                    }

                    .arc-item {
                        font-size: clamp(16px, 5vw, 26px);
                    }
                }
            `}</style>
        </section>
    );
};

export default BrandsMarquee;
