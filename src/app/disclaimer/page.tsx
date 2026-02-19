"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Activity } from "lucide-react";

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Navigation */}
                <Link href="/#hero" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all mb-10">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-emerald-500">
                        <AlertCircle size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Signal Caution</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Legal Disclaimer</h1>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest leading-loose">
                        Version 2.0.4 • Signal Integrity Non-Liability
                    </p>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 glass border border-white/5 rounded-[3rem] p-10 md:p-16 bg-white/5">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-emerald-500/30" /> 01. No Transmission Warranties
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            The signals provided via VIEWPOINT are transmitted "as is" and "as available". We make no warranties, expressed or implied, regarding the stability, quality, or continuous availability of any third-party broadcast feed. Expect atmospheric interference during neural peak times.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-emerald-500/30" /> 02. Content Responsibility
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            VIEWPOINT is an interface layer, not a content originator. We do not endorse, censor, or take responsibility for the accuracy or nature of the information transmitted via our global signal HUD. Viewers consume signals at their own neural risk.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-emerald-500/30" /> 03. Limitation of Liability
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            In no event shall VIEWPOINT Neural Systems or its signal engineers be liable for any direct, indirect, or atmospheric damages arising from the use of our platform or the sudden termination of any live broadcast feed.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-emerald-500/30" /> 04. Third-Party Links
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Our dashboard may contain links to external signal sources. We have no control over the privacy protocols or transmission integrity of these third-party domains. Accessing external frequencies is done at your own discretion.
                        </p>
                    </section>
                </div>

                {/* Footer Seal */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Viewpoint Neural Systems • All Hands Cautioned</span>
                    <Activity size={20} className="text-emerald-500" />
                </div>
            </div>
        </div>
    );
}
