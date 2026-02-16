'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScroll({ children }) {
    // Sync Lenis with GSAP ScrollTrigger
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // This is optional if using lenis/react as it handles a lot of the boilerplate
        // but useful for custom GSAP logic.
        ScrollTrigger.refresh();
    }, []);

    return (
        <ReactLenis root options={{
            lerp: 0.08, // Snappier response
            duration: 1.2, // Balanced duration
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2.5, // Increased from 1.5 for faster swiping
            infinite: false,
        }}>
            {children}
        </ReactLenis>
    );
}
