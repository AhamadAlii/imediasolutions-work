'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, Rocket, Smartphone, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 'video',
        number: '01',
        title: 'Video Editing & Content Creation',
        desc: 'Professional post-production and creative content strategy that captures attention and drives results.',
        servicesList: ['Post-Production', 'Motion Graphics', 'Color Grading', 'Sound Design'],
        tools: ['Premiere', 'After Effects', 'Resolve', 'Final Cut'],
        icon: <Palette className="w-8 h-8" />
    },
    {
        id: 'ai',
        number: '02',
        title: 'AI Ads & Shows',
        desc: 'Cutting-edge AI-powered advertising and entertainment content tailored for the modern digital era.',
        servicesList: ['Generative Video', 'AI Character Design', 'Deepfake Ads', 'Voice Synthesis'],
        tools: ['Midjourney', 'Runway', 'Pika', 'ElevenLabs'],
        icon: <Sparkles className="w-8 h-8" />
    },
    {
        id: 'influencer',
        number: '03',
        title: 'Influencer Marketing',
        desc: 'Connecting brands with the right voices to create authentic engagement and expand market reach.',
        servicesList: ['Campaign Strategy', 'Creator Sourcing', 'ROI Tracking', 'Contract Management'],
        tools: ['Grin', 'HypeAuditor', 'Upfluence', 'Aspire'],
        icon: <Rocket className="w-8 h-8" />
    },
    {
        id: 'event',
        number: '04',
        title: 'Event Planning',
        desc: 'Comprehensive event management—from conceptualization to flawless execution for memorable experiences.',
        servicesList: ['Venue Strategy', 'Technical Production', 'Guest Management', 'Post-Event Analysis'],
        tools: ['Cvent', 'Bizzabo', 'Eventbrite', 'Notion'],
        icon: <CheckCircle2 className="w-8 h-8" />
    },
    {
        id: 'web',
        number: '05',
        title: 'Web Development',
        desc: 'High-performance, responsive websites built with modern frameworks for a premium digital presence.',
        servicesList: ['Frontend Engineering', 'Custom CMS', 'E-commerce', 'Interactive WebGL'],
        tools: ['React', 'Next.js', 'Three.js', 'GSAP'],
        icon: <Code2 className="w-8 h-8" />
    },
    {
        id: 'social',
        number: '06',
        title: 'Social Media Management',
        desc: 'Data-driven social strategies that build community, increase brand loyalty, and drive conversions.',
        servicesList: ['Community Building', 'Content Calendars', 'Performance Ads', 'Trend Analysis'],
        tools: ['Sprout', 'Hootsuite', 'Loomly', 'Canva'],
        icon: <Sparkles className="w-8 h-8" />
    },
    {
        id: 'app',
        number: '07',
        title: 'App Development',
        desc: 'Robust, native and cross-platform mobile applications designed for scale and exceptional user experience.',
        servicesList: ['iOS & Android Native', 'React Native', 'UI/UX Mobile Design', 'Cloud Integration'],
        tools: ['Swift', 'Kotlin', 'Firebase', 'Expo'],
        icon: <Smartphone className="w-8 h-8" />
    },
];

