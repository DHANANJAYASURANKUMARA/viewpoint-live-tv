"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Calendar,
    Mail,
    Globe,
    Camera,
    Save,
    Share2,
    Github,
    Twitter,
    Linkedin as LinkedIn,
    Instagram,
    Gift,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserProfile } from "@/lib/actions";

export default function NexusProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [isBirthday, setIsBirthday] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) {
            try {
                const parsed = JSON.parse(session);
                setUser(parsed);

                // Check birthday
                if (parsed.birthday) {
                    const bday = new Date(parsed.birthday);
                    const today = new Date();
                    if (bday.getDate() === today.getDate() && bday.getMonth() === today.getMonth()) {
                        setIsBirthday(true);
                    }
                }
            } catch { }
        }
        setLoading(false);
    }, []);

    const handleSave = async () => {
        if (!user?.id) return;
        setSaving(true);
        setStatus(null);

        const res = await updateUserProfile(user.id, {
            displayName: user.displayName,
            bio: user.bio,
            birthday: user.birthday,
            socialLinks: JSON.stringify(user.socialLinks || {})
        });

        if (res.success) {
            setStatus({ type: 'success', msg: 'Neural profile synchronized.' });
            localStorage.setItem("vpoint-user", JSON.stringify(user));
        } else {
            setStatus({ type: 'error', msg: 'Synch failed: ' + res.error });
        }
        setSaving(false);
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-neon-cyan animate-pulse font-black uppercase tracking-[0.5em]">Calibrating Nexus...</div>;

    return (
        <div className="min-h-screen p-6 lg:p-20 space-y-12 pb-32">
            {/* Birthday Hub Overlay */}
            <AnimatePresence>
                {isBirthday && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass border border-neon-magenta/30 p-10 rounded-[3rem] bg-neon-magenta/5 relative overflow-hidden text-center space-y-6 mb-10"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 mx-auto bg-neon-magenta/20 rounded-full flex items-center justify-center text-neon-magenta shadow-[0_0_30px_rgba(255,45,85,0.3)]"
                        >
                            <Gift size={40} />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Happy <span className="text-neon-magenta">Birthday</span></h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Nexus Optimization Event Detected</p>
                        </div>
                        <p className="text-slate-400 text-sm italic max-w-md mx-auto">
                            The Viewpoint Matrix wishes you a productive solar iteration. Signal strength boosted for your special day.
                        </p>
                        <Sparkles className="absolute top-10 left-10 text-neon-cyan/20 animate-ping" size={48} />
                        <Sparkles className="absolute bottom-10 right-10 text-neon-magenta/20 animate-ping delay-500" size={48} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Nexus <span className="text-neon-cyan">Profile</span></h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Personal Data Management Sector</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-10 py-5 bg-neon-cyan text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] flex items-center gap-3 disabled:opacity-50"
                    >
                        <Save size={16} /> {saving ? "Syncing..." : "Commit Changes"}
                    </button>
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                    >
                        {status.msg}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Avatar & Identity */}
                    <div className="space-y-8">
                        <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] text-center space-y-6">
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-black/40 border-2 border-dashed border-white/10 flex items-center justify-center text-slate-700 overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase">{user?.displayName || user?.name}</h3>
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{user?.email}</p>
                            </div>
                        </div>

                        {/* Social Links Grid */}
                        <div className="glass border border-white/10 rounded-[3rem] p-8 bg-white/[0.02] space-y-6">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest text-center">Social Interlinks</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'twt', icon: Twitter, color: 'text-blue-400' },
                                    { id: 'gh', icon: Github, color: 'text-white' },
                                    { id: 'li', icon: LinkedIn, color: 'text-blue-600' },
                                    { id: 'ig', icon: Instagram, color: 'text-pink-500' }
                                ].map(soc => (
                                    <div key={soc.id} className="p-4 glass-dark border border-white/5 rounded-2xl flex items-center justify-center group hover:border-white/20 transition-all cursor-pointer">
                                        <soc.icon size={20} className={`${soc.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Data Entry */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] space-y-10">
                            {/* Core Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Identification</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            type="text"
                                            value={user?.displayName || ""}
                                            onChange={(e) => setUser({ ...user, displayName: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/50 transition-all uppercase"
                                            placeholder="NEXUS_OPERATOR_01"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Solar Iteration (Birthday)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            type="date"
                                            value={user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/50 transition-all uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Bio</label>
                                <textarea
                                    value={user?.bio || ""}
                                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-8 text-[11px] font-medium text-slate-400 focus:outline-none focus:border-neon-cyan/50 transition-all resize-none italic leading-relaxed"
                                    placeholder="Tell the matrix about yourself..."
                                />
                            </div>

                            {/* Automated Hub Info */}
                            <div className="p-8 bg-neon-cyan/5 border border-neon-cyan/10 rounded-[2rem] flex items-center gap-6">
                                <div className="w-12 h-12 bg-neon-cyan/20 rounded-2xl flex items-center justify-center text-neon-cyan shrink-0">
                                    <Sparkles size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Automation Ready</p>
                                    <p className="text-[9px] text-slate-500 font-medium">Your birthday is used to trigger automated "Nexus Wishes" across the platform.</p>
                                </div>
                            </div>
                        </div>

                        {/* Network Intel */}
                        <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Globe size={24} className="text-slate-700" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Network Location</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-black">{user?.location || user?.country || "HIDDEN_VECTOR"}</p>
                                </div>
                            </div>
                            <Share2 size={18} className="text-slate-700 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
