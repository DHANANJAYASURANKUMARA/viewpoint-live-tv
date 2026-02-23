"use client";

import React, { useState, useEffect } from "react";
import {
    Database,
    Table,
    RefreshCcw,
    Trash2,
    Activity,
    Server,
    Zap,
    AlertTriangle,
    CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { getDbStats, clearTable } from "@/lib/actions";

interface DbStats {
    channels: number;
    operators: number;
    favorites: number;
    settings: number;
}

export default function DatabaseManagementPage() {
    const [stats, setStats] = useState<DbStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadStats = async () => {
        setLoading(true);
        const res = await getDbStats();
        if (res.success) {
            setStats(res.stats);
        }
        setLoading(false);
    };

    useEffect(() => {
        Promise.resolve().then(() => loadStats());
    }, []);

    const handleClearTable = async (tableName: "channels" | "operators" | "favorites" | "settings") => {
        if (confirm(`ARE YOU ABSOLUTELY SURE? THIS WILL PURGE ALL DATA FROM ${tableName.toUpperCase()}!`)) {
            setActionLoading(tableName);
            const res = await clearTable(tableName);
            if (res.success) {
                await loadStats();
                alert(`${tableName.toUpperCase()} PURGED SUCCESSFULLY.`);
            }
            setActionLoading(null);
        }
    };

    return (
        <div className="flex-1 h-full p-10 space-y-10 overflow-y-auto custom-scrollbar relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Database <span className="text-neon-cyan">Management</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Internal Data Matrix Control</p>
                </div>
                <button
                    onClick={loadStats}
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 glass border border-white/10 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all"
                >
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> Refresh Matrix
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {([
                    { label: "Signal Nodes", val: stats?.channels || 0, color: "text-neon-purple", table: "channels" },
                    { label: "Operators", val: stats?.operators || 0, color: "text-amber-500", table: "operators" },
                    { label: "Favorites", val: stats?.favorites || 0, color: "text-neon-magenta", table: "favorites" },
                    { label: "Settings", val: stats?.settings || 0, color: "text-neon-cyan", table: "settings" }
                ] as const).map((s, i) => (
                    <div key={i} className="glass border border-white/5 p-8 rounded-[2.5rem] bg-white/[0.02] space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Table size={12} /> {s.label}
                            </p>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <Activity size={12} className={s.color} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                            <button
                                onClick={() => handleClearTable(s.table)}
                                disabled={actionLoading === s.table}
                                className="p-3 rounded-xl bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Matrix Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <Server size={16} className="text-neon-cyan" /> Persistence Engine
                    </h3>
                    <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">PostgreSQL / Neon</h4>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase">Synchronized & Secure</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle size={10} className="text-emerald-500" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase">Active</span>
                            </div>
                        </div>

                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
                                <span className="text-[10px] font-mono text-white">24ms</span>
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Uptime</span>
                                <span className="text-[10px] font-mono text-white">99.99%</span>
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Version</span>
                                <span className="text-[10px] font-mono text-white">v15.4.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                        <AlertTriangle size={16} className="text-amber-500" /> Operational Hazards
                    </h3>
                    <div className="glass border border-white/10 rounded-[3rem] p-10 bg-white/5 space-y-6">
                        <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3 text-red-500">
                                <Trash2 size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Structural Purge</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                Purging tables is an <span className="text-red-500">irreversible</span> operation. All associated relational data will be terminated across the matrix.
                            </p>
                        </div>
                        <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3 text-amber-500">
                                <Zap size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Neural Resync</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                                Heavy database operations may cause temporary desynchronization in the consumer sector.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
