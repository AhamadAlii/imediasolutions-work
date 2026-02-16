'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, Rocket, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

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

    // Dynamic values for responsiveness
    // On Desktop: Shape is left 40%, Cards are right 60%
    // On Mobile/Tab: Shape is top 40%, Cards are bottom 60%
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const totalCards = services.length;
            const triggerEl = triggerRef.current;
            const sectionEl = sectionRef.current;
            if (!triggerEl || !sectionEl) return;

            gsap.to(sectionEl, {
                x: () => {
                    const track = sectionEl;
                    const cards = cardsRef.current;
                    if (!track || !cards[0]) return 0;
                    const lastCard = cards[cards.length - 1];
                    // Calculate the total horizontal distance between first and last card
                    return -(lastCard.offsetLeft - cards[0].offsetLeft);
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (totalCards - 1) * (isMobile ? 0.8 : 1.1)}`,
                    scrub: isMobile ? 0.6 : 1.2, // Smoother interpolation (seconds of lag)
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    snap: {
                        snapTo: 1 / (totalCards - 1),
                        duration: { min: 0.4, max: 0.9 }, // Slightly slower snapping
                        delay: 0.05, // Tiny delay before snap kicks in
                        ease: 'power2.out', // Smoother arrival
                    },
                    onUpdate: (self) => {
                        const index = Math.min(Math.round(self.progress * (totalCards - 1)), totalCards - 1);
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
        }, triggerRef);

        return () => ctx.revert();
    }, [onServiceChange, isMobile]);

    // Layout Constants
    const leftPaneWidth = isMobile ? '100%' : '40vw';
    const horizontalGutter = isMobile ? '2rem' : 'clamp(1rem, 5vw, 2.5rem)';

    return (
        <section ref={triggerRef} className="relative bg-black overflow-hidden h-screen flex flex-col">

            {/* TOP HEADER ZONE (Full Width on Desktop, 15% on Mobile) */}
            <div
                className={`relative z-[110] flex items-center justify-center border-b border-white/5 bg-black transition-all duration-700`}
                style={{ height: isMobile ? '15vh' : '10vh' }}
            >
                <div className="flex flex-col items-center">
                    <h2 className="luxe-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-none">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Services</span>
                    </h2>
                </div>
            </div>

            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} flex-1 relative overflow-hidden`}>

                {/* SHAPE ZONE (40% Width on Desktop, 35% Height on Mobile) */}
                <div
                    className={`relative z-[100] border-white/5 ${isMobile ? 'h-[35vh] w-full border-b bg-transparent shadow-none' : 'h-full border-r bg-black shadow-[30px_0_120px_rgba(0,0,0,1)]'}`}
                    style={{
                        width: isMobile ? '100%' : leftPaneWidth,
                    }}
                >
                    {/* The 3D Shape from page.js will be rendered via dynamic mask logic behind this zone */}
                    {!isMobile && (
                        <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none opacity-20">
                            <h2 className="luxe-display text-8xl font-black text-white/5 rotate-[-90deg] whitespace-nowrap">CREATIVE</h2>
                        </div>
                    )}
                </div>

                {/* CARDS ZONE (60% Weight on Desktop, 50% Height on Mobile) */}
                <div className={`relative flex items-center overflow-hidden ${isMobile ? 'h-[50vh] w-full' : 'h-full flex-1'}`}>

                    {/* FIXED BACKGROUND TEXT (only on desktop) */}
                    {!isMobile && (
                        <div
                            className="absolute top-[5vh] z-[10] flex justify-center items-center w-full opacity-5 pointer-events-none"
                        >
                            <h2 className="luxe-display text-[15vw] font-bold tracking-tighter text-white uppercase italic whitespace-nowrap">IMEDIA SOLUTIONS</h2>
                        </div>
                    )}

                    {/* THE TRACK */}
                    <div
                        ref={sectionRef}
                        className="flex flex-nowrap h-full items-center z-[70] services-track"
                        style={{
                            paddingLeft: horizontalGutter,
                            paddingRight: '60vw', // Room for last card
                            willChange: 'transform'
                        }}
                    >
                        {services.map((service, index) => {
                            const isActive = activeId === service.id;
                            return (
                                <div
                                    key={service.id}
                                    ref={el => cardsRef.current[index] = el}
                                    className={`service-parent shrink-0 transition-all duration-500 mr-8 md:mr-16 ${isActive ? 'scale-105 opacity-100 z-50' : 'scale-[0.9] opacity-40 z-10'}`}
                                    style={{
                                        width: isMobile ? 'min(80vw, 300px)' : 'min(28vw, 340px)',
                                        height: isMobile ? 'min(40vh, 320px)' : 'min(62vh, 460px)',
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden'
                                    }}
                                >
                                    <div className={`service-card-3d ${isActive ? 'active' : ''}`}>
                                        <div className="service-logo">
                                            <span className="circle circle1"></span>
                                            <span className="circle circle2"></span>
                                            <span className="circle circle3"></span>
                                            <span className="circle circle4"></span>
                                            <span className="circle circle5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" className="svg">
                                                    <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" transform="translate(0 0)"></path>
                                                    <path d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)"></path>
                                                    <path d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="service-glass"></div>
                                        <div className="service-content">
                                            <span className="title uppercase tracking-tight text-xs sm:text-sm">{service.title}</span>
                                            <span className="text text-[10px] sm:text-xs line-clamp-2">{service.desc}</span>
                                        </div>
                                        <div className="service-bottom">
                                            <div className="mt-4">
                                                <button className="luxe-button luxe-button-outline w-full py-2 text-[9px] tracking-[0.2em]">
                                                    VIEW MORE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
