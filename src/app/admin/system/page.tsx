"use client";

import React, { useState, useEffect } from "react";
import {
    Terminal,
    Activity,
    Cpu,
    Database,
    Shield,
    Zap,
    AlertCircle,
    ChevronRight,
    RefreshCw,
    Search,
    Radio,
    Settings as SettingsIcon,
    Save,
    History,
    Package,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotifications, getChannels, getSettings, updateSetting } from "@/lib/actions";

interface SystemLog {
    id: string;
    timestamp: Date | string;
    type: string;
    source: string;
    event: string;
    message?: string;
    status: string;
    severity: string;
    icon: React.ElementType;
    iconColor: string;
}

export default function MasterLogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"LOGS" | "CONTROL">("LOGS");
    const [config, setConfig] = useState<Record<string, string> | null>(null);
    const [saving, setSaving] = useState(false);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const [notifs, channelsData] = await Promise.all([
                getNotifications(),
                getChannels()
            ]);

            // Transform into unified log format
            const notifLogs: SystemLog[] = notifs.map(n => ({
                id: n.id,
                timestamp: n.createdAt || new Date(),
                type: "ALERT",
                source: "Neural Broadcast",
                event: n.title,
                message: n.message,
                severity: "INFO",
                status: "Processed",
                icon: AlertCircle,
                iconColor: "text-amber-500"
            }));

            const channelLogs: SystemLog[] = channelsData.map(c => ({
                id: c.id,
                timestamp: c.createdAt || new Date(),
                type: "SIGNAL",
                source: "Transmission Node",
                event: `Signal Modulation: ${c.name}`,
                message: `Status: ${c.status} | Category: ${c.category}`,
                severity: c.status === "Live" ? "OPTIMAL" : "WARN",
                status: c.status || "Unknown",
                icon: Radio,
                iconColor: c.status === "Live" ? "text-emerald-500" : "text-amber-500"
            }));

            // Static System Logs for depth
            const systemLogs: SystemLog[] = [
                { id: 's1', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: "CORE", source: "Kernel", event: "Handshake Successful", message: "Asian Edge Node Cluster synchronized.", severity: "INFO", status: "Nominal", icon: Shield, iconColor: "text-neon-cyan" },
                { id: 's2', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: "SECURITY", source: "Shield v2.0", event: "Intrusion Prevention", message: "Blocked anomalous request from IP 192.168.1.104", severity: "WARN", status: "Intercepted", icon: Zap, iconColor: "text-neon-magenta" },
                { id: 's3', timestamp: new Date(Date.now() - 1000 * 60 * 45), type: "DB", source: "Neon Matrix", event: "Index Maintenance", message: "Vacuuming signal_nodes table complete.", severity: "INFO", status: "Complete", icon: Database, iconColor: "text-emerald-500" }
            ];

            const combined = [...notifLogs, ...channelLogs, ...systemLogs].sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setLogs(combined);
        } catch (error) {
            console.error("Master Log Extraction Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadConfig = async () => {
        const res = await getSettings();
        if (res) setConfig(res);
    };

    const handleUpdateSetting = async (key: string, value: string) => {
        setSaving(true);
        const res = await updateSetting(key, value);
        if (res.success) {
            loadConfig();
        }
        setSaving(false);
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            loadLogs();
            loadConfig();
        });
        const interval = setInterval(loadLogs, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter(log => {
        if (filter !== "ALL" && log.type !== filter) return false;
        if (searchTerm && !log.event.toLowerCase().includes(searchTerm.toLowerCase()) && !(log.message || "").toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="p-10 space-y-10 pb-20 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Master <span className="text-emerald-500">System</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Unified System Intelligence & Control</p>
                </div>
                <div className="flex items-center gap-3 glass border border-white/5 rounded-2xl p-1.5">
                    <button
                        onClick={() => setActiveTab("LOGS")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "LOGS" ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                        Activity Feed
                    </button>
                    <button
                        onClick={() => setActiveTab("CONTROL")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "CONTROL" ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-white"}`}
                    >
                        Control & Versioning
                    </button>
                </div>
                <button
                    onClick={loadLogs}
                    className="flex items-center gap-3 px-6 py-4 glass border border-white/10 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500/10 transition-all"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Feed
                </button>
            </div>

            {activeTab === "LOGS" ? (
                <>
                    {/* Tactical Hud */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* ... logic for search/filter ... */}
                        <div className="lg:col-span-3 glass border border-white/10 rounded-[2.5rem] bg-white/[0.02] p-8 flex items-center justify-between gap-8">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="FILTERING SYSTEM STREAM..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] focus:outline-none focus:border-emerald-500/40 transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {["ALL", "ALERT", "SIGNAL", "CORE"].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilter(t)}
                                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === t ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-white/5 border-white/5 text-slate-600 hover:text-white"}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="glass border border-white/10 rounded-[2.5rem] bg-white/[0.02] p-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Flux</p>
                                <p className="text-xl font-black text-white">{filteredLogs.length}</p>
                            </div>
                            <Activity size={24} className="text-emerald-500 animate-pulse" />
                        </div>
                    </div>

                    {/* Log Matrix */}
                    <div className="glass border border-white/10 rounded-[3rem] overflow-hidden bg-white/5 custom-scrollbar">
                        <div className="p-8 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredLogs.map((log, idx) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        key={log.id + idx}
                                        className="group flex items-center gap-6 p-5 rounded-[1.5rem] bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all cursor-default"
                                    >
                                        <div className="text-[9px] font-mono text-slate-600 w-24 shrink-0">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest w-20 text-center border bg-white/5 ${log.iconColor} border-white/5`}>
                                            {log.type}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[11px] font-bold text-white uppercase tracking-tight">{log.event}</h4>
                                                <div className="h-1 w-1 rounded-full bg-slate-800" />
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{log.source}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate italic">{log.message}</p>
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest ${log.severity === 'WARN' ? 'text-amber-500' : log.severity === 'OPTIMAL' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {log.severity}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={14} className="text-slate-700" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredLogs.length === 0 && !loading && (
                                <div className="py-20 text-center opacity-20 space-y-4">
                                    <Terminal size={40} className="mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No log nodes detected in sector</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* System Version & Update */}
                    <div className="glass border border-white/10 rounded-[3rem] p-10 space-y-8 bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <Package size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase">Version Control</h3>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Manage platform build iterations</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Core Build Version</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={config?.version || ""}
                                        onChange={(e) => setConfig(prev => prev ? { ...prev, version: e.target.value } : null)}
                                        placeholder="v2.1.0"
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-sm font-mono font-black text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-all"
                                    />
                                    <button
                                        onClick={() => config && handleUpdateSetting("version", config.version)}
                                        disabled={saving}
                                        className="px-8 py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={14} /> {saving ? "Saving..." : "Update Build"}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 glass border border-white/5 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Update History</label>
                                    <History size={12} className="text-slate-600" />
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { v: "2.1.0", date: "FEB 24, 2026", note: "Nexus Profile Integration" },
                                        { v: "2.0.4", date: "FEB 23, 2026", note: "Security Patch & UI Cleanup" }
                                    ].map(upd => (
                                        <div key={upd.v} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                                            <div>
                                                <span className="text-[10px] font-mono text-emerald-400 font-black">{upd.v}</span>
                                                <p className="text-[8px] text-slate-600 uppercase font-black">{upd.note}</p>
                                            </div>
                                            <span className="text-[8px] font-mono text-slate-700">{upd.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Management */}
                    <div className="glass border border-white/10 rounded-[3rem] p-10 space-y-8 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase">Maintenance Mode</h3>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">Control platform availability</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 glass border border-white/5 rounded-full p-1">
                                <button
                                    onClick={() => handleUpdateSetting("maintenanceMode", "false")}
                                    className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${config?.maintenanceMode !== "true" ? "bg-white/5 text-slate-500" : "text-slate-700 hover:text-white"}`}
                                >
                                    OFF
                                </button>
                                <button
                                    onClick={() => handleUpdateSetting("maintenanceMode", "true")}
                                    className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${config?.maintenanceMode === "true" ? "bg-amber-500 text-white" : "text-slate-700 hover:text-white"}`}
                                >
                                    ON
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 glass border border-white/5 rounded-[2rem] space-y-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">System Lockdown Message</label>
                                <textarea
                                    value={config?.maintenanceMessage || ""}
                                    onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-xs text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all resize-none italic"
                                    placeholder="Enter message for logged out users..."
                                />
                                <button
                                    onClick={() => handleUpdateSetting("maintenanceMessage", config.maintenanceMessage)}
                                    disabled={saving}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Message"}
                                </button>
                            </div>

                            <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-center gap-4">
                                <CheckCircle2 size={20} className="text-amber-500 shrink-0" />
                                <p className="text-[10px] text-amber-500/70 font-medium leading-relaxed uppercase tracking-tight">
                                    Maintenance mode bypasses Super-Admins. Standard users and operators will be restricted to the maintenance overlay.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
