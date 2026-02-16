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

/* ─── Shared card UI ─── */
const ServiceCard = React.forwardRef(({ service, isActive, isMobile, onViewMore }, ref) => (
    <div
        ref={ref}
        className={`service-parent shrink-0 transition-all duration-500 ${isMobile
            ? `${isActive ? 'scale-100 opacity-100 z-50' : 'scale-[0.92] opacity-40 z-10'}`
            : `mr-16 ${isActive ? 'scale-105 opacity-100 z-50' : 'scale-[0.9] opacity-40 z-10'}`
            }`}
        style={{
            width: isMobile ? '85vw' : 'min(28vw, 340px)',
            height: isMobile ? 'min(48vw, 220px)' : 'min(62vh, 460px)',
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
                {!isMobile && <span className="text text-[10px] sm:text-xs line-clamp-2">{service.desc}</span>}
            </div>
            <div className="service-bottom">
                <div className="mt-4 w-full">
                    <button
                        className="luxe-button luxe-button-outline w-full py-2 text-[9px] tracking-[0.2em]"
                        onClick={onViewMore ? () => onViewMore(service.id) : undefined}
                    >
                        VIEW MORE
                    </button>
                </div>
            </div>
        </div>
    </div>
));
ServiceCard.displayName = 'ServiceCard';

/* ─── MOBILE: vertical GSAP scroll (mirror of desktop horizontal) ─── */
const MobileServices = ({ onServiceChange, activeId }) => {
    const sectionRef = useRef(null);       // the vertical card track
    const triggerRef = useRef(null);        // the pinned wrapper
    const cardsRef = useRef([]);
    const lastActiveRef = useRef(activeId);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const totalCards = services.length;
            const triggerEl = triggerRef.current;
            const sectionEl = sectionRef.current;
            if (!triggerEl || !sectionEl) return;

            const container = sectionEl.parentElement;

            // Vertically scroll the card track upward
            gsap.to(sectionEl, {
                y: () => {
                    if (!container || !sectionEl) return 0;
                    const scrollDist = sectionEl.scrollHeight - container.clientHeight;
                    return -scrollDist;
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (totalCards - 1) * 0.75}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                    preventOverlapping: true,
                    onUpdate: () => {
                        const scrollY = -gsap.getProperty(sectionEl, 'y');
                        const cards = cardsRef.current;
                        // Active point: 30% into the visible card container
                        const activePoint = scrollY + (container ? container.clientHeight * 0.3 : 0);
                        let closestIndex = 0;
                        let minDist = Infinity;
                        for (let i = 0; i < cards.length; i++) {
                            if (!cards[i]) continue;
                            const cardCenter = cards[i].offsetTop + cards[i].offsetHeight / 2;
                            const dist = Math.abs(cardCenter - activePoint);
                            if (dist < minDist) {
                                minDist = dist;
                                closestIndex = i;
                            }
                        }
                        const currentId = services[closestIndex].id;
                        if (currentId !== lastActiveRef.current) {
                            lastActiveRef.current = currentId;
                            onServiceChange(currentId);
                        }
                    },
                    onEnter: () => onServiceChange(services[0].id),
                    onLeave: () => onServiceChange(services[totalCards - 1].id),
                    onLeaveBack: () => onServiceChange('hero'),
                },
            });
        }, triggerRef);

        return () => ctx.revert();
    }, [onServiceChange]);

    return (
        <section ref={triggerRef} className="relative bg-black overflow-hidden h-screen flex flex-col">
            {/* ─── Header ─── */}
            <div
                className="relative z-[110] flex items-center justify-center border-b border-white/5 bg-black transition-all duration-700"
                style={{ height: '8vh' }}
            >
                <h2 className="luxe-display text-2xl font-bold tracking-tight text-white uppercase leading-none">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Services</span>
                </h2>
            </div>

            {/* ─── Two-row layout: top 40% particles, bottom 60% cards ─── */}
            <div className="flex flex-col flex-1 relative overflow-hidden">
                {/* Top 40%: particle shape area */}
                <div
                    className="relative z-[100] w-full border-b border-white/5 bg-black shadow-[0_30px_120px_rgba(0,0,0,1)]"
                    style={{ height: '38%' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none opacity-10">
                        <h2 className="luxe-display text-5xl font-black text-white/5 whitespace-nowrap">CREATIVE</h2>
                    </div>
                </div>

                {/* Bottom 60%: vertically scrolling card track */}
                <div className="relative flex justify-center overflow-hidden flex-1">
                    <div
                        ref={sectionRef}
                        className="flex flex-col items-center z-[70] services-track"
                        style={{
                            paddingTop: 'clamp(1rem, 4vh, 2rem)',
                            paddingBottom: '60vh',
                            willChange: 'transform',
                            gap: '3rem',
                        }}
                    >
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                ref={el => cardsRef.current[index] = el}
                                service={service}
                                isActive={activeId === service.id}
                                isMobile={true}
                                onViewMore={(id) => window.location.href = `/services/${id}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ─── DESKTOP: horizontal GSAP scroll ─── */
const DesktopServices = ({ onServiceChange, activeId }) => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const cardsRef = useRef([]);
    const lastActiveRef = useRef(activeId);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const totalCards = services.length;
            const triggerEl = triggerRef.current;
            const sectionEl = sectionRef.current;
            if (!triggerEl || !sectionEl) return;

            const container = sectionEl.parentElement;

            gsap.to(sectionEl, {
                x: () => {
                    if (!container || !sectionEl) return 0;
                    const scrollDist = sectionEl.scrollWidth - container.clientWidth;
                    return -scrollDist;
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (totalCards - 1) * 0.75}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                    preventOverlapping: true,
                    onUpdate: () => {
                        const scrollX = -gsap.getProperty(sectionEl, 'x');
                        const cards = cardsRef.current;
                        const activePoint = scrollX + (container ? container.clientWidth * 0.3 : 0);
                        let closestIndex = 0;
                        let minDist = Infinity;
                        for (let i = 0; i < cards.length; i++) {
                            if (!cards[i]) continue;
                            const cardCenter = cards[i].offsetLeft + cards[i].offsetWidth / 2;
                            const dist = Math.abs(cardCenter - activePoint);
                            if (dist < minDist) {
                                minDist = dist;
                                closestIndex = i;
                            }
                        }
                        const currentId = services[closestIndex].id;
                        if (currentId !== lastActiveRef.current) {
                            lastActiveRef.current = currentId;
                            onServiceChange(currentId);
                        }
                    },
                    onEnter: () => onServiceChange(services[0].id),
                    onLeave: () => onServiceChange(services[totalCards - 1].id),
                    onLeaveBack: () => onServiceChange('hero'),
                },
            });
        }, triggerRef);

        return () => ctx.revert();
    }, [onServiceChange]);

    return (
        <section ref={triggerRef} className="relative bg-black overflow-hidden h-screen flex flex-col">
            <div
                className="relative z-[110] flex items-center justify-center border-b border-white/5 bg-black transition-all duration-700"
                style={{ height: '10vh' }}
            >
                <h2 className="luxe-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-none">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Services</span>
                </h2>
            </div>

            <div className="flex flex-row flex-1 relative overflow-hidden">
                <div
                    className="relative z-[100] h-full border-r border-white/5 bg-black shadow-[30px_0_120px_rgba(0,0,0,1)]"
                    style={{ width: '40vw' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none opacity-20">
                        <h2 className="luxe-display text-8xl font-black text-white/5 rotate-[-90deg] whitespace-nowrap">CREATIVE</h2>
                    </div>
                </div>

                <div className="relative flex items-center overflow-hidden h-full flex-1">
                    <div className="absolute top-[5vh] z-[10] flex justify-center items-center w-full opacity-5 pointer-events-none">
                        <h2 className="luxe-display text-[15vw] font-bold tracking-tighter text-white uppercase italic whitespace-nowrap">IMEDIA SOLUTIONS</h2>
                    </div>

                    <div
                        ref={sectionRef}
                        className="flex flex-nowrap h-full items-center z-[70] services-track"
                        style={{
                            paddingLeft: 'clamp(1rem, 5vw, 2.5rem)',
                            paddingRight: '60vw',
                            willChange: 'transform'
                        }}
                    >
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                ref={el => cardsRef.current[index] = el}
                                service={service}
                                isActive={activeId === service.id}
                                isMobile={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ─── Wrapper: picks layout based on viewport ─── */
const ServicesSection = ({ onServiceChange, activeId }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 1024);
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) {
        return (
            <section className="relative bg-black overflow-hidden h-screen flex items-center justify-center">
                <h2 className="luxe-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-none">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Services</span>
                </h2>
            </section>
        );
    }

    return isMobile
        ? <MobileServices onServiceChange={onServiceChange} activeId={activeId} />
        : <DesktopServices onServiceChange={onServiceChange} activeId={activeId} />;
};

export default ServicesSection;
