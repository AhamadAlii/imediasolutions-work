'use client';

import React from 'react';
import Image from 'next/image';

const projects = [
    { id: '01', name: 'Clinix AI', tags: ['Web Design', 'App Design', 'AI Development', 'GTM'] },
    { id: '02', name: 'Synergies4', tags: ['App Design', 'AI Development'] },
    { id: '03', name: 'Curehire', tags: ['Web Design', 'Development'] },
    { id: '04', name: 'OWASP Foundation', tags: ['Web Design', 'Development'] },
    { id: '05', name: 'Feature', tags: ['App Design', 'GTM'] },
];

const CaseStudies = () => {
    return (
        <section className="bg-black py-32 px-12 md:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
                    <h2 className="text-5xl font-bold tracking-tighter text-white">Case Studies</h2>
                    <p className="max-w-[400px] text-gray-400 text-sm font-light leading-relaxed text-right">
                        Proven results, measurable impact—explore the transformations we've delivered.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* PROJECTS TABLE */}
                    <div className="flex flex-col border-t border-white/5">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group flex items-center justify-between py-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-12">
                                    <span className="text-xs font-medium text-gray-500 tracking-widest">{project.id}</span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                        {project.name}
                                    </h3>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-gray-400 font-medium whitespace-nowrap"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* MOCKUP PREVIEW - CSS BASED */}
                    <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#0A0B14] border border-white/5 shadow-2xl group/mockup">
                        {/* Dashboard Backdrop */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(58,61,145,0.15)_0%,transparent_50%)]" />

                        {/* Grid Lines */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Simulated UI Content */}
                        <div className="absolute inset-12 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                                    <div className="h-2 w-2 bg-indigo-500/40 rounded-full" />
                                    <div className="h-2 w-2 bg-indigo-500/20 rounded-full" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 h-full pt-4">
                                <div className="bg-white/[0.03] rounded-2xl border border-white/[0.05] p-6 flex flex-col gap-4">
                                    <div className="h-3 w-20 bg-white/10 rounded-full" />
                                    <div className="h-24 w-full bg-gradient-to-t from-indigo-500/20 to-transparent rounded-lg border-b border-indigo-500/30" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex-1 bg-white/[0.03] rounded-2xl border border-white/[0.05] p-6">
                                        <div className="h-3 w-12 bg-white/10 rounded-full mb-4" />
                                        <div className="flex gap-2 items-end h-12">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex-1 rounded-t-sm bg-indigo-400/40" style={{ height: `${20 + i * 15}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white/[0.03] rounded-2xl border border-white/[0.05] p-6">
                                        <div className="h-3 w-24 bg-white/10 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glass Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-1000" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;
