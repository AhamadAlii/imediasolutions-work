'use client';

import React from 'react';
import { Mail, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black pt-32 pb-12 px-12 md:px-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* BRAND */}
                    <div className="col-span-1 lg:col-span-1">
                        <h2 className="text-2xl font-bold tracking-tighter text-white mb-8">EYEMEDIA</h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                            Crafting high-fidelity digital experiences that bridge imagination and execution.
                        </p>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8">Contact</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm cursor-pointer">
                                <Mail className="w-4 h-4" />
                                hello@eyemedia.ai
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <MapPin className="w-4 h-4" />
                                Silicon Valley, CA
                            </li>
                        </ul>
                    </div>

                    {/* LINKS */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8">Navigation</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="text-gray-500 hover:text-white transition-colors text-sm cursor-pointer tracking-tight">Services</li>
                            <li className="text-gray-500 hover:text-white transition-colors text-sm cursor-pointer tracking-tight">Case Studies</li>
                            <li className="text-gray-500 hover:text-white transition-colors text-sm cursor-pointer tracking-tight">About Us</li>
                            <li className="text-gray-500 hover:text-white transition-colors text-sm cursor-pointer tracking-tight">Careers</li>
                        </ul>
                    </div>

                    {/* SOCIAL */}
                    <div>
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8">Social</h4>
                        <div className="flex gap-6">
                            <Instagram className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
                            <Twitter className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
                            <Linkedin className="w-5 h-5 text-gray-500 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 gap-6">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        © 2026 Eyemedia Studios. All rights reserved.
                    </p>
                    <div className="flex gap-12">
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest cursor-pointer hover:text-white">Privacy Policy</span>
                        <span className="text-[10px] text-gray-600 uppercase tracking-widest cursor-pointer hover:text-white">Terms of Use</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