const ServicesSection = ({ onServiceChange, activeId }) => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const cardsRef = useRef([]);
    const lastActiveRef = useRef(activeId);

    useEffect(() => {
        const totalCards = services.length;

        // 1. PINNING & PROGRESS
        const pin = gsap.to(sectionRef.current, {
            x: () => {
                const track = sectionRef.current;
                const cards = cardsRef.current;
                if (!track || cards.length === 0) return 0;

                // We want the last card to stop when its left edge aligns with the track start
                // The track start is at 0 (translated). Padding handles initial offset.
                // So max translation is the distance from the first card's left to the last card's left.
                const lastCard = cards[cards.length - 1];
                return -(lastCard.offsetLeft - cards[0].offsetLeft);
            },
            ease: 'none',
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top top',
                end: () => `+=${window.innerHeight * totalCards * 2}`, // Refined duration
                scrub: 0.5,
                pin: true,
                snap: {
                    snapTo: 1 / (totalCards - 1),
                    duration: { min: 0.2, max: 0.8 },
                    delay: 0.05,
                    ease: 'power1.inOut'
                },
                onUpdate: (self) => {
                    const progress = self.progress;
                    const totalServices = services.length;

                    const index = Math.min(
                        Math.floor(progress * totalServices),
                        totalServices - 1
                    );

                    const currentId = services[index].id;
                    if (currentId !== lastActiveRef.current) {
                        lastActiveRef.current = currentId;
                        onServiceChange(currentId);
                    }
                },
                onEnter: () => onServiceChange(services[0].id),
                onLeaveBack: () => onServiceChange(services[0].id),
            },
        });

        // 2. INDIVIDUAL CARD ANIMATIONS
        services.forEach((_, i) => {
            const card = cardsRef.current[i];
            if (!card) return;

            const cardStart = (i / (totalCards - 1));
            // Card stays visible much longer to show blue state
            const cardEnd = ((i + 0.8) / (totalCards - 1));

            gsap.to(card, {
                opacity: 0,
                xPercent: -150,
                filter: 'blur(30px)',
                scale: 0.9,
                ease: 'power2.in',
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: () => `top+=${cardStart * window.innerHeight * totalCards * 2.5 + window.innerHeight * 1.0} top`,
                    end: () => `top+=${cardEnd * window.innerHeight * totalCards * 2.5 + window.innerHeight * 1.0} top`,
                    scrub: true,
                }
            });
        });

        return () => {
            pin.kill();
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === triggerRef.current) st.kill();
            });
        };
    }, [onServiceChange]);

    return (
        <section ref={triggerRef} className="relative bg-black overflow-hidden">
            <div className="flex h-screen w-full relative">

                {/* CONTENT ZONE (Entire section height) */}
                <div className="h-full w-full relative flex items-center">
                    {/* THE MASK (Box) - Left column inside content zone - COMPLETELY BLACK */}
                    <div className="absolute top-0 left-0 h-full w-[40vw] bg-black z-[100] border-r border-white/5 shadow-[30px_0_120px_rgba(0,0,0,1)]">
                        {/* 3D Shape rendered here */}
                    </div>

                    {/* FIXED HEADER ROW (Stays fixed while track slides) */}
                    <div className="absolute top-[5vh] left-[calc(40vw+4cm)] z-[110] flex justify-between w-[calc(60vw-4cm-10vw)] items-end pb-12 border-b border-white/5 whitespace-nowrap">
                        <h2 className="text-5xl font-bold tracking-tighter text-white">Our Services</h2>
                        <p className="max-w-[340px] text-xs text-gray-400 font-light leading-relaxed whitespace-normal pr-12">
                            We offer comprehensive digital solutions that transform your business and drive innovation across every touchpoint.
                        </p>
                    </div>

                    {/* THE TRACK (Cards) */}
                    <div
                        ref={sectionRef}
                        className="flex flex-nowrap h-full items-center pr-[20vw] z-[70] pt-[25vh]"
                        style={{ paddingLeft: 'calc(40vw + 4cm)' }}
                    >
                        {services.map((service, index) => {
                            const isActive = activeId === service.id;
                            return (
                                <div
                                    key={service.id}
                                    ref={el => cardsRef.current[index] = el}
                                    className={`service-card h-[520px] w-[360px] shrink-0 rounded-[2.5rem] border p-10 flex flex-col justify-between transition-[background-color,border-color,box-shadow] duration-500 relative overflow-hidden mr-20 will-change-transform ${isActive ? 'bg-[#3A3D91] border-[#3A3D91] shadow-[0_40px_100px_rgba(58,61,145,0.4)] scale-105' : 'bg-[#0A0A0E] border-white/5 backdrop-blur-3xl'}`}
                                >
                                    {/* Arrow Top Right */}
                                    <div className="absolute top-10 right-10">
                                        <ArrowUpRight className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                                    </div>

                                    {isActive ? (
                                        /* ACTIVE STATE CONTENT */
                                        <>
                                            <div className="flex flex-col gap-8">
                                                <h3 className="text-3xl font-bold leading-tight text-white pr-12">{service.title}</h3>
                                                <p className="text-white/70 text-sm font-light leading-relaxed max-w-[260px]">
                                                    {service.desc}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col gap-4">
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Services</span>
                                                    <ul className="flex flex-col gap-1.5">
                                                        {service.servicesList.map((item, i) => (
                                                            <li key={i} className="text-white text-[11px] font-medium flex items-center gap-2">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-white/30" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="flex flex-col gap-4 items-end">
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tools</span>
                                                    <div className="flex gap-2">
                                                        {service.tools.slice(0, 4).map((tool, i) => (
                                                            <div key={i} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/5">
                                                                {tool[0]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* INACTIVE STATE CONTENT */
                                        <>
                                            <div className="text-7xl font-bold text-white/5 tracking-tighter">{service.number}</div>

                                            <div className="flex flex-col gap-2 relative z-10">
                                                <h3 className="text-2xl font-bold text-white pr-12">{service.title}</h3>
                                            </div>

                                            {/* Dotted Pattern Overlay (Bottom Right) */}
                                            <div className="absolute bottom-8 right-8 opacity-20">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div key={i} className="w-1 h-1 rounded-full bg-white/40" />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
