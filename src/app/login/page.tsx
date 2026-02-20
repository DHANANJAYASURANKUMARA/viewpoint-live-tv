"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) router.push("/watch");
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        const res = await loginUser(email, password);
        setLoading(false);
        if (res.success && res.user) {
            localStorage.setItem("vpoint-user", JSON.stringify(res.user));
            router.push("/watch");
        } else {
            setError(res.error || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass border border-white/10 rounded-[3rem] p-10 space-y-8 bg-white/[0.02]">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full mb-4">
                            <Zap size={14} className="text-neon-cyan" />
                            <span className="text-[9px] font-black text-neon-cyan uppercase tracking-widest">Viewpoint Access</span>
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Welcome <span className="text-neon-cyan">Back</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            Authenticate to access transmissions
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
                        >
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="operator@viewpoint.tv"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pr-14 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all placeholder:text-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-neon-cyan to-cyan-400 text-vpoint-dark rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-lg hover:shadow-neon-cyan/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-vpoint-dark/30 border-t-vpoint-dark rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={16} /> Access Transmissions
                                </>
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="text-center pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            No account?{" "}
                            <Link href="/signup" className="text-neon-cyan hover:text-white transition-colors font-black">
                                Create One <ArrowRight size={10} className="inline" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
