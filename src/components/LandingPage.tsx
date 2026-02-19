"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tv, Zap, Globe, ShieldCheck, Play, ArrowRight,
    Activity, Layers, Users, Radio, Info, FileText,
    Mail, ExternalLink, Menu, X, ArrowUpRight,
    Sparkles, Shield, Cpu, Volume2
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
        { name: "Home", href: "#hero" },
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
                        <a href="#hero" className="flex items-center gap-3 group">
                            <span className="text-xl font-bold text-white tracking-tighter uppercase whitespace-nowrap">VIEWPOINT</span>
                        </a>

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
                                className="hidden sm:flex items-center gap-2 px-6 py-2.5 glass border border-white/20 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/10 hover:border-white/40 transition-all"
                            >
                                WATCH NOW <ArrowRight size={14} />
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
            <div id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.15)_0%,_transparent_70%)] opacity-50" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center py-20">
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

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter uppercase leading-[1.1] [text-wrap:balance]">
                            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-pulse">Live Transmission</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-xs md:text-sm text-white/40 font-medium uppercase tracking-[0.2em] leading-relaxed">
                            Atmospheric live television. Optimized for digital density and visual clarity.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <button
                                onClick={onLaunch}
                                className="group relative w-full sm:w-auto px-10 py-5 glass border border-white/20 text-white rounded-full font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    WATCH NOW <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features HUD */}
            <section id="features" className="min-h-screen py-32 container mx-auto px-6 flex flex-col justify-center">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">Core Technologies</h2>
                    <p className="text-xs font-medium text-white/30 uppercase tracking-[0.3em]">The Architecture of the Future</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap />, title: "300ms Pulse", desc: "Instantaneous signal lock for a lag-free experience across all global channels." },
                        { icon: <Shield />, title: "Neural Shield", desc: "Military-grade encryption for all custom transmission signals and user preferences." },
                        { icon: <Cpu />, title: "4K Engine", desc: "Proprietary upscaling technology ensuring atmospheric clarity on low-bandwidth signals." },
                        { icon: <Globe />, title: "Adaptive ABR", desc: "Global content delivery network with dynamic bitrate switching for zero buffering." },
                        { icon: <Activity />, title: "Neural HUD", desc: "Real-time telemetry and signal diagnostics integrated directly into the player." },
                        { icon: <Layers />, title: "Zero-Lint Core", desc: "Enterprise-grade stability with a clean-code architecture for maximum performance." }
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
            <section id="whats-new" className="min-h-screen flex items-center justify-center py-32 bg-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8 text-center lg:text-left">
                        <div className="space-y-4 w-full lg:w-auto">
                            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-[0.4em]">Signal Refinement v2.5.8</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-none">Intelligence</h2>
                        </div>
                        <p className="max-w-md mx-auto lg:mx-0 text-[10px] font-semibold uppercase tracking-widest text-white/30 leading-loose">
                            We've upgraded our global signal backbone to support true 10-bit HDR transmissions with deep atmospheric enhancement and predictive buffering.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: <Sparkles className="mx-auto text-neon-magenta opacity-80" size={32} />, title: "Atmospheric 4K", desc: "250+ Nodes Upgraded to HDR10+" },
                            { icon: <Radio className="mx-auto text-neon-cyan opacity-80" size={32} />, title: "Neural Pulse", desc: "Predictive Buffer Engine Active" },
                            { icon: <Volume2 className="mx-auto text-neon-purple opacity-80" size={32} />, title: "Spatial Shield", desc: "3D Atmospheric Audio Engine" },
                            { icon: <Globe className="mx-auto text-emerald-400 opacity-80" size={32} />, title: "Global Grid", desc: "Ultra-Edge Node Synchronization" }
                        ].map((item, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-[2rem] aspect-video glass border border-white/10 flex items-center justify-center bg-white/5 transition-all hover:border-white/20">
                                <div className="absolute inset-0 bg-gradient-to-t from-vpoint-dark via-transparent to-transparent z-10" />
                                <div className="text-center z-20 space-y-4 p-6">
                                    {item.icon}
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter transition-all group-hover:scale-105">{item.title}</h3>
                                    <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40">{item.desc}</p>
                                </div>
                            </div>
                        ))}
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
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <Tv size={28} className="text-neon-cyan" />
                                <span className="text-3xl font-bold text-white tracking-tighter uppercase">VIEWPOINT</span>
                            </div>
                            <p className="text-xs font-semibold text-white/30 leading-loose uppercase tracking-widest">The future of atmospheric live television. Ultra-low latency, global signal coverage.</p>
                            <div className="flex items-center gap-5">
                                <a href="#" className="p-3 glass border border-white/10 rounded-xl hover:text-neon-cyan transition-all bg-white/5"><Mail size={18} /></a>
                                <a href="#" className="p-3 glass border border-white/10 rounded-xl hover:text-neon-cyan transition-all bg-white/5"><ExternalLink size={18} /></a>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xs font-bold text-white uppercase tracking-[0.4em]">Network</h4>
                            <ul className="space-y-5">
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Signal HUD</a></li>
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Edge Nodes</a></li>
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Latency Stats</a></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xs font-bold text-white uppercase tracking-[0.4em]">Protocol</h4>
                            <ul className="space-y-5">
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Entry Terms</a></li>
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Privacy Shield</a></li>
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">DMCA Request</a></li>
                                <li><a href="#" className="text-xs font-semibold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Legal Disclaimer</a></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xs font-bold text-white uppercase tracking-[0.4em]">Handshake</h4>
                            <div className="p-8 glass border border-white/10 rounded-[2rem] space-y-6 bg-white/5">
                                <h5 className="text-[10px] font-bold text-neon-cyan uppercase tracking-[0.2em]">Join the Transmission</h5>
                                <input
                                    type="email"
                                    placeholder="Neural ID"
                                    className="w-full bg-vpoint-dark/50 border border-white/5 rounded-full px-6 py-3 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/30"
                                />
                                <button className="w-full py-3 bg-white text-vpoint-dark rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neon-cyan transition-all">Subscribe</button>
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
