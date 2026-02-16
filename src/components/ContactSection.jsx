'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';

const ContactSection = () => {
    const containerRef = useRef(null);
    const boxRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseMove = (e) => {
        if (isFocused || !containerRef.current || !boxRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(boxRef.current, {
            rotateY: x * 20,
            rotateX: -y * 20,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    };

    const handleMouseLeave = () => {
        if (isFocused || !boxRef.current) return;
        gsap.to(boxRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)'
        });
    };

    const handleFocus = () => {
        setIsFocused(true);
        gsap.to(boxRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    };

    return (
        <section className="relative z-[120] bg-black py-20 sm:py-32 overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* LEFT SIDE: TEXT */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-[9px] font-bold tracking-[0.2em] uppercase mb-6">
                            Contact Us
                        </div>
                        <h2 className="luxe-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6 leading-none uppercase">
                            LET'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CONNECT</span>
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed max-w-md lg:max-w-none">
                            Have a vision that needs a high-fidelity digital touch? We're ready to bring your ideas to life with state-of-the-art tech and design.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 text-sm font-medium">
                            <div className="flex items-center gap-3 text-white">
                                <span className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    @
                                </span>
                                hello@eyemedia.ai
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: FORM */}
                    <div
                        className="flex justify-center lg:justify-end w-full"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        ref={containerRef}
                    >
                        <div className="contact-container w-full max-w-[450px]" style={{ perspective: '1000px' }}>
                            <div className="contact-box" ref={boxRef} style={{ transformStyle: 'preserve-3d' }}>
                                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="contact-logo"></div>
                                    <span className="contact-header">Send a Message</span>

                                    <input
                                        type="text"
                                        name="full_name"
                                        id="full_name"
                                        placeholder="Full Name"
                                        className="contact-input"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={() => setIsFocused(false)}
                                        suppressHydrationWarning
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Email Address"
                                        className="contact-input"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={() => setIsFocused(false)}
                                        suppressHydrationWarning
                                    />
                                    <textarea
                                        name="message"
                                        id="message"
                                        placeholder="Your Message"
                                        className="contact-input contact-textarea"
                                        rows="4"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={() => setIsFocused(false)}
                                        suppressHydrationWarning
                                    ></textarea>

                                    <button type="submit" className="luxe-button luxe-button-primary w-full py-4 mt-6">
                                        Send Message
                                    </button>

                                    <p className="contact-footer text-[10px] uppercase tracking-widest opacity-60">
                                        EST. RESPONSE: 24h
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
