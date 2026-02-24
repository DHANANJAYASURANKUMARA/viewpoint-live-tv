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
        <div className="min-h-screen bg-vpoint-dark text-slate-300 py-16 px-6">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Back */}
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
                    ← Back to Home
                </Link>

                {/* Hero */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-neon-cyan">
                        <Tv size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">About Us</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Watch Live TV <span className="text-neon-cyan">Free</span>
                    </h1>
                    <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
                        VIEWPOINT is your ultimate destination for free live TV streaming online. Watch live cricket matches including the T20 World Cup, IPL, football, news channels, and entertainment — all completely free, with no subscription required.
                    </p>
                </div>

                {/* What We Offer */}
                <div className="glass border border-white/10 rounded-[2rem] p-10 space-y-8 bg-white/[0.02]">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: Star, title: "Live Cricket Streaming", desc: "Watch T20 World Cup, IPL, ODI, and Test matches live for free in HD quality." },
                            { icon: Globe, title: "International Channels", desc: "Access 200+ live TV channels from around the world covering sports, news, entertainment, and more." },
                            { icon: Tv, title: "Free Live Sports", desc: "Stream football, cricket, kabaddi, tennis, and other live sports events without any subscription." },
                            { icon: Users, title: "For Everyone", desc: "No registration required to browse. Simple, fast, and free access to live TV from any device." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="p-3 rounded-xl bg-neon-cyan/10 text-neon-cyan shrink-0">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2">{title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keywords-rich content for SEO */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Watch Free Live TV Online</h2>
                    <div className="prose prose-invert max-w-none space-y-4 text-slate-400 text-sm leading-relaxed">
                        <p>
                            VIEWPOINT makes it easy to <strong className="text-white">watch live TV free online</strong>. Whether you're looking for live cricket streaming, the T20 World Cup, IPL matches, or free live football streaming — we have it all in one place.
                        </p>
                        <p>
                            Our platform streams hundreds of <strong className="text-white">free live TV channels</strong> in HD quality. Watch live match today without any subscription or registration. Our zero-lag technology ensures buffer-free streaming even on slower connections.
                        </p>
                        <p>
                            Looking for <strong className="text-white">live cricket streaming free</strong>? We cover ICC T20 World Cup, IPL, Big Bash League, Pakistan Super League, Caribbean Premier League, and all major international cricket tournaments. Watch live cricket online free anytime on any device.
                        </p>
                        <p>
                            Beyond cricket, VIEWPOINT offers <strong className="text-white">free live football streaming</strong> including Premier League, La Liga, Serie A, and Champions League matches. Also watch news, movies, entertainment, and lifestyle channels from around the world.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="p-8 bg-neon-cyan/5 border border-neon-cyan/20 rounded-2xl">
                    <Shield size={24} className="text-neon-cyan mb-4" />
                    <h2 className="text-lg font-black text-white uppercase tracking-wide mb-3">Our Mission</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        We believe live entertainment should be accessible to everyone, everywhere. VIEWPOINT is committed to providing high-quality, free live TV streaming that works on any device — smartphone, tablet, or desktop — so you never miss a live match or your favourite show.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center space-y-4">
                    <Link href="/watch" className="inline-flex items-center gap-3 px-10 py-5 bg-neon-cyan text-vpoint-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-300 transition-all">
                        Watch Live TV Now <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Footer links */}
                <div className="pt-10 border-t border-white/5 flex flex-wrap gap-6">
                    {[["Home", "/"], ["Watch Live", "/watch"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"], ["DMCA", "/dmca"]].map(([label, href]) => (
                        <Link key={href} href={href} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-neon-cyan transition-colors">
                            {label}
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
