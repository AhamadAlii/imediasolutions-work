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

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl transition-all duration-500 ease-luxe ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link, i) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-3xl font-bold tracking-tighter hover:text-blue-500 transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                            style={{ transitionDelay: `${i * 50}ms` }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className={`mt-8 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                        <button className="luxe-button luxe-button-primary px-12 py-5" onClick={() => setIsMenuOpen(false)}>
                            LET'S TALK
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
