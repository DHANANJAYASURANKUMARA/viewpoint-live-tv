import React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Globe, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - VIEWPOINT Live TV",
    description: "Contact the VIEWPOINT team for support, partnership inquiries, DMCA requests, or advertising. Reach us for free live TV streaming assistance.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-vpoint-dark text-slate-300 py-16 px-6">
            <div className="max-w-3xl mx-auto space-y-12">

                <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 glass border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-neon-cyan">
                        <Mail size={28} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Contact</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Get In <span className="text-neon-cyan">Touch</span></h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Have questions about our free live TV streaming service? Want to report an issue, request a channel, or partner with us? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            icon: Mail,
                            title: "General Support",
                            desc: "For questions about watching live TV, channel requests, or technical issues with our free streaming platform.",
                            email: "supportviewpointlivetv@gmail.com",
                        },
                        {
                            icon: Globe,
                            title: "Partnership & Advertising",
                            desc: "Interested in advertising on VIEWPOINT? Reach millions of live TV viewers. Contact our partnerships team.",
                            email: "adsviewpointlivetv@gmail.com",
                        },
                        {
                            icon: MessageSquare,
                            title: "DMCA & Legal",
                            desc: "For copyright concerns, content removal requests, or legal inquiries. We respond within 24–48 hours.",
                            email: "legalviewpointlivetv@gmail.com",
                        },
                        {
                            icon: Globe,
                            title: "Press & Media",
                            desc: "Media enquiries, press releases, and journalist access requests for VIEWPOINT Live TV.",
                            email: "pressviewpointlivetv@gmail.com",
                        },
                    ].map(({ icon: Icon, title, desc, email }) => (
                        <div key={title} className="glass border border-white/10 rounded-2xl p-6 space-y-3 bg-white/[0.02] hover:border-neon-cyan/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan">
                                    <Icon size={18} />
                                </div>
                                <h2 className="text-sm font-black text-white uppercase tracking-wide">{title}</h2>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                            <a href={`mailto:${email}`} className="text-[10px] font-mono text-neon-cyan hover:underline block">
                                {email}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="glass border border-white/10 rounded-2xl p-8 bg-white/[0.02] space-y-4">
                    <h2 className="text-sm font-black text-white uppercase tracking-wide">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is VIEWPOINT really free?", a: "Yes! VIEWPOINT is a completely free live TV streaming platform. No subscription, no credit card, no registration required to watch live channels." },
                            { q: "Can I watch T20 World Cup live for free?", a: "Yes, we stream major cricket tournaments including the T20 World Cup, IPL, and other international cricket series for free in HD." },
                            { q: "Which devices support VIEWPOINT?", a: "VIEWPOINT works on any device with a web browser — smartphone, tablet, laptop, PC, or smart TV. We also have an Android app available." },
                            { q: "How do I report a broken channel?", a: "Email us at supportviewpointlivetv@gmail.com with the channel name and we'll fix it within 24 hours." },
                        ].map(({ q, a }) => (
                            <div key={q} className="border-b border-white/5 pb-4">
                                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-wide">{q}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-wrap gap-6">
                    {[["Home", "/"], ["Watch Live", "/watch"], ["About", "/about"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["DMCA", "/dmca"]].map(([label, href]) => (
                        <Link key={href} href={href} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-neon-cyan transition-colors">
                            {label}
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

