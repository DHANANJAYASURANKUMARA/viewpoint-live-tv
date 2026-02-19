"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, ArrowRight, User, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulated secure handshake
        setTimeout(() => {
            if (username === "admin" && password === "viewpoint2026") {
                localStorage.setItem("vpoint-admin-auth", "true");
                router.push("/admin/dashboard");
            } else {
                setError("NEURAL MISMATCH: UNAUTHORIZED CREDENTIALS");
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-vpoint-dark flex items-center justify-center p-6 selection:bg-neon-cyan/30 overflow-hidden relative">
            {/* Background Neural Pulse */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mb-6 shadow-2xl backdrop-blur-2xl">
                        <Shield size={32} className="text-neon-cyan animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Command <span className="text-neon-cyan">Center</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Administrative Handshake Required</p>
                </div>

                {/* Login Terminal */}
                <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 bg-white/5 relative overflow-hidden">
                    {/* Progress Bar for Loading */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.5 }}
                                className="w-full h-full bg-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                            />
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-cyan transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="OPERATOR ID"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white uppercase tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-neon-cyan/50 transition-all"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-cyan transition-colors" size={16} />
                                <input
                                    type="password"
                                    placeholder="ACCESS KEY"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white uppercase tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-neon-cyan/50 transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[9px] font-black text-red-500 tracking-widest uppercase text-center"
                            >
                                <Terminal size={14} /> {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-white text-vpoint-dark rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? "VERIFYING..." : (
                                <>
                                    Initiate Login <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Trace */}
                <div className="mt-10 text-center opacity-20">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white">
                        © 2026 VIEWPOINT Neural Systems • System v2.0.4
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
