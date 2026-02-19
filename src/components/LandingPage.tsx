"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tv, Zap, Globe, ShieldCheck, Play, ArrowRight,
    Activity, Layers, Users, Radio, Info, FileText,
    Mail, ExternalLink, Menu, X, ArrowUpRight,
    Sparkles, Shield, Cpu
} from "lucide-react";

interface LandingPageProps {
    onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [viewerCount, setViewerCount] = useState(12405);
    const [activeSignals, setActiveSignals] = useState(258);

    // Simulate real-time data flow
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
            if (Math.random() > 0.8) {
                setActiveSignals(prev => prev + (Math.random() > 0.5 ? 1 : -1));
            }
        }, 3000);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        return () => {
            clearInterval(interval);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navLinks = [
        { name: "Transmission", href: "#transmission" },
        { name: "Features", href: "#features" },
        { name: "What's New", href: "#whats-new" },
        { name: "FAQ", href: "#faq" },
        { name: "About", href: "#about" }
    ];

    return (
        <div className="relative min-h-screen w-full bg-vpoint-dark text-slate-300 font-sans selection:bg-neon-cyan/30">
            {/* Ultra-Futuristic Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? "py-4" : "py-8"}`}>
                <div className="container mx-auto px-6">
                    <div className={`relative glass border border-white/5 rounded-full px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-vpoint-dark/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-transparent"}`}>
                        {/* Branding */}
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-white tracking-tighter uppercase whitespace-nowrap">VIEWPOINT</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onLaunch}
                                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white text-vpoint-dark rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-neon-cyan transition-all"
                            >
                                Dashboard <ArrowRight size={14} />
                            </button>
                            <button
                                className="lg:hidden text-white"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed inset-0 z-[90] bg-vpoint-dark glass-dark backdrop-blur-3xl flex flex-col items-center justify-center gap-8 p-10 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button
                            onClick={onLaunch}
                            className="w-full mt-10 px-10 py-5 bg-white text-vpoint-dark rounded-full font-black uppercase tracking-[0.2em]"
                        >
                            Start Transmission
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero & Background */}
            <div className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.15)_0%,_transparent_70%)] opacity-50" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        {/* Live HUD Placeholder */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                            <div className="flex items-center gap-3 px-5 py-2.5 glass border border-white/10 rounded-full bg-white/5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.1em]">Signal Online: {viewerCount.toLocaleString()} Viewing</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-2.5 glass border border-white/10 rounded-full bg-white/5">
                                <Activity size={12} className="text-neon-cyan" />
                                <span className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.1em]">Data Nodes: {activeSignals}</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-2.5 glass border border-white/5 rounded-full bg-white/5">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                <span className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.1em]">Atmospheric Encrypted</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter uppercase leading-[0.9] [text-wrap:balance]">
                            Ultra <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-pulse">Low Latency</span><br />
                            Engine v2.5
                        </h1>

                        <p className="max-w-2xl mx-auto text-sm md:text-lg text-white/50 font-medium uppercase tracking-[0.25em] leading-relaxed">
                            Experience the future of live transmission. Optimized for editorial density and visual clarity.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                            <button
                                onClick={onLaunch}
                                className="group relative w-full sm:w-auto px-12 py-6 bg-white text-vpoint-dark rounded-full font-black uppercase tracking-[0.3em] transition-all hover:bg-neon-cyan hover:shadow-[0_0_80px_rgba(34,211,238,0.5)] overflow-hidden scale-110"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Enter Dashboard <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features HUD */}
            <section id="features" className="py-32 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap />, title: "300ms Pulse", desc: "Instantaneous signal lock for a lag-free experience across all global channels." },
                        { icon: <Shield />, title: "Neural Shield", desc: "Military-grade encryption for all custom transmission signals and user preferences." },
                        { icon: <Cpu />, title: "4K Engine", desc: "Proprietary upscaling technology ensuring atmospheric clarity on low-bandwidth signals." }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className="p-10 glass border border-white/10 rounded-[2.5rem] space-y-8 hover:border-white/20 transition-all bg-gradient-to-br from-white/5 to-transparent"
                        >
                            <div className="p-4 bg-white/5 rounded-2xl w-fit text-neon-cyan ring-1 ring-white/10">
                                {f.icon}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{f.title}</h3>
                                <p className="text-xs font-medium leading-relaxed uppercase tracking-widest text-white/40 italic">
                                    {f.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* What's New Section (Premium Look) */}
            <section id="whats-new" className="py-32 bg-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
                        <div className="space-y-6 text-left w-full lg:w-auto">
                            <span className="text-xs font-bold text-neon-purple uppercase tracking-[0.4em]">Signal Refinement v2.5.8</span>
                            <h2 className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter leading-none">Intelligence</h2>
                        </div>
                        <p className="max-w-md text-xs font-semibold uppercase tracking-widest text-white/30 leading-loose">
                            We've upgraded our global signal backbone to support true 10-bit HDR transmissions with deep atmospheric enhancement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="relative group overflow-hidden rounded-[2.5rem] aspect-video glass border border-white/10 flex items-center justify-center bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-vpoint-dark via-transparent to-transparent z-10" />
                            <div className="text-center z-20 space-y-6 p-10">
                                <Sparkles className="mx-auto text-neon-magenta opacity-80" size={48} />
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter transition-all group-hover:scale-105">Atmospheric 4K</h3>
                                <p className="text-xs font-semibold tracking-widest uppercase text-white/40">250+ Nodes Upgraded to HDR10</p>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-[2.5rem] aspect-video glass border border-white/10 flex items-center justify-center bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-vpoint-dark via-transparent to-transparent z-10" />
                            <div className="text-center z-20 space-y-6 p-10">
                                <Radio className="mx-auto text-neon-cyan opacity-80" size={48} />
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter transition-all group-hover:scale-105">Neural Pulse</h3>
                                <p className="text-xs font-semibold tracking-widest uppercase text-white/40">Predictive Buffer Engine Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ / Support / Legal (Content Rich for AdSense) */}
            <section id="faq" className="py-32 container mx-auto px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold text-white uppercase tracking-[0.3em]">Telemetry Support</h2>
                        <div className="w-24 h-1 bg-neon-cyan mx-auto rounded-full opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        {[
                            { q: "Transmission Integrity", a: "Viewpoint leverages a global CDN edge mesh to ensure 99.9% uptime for all major network protocols." },
                            { q: "Interface Fluidity", a: "Our dashboard is engineered to be atmospheric and fully responsive from handheld optics to theater screens." },
                            { q: "Custom Signals", a: "Paste any HLS, DASH or M3U8 source into our HUD to experience it with VIEWPOINT's proprietary post-processing." },
                            { q: "Secure Handshake", a: "We operate on a zero-knowledge architecture. Your transmission history stays local to your neural handshake." }
                        ].map((item, i) => (
                            <div key={i} className="space-y-5 p-10 glass border-l-4 border-neon-cyan/20 rounded-r-[2rem] bg-white/5">
                                <h4 className="text-sm font-bold text-white uppercase tracking-[0.15em]">{item.q}</h4>
                                <p className="text-xs font-medium leading-relaxed text-white/40 uppercase tracking-widest italic">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About & Mission */}
            <section id="about" className="py-32 bg-white/5">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <Info className="mx-auto text-neon-purple mb-10" size={32} />
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-10">The Mission</h2>
                    <p className="text-sm md:text-md font-bold leading-relaxed text-slate-400 uppercase tracking-[0.2em] mb-12">
                        Viewpoint was founded to bridge the gap between traditional broadcasting and the future of digital density. We believe that live television should be as fluid and expressive as the neural networks we use to access them. Our team of interface designers and signal engineers work tirelessly to ensure that every frame transmitted via our platform is of military-grade excellence.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
                        <div className="flex flex-col gap-2">
                            <div className="text-2xl font-mono text-white">2026.02</div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Initial Boot</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-2xl font-mono text-white">150+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Countries</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-2xl font-mono text-white">1M+</div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Handshakes</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Social Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Tv size={24} className="text-neon-cyan" />
                                <span className="text-2xl font-black text-white tracking-tighter uppercase">VIEWPOINT</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 leading-loose uppercase tracking-widest">The future of atmospheric live television. Ultra-low latency, global coverage.</p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="p-2 glass border border-white/10 rounded-lg hover:text-white transition-all"><Mail size={16} /></a>
                                <a href="#" className="p-2 glass border border-white/10 rounded-lg hover:text-white transition-all"><ExternalLink size={16} /></a>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Network</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Status HUD</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">CDNs Active</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Signal Stats</a></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Governance</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Terms of Entry</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Privacy Matrix</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">DMCA Protocol</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Disclaimer</a></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Transmission</h4>
                            <div className="p-6 glass border border-white/10 rounded-3xl space-y-4">
                                <h5 className="text-[9px] font-black text-neon-cyan uppercase">Join the Pulse</h5>
                                <input
                                    type="email"
                                    placeholder="Neural ID"
                                    className="w-full bg-white/5 border border-white/5 rounded-full px-4 py-2 text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/50"
                                />
                                <button className="w-full py-2 bg-white text-vpoint-dark rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-neon-cyan transition-all">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                        <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Viewpoint Neural Systems • All Handshakes Encrypted</span>
                        <div className="flex items-center gap-6">
                            <span className="text-[8px] font-black cursor-help">TOS</span>
                            <span className="text-[8px] font-black cursor-help">PRIVACY</span>
                            <span className="text-[8px] font-black cursor-help">DISCLAIMER</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
