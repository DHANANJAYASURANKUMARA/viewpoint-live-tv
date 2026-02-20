"use client";

import React, { useState, useEffect } from "react";
import {
    Users as UsersIcon,
    Search,
    Activity,
    Clock,
    Filter,
    Ban,
    Trash2,
    ShieldCheck,
    Monitor,
    Globe,
    Mail,
    RefreshCw,
    AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUsers, banUser, deleteUser, getDbStats } from "@/lib/actions";

interface User {
    id: string;
    name: string;
    email: string;
    country: string | null;
    device: string | null;
    lastLogin: Date | null;
    isBanned: boolean | null;
    createdAt: Date | null;
}

export default function UsersActivityPage() {
    const [stats, setStats] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [userData, statsData] = await Promise.all([
            getUsers(),
            getDbStats()
        ]);
        setUsers(userData as User[]);
        if (statsData.success) setStats(statsData.stats);
        setLoading(false);
    };

    const handleBan = async (id: string, currentBanStatus: boolean | null) => {
        await banUser(id, !currentBanStatus);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, isBanned: !currentBanStatus } : u));
    };

    const handleDelete = async (id: string) => {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        setConfirmDelete(null);
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.country || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: Date | null) => {
        if (!date) return "Never";
        return new Date(date).toLocaleString();
    };

    const getDeviceShort = (device: string | null) => {
        if (!device) return "Unknown";
        if (device.toLowerCase().includes("mobile") || device.toLowerCase().includes("android") || device.toLowerCase().includes("iphone")) return "Mobile";
        if (device.toLowerCase().includes("tablet") || device.toLowerCase().includes("ipad")) return "Tablet";
        return "Desktop";
    };

    return (
        <div className="flex-1 h-full p-10 space-y-10 overflow-y-auto custom-scrollbar relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        User <span className="text-neon-cyan">Management</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Monitor & Control All Registered Users</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 px-8 py-4 glass border border-white/5 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Users</span>
                            <span className="text-xl font-black text-white">{stats?.users ?? users.length}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                            <UsersIcon size={18} />
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="p-4 glass border border-white/10 rounded-2xl text-slate-500 hover:text-neon-cyan transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-cyan transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME, EMAIL OR COUNTRY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] placeholder:text-slate-700 focus:outline-none focus:border-neon-cyan/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 px-6 py-5 glass border border-white/10 rounded-[2rem]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.filter(u => !u.isBanned).length} Active</span>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.filter(u => u.isBanned).length} Banned</span>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setConfirmDelete(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 glass border border-red-500/20 rounded-[2rem] p-10 max-w-sm w-full text-center space-y-6">
                            <AlertTriangle size={40} className="text-red-400 mx-auto" />
                            <div>
                                <h3 className="text-xl font-black text-white uppercase">Terminate User?</h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">This action is permanent and cannot be undone.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 glass border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400 transition-colors">Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="glass border border-white/10 rounded-[3rem] overflow-hidden bg-white/5">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 grid grid-cols-12 gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span className="col-span-3">Identity</span>
                    <span className="col-span-3">Email</span>
                    <span className="col-span-1 text-center">Country</span>
                    <span className="col-span-1 text-center">Device</span>
                    <span className="col-span-2 text-center">Last Login</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-1 text-right">Actions</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <div className="w-10 h-10 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scanning User Matrix...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <UsersIcon size={40} className="mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{users.length === 0 ? "No Registered Users Yet" : "No Users Match Search"}</span>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filtered.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-6 grid grid-cols-12 gap-4 items-center hover:bg-white/[0.02] transition-colors ${user.isBanned ? "opacity-50" : ""}`}
                            >
                                {/* Name */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                                        <UsersIcon size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase tracking-wide truncate">{user.name}</p>
                                        <p className="text-[8px] font-mono text-slate-600 truncate">{user.id.slice(0, 8)}...</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-span-3 flex items-center gap-2">
                                    <Mail size={12} className="text-slate-600 shrink-0" />
                                    <span className="text-[10px] font-mono text-neon-cyan truncate">{user.email}</span>
                                </div>

                                {/* Country */}
                                <div className="col-span-1 flex items-center justify-center gap-1">
                                    <Globe size={12} className="text-slate-600" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{user.country || "?"}</span>
                                </div>

                                {/* Device */}
                                <div className="col-span-1 flex items-center justify-center gap-1">
                                    <Monitor size={12} className="text-slate-600" />
                                    <span className="text-[9px] font-black text-slate-400">{getDeviceShort(user.device)}</span>
                                </div>

                                {/* Last Login */}
                                <div className="col-span-2 text-center">
                                    <p className="text-[9px] font-mono text-slate-500">{formatDate(user.lastLogin)}</p>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 flex items-center justify-center">
                                    {user.isBanned ? (
                                        <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[8px] font-black text-red-400 uppercase">Banned</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-400 uppercase">Active</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleBan(user.id, user.isBanned)}
                                        title={user.isBanned ? "Unban User" : "Ban User"}
                                        className={`p-2 rounded-xl transition-colors ${user.isBanned ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"}`}
                                    >
                                        {user.isBanned ? <ShieldCheck size={14} /> : <Ban size={14} />}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(user.id)}
                                        title="Delete User"
                                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
