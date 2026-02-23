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
    Shield,
    Edit2,
    Trash2,
    Calendar,
    Bell,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDbStats, getChannels, updateChannel, deleteChannel, addChannel } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function AdminDashboard() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const [dbStats, setDbStats] = useState<any>(null);
    const [channels, setChannels] = useState<any[]>([]);
    const { config, updateConfig } = useConfig();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingSignal, setEditingSignal] = useState<any>(null);
    const [newSignal, setNewSignal] = useState({
        name: "",
        url: "",
        category: "Entertainment",
        status: "Live",
        scheduledAt: ""
    });

    const loadData = async () => {
        const statsRes = await getDbStats();
        if (statsRes.success) setDbStats(statsRes.stats);

        const channelData = await getChannels();
        setChannels(channelData);
    };

    useEffect(() => {
        setIsMounted(true);
        const auth = localStorage.getItem("vpoint-admin-auth");
        if (!auth) {
            router.push("/admin/login");
        }

        loadData();
    }, [router]);

    const handleUpdateSignal = async () => {
        if (!editingSignal) return;
        // Convert local datetime-local value to UTC before saving
        const payload = { ...editingSignal };
        if (payload.status === 'Scheduled' && payload.scheduledAt) {
            payload.scheduledAt = new Date(payload.scheduledAt).toISOString();
        }
        const res = await updateChannel(editingSignal.id, payload);
        if (res.success) {
            setIsEditModalOpen(false);
            setEditingSignal(null);
            loadData();
        } else {
            alert(`Update Failed: ${(res as any).error || 'Unknown error'}`);
        }
    };

    const handleAddSignal = async () => {
        const payload = {
            id: Date.now().toString(),
            name: newSignal.name.toUpperCase(),
            url: newSignal.url,
            category: newSignal.category,
            status: newSignal.status,
            scheduledAt: newSignal.status === 'Scheduled' ? new Date(newSignal.scheduledAt).toISOString() : null
        };
        const res = await addChannel(payload);
        if (res.success) {
            setIsAddModalOpen(false);
            setNewSignal({ name: "", url: "", category: "Entertainment", status: "Live", scheduledAt: "" });
            loadData();
        } else {
            alert(`Injection Failed: ${(res as any).error || 'Unknown error'}`);
        }
    };

    const handleDeleteSignal = async (id: string) => {
        if (confirm("TERMINATE SIGNAL NODE?")) {
            const res = await deleteChannel(id);
            if (res.success) {
                loadData();
            } else {
                alert(`Deletion Failed: ${(res as any).error || 'Unknown error'}`);
            }
        }
    };

    if (!isMounted) return null;

    const stats = [
        { label: "Active Channels", value: dbStats?.channels?.toString() || "...", icon: Globe, color: "text-neon-cyan" },
        { label: "Active Operators", value: dbStats?.operators?.toString() || "...", icon: Zap, color: "text-neon-purple" },
        { label: "Signal Uptime", value: "99.998%", icon: Shield, color: "text-emerald-500" },
        { label: "Config Nodes", value: dbStats?.settings?.toString() || "...", icon: Activity, color: "text-amber-500" },
    ];

    return (
        <div className="p-10 space-y-12 pb-20">
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

            {/* Command Center: Quick Actions */}
            <div className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-4">
                    <Zap size={16} className="text-neon-cyan" /> Command Center
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: "Broadcast Alert",
                            description: "Global Neural Transmission",
                            icon: Bell,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10",
                            border: "border-amber-500/20",
                            action: () => router.push("/admin/notifications")
                        },
                        {
                            label: "Mask All Signals",
                            description: "Global SNI Obfuscation",
                            icon: Shield,
                            color: "text-neon-cyan",
                            bg: "bg-neon-cyan/10",
                            border: "border-neon-cyan/20",
                            action: async () => {
                                if (confirm("INITIATE GLOBAL MASKING SEQUENCE?")) {
                                    const { bulkUpdateChannelMasks } = await import("@/lib/actions");
                                    await bulkUpdateChannelMasks("m.facebook.com");
                                    alert("SHIELD PROTOCOLS ACTIVE");
                                }
                            }
                        },
                        {
                            label: "Node Database",
                            description: "Core Data Management",
                            icon: Database,
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10",
                            border: "border-emerald-500/20",
                            action: () => router.push("/admin/database")
                        },
                        {
                            label: "Purge System Logs",
                            description: "Terminal History Wipe",
                            icon: Trash2,
                            color: "text-red-500",
                            bg: "bg-red-500/10",
                            border: "border-red-500/20",
                            action: async () => {
                                if (confirm("EXECUTE TOTAL LOG PURGE?")) {
                                    const { clearNotifications } = await import("@/lib/actions");
                                    await clearNotifications();
                                    alert("VOORHEES PROTOCOL COMPLETE");
                                }
                            }
                        },
                    ].map((cmd, i) => (
                        <button
                            key={i}
                            onClick={cmd.action}
                            className={`group p-8 glass border ${cmd.border} rounded-[2.5rem] bg-white/[0.02] text-left transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-white/[0.04]`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${cmd.bg} border ${cmd.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <cmd.icon size={24} className={cmd.color} />
                            </div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 group-hover:text-neon-cyan transition-colors">{cmd.label}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{cmd.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Signals Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <Radio size={16} className="text-neon-purple" /> Active Signals
                        </h3>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-purple hover:text-white transition-all"
                        >
                            <Plus size={14} /> Inject Signal
                        </button>
                    </div>
                    <div className="glass border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/5 admin-table-container">
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
                                {channels.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] ${row.status === 'Live' ? 'bg-emerald-500' : row.status === 'Scheduled' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                <span className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-neon-cyan transition-colors">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.category}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[10px] font-mono font-bold ${row.status === 'Live' ? 'text-emerald-500' : row.status === 'Scheduled' ? 'text-amber-500' : 'text-red-500'}`}>{row.status}</span>
                                                {row.status === 'Scheduled' && row.scheduledAt && (
                                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                        <Calendar size={8} /> {new Date(row.scheduledAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingSignal(row);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:border-white/10 transition-all"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSignal(row.id)}
                                                    className="p-2 rounded-lg bg-white/5 border border-white/5 text-red-500/50 hover:text-red-500 hover:border-red-500/30 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
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
            {/* Dashboard Edit Modal Injection */}
            <AnimatePresence>
                {isEditModalOpen && editingSignal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
                            onClick={() => setIsEditModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-xl glass border border-white/10 rounded-[3rem] p-10 relative z-10 bg-vpoint-dark"
                        >
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quick <span className="text-neon-cyan">Modulation</span></h2>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Rapid Structural Revision</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                                            <input
                                                type="text"
                                                value={editingSignal.name}
                                                onChange={(e) => setEditingSignal({ ...editingSignal, name: e.target.value.toUpperCase() })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/50 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lifecycle State</label>
                                            <select
                                                value={editingSignal.status}
                                                onChange={(e) => setEditingSignal({ ...editingSignal, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Live">Live</option>
                                                <option value="Offline">Offline</option>
                                                <option value="Scheduled">Scheduled</option>
                                            </select>
                                        </div>
                                    </div>
                                    {editingSignal.status === 'Scheduled' && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Launch Date/Time</label>
                                            <input
                                                type="datetime-local"
                                                value={editingSignal.scheduledAt ? new Date(new Date(editingSignal.scheduledAt).getTime() - (new Date(editingSignal.scheduledAt).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                                                onChange={(e) => setEditingSignal({ ...editingSignal, scheduledAt: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="py-5 glass-dark border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handleUpdateSignal}
                                        className="py-5 bg-white text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neon-cyan hover:text-white transition-all shadow-2xl"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Dashboard Add Modal Injection */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-xl glass border border-white/10 rounded-[3rem] p-10 relative z-10 bg-vpoint-dark"
                        >
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Inject <span className="text-neon-purple">Signal</span></h2>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Establish New Transmission Node</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                                            <input
                                                type="text"
                                                placeholder="SIGNAL ID"
                                                value={newSignal.name}
                                                onChange={(e) => setNewSignal({ ...newSignal, name: e.target.value.toUpperCase() })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-purple/50 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lifecycle State</label>
                                            <select
                                                value={newSignal.status}
                                                onChange={(e) => setNewSignal({ ...newSignal, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-purple/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Live">Live</option>
                                                <option value="Offline">Offline</option>
                                                <option value="Scheduled">Scheduled</option>
                                            </select>
                                        </div>
                                    </div>
                                    {newSignal.status === 'Scheduled' && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Launch Date/Time</label>
                                            <input
                                                type="datetime-local"
                                                value={newSignal.scheduledAt || ""}
                                                onChange={(e) => setNewSignal({ ...newSignal, scheduledAt: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all font-mono"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                                        <select
                                            value={newSignal.category}
                                            onChange={(e) => setNewSignal({ ...newSignal, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-purple/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Sports">Sports</option>
                                            <option value="News">News</option>
                                            <option value="Movies">Movies</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Address (M3U8/MPD)</label>
                                        <input
                                            type="text"
                                            placeholder="HTTPS://..."
                                            value={newSignal.url}
                                            onChange={(e) => setNewSignal({ ...newSignal, url: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="py-5 glass-dark border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={handleAddSignal}
                                        className="py-5 bg-white text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neon-purple hover:text-white transition-all shadow-2xl"
                                    >
                                        Confirm Injection
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
