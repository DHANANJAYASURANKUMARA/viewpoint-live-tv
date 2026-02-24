"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Scale } from "lucide-react";

export default function DMCAPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Navigation */}
                <Link href="/#hero" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all mb-10">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-neon-magenta">
                        <Scale size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Legal Compliance</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">DMCA Request</h1>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest leading-loose">
                        Version 2.0.4 • International Signal Law Compliant
                    </p>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 glass border border-white/5 rounded-[3rem] p-10 md:p-16 bg-white/5">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-magenta/30" /> 01. Copyright Protocol
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            VIEWPOINT respects the rights of signal originators. We act as a conduit for public and third-party transmissions. If you believe your copyrighted content is being multiplexed via our platform without authorization, please initiate a formal reporting signal.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-magenta/30" /> 02. Report Requirements
                        </h2>
                        <p className="text-[10px] leading-relaxed text-slate-400 uppercase tracking-[2px] space-y-2">
                            Full Signal ID of the infringing content.<br />
                            Evidence of ownership or neural authorization.<br />
                            Contact frequency (Email address) for follow-up.<br />
                            A statement of good-faith belief in the infringement.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-magenta/30" /> 03. Agent Transmission
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Direct all neural takedown requests to our designated legal node: <span className="text-neon-magenta">copyright@viewpoint.tv</span>. We prioritize the removal of verified infringing signals within 48 neural cycles (hours).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-magenta/30" /> 04. Counter-Signals
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Transmission operators whose signals have been purged may file a counter-report if they possess a valid broadcast license or authorization for the content in question.
                        </p>
                    </section>
                </div>

                {/* Institutional Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/5">
                    <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-cyan transition-colors py-2">Entry Terms</Link>
                    <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-purple transition-colors py-2">Privacy Shield</Link>
                    <Link href="/dmca" className="text-[10px] font-black uppercase tracking-widest text-neon-magenta py-2">DMCA Request</Link>
                    <Link href="/disclaimer" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-500 transition-colors py-2">Legal Disclaimer</Link>
                </div>

                {/* Footer Seal */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Viewpoint Neural Systems • All Reports Synchronized</span>
                    <Zap size={20} className="text-neon-magenta" />
                </div>
            </div>
        </div>
    );
}
