import React from "react";
import Link from "next/link";
import { Tv, Globe, Shield, Users, Mail, Star, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About VIEWPOINT - Free Live TV Streaming Platform",
    description: "VIEWPOINT is a free live TV streaming platform where you can watch cricket, T20 World Cup, football, news and entertainment channels from around the world for free.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 py-24 px-6 relative overflow-hidden selection:bg-neon-cyan/30">
            {/* Neural Background FX */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-neon-magenta/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-20 relative z-10">
                {/* Back Link */}
                <Link href="/" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all active:scale-95 shadow-2xl">
                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Neural Return
                </Link>

                {/* Hero Transmission */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                            <Tv size={36} className="text-neon-cyan" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-neon-cyan">Project Overview</span>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Global Signal Multiplexer</p>
                        </div>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        Neural <span className="text-neon-cyan">Stream</span>
                    </h1>
                    <p className="max-w-3xl text-sm md:text-lg text-slate-400 font-medium leading-relaxed uppercase tracking-widest opacity-80">
                        VIEWPOINT is the ultimate transmission node for zero-cost, high-fidelity live TV. Witness global events, cricket tournaments, and entertainment fragments in real-time.
                    </p>
                </div>

                {/* Core Functionalities */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-20 space-y-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Signal Specs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {[
                            { icon: Star, title: "Cricket Nexus", desc: "Live T20 World Cup, IPL, and international cricket synchronized in HD." },
                            { icon: Globe, title: "Global Grid", desc: "200+ neural channels from every sector of the planet." },
                            { icon: Shield, title: "Zero Handshake", desc: "No registration required. Access the matrix instantly from any node." },
                            { icon: Users, title: "Neural Sync", desc: "Optimized for all browser interfaces. Mobile, Desktop, and Smart TV compatible." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex flex-col gap-6 p-8 bg-white/5 border border-white/5 rounded-3xl group hover:border-neon-cyan/30 transition-all hover:bg-white/[0.08]">
                                <div className="p-4 rounded-2xl bg-neon-cyan/10 text-neon-cyan self-start group-hover:scale-110 transition-transform">
                                    <Icon size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed tracking-wider uppercase opacity-70">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tactical Content Segments */}
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.5em]">Transmission Intel (SEO)</h2>
                    </div>
                    <div className="prose prose-invert max-w-none grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-400 text-[10px] md:text-[11px] font-bold leading-loose uppercase tracking-[0.2em]">
                        <p className="opacity-60 hover:opacity-100 transition-opacity">
                            VIEWPOINT facilitates a streamlined <strong className="text-white">watch live TV free</strong> experience. Our architecture aggregates live cricket, T20 World Cup broadcasts, and international news fragments into a single, cohesive neural hub.
                        </p>
                        <p className="opacity-60 hover:opacity-100 transition-opacity">
                            Every <strong className="text-white">free live TV channel</strong> is optimized for HD transmission. Experience zero-latency bursts for IPL matches and elite football tournaments without neural registration or data harvesting.
                        </p>
                        <p className="opacity-60 hover:opacity-100 transition-opacity">
                            Looking for <strong className="text-white">live cricket online free</strong>? Our nodes monitor the ICC T20 World Cup, Big Bash League, PSL, and CPL around the clock. Synchronize your browser with our matrix to bypass traditional subscription firewalls.
                        </p>
                        <p className="opacity-60 hover:opacity-100 transition-opacity">
                            Beyond the pitch, experience <strong className="text-white">free live football streaming</strong> across the Premier League and Champions League. VIEWPOINT remains the most resilient conduit for global entertainment.
                        </p>
                    </div>
                </div>

                {/* Mission Core */}
                <div className="p-12 md:p-16 bg-gradient-to-br from-neon-cyan/10 to-transparent border border-neon-cyan/20 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-neon-cyan/5 blur-[100px] rounded-full group-hover:bg-neon-cyan/10 transition-colors" />
                    <Shield size={40} className="text-neon-cyan mb-8" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-6">Our Protocol</h2>
                    <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed uppercase tracking-[0.2em] opacity-80">
                        Signal access must remain decentralized and zero-cost. VIEWPOINT is engineered to provide military-grade streaming fidelity to every human node, regardless of hardware or sector location.
                    </p>
                </div>

                {/* Final Call */}
                <div className="text-center pt-10">
                    <Link href="/watch" className="group relative inline-flex items-center gap-4 px-12 py-6 bg-neon-cyan text-vpoint-dark rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(34,211,238,0.3)]">
                        Initialize Transmission <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Institutional Institutional Index */}
                <div className="pt-20 border-t border-white/5 flex flex-wrap justify-center gap-10">
                    {[["HOME", "/"], ["WATCH LIVE", "/watch"], ["PRIVACY", "/privacy"], ["TERMS", "/terms"], ["CONTACT", "/contact"], ["DMCA", "/dmca"]].map(([label, href]) => (
                        <Link key={href} href={href} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-neon-cyan transition-all">
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

