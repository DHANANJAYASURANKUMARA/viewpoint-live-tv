"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Navigation */}
                <Link href="/#hero" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all mb-10">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-neon-purple">
                        <Lock size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Security Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Privacy Shield</h1>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest leading-loose">
                        Version 2.0.4 • military-Grade Encryption Standards
                    </p>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 glass border border-white/5 rounded-[3rem] p-10 md:p-16 bg-white/5">
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 01. Zero-Knowledge Architecture
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Our platform is built on a fundamental principle of privacy: zero-knowledge. VIEWPOINT does not harvest, store, or sell your personal transmission history. All metadata required for signal stabilization is processed locally within your neural handshake.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 02. Data Encryption Grid
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            Every signal packet transmitted through our edge mesh is protected by AES-256 military-grade encryption. We use end-to-end TLS protocols to ensure that your handshake remains private, even when traversing public network segments.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 03. Cookies & Tracking
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            We utilize essential atmospheric cookies to maintain your dashboard configuration and signal preferences. Third-party telemetry, specifically Google AdSense, may utilize non-identifiable browser signals to provide relevant, atmospheric monetization experiences.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 04. User Control
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest">
                            You maintain absolute control over your digital optics. You may terminate your neural handshake at any time, which instantly purges all temporary edge-cached data related to your current session.
                        </p>
                    </section>
                </div>

                {/* Institutional Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/5">
                    <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-cyan transition-colors py-2">Entry Terms</Link>
                    <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-neon-purple py-2">Privacy Shield</Link>
                    <Link href="/dmca" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-magenta transition-colors py-2">DMCA Request</Link>
                    <Link href="/disclaimer" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-500 transition-colors py-2">Legal Disclaimer</Link>
                </div>

                {/* Footer Seal */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Viewpoint Neural Systems • All Data Encrypted</span>
                    <Shield size={20} className="text-neon-purple" />
                </div>
            </div>
        </div>
    );
}
