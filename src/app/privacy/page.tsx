"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Globe } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-purple/30 py-24 px-6 relative overflow-hidden">
            {/* Neural Background FX */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Navigation Hub */}
                <Link href="/#hero" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon-purple hover:text-black hover:border-neon-purple transition-all active:scale-95 shadow-2xl">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Neural Return
                </Link>

                {/* Tactical Header */}
                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <Lock size={32} className="text-neon-purple" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-purple">Privacy Protocol</span>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Version 3.0.1 • military-Grade Encryption</p>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        Privacy <span className="text-neon-purple">Shield</span>
                    </h1>
                </div>

                {/* Content Matrix */}
                <div className="space-y-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-purple to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Zero-Knowledge Architecture</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            Our platform is strictly governed by zero-knowledge principles. VIEWPOINT does not harvest, store, or commoditize your personal transmission history. All metadata required for signal stabilization is processed within your local neural handshake.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Data Encryption Grid</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            Every signal packet transmitted through our mesh is secured by AES-256 standard encryption. We utilize end-to-end TLS protocols ensuring your handshake remain private across all public network segments.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-purple to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Cookies & Tracking</h2>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-[0.15em] font-medium">
                            Essential cookies are utilized to maintain session integrity and preferences. Analytics fragments help us optimize the matrix. You may sever cookie synchronization via your browser interface without core signal degradation.
                        </p>
                    </section>

                    <section className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <Globe size={20} className="text-neon-cyan" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Google AdSense Protocol</h2>
                        </div>
                        <div className="space-y-4 text-xs leading-relaxed text-slate-400 uppercase tracking-widest font-medium opacity-80">
                            <p>
                                VIEWPOINT utilizes Google AdSense for advertisement synchronization. Google uses DART cookies to serve ads based on your visit to this and other matrix nodes.
                            </p>
                            <p>
                                You may opt out of interest-based advertisement synchronization by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline hover:text-white transition-colors">Google Ads Portal</a>.
                            </p>
                            <p className="text-white/60">
                                We fully comply with the Google Publisher Policies, ensuring no ads are served alongside prohibited or unverified signal fragments.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-neon-magenta to-transparent" />
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">User Sovereignty</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Terminate Cookie Synchronization",
                                "Opt-out of Personalized Ad Flows",
                                "Purge Neural Profile Data",
                                "Continuous Privacy Monitoring"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="p-8 bg-black/40 border border-white/10 rounded-3xl">
                        <p className="text-xs leading-relaxed text-slate-400 uppercase tracking-widest mb-4">
                            For privacy inquiries or data purge requests, contact:
                        </p>
                        <a href="mailto:viewpointlivetv@gmail.com" className="text-xl md:text-3xl font-black text-white hover:text-neon-purple transition-colors italic tracking-tight font-mono">
                            viewpointlivetv@gmail.com
                        </a>
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
                                ${href === "/privacy" ? "bg-neon-purple/10 border-neon-purple/30 text-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.1)]" : "border-white/5 text-white/30 hover:text-white hover:border-white/20"}
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
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-slate-500 italic">Military-Grade Privacy Handshake Active</span>
                    </div>
                    <Shield size={24} className="text-neon-purple animate-pulse" />
                </div>
            </div>
        </div>
    );
}


