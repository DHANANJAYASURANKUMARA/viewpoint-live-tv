import React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Globe, ArrowLeft, Scale, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - VIEWPOINT Live TV",
    description: "Contact the VIEWPOINT team for support, partnership inquiries, DMCA requests, or advertising. Reach us for free live TV streaming assistance.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 py-24 px-6 relative overflow-hidden selection:bg-neon-cyan/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-neon-magenta/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Tactical Navigation */}
                <Link href="/" className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-neon-cyan hover:text-black hover:border-neon-cyan transition-all btn-touch shadow-2xl">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Signal Return
                </Link>

                <div className="space-y-8">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                            <Mail size={32} className="text-neon-cyan" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-cyan">Neural Link</span>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Communication Interface</p>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic drop-shadow-2xl">
                        Contact <span className="text-neon-cyan">Transmit</span>
                    </h1>
                    <p className="max-w-2xl text-xs md:text-sm text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                        Initiate a direct neural synchronization with our administrative nodes for support, partnerships, or verified legal inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            icon: MessageSquare,
                            title: "Signal Support",
                            desc: "Technical troubleshooting, channel synchronization requests, and transmission feedback.",
                            tag: "SUPPORT",
                            color: "neon-cyan"
                        },
                        {
                            icon: Globe,
                            title: "Strategic Partnerships",
                            desc: "Advertising integration, global expansion, and broadcast distribution inquiries.",
                            tag: "COMMERCIAL",
                            color: "neon-magenta"
                        },
                        {
                            icon: Scale,
                            title: "DMCA & Compliance",
                            desc: "Legal takedown protocols, copyright verification, and regulatory synchronization.",
                            tag: "LEGAL",
                            color: "neon-purple"
                        },
                        {
                            icon: Zap,
                            title: "Press & Media Hub",
                            desc: "Official press fragments, interview requests, and media resource acquisition.",
                            tag: "GLOBAL",
                            color: "emerald-500"
                        },
                    ].map(({ icon: Icon, title, desc, tag, color }) => (
                        <div key={title} className="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-white/20 transition-all hover:bg-white/[0.04] shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all" />

                            <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 text-white transition-all duration-500 group-hover:scale-110`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-[8px] font-black tracking-[0.4em] px-3 py-1 rounded-full border border-white/10 text-white/40 transition-all group-hover:text-white group-hover:border-white/30`}>{tag}</span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-lg font-black text-white uppercase tracking-tight italic">{title}</h2>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-wide uppercase opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Communication Node</span>
                                <a href="mailto:viewpointlivetv@gmail.com" className="text-sm font-mono text-white hover:text-neon-cyan transition-colors underline decoration-white/10 underline-offset-4 btn-touch w-fit">
                                    viewpointlivetv@gmail.com
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Neural Hub */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-10 shadow-inner mt-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent" />
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.5em]">Neural Sync fragments (FAQ)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {[
                            { q: "Platform Transmission Cost?", a: "VIEWPOINT is a zero-cost conduit. No registration or neural subscriptions are required for standard signal viewing." },
                            { q: "T20 World Cup Synchronization?", a: "Verified. Major international cricket tournaments are available for free broadcast in high-fidelity HD fragments." },
                            { q: "Supported Neural Links?", a: "Any standard web browser interface (Smartphone, Desktop, Smart TV) can interface with the VIEWPOINT matrix." },
                            { q: "Report Broken Signals?", a: "Dispatch a fragment to viewpointlivetv@gmail.com. Nodes are typically repaired within 24 neural cycles." },
                        ].map(({ q, a }, idx) => (
                            <div key={idx} className="space-y-3 group">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-4 h-[1px] bg-white/10 group-hover:w-8 group-hover:bg-neon-cyan transition-all" /> {q}
                                </h3>
                                <p className="text-[10px] text-slate-400 leading-relaxed tracking-wider uppercase pl-7 opacity-60 group-hover:opacity-100 transition-opacity">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Institutional Institutional Meta */}
                <div className="pt-16 border-t border-white/5 flex flex-wrap justify-center gap-x-10 gap-y-6">
                    {[["WATCH LIVE", "/watch"], ["NEXUS HUB", "/nexus"], ["ABOUT NODE", "/about"], ["PRIVACY SHIELD", "/privacy"], ["ENTRY TERMS", "/terms"], ["DMCA REQUEST", "/about"]].map(([label, href]) => (
                        <Link key={href} href={href} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-neon-cyan transition-all hover:tracking-[0.6em] btn-touch">
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="pt-10 flex justify-center opacity-20">
                    <div className="flex items-center gap-4 text-[8px] font-black tracking-[0.8em] uppercase text-white">
                        LINK ESTABLISHED <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SYNC COMPLETE
                    </div>
                </div>
            </div>
        </div>
    );
}


