'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import ParticleScene from '@/components/ParticleScene';
import CaseStudies from '@/components/CaseStudies';
import BrandsMarquee from '@/components/BrandsMarquee';
import CTASection from '@/components/CTASection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeService, setActiveService] = useState('hero');
  const [hideNavbar, setHideNavbar] = useState(false);
  const [heroHidden, setHeroHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroContentRef = useRef(null);
  const particleShiftRef = useRef({ x: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!heroContentRef.current) return;
    const animations = [];
    const triggers = [];

    // 1. Hero Content Fade & Scale
    animations.push(gsap.to(heroContentRef.current, {
      opacity: 0,
      y: -150,
      scale: 0.9,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#services-trigger',
        start: 'top bottom',
        end: 'top center',
        scrub: true,
        onEnter: () => setHeroHidden(false),
        onLeave: () => setHeroHidden(true),
        onEnterBack: () => {
          setHeroHidden(false);
          setActiveService('hero');
        },
      }
    }));

    // 2. Particle Shift Animation (Move to left stage as we approach Services)
    animations.push(gsap.to(particleShiftRef.current, {
      x: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#services-trigger',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      }
    }));

    // 3. Hero Reset Logic
    triggers.push(ScrollTrigger.create({
      trigger: '#services-trigger',
      start: 'top 20%',
      onEnterBack: () => {
        setActiveService('hero');
        particleShiftRef.current.x = 0;
      },
    }));

    // 4. Robust Section Top Fallback
    triggers.push(ScrollTrigger.create({
      trigger: '#services-section',
      start: 'top bottom',
      onEnter: () => setActiveService('video'),
      onEnterBack: () => setActiveService('video'),
    }));

    // 4b. Hide navbar only while services section is in view.
    triggers.push(ScrollTrigger.create({
      trigger: '#services-section',
      start: 'top top',
      end: 'bottom top',
      onEnter: () => setHideNavbar(true),
      onLeave: () => setHideNavbar(false),
      onEnterBack: () => setHideNavbar(true),
      onLeaveBack: () => setHideNavbar(false),
    }));

    // 5. Global Top Reset
    triggers.push(ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      onEnterBack: () => {
        setActiveService('hero');
        particleShiftRef.current.x = 0;
      }
    }));

    return () => {
      animations.forEach((animation) => animation.kill());
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  // CLIP PATH LOGIC:
  // Desktop: Top 10% is header. Left 40% starts at 10% height -> inset(10% 60% 0 0)
  // Mobile/Tab: 0-15% title, 15-50% shape, 50-100% cards.
  // Shape zone is 15% to 50% -> inset(15% 0 50% 0)
  let currentClipPath = 'inset(0 0 0 0)';
  if (activeService !== 'hero') {
    currentClipPath = isMobile ? 'inset(15% 0 50% 0)' : 'inset(10% 60% 0 0)';
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar hidden={hideNavbar} />

      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-700 ${activeService === 'hero' ? 'z-10' : 'z-[110]'}`}
        style={{
          clipPath: currentClipPath
        }}
      >
        <ParticleScene activeService={activeService} particleShift={particleShiftRef} isMobile={isMobile} />
      </div>

      {/* Hero Section */}
      <section
        className={`relative z-[60] flex min-h-screen items-center px-6 pt-20 transition-all duration-1000 ease-in-out ${heroHidden ? 'pointer-events-none opacity-0 invisible' : 'opacity-100'}`}
      >
        <div ref={heroContentRef} className="w-full max-w-7xl mx-auto">
          <div className="max-w-[640px]">
            <h1
              className="luxe-display mb-8 mt-6 md:mt-16 font-semibold tracking-tight text-white leading-[1.1] md:leading-[0.92]"
              style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <span className="flex flex-col md:block">
                <span className="text-[48px] sm:text-7xl md:text-8xl lg:text-9xl hero-eye-word">EYE</span>{' '}
                <span className="text-[48px] sm:text-7xl md:text-8xl lg:text-9xl hero-media-word text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 italic">MEDIA</span>
              </span>
            </h1>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/12 text-indigo-200 text-[9px] sm:text-[10px] font-medium tracking-[0.18em] uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Innovation Driven Studio
            </div>

            <p
              className="max-w-[620px] text-gray-200/95 text-base sm:text-lg md:text-xl font-normal mb-10 md:mb-12 leading-relaxed"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
            >
              Eyemedia crafts high-fidelity digital experiences that bridge the gap between imagination and execution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center md:justify-start">
              <button className="luxe-button luxe-button-primary py-4 md:py-5 px-8 md:px-10 text-[10px] md:text-[11px]">
                START A PROJECT
              </button>
              <button className="luxe-button luxe-button-outline py-4 md:py-5 px-8 md:px-10 text-[10px] md:text-[11px]">
                OUR SERVICES
              </button>
            </div>
          </div>
        </div>
      </section>

      <div id="services-trigger" className="h-[30vh]" />

      {/* Services Section */}
      <div id="services-section" className="relative z-[70]">
        <ServicesSection onServiceChange={setActiveService} activeId={activeService} />
      </div>

      {/* NEW SECTIONS CONTENT */}
      <div className="relative z-[120] bg-black">
        <CaseStudies />
        <BrandsMarquee />
        <CTASection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
