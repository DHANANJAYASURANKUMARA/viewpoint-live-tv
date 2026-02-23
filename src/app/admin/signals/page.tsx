"use client";

import React, { useState, useEffect } from "react";
import {
    Radio,
    Plus,
    Search,
    Edit2,
    Trash2,
    ShieldAlert,
    Link as LinkIcon,
    Calendar,
    Eye,
    EyeOff,
    RefreshCw,
    Globe,
    Lock,
    Unlock,
    Activity,
    Server,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChannels, addChannel, updateChannel, deleteChannel, seedChannels, bulkMaskChannels } from "@/lib/actions";
import { initialChannels } from "@/lib/constants";

interface Signal {
    id: string;
    name: string;
    url: string;
    category: string;
    status: string;
    sniMask?: string;
    proxyActive?: boolean;
    scheduledAt?: string | Date | null;
    masked?: boolean;
    lastChecked?: string;
}

export default function SignalControlPage() {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSignal, setEditingSignal] = useState<Signal | null>(null);

    const [newSignal, setNewSignal] = useState({
        name: "",
        url: "",
        category: "Entertainment",
        sniMask: "",
        proxyActive: false,
        status: "Live",
        scheduledAt: ""
    });

    const loadSignals = async () => {
        setLoading(true);
        const data = await getChannels();
        setSignals(data as Signal[]);
        setLoading(false);
    };

    useEffect(() => {
        loadSignals();
    }, []);

    const handleBulkSync = async () => {
        setSyncing(true);
        const res = await seedChannels(initialChannels);
        await loadSignals();
        setSyncing(false);
        if (res.success) {
            alert(`Institutional Signal Sync Complete. ${res.count} new nodes established.`);
        } else {
            alert(`Signal Sync Failed: ${(res as any).error || 'Unknown error'}`);
        }
    };

    const handleAddSignal = async () => {
        const payload = {
            id: Date.now().toString(),
            name: newSignal.name.toUpperCase(),
            url: newSignal.url,
            category: newSignal.category,
            sniMask: newSignal.sniMask,
            proxyActive: newSignal.proxyActive,
            status: newSignal.status,
            scheduledAt: newSignal.status === 'Scheduled' ? new Date(newSignal.scheduledAt).toISOString() : null
        };
        const res = await addChannel(payload);
        if (res.success) {
            setIsAddModalOpen(false);
            setNewSignal({ name: "", url: "", category: "Entertainment", sniMask: "", proxyActive: false, status: "Live", scheduledAt: "" });
            loadSignals();
        } else {
            alert(`Injection Failed: ${(res as any).error || 'Unknown error'}`);
        }
    };

    const handleUpdateSignal = async () => {
        if (!editingSignal) return;
        const payload = {
            ...editingSignal,
            status: "Operational",
            scheduledAt: editingSignal.scheduledAt ? new Date(editingSignal.scheduledAt) : null
        } as any; // Cast as any to satisfy the complex Partial mismatch while maintaining data integrity
        const res = await updateChannel(editingSignal.id, payload);
        if (res.success) {
            setIsEditModalOpen(false);
            setEditingSignal(null);
            loadSignals();
        } else {
            alert(`Update Failed: ${(res as any).error || 'Unknown error'}`);
        }
    };

    const handleDeleteSignal = async (id: string) => {
        if (confirm("TERMINATE SIGNAL NODE?")) {
            const res = await deleteChannel(id);
            if (res.success) {
                loadSignals();
            } else {
                alert(`Deletion Failed: ${(res as any).error || 'Unknown error'}`);
            }
        }
    };

    const handleGlobalMask = async () => {
        if (confirm("APPLY GLOBAL MASK (m.facebook.com) TO ALL SIGNALS?")) {
            setSyncing(true);
            const res = await bulkMaskChannels("m.facebook.com");
            await loadSignals();
            setSyncing(false);
            if (res.success) {
                alert("Global Masking Matrix Established. All nodes now masked to m.facebook.com");
            } else {
                alert(`Masking Injection Failed: ${(res as any).error || 'Unknown error'}`);
            }
        }
    };

    const toggleSNI = async (id: string, current: boolean) => {
        await updateChannel(id, { proxyActive: !current });
        loadSignals();
    };

    const updateSNIMask = async (id: string, mask: string) => {
        await updateChannel(id, { sniMask: mask });
        loadSignals();
    };

    const filtered = signals.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-10 space-y-10 pb-20 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Signal <span className="text-neon-purple">Intelligence</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Manage Global Transmission Matrix & SNI Masking</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBulkSync}
                        disabled={syncing}
                        className="flex items-center gap-3 px-6 py-4 glass border border-white/10 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-neon-cyan/50 hover:text-white transition-all"
                    >
                        <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing..." : "Bulk Core Sync"}
                    </button>
                    <button
                        onClick={handleGlobalMask}
                        disabled={syncing}
                        className="flex items-center gap-3 px-6 py-4 glass border border-white/10 text-neon-magenta rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-neon-magenta/50 hover:bg-neon-magenta/5 transition-all"
                    >
                        <ShieldAlert size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Masking..." : "Inject Global Mask"}
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neon-purple hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                    >
                        <Plus size={16} /> Inject Signal
                    </button>
                </div>
            </div>

            {/* Tactical Search */}
            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-purple transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="SCANNINING FOR FREQUENCIES..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] placeholder:text-slate-700 focus:outline-none focus:border-neon-purple/50 transition-all"
                />
            </div>

            {/* Signal Grid */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <div className="w-10 h-10 rounded-full border-2 border-neon-purple border-t-transparent animate-spin mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intercepting Data Nodes...</span>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map((signal) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={signal.id}
                                className="glass border border-white/5 rounded-[2.5rem] p-8 bg-white/[0.01] flex flex-col xl:flex-row items-center justify-between gap-8 group hover:border-white/20 transition-all"
                            >
                                {/* Identity & Pulse */}
                                <div className="flex items-center gap-6 w-full xl:w-auto">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${signal.status === "Live" ? "bg-neon-purple/10 border-neon-purple/30 text-neon-purple" : signal.status === "Scheduled" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                        } shadow-2xl`}>
                                        <Radio size={24} className={signal.status === "Live" ? "animate-pulse" : ""} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-neon-purple transition-colors">{signal.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{signal.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                                            <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${signal.status === 'Live' ? 'text-emerald-500' : signal.status === 'Scheduled' ? 'text-amber-500' : 'text-slate-600'}`}>
                                                <Activity size={10} /> {signal.status === 'Live' ? 'Optimal Gain' : signal.status === 'Scheduled' ? 'Pending Launch' : 'Zero Signal'}
                                            </span>
                                            {signal.status === 'Scheduled' && signal.scheduledAt && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Calendar size={10} /> {new Date(signal.scheduledAt).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Intelligence Matrix */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                    <div className="space-y-3">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                            <Server size={10} /> SNI MASKING
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="MASK ENDPOINT..."
                                                defaultValue={signal.sniMask}
                                                onBlur={(e) => updateSNIMask(signal.id, e.target.value)}
                                                className="bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white font-mono focus:border-neon-cyan/50 outline-none w-full uppercase tracking-tighter"
                                            />
                                            <button
                                                onClick={() => toggleSNI(signal.id, signal.proxyActive || false)}
                                                className={`p-2 rounded-lg border transition-all ${signal.proxyActive ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan" : "bg-white/5 border-white/10 text-slate-700"
                                                    }`}
                                            >
                                                {signal.proxyActive ? <Lock size={14} /> : <Unlock size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                            <LinkIcon size={10} /> SOURCE ADDRESS
                                        </p>
                                        <p className="text-[10px] font-mono font-bold text-white truncate max-w-[200px] opacity-40">
                                            {signal.url}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldAlert size={10} /> SECURITY GRID
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${signal.proxyActive ? "bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]" : "bg-emerald-500"}`} />
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${signal.proxyActive ? "text-neon-cyan" : "text-emerald-500"}`}>
                                                {signal.proxyActive ? "SNI PROXY ACTIVE" : "DIRECT LINK SECURE"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tactical Actions */}
                                <div className="flex items-center gap-3 w-full xl:w-auto border-t xl:border-t-0 border-white/5 pt-6 xl:pt-0">
                                    <button
                                        onClick={() => {
                                            setEditingSignal(signal);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="p-4 rounded-xl glass-dark border border-white/10 text-slate-500 hover:text-white transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSignal(signal.id)}
                                        className="p-4 rounded-xl glass-dark border border-white/10 text-red-500/50 hover:text-red-500 hover:border-red-500/30 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Injection Modal */}
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-purple/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                                            <select
                                                value={newSignal.category}
                                                onChange={(e) => setNewSignal({ ...newSignal, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-purple/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Entertainment" className="bg-vpoint-dark">Entertainment</option>
                                                <option value="Sports" className="bg-vpoint-dark">Sports</option>
                                                <option value="News" className="bg-vpoint-dark">News</option>
                                                <option value="Movies" className="bg-vpoint-dark">Movies</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
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
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SNI Masking Key (Optional)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                placeholder="E.G. CLOUD.SERVER.COM"
                                                value={newSignal.sniMask}
                                                onChange={(e) => setNewSignal({ ...newSignal, sniMask: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-purple/50 transition-all font-mono"
                                            />
                                            <button
                                                onClick={() => setNewSignal({ ...newSignal, proxyActive: !newSignal.proxyActive })}
                                                className={`px-6 py-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${newSignal.proxyActive ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/10 text-slate-600"}`}
                                            >
                                                Proxy {newSignal.proxyActive ? "ON" : "OFF"}
                                            </button>
                                        </div>
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

            {/* Edit Modal */}
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
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Modulate <span className="text-neon-cyan">Signal</span></h2>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Structural Refinement of Data Node</p>
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
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                                            <select
                                                value={editingSignal.category}
                                                onChange={(e) => setEditingSignal({ ...editingSignal, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-neon-cyan/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Entertainment" className="bg-vpoint-dark">Entertainment</option>
                                                <option value="Sports" className="bg-vpoint-dark">Sports</option>
                                                <option value="News" className="bg-vpoint-dark">News</option>
                                                <option value="Movies" className="bg-vpoint-dark">Movies</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
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
                                        {editingSignal.status === 'Scheduled' && (
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Launch Date/Time</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editingSignal.scheduledAt ? new Date(new Date(editingSignal.scheduledAt).getTime() - (new Date(editingSignal.scheduledAt).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                                                    onChange={(e) => setEditingSignal({ ...editingSignal, scheduledAt: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Address</label>
                                        <input
                                            type="text"
                                            value={editingSignal.url}
                                            onChange={(e) => setEditingSignal({ ...editingSignal, url: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SNI Masking & Proxy</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={editingSignal.sniMask || ""}
                                                onChange={(e) => {
                                                    if (editingSignal) {
                                                        setEditingSignal({ ...editingSignal, sniMask: e.target.value });
                                                    }
                                                }}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xs font-bold text-white focus:outline-none focus:border-neon-cyan/50 transition-all font-mono"
                                            />
                                            <button
                                                onClick={() => setEditingSignal({ ...editingSignal, proxyActive: !editingSignal.proxyActive })}
                                                className={`px-6 py-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${editingSignal.proxyActive ? "bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/10 text-slate-600"}`}
                                            >
                                                Proxy {editingSignal.proxyActive ? "ON" : "OFF"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="py-5 glass-dark border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all"
                                    >
                                        Cancel
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
        </div>
    );
}
