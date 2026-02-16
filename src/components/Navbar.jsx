import React, { useState } from 'react';
import { Search, Atom, Menu, X } from 'lucide-react';

const Navbar = ({ hidden = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Work', href: '#' },
        { name: 'Company', href: '#' },
        { name: 'Services', href: '#' },
        { name: 'Journal', href: '#' },
        { name: 'Contact', href: '#' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-[200] transition-all duration-500 ${hidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <div className="max-w-7xl mx-auto mt-3 px-4 sm:px-6">
                <div className="h-20 flex justify-between items-center px-4 sm:px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group z-[210]">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center group-hover:rotate-[18deg] transition-transform duration-500">
                            <Atom className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold tracking-tight text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent uppercase">EYEMEDIA</span>
                    </div>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex gap-10 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.22em]">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="hover:text-white transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 sm:gap-6 items-center z-[210]">
                        <button className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:block">
                            <button className="luxe-button luxe-button-primary h-10 px-8">
                                LET'S TALK
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="flex md:hidden w-10 h-10 items-center justify-center text-white/70 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu — Slide-down Panel */}
            <div
                className={`md:hidden absolute top-full left-4 right-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-2xl shadow-black/50 transition-all duration-400 ease-out z-[220] overflow-hidden ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            >
                <div className="flex flex-col py-3">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 ${i < navLinks.length - 1 ? 'border-b border-white/5' : ''} ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                            style={{ transitionDelay: isMenuOpen ? `${i * 40}ms` : '0ms' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div
                        className={`px-6 pt-3 pb-1 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                        style={{ transitionDelay: isMenuOpen ? '200ms' : '0ms' }}
                    >
                        <button className="luxe-button luxe-button-primary w-full py-3 text-xs" onClick={() => setIsMenuOpen(false)}>
                            LET'S TALK
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
