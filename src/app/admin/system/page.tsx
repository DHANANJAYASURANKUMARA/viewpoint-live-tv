"use client";

import React, { useState } from "react";
import {
    Terminal,
    Cpu,
    Shield,
    RefreshCcw,
    Database,
    Zap,
    History,
    Search,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDbStats } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function SystemControlPage() {
    const [logs, setLogs] = useState([
        { id: 1, type: "AUTH", message: "Operator Admin synchronized securely", time: "14:24:08", status: "Success" },
        { id: 2, type: "SIGNAL", message: "ASIA TV link masked successfully", time: "14:12:30", status: "Success" },
        { id: 3, type: "CONFIG", message: "Global accent modulated to #06b6d4", time: "13:45:12", status: "Syncing" },
        { id: 4, type: "SYSTEM", message: "Vercel Analytics handshake established", time: "12:00:00", status: "Success" },
        { id: 5, type: "AUTH", message: "Failed handshake attempt from IP 192.168.1.1", time: "11:50:22", status: "Violation" },
    ]);

    const [dbStatus, setDbStatus] = useState<any>(null);
    const { config, updateConfig } = useConfig();

    React.useEffect(() => {
        getDbStats().then(res => setDbStatus(res));
    }, []);

    return (
        <div className="flex-1 h-full p-10 space-y-12 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Command <span className="text-amber-500">Logs</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Master System Manifest</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 glass border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">
                        <Download size={16} /> Export Logs
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all shadow-2xl">
                        <RefreshCcw size={16} /> Purge Buffer
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Master Logs Table */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <History size={16} className="text-amber-500" /> Command History
                        </h3>
                        <div className="relative group w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                            <input
                                type="text"
                                placeholder="FILTER MANIFEST..."
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="glass border border-white/10 rounded-[3rem] overflow-hidden bg-white/5">
                        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest uppercase">
                            <span className="w-20">Type</span>
                            <span className="flex-1">Operation Message</span>
                            <span className="w-20">Temporal</span>
                            <span className="w-20 text-right">Verification</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <div key={log.id} className="p-6 flex items-center gap-4 hover:bg-white/[0.01] transition-colors group">
                                    <div className="w-20">
                                        <span className={`px-2 py-1 rounded-md text-[8px] font-black border ${log.type === "AUTH" ? "border-amber-500/30 text-amber-500 bg-amber-500/5" :
                                            log.type === "SIGNAL" ? "border-neon-purple/30 text-neon-purple bg-neon-purple/5" :
                                                "border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5"
                                            }`}>
                                            {log.type}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                                            {log.message}
                                        </p>
                                    </div>
                                    <div className="w-20 text-[10px] font-mono text-slate-600">
                                        {log.time}
                                    </div>
                                    <div className="w-20 text-right">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${log.status === "Success" ? "text-emerald-500" :
                                            log.status === "Syncing" ? "text-neon-cyan" :
                                                "text-red-500"
                                            }`}>
                                            {log.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
                            <button className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-[0.4em] transition-colors">
                                Load Older Synchronizations
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Nodes */}
                <div className="space-y-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <Shield size={16} className="text-emerald-500" /> System Integrity
                    </h3>
                    <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/5 space-y-10">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan">
                                        <Database size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Neon DB</h4>
                                        <p className={`text-[9px] font-bold uppercase ${dbStatus?.success ? "text-emerald-500" : "text-amber-500"}`}>
                                            {dbStatus?.success ? "Synchronized" : "Establishing..."}
                                        </p>
                                    </div>
                                </div>
                                <Zap size={14} className={dbStatus?.success ? "text-emerald-500" : "text-amber-500"} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-purple">
                                        <Terminal size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Vercel Edge</h4>
                                        <p className="text-[9px] font-bold text-emerald-500 uppercase">Active</p>
                                    </div>
                                </div>
                                <Zap size={14} className="text-emerald-500" />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Toggles</h4>
                            <div className="space-y-4">
                                <button
                                    onClick={() => updateConfig({ maintenanceMode: !config.maintenanceMode })}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                                >
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Maintenance Mode</span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${config.maintenanceMode ? "bg-neon-magenta/80" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.maintenanceMode ? "right-1" : "left-1 bg-slate-700"}`} />
                                    </div>
                                </button>
                                <button
                                    onClick={() => updateConfig({ adSenseActive: !config.adSenseActive })}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                                >
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural AdSense</span>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${config.adSenseActive ? "bg-emerald-500/80" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSenseActive ? "right-1" : "left-1 bg-slate-700"}`} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 bg-black/40 border border-white/10 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Cpu size={16} className="text-amber-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Core v2.0.4 Alpha</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                System is currently operating under Alpha-level administrative protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
