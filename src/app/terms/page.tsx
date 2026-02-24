"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-24 px-6 relative overflow-hidden">
            {/* Neural Background FX */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neon-magenta/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Navigation Hub */}
                <Link href="/#hero" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all active:scale-95 shadow-2xl">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Neural Return
                </Link>

                {/* Tactical Header */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                            <FileText size={32} className="text-neon-cyan" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-cyan">Entry Protocol</span>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Version 3.0.1 • Nexus Integration Standards</p>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        Terms of <span className="text-neon-cyan">Nexus</span>
                    </h1>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Signal Access Rights</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            By initiating a neural handshake with the VIEWPOINT matrix, you agree to abide by our transmission standards. Access to live signals is provided for personal, non-commercial use only. Rebroadcasting or unauthorized multiplexing of our streams is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-purple to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural ID Security</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            Every node operator is responsible for their own Signal ID. VIEWPOINT operates on zero-knowledge architecture; we do not store private handshake keys. You are solely responsible for all activity occurring under your neural footprint.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Intellectual Matrix</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            All interface fragments, neural animations, and proprietary post-processing algorithms remain the exclusive property of VIEWPOINT Systems. This document grants a temporary license for signal consumption, not a transfer of ownership.
                        </p>
                    </section>

                    <section className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">AdSense Synchronization</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest font-medium opacity-80">
                            The platform integrates Google Neural AdSense to sustain its high-bandwidth edge mesh. By utilizing our services, you consent to non-intrusive metadata analysis required for monetization synchronization.
                        </p>
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
                                ${href === "/terms" ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.1)]" : "border-white/5 text-white/30 hover:text-white hover:border-white/20"}
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
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-slate-500 italic">Global Terms of Entry Synchronized</span>
                    </div>
                    <ShieldCheck size={24} className="text-neon-cyan animate-pulse" />
                </div>
            </div>
        </div>
    );
}

