"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Zap, Globe, Shield, ArrowRight,
    Activity, BarChart3, Star, ChevronRight, Play,
    MessageSquare, Zap as FlashIcon, ArrowUpRight,
    Download, Smartphone, Info, Mail, Send, Cpu, Layers, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useConfig } from "./ConfigContext";
import NotificationCenter from "./NotificationCenter";

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [stats, setStats] = useState({
        uplink: "99.9%",
        latency: "14ms",
        nodes: "4,209",
        status: "OPTIMAL"
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);

        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                latency: Math.floor(Math.random() * 5 + 10) + "ms",
                nodes: (4200 + Math.floor(Math.random() * 20)).toLocaleString()
            }));
        }, 3000);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(interval);
        };
    }, []);

    const features = [
        { icon: <Zap className="text-neon-cyan" />, title: "Hyper-Speed", desc: "Proprietary buffering algorithms for zero-lag transmission." },
        { icon: <Shield className="text-neon-purple" />, title: "Secure HUD", desc: "Military-grade encryption for all neural handshake protocols." },
        { icon: <FlashIcon className="text-emerald-500" />, title: "Quantum Mesh", desc: "Distributed signal processing via neural nodes." },
        { icon: <Globe className="text-blue-500" />, title: "Grid-Wide", desc: "Access signals from every sector of the digital frontier." },
        { icon: <Activity className="text-amber-500" />, title: "Multi-Stack", desc: "Parallel signal streams for total tactical awareness." }
    ];

    const faqs = [
        { q: "Is VIEWPOINT free to access?", a: "Yes, our core transmission protocols are open and decentralized." },
        { q: "How do I upgrade my signal?", a: "Signals are automatically optimized based on your terminal's capabilities." },
        { q: "Is the chat secure?", a: "All communications are end-to-end encrypted across the neural mesh." }
    ];

    return (
        <div className="min-h-screen bg-vpoint-dark selection:bg-neon-cyan/30 selection:text-white">
            {/* Cyber Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-vpoint-dark/80 backdrop-blur-2xl border-white/10 py-4' : 'bg-transparent border-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-neon-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="w-10 h-10 glass border border-white/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                                <Zap className="text-neon-cyan relative z-10 w-5 h-5" />
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-transparent" />
                            </div>
                        </div>
                        <span className="text-2xl font-black text-white uppercase tracking-tighter">View<span className="text-neon-cyan">point</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-12">
                        {['Signals', 'Protocols', 'Social', 'Legal'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-neon-cyan transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <Link href="/watch" className="px-8 py-3 bg-neon-cyan text-vpoint-dark rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,243,0.3)]">
                            Enter HUD
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero / Void Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-white/5 rounded-full animate-spin-slow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-white/5 rounded-full animate-spin-slow-reverse" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,243,0.05)_0%,transparent_50%)]" />
                </div>

                <div className="max-w-7xl mx-auto px-10 relative z-10 text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 glass border border-white/10 rounded-full animate-pulse-slow">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                            <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-[0.4em]">Grid Status: {stats.status}</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                            Elite Signal <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient-x">Augmentation</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-white/40 text-lg uppercase tracking-widest leading-loose">
                            Experience the digital frontier with unparalleled clarity. Decentralized streaming protocols for the next civilization.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/watch" className="group px-10 py-5 bg-white text-vpoint-dark rounded-full font-black text-sm uppercase tracking-widest hover:bg-neon-cyan transition-all flex items-center gap-3">
                            Initiate Stream <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link href="#protocols" className="px-10 py-5 glass border border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                            View Protocols
                        </Link>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-20 border-t border-white/5">
                        {Object.entries(stats).map(([label, value]) => (
                            <div key={label} className="space-y-2">
                                <div className="text-3xl font-black text-white tracking-widest">{value}</div>
                                <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features / Protocols */}
            <section id="protocols" className="py-40 relative">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-neon-purple">
                                    <Shield className="text-neon-purple" size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">System Architecture</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Neural Signal <br /> Propagation</h2>
                            </div>
                            <div className="grid gap-6">
                                {features.map((f, i) => (
                                    <div key={i} className="group p-8 glass border border-white/5 rounded-3xl hover:border-white/20 transition-all">
                                        <div className="flex gap-6 items-start">
                                            <div className="w-12 h-12 glass border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                                {f.icon}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-white font-bold uppercase tracking-widest">{f.title}</h3>
                                                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-20 bg-neon-cyan/10 blur-[100px] rounded-full" />
                            <div className="relative glass border border-white/10 rounded-[3rem] p-4 aspect-square overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-vpoint-dark via-transparent to-transparent z-10" />
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    <div className="space-y-4 animate-float">
                                        <div className="h-2/3 glass-dark border border-white/5 rounded-2xl" />
                                        <div className="h-1/3 glass-dark border border-white/5 rounded-2xl" />
                                    </div>
                                    <div className="space-y-4 animate-float-delayed pt-10">
                                        <div className="h-1/3 glass-dark border border-white/5 rounded-2xl" />
                                        <div className="h-2/3 glass-dark border border-white/5 rounded-2xl" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="w-24 h-24 glass border border-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
                                        <Activity className="text-neon-cyan w-10 h-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social / News Section */}
            <section id="social" className="py-40 glass border-y border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-10 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-white">
                        <div className="space-y-6">
                            <h2 className="text-6xl font-black uppercase tracking-tighter">Collective Feed</h2>
                            <p className="max-w-md text-white/40 uppercase tracking-widest text-xs leading-loose">
                                We&apos;ve upgraded our global signal backbone to support true 10-bit HDR transmissions with deep atmospheric enhancement and predictive buffering.
                            </p>
                        </div>
                        <Link href="/watch" className="px-10 py-5 glass border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                            Join Discussion
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Star />, title: "Visual Purity", text: "New ultra-clear 4K neural signals deployed across Sector 7." },
                            { icon: <BarChart3 />, title: "Low Latency", text: "Proprietary mesh protocols reduced ping to sub-5ms globally." },
                            { icon: <Play />, title: "Neural Audio", text: "Uncompressed spatial soundscapes now standard in all streams." }
                        ].map((post, i) => (
                            <div key={i} className="p-10 glass border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.02] transition-colors group">
                                <div className="w-20 h-20 rounded-3xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan mb-8 group-hover:scale-110 transition-transform border border-neon-cyan/20">
                                    <Zap size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">{post.title}</h3>
                                <p className="text-sm text-white/30 leading-loose">{post.text}</p>
                                <div className="pt-4 flex items-center gap-3 text-[10px] font-black text-neon-cyan uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read Protocol <ArrowUpRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legal / FAQ Shell */}
            <section id="legal" className="py-40">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="grid lg:grid-cols-2 gap-40">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-emerald-500">
                                    <Info size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Direct Access</span>
                                </div>
                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight">Neural Knowledge Base</h2>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="p-8 glass border border-white/5 rounded-3xl space-y-4">
                                        <h4 className="text-white font-bold uppercase tracking-widest flex justify-between items-center">
                                            {faq.q}
                                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[10px]">+</div>
                                        </h4>
                                        <p className="text-sm text-white/30 leading-relaxed font-medium">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight">Sector Access</h2>
                                <p className="text-white/40 uppercase tracking-widest text-xs leading-loose">
                                    By leveraging proprietary neural mesh architecture, we&apos;ve decentralized the global transmission backbone, bringing ultra-low latency signals to every corner of the digital frontier.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['About', 'Privacy', 'Contact', 'Disclaimer', 'DMCA', 'Terms'].map((l) => (
                                    <Link key={l} href={`/${l.toLowerCase()}`} className="p-6 glass border border-white/5 rounded-2xl text-center font-bold text-[10px] uppercase tracking-[0.4em] text-white/60 hover:text-white hover:border-white/20 transition-all">
                                        {l}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final HUD CTA */}
            <section className="py-40 px-10">
                <div className="max-w-7xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-white to-neon-purple rounded-[4rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    <div className="relative glass border border-white/10 rounded-[4rem] p-20 text-center space-y-12 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,243,0.1)_0%,transparent_50%)]" />
                        <div className="space-y-6 relative z-10">
                            <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Ready to <br /> Augment?</h2>
                            <p className="text-white/40 uppercase tracking-widest text-sm leading-loose">
                                Initiate a neural handshake with our support collective. We&apos;re active across all digital frequencies.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 relative z-10">
                            <Link href="/contact" className="px-12 py-5 glass border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center gap-3">
                                Contact Collective <Mail size={16} />
                            </Link>
                            <Link href="https://t.me/yourtelegram" className="px-12 py-5 bg-white text-vpoint-dark rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-neon-cyan transition-all flex items-center gap-3">
                                Neural Feed <MessageSquare size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Minimalist */}
            <footer className="py-20 border-t border-white/5 bg-vpoint-dark/50">
                <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                            <Globe size={18} className="text-white" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] lg:block hidden">Global Cluster v2.4</span>
                        </div>
                        <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                            <Shield size={18} className="text-white" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] lg:block hidden">Protocol: SECURE</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
                            <span className="text-neon-cyan/40">&copy; 2024</span>
                            <span>Viewpoint Collective</span>
                            <span className="text-neon-purple/40">Sector 7G</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/watch" className="w-8 h-8 glass flex items-center justify-center rounded-lg text-white/30 hover:text-neon-cyan transition-colors">
                                <Send size={14} />
                            </Link>
                            <Link href="/watch" className="w-8 h-8 glass flex items-center justify-center rounded-lg text-white/30 hover:text-neon-purple transition-colors">
                                <Smartphone size={14} />
                            </Link>
                            <Link href="/watch" className="w-8 h-8 glass flex items-center justify-center rounded-lg text-white/30 hover:text-emerald-500 transition-colors">
                                <Download size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
