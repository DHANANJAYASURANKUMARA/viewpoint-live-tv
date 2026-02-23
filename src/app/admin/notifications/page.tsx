"use client";

import React, { useState, useEffect } from "react";
import {
    Send, Trash2, Bell, AlertTriangle,
    Info, CheckCircle, XCircle, History,
    Radio, Activity, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotifications, sendGlobalNotification, deleteNotification, clearNotifications } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function AdminNotifications() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("INFO");
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { config, updateConfig } = useConfig();

    const loadHistory = async () => {
        const data = await getNotifications();
        setHistory(data.reverse());
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) return;

        setIsLoading(true);
        const res = await sendGlobalNotification({ title, message, type });
        setIsLoading(false);

        if (res.success) {
            setTitle("");
            setMessage("");
            loadHistory();
        }
    };

    const handleDelete = async (id: string) => {
        const res = await deleteNotification(id);
        if (res.success) loadHistory();
    };

    const handlePurge = async () => {
        if (!confirm("PURGE ALL LOGS? This cannot be undone.")) return;
        const res = await clearNotifications();
        if (res.success) loadHistory();
    };

    const typeOptions = [
        { id: "INFO", label: "Protocol Info", icon: <Info size={14} />, color: "text-neon-cyan" },
        { id: "ALERT", label: "Critical Alert", icon: <AlertTriangle size={14} />, color: "text-amber-500" },
        { id: "SUCCESS", label: "Sync Complete", icon: <CheckCircle size={14} />, color: "text-emerald-500" },
        { id: "WARNING", label: "Structural Warn", icon: <XCircle size={14} />, color: "text-rose-500" },
    ];

    return (
        <div className="p-8 space-y-10 max-w-7xl mx-auto pb-20">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neon-cyan mb-2">
                        <Radio size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Broadcast Frequency: Alpha</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                        Signal <span className="text-neon-cyan">Broadcaster</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 glass-dark border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active nodes</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Real-time sync</span>
                        </div>
                        <Activity size={24} className="text-neon-cyan opacity-50" />
                    </div>
                </div>
            </div>

            {/* System Config HUD */}
            <div className="glass-dark border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-neon-cyan/5 to-transparent">
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border transition-all duration-500 ${config.notificationsEnabled ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_30px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/10 text-slate-500"}`}>
                        <Bell size={28} className={config.notificationsEnabled ? "animate-bounce" : ""} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Global Signal Hub</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Master system control for all terminal notifications
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => { window.location.reload(); }}
                            className="p-3 glass border border-white/5 rounded-2xl text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all flex items-center gap-2"
                            title="Force System Sync"
                        >
                            <Activity size={16} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">Sync Nodes</span>
                        </button>
                        <button
                            onClick={async () => {
                                await sendGlobalNotification({
                                    title: "DIAGNOSTIC SIGNAL",
                                    message: "Pulse transmission successful. Neural link established.",
                                    type: "SUCCESS"
                                });
                                loadHistory();
                            }}
                            className="p-3 glass border border-white/5 rounded-2xl text-white/40 hover:text-emerald-400 hover:border-emerald-400/30 transition-all flex items-center gap-2"
                        >
                            <Send size={16} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">Test Signal</span>
                        </button>
                    </div>

                    <div className="h-10 w-[1px] bg-white/5 mx-2" />

                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${config.notificationsEnabled ? "text-emerald-400" : "text-rose-500"}`}>
                            System {config.notificationsEnabled ? "Active" : "Offline"}
                        </span>
                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">Synchronized with nodes</span>
                    </div>

                    <button
                        onClick={() => updateConfig({ notificationsEnabled: !config.notificationsEnabled })}
                        className={`relative w-20 h-10 rounded-full transition-all duration-500 p-1.5 ${config.notificationsEnabled ? "bg-neon-cyan/20 border border-neon-cyan/30" : "bg-white/5 border border-white/10"}`}
                    >
                        <motion.div
                            animate={{ x: config.notificationsEnabled ? 40 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${config.notificationsEnabled ? "bg-neon-cyan" : "bg-slate-600"}`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-white ${config.notificationsEnabled ? "animate-pulse" : ""}`} />
                        </motion.div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Composition HUD */}
                <div className="lg:col-span-1 space-y-8">
                    <form onSubmit={handleBroadcast} className="glass-dark border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Send size={18} className="text-neon-cyan" />
                                <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Compose Pulse</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 italic">Broadcast Header</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SYSTEM UPGRADE"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-vpoint-dark/50 border border-white/5 rounded-full px-6 py-4 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/30 placeholder:text-slate-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 italic">Pulse Payload</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter transmission details..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-vpoint-dark/50 border border-white/5 rounded-[2rem] px-6 py-5 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/30 placeholder:text-slate-700 resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 italic">Protocol Classification</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {typeOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setType(opt.id)}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${type === opt.id
                                                ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                : "bg-transparent border-white/5 hover:border-white/10"
                                                }`}
                                        >
                                            <div className={`${opt.color}`}>{opt.icon}</div>
                                            <span className={`text-[9px] font-black uppercase tracking-tighter ${type === opt.id ? "text-white" : "text-slate-500"}`}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading || !title || !message}
                            className="w-full py-5 bg-white text-vpoint-dark rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-neon-cyan transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Activity className="animate-spin" size={16} />
                            ) : (
                                <>
                                    BROADCAST SIGNAL <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="p-8 glass-dark border border-white/5 rounded-[2rem] flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-neon-magenta/10 border border-neon-magenta/20 flex items-center justify-center text-neon-magenta">
                            <Shield size={24} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Institutional Integrity</h4>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed">
                                All broadcasts are logged in the system telemetry for audit purposes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Log History HUD */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-dark border border-white/10 rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <History size={20} className="text-neon-cyan" />
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">Transmission Logs</h2>
                            </div>
                            {history.length > 0 && (
                                <button
                                    onClick={handlePurge}
                                    className="flex items-center gap-2 text-[9px] font-black text-rose-500/70 hover:text-rose-500 uppercase tracking-widest transition-colors group"
                                >
                                    <Trash2 size={12} className="group-hover:scale-110 transition-transform" /> PURGE VOID
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                            {history.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20 py-40">
                                    <Bell className="w-20 h-20" />
                                    <div className="space-y-2">
                                        <p className="text-sm font-black uppercase tracking-[0.5em]">No Broadcast History</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest">System is currently silent</p>
                                    </div>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {history.map((log) => (
                                        <motion.div
                                            key={log.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group relative p-6 glass border border-white/5 rounded-3xl hover:bg-white/[0.03] transition-all hover:border-white/20"
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className="mt-1">
                                                    {typeOptions.find(o => o.id === log.type)?.icon}
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-[12px] font-black text-white uppercase tracking-tight">{log.title}</h4>
                                                            <span className={`text-[8px] font-bold bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-tighter ${typeOptions.find(o => o.id === log.type)?.color}`}>
                                                                {log.type}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter italic">
                                                            {new Date(log.createdAt).toLocaleDateString()} — {new Date(log.createdAt).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic pr-12">
                                                        {log.message}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 transition-all hover:bg-rose-500/10 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
