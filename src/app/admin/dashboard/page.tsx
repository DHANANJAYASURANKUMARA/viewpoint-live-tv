"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    Cpu,
    Zap,
    Globe,
    Radio,
    AlertCircle,
    Plus,
    MoreVertical,
    TrendingUp,
    Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { getDbStats, getChannels } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function AdminDashboard() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const [dbStats, setDbStats] = useState<any>(null);
    const [channels, setChannels] = useState<any[]>([]);
    const { config, updateConfig } = useConfig();

    useEffect(() => {
        setIsMounted(true);
        const auth = localStorage.getItem("vpoint-admin-auth");
        if (!auth) {
            router.push("/admin/login");
        }

        getDbStats().then(res => {
            if (res.success) setDbStats(res.stats);
        });

        getChannels().then(data => {
            setChannels(data);
        });
    }, [router]);

    if (!isMounted) return null;

    const stats = [
        { label: "Active Channels", value: dbStats?.channels?.toString() || "...", icon: Globe, color: "text-neon-cyan" },
        { label: "Active Operators", value: dbStats?.operators?.toString() || "...", icon: Zap, color: "text-neon-purple" },
        { label: "Signal Uptime", value: "99.998%", icon: Shield, color: "text-emerald-500" },
        { label: "Config Nodes", value: dbStats?.settings?.toString() || "...", icon: Activity, color: "text-amber-500" },
    ];

    return (
        <div className="flex-1 h-full p-10 space-y-12 overflow-y-auto custom-scrollbar">
            {/* Welcome Header */}
            <div className="flex items-center justify-between group">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Dashboard <span className="text-neon-cyan">Overview</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrated Platform Telemetry</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 glass border border-white/10 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Nodes Operational</span>
                    </div>
                </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="glass border border-white/10 rounded-[2rem] p-8 space-y-4 hover:border-white/20 transition-all cursor-crosshair group bg-white/5"
                    >
                        <div className="flex items-center justify-between">
                            <stat.icon size={20} className={stat.color} />
                            <TrendingUp size={14} className="text-emerald-500 opacity-30" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</h4>
                            <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Signals Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <Radio size={16} className="text-neon-purple" /> Active Signals
                        </h3>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-purple hover:text-white transition-all">
                            <Plus size={14} /> Inject Signal
                        </button>
                    </div>
                    <div className="glass border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/5">
                        <table className="w-full text-left">
                            <thead className="border-b border-white/5 bg-white/[0.02]">
                                <tr>
                                    <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Name</th>
                                    <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Sector</th>
                                    <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {channels.slice(0, 5).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] ${row.status === 'Live' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <span className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-neon-cyan transition-colors">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.category}</td>
                                        <td className="px-8 py-6 text-[10px] font-mono font-bold text-blue-500">{row.status}</td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => router.push('/admin/signals')}
                                                className="text-slate-700 hover:text-white transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {channels.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center opacity-30 text-[10px] uppercase font-black tracking-widest">
                                            No signals detected in matrix
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Alerts & Config */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <Cpu size={16} className="text-amber-500" /> Neural Health
                    </h3>
                    <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-8 bg-white/5">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Congestion Link-04</h5>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">Latency spike detected in Asian edge node cluster.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <Shield size={20} className="text-emerald-500 shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Privacy Shield v2.0</h5>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">Handshake encryption protocols operating at peak efficiency.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <button
                                onClick={() => updateConfig({ neuralHudEnabled: !config.neuralHudEnabled })}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Neural HUD</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.neuralHudEnabled ? "bg-neon-cyan/80" : "bg-white/5"}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.neuralHudEnabled ? "right-1" : "left-1 bg-slate-700"}`} />
                                </div>
                            </button>
                            <button
                                onClick={() => updateConfig({ maintenanceMode: !config.maintenanceMode })}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Maintenance Mode</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${config.maintenanceMode ? "bg-neon-magenta/80" : "bg-white/5"}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.maintenanceMode ? "right-1" : "left-1 bg-slate-700"}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
