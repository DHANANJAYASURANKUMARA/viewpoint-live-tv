"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tv, Zap, Globe, ShieldCheck, Play, ArrowRight, Activity, Layers } from "lucide-react";

interface LandingPageProps {
    onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
    return (
        <div className="relative min-h-screen w-full bg-vpoint-dark overflow-hidden selection:bg-neon-cyan/30">
            {/* Background layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.1)_0%,_transparent_50%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/viewpoint_hero_bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-vpoint-dark/50 via-vpoint-dark to-vpoint-dark" />

                {/* Neural grid effect */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            <main className="relative z-10 flex min-h-screen items-center justify-center py-20">
                <div className="container mx-auto px-6">
                    {/* Hero section */}
                    <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 transition-all">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                                </span>
                                <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.3em]">Neural Interface v2.0.4 Live</span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                                Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple animate-pulse">Streaming</span>
                            </h1>

                            <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-widest opacity-80 px-4">
                                Experience the next evolution of live television. Ultra-low latency, global signal coverage, and a hyper-fluid neural interface.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
                        >
                            <button
                                onClick={onLaunch}
                                className="group relative w-72 sm:w-auto px-10 py-5 bg-white text-vpoint-dark rounded-full font-black uppercase tracking-[0.2em] transition-all hover:bg-neon-cyan hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] overflow-hidden active:scale-95"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Start Transmission <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>

                            <button className="w-72 sm:w-auto px-10 py-5 glass border border-white/10 rounded-full text-white font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95">
                                Network Stats
                            </button>
                        </motion.div>
                    </div>

                    {/* Features layer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
                        {[
                            {
                                icon: <Zap className="text-neon-cyan" size={24} />,
                                title: "Zero Lag",
                                desc: "Advanced predictive buffering engine ensures liquid-smooth playback even on unstable networks."
                            },
                            {
                                icon: <Globe className="text-neon-purple" size={24} />,
                                title: "Global Signals",
                                desc: "Direct access to premium entertainment, sports, and news transmissions from across the pulse."
                            },
                            {
                                icon: <Layers className="text-emerald-500" size={24} />,
                                title: "Neural HUD",
                                desc: "Real-time technical telemetry and signal verification embedded directly into your view."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="p-8 glass border border-white/5 rounded-[2.5rem] space-y-4 hover:border-white/20 transition-all group backdrop-blur-2xl"
                            >
                                <div className="p-3.5 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-widest">{feature.title}</h3>
                                <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest opacity-70">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* About Section (Content Density for AdSense) */}
                    <section className="max-w-4xl mx-auto mb-32 space-y-12 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-black text-white uppercase tracking-widest">The Transmission Standard</h2>
                            <p className="text-slate-400 text-[11px] font-bold leading-relaxed uppercase tracking-widest max-w-3xl mx-auto opacity-70">
                                Viewpoint is a high-performance streaming architecture designed for the modern audience. We bypass traditional bottlenecks by utilizing a neural-buffer engine that adapts to your network in real-time. Whether you're watching global sports or local news, our infrastructure ensures you're always receiving the highest possible bit-rate with zero interrupts.
                            </p>
                        </motion.div>
                    </section>

                    {/* FAQ Section (SEO/AdSense content) */}
                    <section className="max-w-5xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { q: "What is neural buffering?", a: "Our proprietary algorithm that predicts network drops before they happen, ensuring a constant 4K flow." },
                            { q: "Is it really zero-lag?", a: "We maintain a technical latency of under 300ms, making it faster than standard cable or satellite." },
                            { q: "Can I use custom streams?", a: "Yes. Our dashboard supports M3U8, MPD, and high-bitrate HLS signals natively." },
                            { q: "Does it work globally?", a: "Viewpoint leverages a global CDN network to provide stable signals in over 150 countries." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 glass rounded-3xl border border-white/5 space-y-3">
                                <h4 className="text-neon-cyan font-black text-[10px] uppercase tracking-widest">{item.q}</h4>
                                <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest opacity-80">{item.a}</p>
                            </div>
                        ))}
                    </section>

                    {/* Stats Layer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        className="pt-12 border-t border-white/5 flex flex-wrap items-center justify-around gap-12 mb-24"
                    >
                        <div className="text-center">
                            <div className="text-2xl font-black text-white leading-none">250+</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 font-mono">Signals</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-neon-cyan leading-none">99.9%</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 font-mono">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-white leading-none">4K HDR</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 font-mono">Resolution</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-neon-purple leading-none">GLOBAL</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 font-mono">Coverage</div>
                        </div>
                    </motion.div>

                    {/* Footer / AdSense Legal links */}
                    <footer className="relative pt-20 border-t border-white/5 space-y-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none mb-2">VIEWPOINT</h2>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">© 2026 Neural Transmission Systems.</p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-8">
                                <a href="#" className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</a>
                                <a href="#" className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</a>
                                <a href="#" className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Contact Signal</a>
                                <a href="#" className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">DMCA</a>
                            </div>
                        </div>

                        {/* Final Tagline */}
                        <div className="text-center pt-8 opacity-20">
                            <p className="text-[7px] font-black text-slate-600 uppercase tracking-[1em] leading-loose">
                                Designed for peak human experience • ultra-low latency enabled • global CDN verified • neural buffer active
                            </p>
                        </div>
                    </footer>
                </div>
            </main>

            {/* Floating neural elements */}
            <div className="fixed bottom-8 left-8 hidden md:flex items-center gap-4 text-slate-600 opacity-30 select-none pointer-events-none">
                <Activity size={14} className="animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] font-mono">Secure Transmission Established</span>
            </div>
        </div>
    );
}
