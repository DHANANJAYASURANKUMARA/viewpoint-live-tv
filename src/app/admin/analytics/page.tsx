"use client";

import React from "react";
import {
    Activity,
    Users,
    Globe,
    Zap,
    TrendingUp,
    MousePointer2,
    Monitor,
    Smartphone,
    Layout
} from "lucide-react";
import { motion } from "framer-motion";
import { getDbStats } from "@/lib/actions";

export default function AnalyticsPage() {
    const [dbStats, setDbStats] = React.useState<any>(null);

    React.useEffect(() => {
        getDbStats().then(res => {
            if (res.success) setDbStats(res.stats);
        });
    }, []);

    const stats = [
        { label: "Total Signal Nodes", value: dbStats?.channels?.toString() || "...", delta: "+12%", icon: Globe, color: "text-neon-cyan" },
        { label: "Active Operators", value: dbStats?.operators?.toString() || "...", delta: "+5.4%", icon: Users, color: "text-neon-purple" },
        { label: "Saved Favorites", value: dbStats?.favorites?.toString() || "...", delta: "Stable", icon: Activity, color: "text-emerald-500" },
        { label: "Config Nodes", value: dbStats?.settings?.toString() || "...", delta: "-2ms", icon: Zap, color: "text-amber-500" },
    ];

    return (
        <div className="flex-1 h-full p-10 space-y-12 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Analytics <span className="text-emerald-500">Engine</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Real-time Human-Digital Telemetry</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 glass border border-white/10 rounded-2xl flex items-center gap-3">
                        <Activity size={16} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Pulse: Active</span>
                    </div>
                </div>
            </div>

            {/* Core Metrics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-6 bg-white/[0.02] hover:bg-white/5 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-full">
                                <span className={`text-[10px] font-black uppercase tracking-tight ${stat.delta.startsWith('+') ? 'text-emerald-500' : 'text-neon-cyan'}`}>{stat.delta}</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</h4>
                            <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Traffic Heatmap Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <TrendingUp size={16} className="text-neon-cyan" /> Engagement Trajectory
                    </h3>
                    <div className="glass border border-white/10 rounded-[3rem] p-10 h-[400px] bg-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] group-hover:opacity-100 transition-opacity opacity-0" />

                        <div className="flex flex-col items-center gap-6 relative z-10 text-center">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-slate-700">
                                <Activity size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-black text-white uppercase tracking-tighter opacity-30">Generating Heatmap...</h4>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Aggregating regional signal packets</p>
                            </div>
                        </div>

                        {/* Faux Grid Lines */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <Monitor size={16} className="text-neon-purple" /> Node Archetypes
                    </h3>
                    <div className="glass border border-white/10 rounded-[3rem] p-8 space-y-10 bg-white/5">
                        {[
                            { label: "Desktop Hubs", percentage: 65, icon: Monitor, color: "bg-neon-cyan" },
                            { label: "Mobile Handsets", percentage: 28, icon: Smartphone, color: "bg-neon-purple" },
                            { label: "Tablet Modules", percentage: 7, icon: Layout, color: "bg-neon-magenta" },
                        ].map((item) => (
                            <div key={item.label} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <item.icon size={16} className="text-slate-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MousePointer2 size={12} className="text-neon-cyan" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Clicks: 48k/hr</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={12} className="text-neon-purple" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Peek Load: 2.1 GB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
