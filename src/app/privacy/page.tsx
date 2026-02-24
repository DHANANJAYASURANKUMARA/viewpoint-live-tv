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
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 03. Cookies &amp; Tracking
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400">
                            VIEWPOINT uses essential cookies to maintain your preferences and session data. We also use Google Analytics to understand how visitors use our free live TV streaming platform. You may disable cookies in your browser settings without affecting core functionality.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 04. Google AdSense &amp; Third-Party Advertising
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400">
                            VIEWPOINT uses Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our site and other sites on the internet.
                        </p>
                        <p className="text-xs leading-relaxed text-slate-400">
                            You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for interest-based advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">aboutads.info</a>.
                        </p>
                        <p className="text-xs leading-relaxed text-slate-400">
                            We comply with the <strong className="text-white">Google Publisher Policies</strong> and do not place ads on pages with illegal content, adult content, or copyrighted material without authorisation. All ad placements follow Google AdSense program policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 05. User Control
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400">
                            You maintain full control over your data. You may:
                            (a) disable cookies in your browser settings,
                            (b) opt out of Google personalised ads via Google's ad settings,
                            (c) delete your VIEWPOINT account and all associated data at any time by contacting us at <a href="mailto:viewpointlivetv@gmail.com" className="text-neon-cyan hover:underline">viewpointlivetv@gmail.com</a>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 06. Children's Privacy
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400">
                            VIEWPOINT is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-neon-purple/30" /> 07. Contact
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-400">
                            For privacy-related inquiries, email us at: <a href="mailto:viewpointlivetv@gmail.com" className="text-neon-cyan hover:underline">viewpointlivetv@gmail.com</a>. We respond within 48 hours.
                        </p>
                    </section>
                </div>

                {/* Institutional Links */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-10 border-t border-white/5">
                    <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-cyan transition-colors py-2">About</Link>
                    <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-cyan transition-colors py-2">Contact</Link>
                    <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-cyan transition-colors py-2">Terms</Link>
                    <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-neon-purple py-2">Privacy</Link>
                    <Link href="/dmca" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-neon-magenta transition-colors py-2">DMCA</Link>
                    <Link href="/disclaimer" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-emerald-500 transition-colors py-2">Disclaimer</Link>
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

