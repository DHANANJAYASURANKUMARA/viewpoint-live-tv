"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) router.push("/watch");
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const res = await registerUser(name, email, password);
        setLoading(false);

        if (res.success && res.user) {
            localStorage.setItem("vpoint-user", JSON.stringify(res.user));
            router.push("/watch");
        } else {
            setError(res.error || "Registration failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-[120px] animate-pulse delay-1000" />
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/10 border border-neon-purple/20 rounded-full mb-4">
                            <Zap size={14} className="text-neon-purple" />
                            <span className="text-[9px] font-black text-neon-purple uppercase tracking-widest">New Identity</span>
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Create <span className="text-neon-purple">Account</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            Establish your transmission identity
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
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5"
                            >
                                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                                {showPassword ? "Hide" : "Show"} Passwords
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-neon-purple to-purple-400 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-lg hover:shadow-neon-purple/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={16} /> Establish Identity
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center pt-4 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Already have access?{" "}
                            <Link href="/login" className="text-neon-purple hover:text-white transition-colors font-black">
                                Log In <ArrowRight size={10} className="inline" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
