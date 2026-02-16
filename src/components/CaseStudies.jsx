'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const projects = [
    { id: '01', name: 'Clinix AI', tags: ['Web Design', 'App Design', 'AI Development', 'GTM'], image: '/cases/1.jpeg' },
    { id: '02', name: 'Synergies4', tags: ['App Design', 'AI Development'], image: '/cases/2.jpeg' },
    { id: '03', name: 'Curehire', tags: ['Web Design', 'Development'], image: '/cases/3.jpeg' },
    { id: '04', name: 'OWASP Foundation', tags: ['Web Design', 'Development'], image: '/cases/4.jpeg' },
    { id: '05', name: 'Feature', tags: ['App Design', 'GTM'], image: '/cases/5.jpeg' },
];

/* ── Small sub-component for the mobile 3D inline card ─────────── */
const MobileInlineCard = ({ project, isExpanded }) => {
    const mobileCardRef = useRef(null);
    const mobileTitleRef = useRef(null);

    useEffect(() => {
        if (!isExpanded || !mobileCardRef.current) return;

        // Entrance: tilt in with the same 3D pop as desktop
        gsap.fromTo(mobileCardRef.current,
            { rotateX: 15, rotateY: -8, z: -30, opacity: 0, scale: 0.92 },
            { rotateX: 8, rotateY: -6, z: 20, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
        );
        if (mobileTitleRef.current) {
            gsap.fromTo(mobileTitleRef.current,
                { z: 0, opacity: 0 },
                { z: 50, opacity: 1, duration: 0.6, delay: 0.1, ease: 'expo.out' }
            );
        }
    }, [isExpanded]);

    return (
        <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[350px] opacity-100 pb-8 px-4' : 'max-h-0 opacity-0'}`}
        >
            <div className="case-3d-container" style={{ perspective: '1000px', height: 'auto' }}>
                <div
                    ref={mobileCardRef}
                    className="case-3d-card shadow-2xl"
                    style={{ aspectRatio: '16/9', borderRadius: '16px', transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-2xl" />
                    <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover rounded-2xl"
                    />
                    <div
                        ref={mobileTitleRef}
                        className="absolute bottom-4 left-4 z-20 text-white font-bold text-lg tracking-tight opacity-0"
                        style={{ transform: 'translateZ(0px)', textShadow: '0 6px 20px rgba(0,0,0,0.5)' }}
                    >
                        {project.name}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CaseStudies = () => {
    const [activeProject, setActiveProject] = useState(projects[0]);
    const [isRowHovered, setIsRowHovered] = useState(false);
    const [mobileExpandedId, setMobileExpandedId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const imageRef = useRef(null);
    const cardRef = useRef(null);
    const titleOverlayRef = useRef(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleRowClick = useCallback((project) => {
        if (isMobile) {
            // Toggle: tap same row again to collapse
            setMobileExpandedId(prev => prev === project.id ? null : project.id);
        }
        setActiveProject(project);
        // For mobile, we don't use isRowHovered for the desktop effect,
        // but setting activeProject is still useful for styling the row.
        // For desktop, this will still trigger the hover effect.
        setIsRowHovered(true);
    }, [isMobile]);

    // Desktop: Swap Animation (Image Fade/Scale)
    useEffect(() => {
        if (!isMobile && imageRef.current) {
            gsap.fromTo(imageRef.current,
                { opacity: 0, scale: 1.1, y: 15 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }

        // Re-trigger 3D Tilt and Pop-out on Project Change (if hovered)
        if (!isMobile && isRowHovered && cardRef.current && titleOverlayRef.current) {
            gsap.to(cardRef.current, {
                rotateX: 10,
                rotateY: -10,
                z: 20,
                duration: 0.6,
                ease: 'expo.out'
            });
            gsap.to(titleOverlayRef.current, {
                z: 60,
                opacity: 1,
                duration: 0.6,
                ease: 'expo.out'
            });
        }
    }, [activeProject, isRowHovered, isMobile]);

    // Desktop: Reset when not hovering anymore
    useEffect(() => {
        if (!isMobile && !isRowHovered && cardRef.current && titleOverlayRef.current) {
            gsap.to(cardRef.current, {
                rotateX: 0,
                rotateY: 0,
                z: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            });
            gsap.to(titleOverlayRef.current, {
                z: 0,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            });
        }
    }, [isRowHovered, isMobile]);

    return (
        <section className="bg-black py-32 px-12 md:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
                    <h2 className="luxe-heading text-6xl font-semibold tracking-tight text-white">Case Studies</h2>
                    <p className="max-w-[400px] text-gray-400 text-sm font-light leading-relaxed text-right">
                        Proven results, measurable impact—explore the transformations we've delivered.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* PROJECTS TABLE */}
                    <div
                        className="flex flex-col border-t border-white/5"
                        onMouseLeave={() => !isMobile && setIsRowHovered(false)} // Only reset hover state on desktop
                    >
                        {projects.map((project) => {
                            const isActive = activeProject.id === project.id;
                            const isMobileExpanded = mobileExpandedId === project.id;
                            return (
                                <div
                                    key={project.id}
                                    onClick={() => handleRowClick(project)}
                                    onMouseEnter={() => {
                                        // Only trigger hover effect on desktop
                                        if (!isMobile) {
                                            setActiveProject(project);
                                            setIsRowHovered(true);
                                        }
                                    }}
                                    className={`group flex flex-col border-b border-white/5 transition-all duration-300 cursor-pointer ${isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                                >
                                    <div className="flex items-center justify-between py-8 px-4">
                                        <div className="flex items-center gap-12">
                                            <span className={`text-xs font-medium tracking-widest transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>{project.id}</span>
                                            <h3 className={`text-xl font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                {project.name}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2 flex-wrap justify-end">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className={`px-4 py-1.5 rounded-full border transition-all duration-300 text-[10px] font-medium whitespace-nowrap ${isActive ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' : 'border-white/10 bg-white/5 text-gray-400'}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* MOBILE INLINE 3D IMAGE PREVIEW — directly below this row */}
                                    <MobileInlineCard project={project} isExpanded={isMobileExpanded} />
                                </div>
                            );
                        })}
                    </div>

                    {/* PROJECT PREVIEW - 3D CARD (DESKTOP ONLY) */}
                    {!isMobile && (
                        <div className="case-3d-container aspect-[4/3] w-full">
                            <div ref={cardRef} className="case-3d-card shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <div ref={imageRef} className="w-full h-full">
                                    <Image
                                        src={activeProject.image}
                                        alt={activeProject.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div ref={titleOverlayRef} className="card_title_overlay z-20">
                                    {activeProject.name}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;
