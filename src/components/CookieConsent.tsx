"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("vpoint-cookies-consent");
        if (!consent) {
            // Small delay so it doesn't jar on first load
            setTimeout(() => setVisible(true), 1500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("vpoint-cookies-consent", "accepted");
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("vpoint-cookies-consent", "declined");
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-4"
                >
                    <div className="glass border border-white/10 rounded-[2rem] p-6 bg-vpoint-dark/95 backdrop-blur-3xl shadow-2xl shadow-black/50">
                        <div className="flex items-start gap-5">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0">
                                <Cookie size={22} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Cookie & Cache Policy</h3>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full">
                                        <Shield size={10} className="text-neon-cyan" />
                                        <span className="text-[8px] font-black text-neon-cyan uppercase tracking-widest">Secure</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    We use cookies and local cache to personalize your viewing experience, remember channel preferences, and improve performance. See our{" "}
                                    <Link href="/privacy" className="text-neon-cyan hover:underline">Privacy Policy</Link> for details.
                                </p>

                                {/* Buttons */}
                                <div className="flex items-center gap-3 mt-4">
                                    <button
                                        onClick={handleAccept}
                                        className="px-6 py-2.5 bg-neon-cyan text-vpoint-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-lg shadow-neon-cyan/20"
                                    >
                                        Accept All
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="px-6 py-2.5 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                                    >
                                        Decline
                                    </button>
                                    <Link href="/privacy" className="ml-auto text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                                        Learn More
                                    </Link>
                                </div>
                            </div>

                            {/* Close */}
                            <button onClick={handleDecline} className="text-slate-600 hover:text-white transition-colors shrink-0">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
