"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Navigation */}
                <Link href="/#hero" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all mb-10">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-neon-cyan">
                        <FileText size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Protocol Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Entry Terms</h1>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest leading-loose">
                        Version 2.0.4 • Optimized for Global Signal Integrity
                    </p>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 glass border border-white/5 rounded-[3rem] p-10 md:p-16 bg-white/5">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-cyan/30" /> 01. Signal Access
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            By initiating a neural handshake with the VIEWPOINT platform, you agree to abide by our transmission standards. Access to live signals is provided for personal, non-commercial use only. Any attempt to rebroadcast or multiplex our encrypted streams without explicit verification is a violation of protocol.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-cyan/30" /> 02. Neural ID & Verification
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Users are responsible for maintaining the security of their local handshake nodes. VIEWPOINT operates on a zero-knowledge architecture, meaning we do not store your private transmission keys. You are solely responsible for all activity occurring under your Signal ID.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-cyan/30" /> 03. Intellectual Property
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            All interface elements, neural pulse animations, and proprietary post-processing algorithms are the exclusive property of VIEWPOINT Neural Systems. This documentation serves as a temporary license for signal consumption, not an transfer of technology ownership.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-cyan/30" /> 04. Data Usage & AdSense
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            The platform integrates Google Neural AdSense to sustain its high-bandwidth edge mesh. By using this service, you consent to non-intrusive metadata analysis required for atmospheric monetization. We prioritize signal speed over all secondary processes.
                        </p>
                    </section>
                </div>

                {/* Institutional Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/5">
                    <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-neon-cyan py-2">Entry Terms</Link>
                    <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-purple transition-colors py-2">Privacy Shield</Link>
                    <Link href="/dmca" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-magenta transition-colors py-2">DMCA Request</Link>
                    <Link href="/disclaimer" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-500 transition-colors py-2">Legal Disclaimer</Link>
                </div>

                {/* Footer Seal */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Viewpoint Neural Systems • All Terms Encrypted</span>
                    <ShieldCheck size={20} className="text-neon-cyan" />
                </div>
            </div>
        </div>
    );
}
