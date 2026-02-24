"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Scale } from "lucide-react";

export default function DMCAPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-24 px-6 relative overflow-hidden">
            {/* Neural Background FX */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-magenta/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Navigation Hub */}
                <Link href="/#hero" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon-magenta hover:text-black hover:border-neon-magenta transition-all active:scale-95 shadow-2xl">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Neural Return
                </Link>

                {/* Tactical Header */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-neon-magenta/10 border border-neon-magenta/20 rounded-2xl shadow-[0_0_30px_rgba(255,45,85,0.1)]">
                            <Scale size={32} className="text-neon-magenta" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-magenta">Legal Protocol</span>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Version 3.0.1 • Nexus Certified</p>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        DMCA <span className="text-neon-magenta">Request</span>
                    </h1>
                </div>

                {/* Signal Content Matrix */}
                <div className="space-y-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-magenta to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Signal Origin Protection</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            VIEWPOINT functions as a high-fidelity bridge for third-party transmissions. As an automated conduit, we do not host or originate signals locally. If you believe your copyrighted signal is being proxied through our matrix without authorization, please initiate a formal reporting fragment.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Transmission Report Specs</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Unique Signal ID (URI/Channel)",
                                "Verification of Neural Ownership",
                                "Active Matrix Communication Node",
                                "Good-faith Declaration of Protocol"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-neon-cyan/30 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-neon-cyan/40 group-hover:bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-purple to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Legal Node Transmit</h2>
                        </div>
                        <div className="p-8 bg-black/40 border border-white/10 rounded-3xl group hover:border-neon-magenta/30 transition-all">
                            <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest mb-4">
                                Direct all verified neural takedown payloads to our legal synchronization node:
                            </p>
                            <a href="mailto:viewpointlivetv@gmail.com" className="text-xl md:text-3xl font-black text-white hover:text-neon-magenta transition-colors italic tracking-tight font-mono">
                                viewpointlivetv@gmail.com
                            </a>
                            <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Response Window: 24-48 Neural Cycles</p>
                        </div>
                    </section>
                </div>

                {/* Institutional Bottom Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-white/5">
                    {[
                        ["Privacy Shield", "/privacy"],
                        ["Entry Terms", "/terms"],
                        ["DMCA Protocol", "/dmca"],
                        ["Transmission Meta", "/disclaimer"]
                    ].map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-[9px] font-black uppercase tracking-[0.3em] py-4 px-6 rounded-xl border transition-all text-center
                                ${href === "/dmca" ? "bg-neon-magenta/10 border-neon-magenta/30 text-neon-magenta shadow-[0_0_20px_rgba(255,45,85,0.1)]" : "border-white/5 text-white/30 hover:text-white hover:border-white/20"}
                            `}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Universal Sync Seal */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 opacity-20 hover:opacity-100 transition-opacity duration-1000">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white">© 2026 Viewpoint Neural Nexus</span>
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-slate-500 italic">All signals monitored and processed by M-CORE Intelligence</span>
                    </div>
                    <Zap size={24} className="text-neon-magenta animate-pulse" />
                </div>
            </div>
        </div>
    );
}

