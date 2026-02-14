'use client';

import React from 'react';
import { Search, Atom } from 'lucide-react';

const Navbar = ({ hidden = false }) => {
    return (
        <nav className={`fixed top-0 w-full z-[200] border-b border-transparent bg-transparent transition-all duration-500 ${hidden ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center group-hover:rotate-[30deg] transition-transform duration-500">
                        <Atom className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold tracking-tighter text-lg bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">EYEMEDIA</span>
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex gap-12 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    <a href="#" className="hover:text-white transition-colors">Work</a>
                    <a href="#" className="hover:text-white transition-colors">Company</a>
                    <a href="#" className="hover:text-white transition-colors">Services</a>
                    <a href="#" className="hover:text-white transition-colors">Journal</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>

                {/* Actions */}
                <div className="flex gap-6 items-center">
                    <button className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="bg-white text-black text-[10px] font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        START YOUR PROJECT
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
