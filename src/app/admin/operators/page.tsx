"use client";

import React, { useState, useEffect } from "react";
import {
    Users, UserPlus, Shield, ShieldAlert, ShieldCheck, Trash2,
    Search, Eye, EyeOff, RefreshCw, Lock, AlertTriangle, Star,
    Ban, Activity, Key, Copy, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getOperators,
    manageOperator
} from "@/lib/actions";
import {
    manageOperatorFull,
    deleteOperatorSecure,
    suspendOperator,
    changeSuperAdminCredentials
} from "@/lib/adminAuth";

interface Operator {
    id: string;
    name: string;
    loginId: string | null;
    role: string;
    isSuperAdmin: boolean | null;
    status: string | null;
    lastActive: Date | null;
    createdAt: Date | null;
}

export default function OperatorManagementPage() {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentActor, setCurrentActor] = useState<any>(null);
    const isSuperAdmin = currentActor?.isSuperAdmin === true;

    // Add/Edit Operator modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOp, setEditOp] = useState({ id: "", name: "", loginId: "", password: "", role: "Operator", status: "Active" });
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    // SA credential change modal
    const [isSAModalOpen, setIsSAModalOpen] = useState(false);
    const [saForm, setSaForm] = useState({ currentPassword: "", newLoginId: "", newPassword: "" });
    const [saLoading, setSaLoading] = useState(false);
    const [saError, setSaError] = useState("");
    const [saSuccess, setSaSuccess] = useState("");

    // Delete confirm
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("vpoint-admin-auth");
        if (auth) {
            try { setCurrentActor(JSON.parse(auth)); } catch { }
        }
        loadOperators();
    }, []);

    const loadOperators = async () => {
        setLoading(true);
        const data = await getOperators();
        setOperators(data as Operator[]);
        setLoading(false);
    };

    const openAddModal = () => {
        setEditOp({ id: "", name: "", loginId: "", password: "", role: "Operator", status: "Active" });
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const openEditModal = (op: Operator) => {
        setEditOp({ id: op.id, name: op.name, loginId: op.loginId || "", password: "", role: op.role, status: op.status || "Active" });
        setShowPassword(false);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!editOp.name) return;
        setSaving(true);
        // Generate loginId if creating and none specified
        const payload = {
            ...editOp,
            loginId: editOp.loginId || `OP-${Date.now().toString(36).toUpperCase().slice(-4)}`,
        };
        const res = await manageOperatorFull(payload, currentActor?.name || "Super Admin");
        setSaving(false);
        if (res.success) {
            setIsModalOpen(false);
            loadOperators();
        }
    };

    const handleSuspend = async (id: string, suspended: boolean) => {
        await suspendOperator(id, !suspended, currentActor?.name || "Admin");
        loadOperators();
    };

    const handleDelete = async (id: string) => {
        const res = await deleteOperatorSecure(id, isSuperAdmin, currentActor?.name || "Admin");
        if (res.success) { loadOperators(); setConfirmDelete(null); }
    };

    const handleSAChange = async () => {
        setSaLoading(true); setSaError(""); setSaSuccess("");
        const res = await changeSuperAdminCredentials(saForm.currentPassword, saForm.newLoginId, saForm.newPassword);
        setSaLoading(false);
        if (res.success) {
            setSaSuccess("Credentials updated! Log out and log in with new credentials.");
            setSaForm({ currentPassword: "", newLoginId: "", newPassword: "" });
        } else {
            setSaError(res.error || "Failed.");
        }
    };

    const copyLoginId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filtered = operators.filter(op =>
        op.name.toLowerCase().includes(search.toLowerCase()) ||
        (op.loginId || "").toLowerCase().includes(search.toLowerCase()) ||
        op.role.toLowerCase().includes(search.toLowerCase())
    );

    const roles = ["Operator", "Analyst", "Moderator", "Lead"];

    return (
        <div className="p-10 space-y-10 pb-20 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Operator <span className="text-amber-500">Command</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Personnel & Access Control</p>
                </div>
                <div className="flex items-center gap-3">
                    {isSuperAdmin && (
                        <button onClick={() => setIsSAModalOpen(true)} className="flex items-center gap-2 px-6 py-4 glass border border-amber-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-500/10 transition-all">
                            <Key size={14} /> Change SA Credentials
                        </button>
                    )}
                    {isSuperAdmin && (
                        <button onClick={openAddModal} className="flex items-center gap-3 px-8 py-4 bg-white text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neon-cyan hover:text-white transition-all">
                            <UserPlus size={16} /> Provision Operator
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: "Total Operators", value: operators.length, color: "text-white" },
                    { label: "Active", value: operators.filter(o => o.status === "Active").length, color: "text-emerald-400" },
                    { label: "Suspended", value: operators.filter(o => o.status === "Suspended").length, color: "text-red-400" },
                ].map(stat => (
                    <div key={stat.label} className="glass border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input type="text" placeholder="SEARCH OPERATORS..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-14 pr-6 text-[10px] font-bold text-white uppercase tracking-widest placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 transition-all" />
            </div>

            {/* Operators table */}
            <div className="glass border border-white/10 rounded-[3rem] overflow-hidden bg-white/5 admin-table-container">
                <div className="p-5 bg-white/[0.02] border-b border-white/5 grid grid-cols-12 gap-3 text-[9px] font-black text-slate-600 uppercase tracking-widest min-w-[1000px]">
                    <span className="col-span-3">Name</span>
                    <span className="col-span-2">Login ID</span>
                    <span className="col-span-2">Role</span>
                    <span className="col-span-2 text-center">Last Active</span>
                    <span className="col-span-1 text-center">Status</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16 opacity-30">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="min-w-[1000px]">
                        {filtered.map(op => (
                            <div key={op.id} className={`p-5 grid grid-cols-12 gap-3 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors ${op.status === "Suspended" ? "opacity-50" : ""}`}>
                                {/* Name */}
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border ${op.isSuperAdmin ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-white/5 border-white/10 text-slate-500"}`}>
                                        {op.isSuperAdmin ? <Star size={14} /> : <Users size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase">{op.name}</p>
                                        {op.isSuperAdmin && <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Super Admin</p>}
                                    </div>
                                </div>
                                {/* Login ID */}
                                <div className="col-span-2 flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-neon-cyan">{op.loginId || "—"}</span>
                                    {op.loginId && (
                                        <button onClick={() => copyLoginId(op.loginId!)} className="text-slate-600 hover:text-white transition-colors">
                                            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                        </button>
                                    )}
                                </div>
                                {/* Role */}
                                <div className="col-span-2">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${op.isSuperAdmin ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-white/5 text-slate-400 border border-white/5"}`}>
                                        {op.role}
                                    </span>
                                </div>
                                {/* Last Active */}
                                <div className="col-span-2 text-center">
                                    <span className="text-[9px] font-mono text-slate-500">
                                        {op.lastActive ? new Date(op.lastActive).toLocaleDateString() : "Never"}
                                    </span>
                                </div>
                                {/* Status */}
                                <div className="col-span-1 flex justify-center">
                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${op.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                        {op.status}
                                    </span>
                                </div>
                                {/* Actions */}
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    {isSuperAdmin && !op.isSuperAdmin && (
                                        <>
                                            <button onClick={() => openEditModal(op)} title="Edit" className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                                <Key size={13} />
                                            </button>
                                            <button onClick={() => handleSuspend(op.id, op.status === "Suspended")} title={op.status === "Suspended" ? "Reinstate" : "Suspend"} className={`p-2 rounded-xl transition-colors ${op.status === "Suspended" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                                {op.status === "Suspended" ? <ShieldCheck size={13} /> : <Ban size={13} />}
                                            </button>
                                            <button onClick={() => setConfirmDelete(op.id)} title="Delete" className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        </>
                                    )}
                                    {!isSuperAdmin && !op.isSuperAdmin && (
                                        <span className="text-[9px] text-slate-700 uppercase tracking-widest">No Access</span>
                                    )}
                                    {op.isSuperAdmin && (
                                        <span className="text-[9px] text-amber-500/50 uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={11} /> Protected</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative z-10 glass border border-white/10 rounded-[3rem] p-10 w-full max-w-md bg-vpoint-dark space-y-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">{editOp.id ? "Edit Operator" : "Provision Operator"}</h2>
                            <div className="space-y-4">
                                <input value={editOp.name} onChange={e => setEditOp(p => ({ ...p, name: e.target.value }))} placeholder="Operator Name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Login ID</label>
                                        <input value={editOp.loginId} onChange={e => setEditOp(p => ({ ...p, loginId: e.target.value.toUpperCase() }))} placeholder="OP-XXXX (auto)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-xs font-mono font-bold text-neon-cyan focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600 uppercase" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Role</label>
                                        <select value={editOp.role} onChange={e => setEditOp(p => ({ ...p, role: e.target.value }))} className="w-full bg-vpoint-dark border border-white/10 rounded-2xl py-4 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all">
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={editOp.password} onChange={e => setEditOp(p => ({ ...p, password: e.target.value }))} placeholder={editOp.id ? "New Password (leave blank = no change)" : "Set Password"} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 glass-dark border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-amber-500 text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-50">
                                    {saving ? "Saving..." : editOp.id ? "Update" : "Provision"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isSAModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setIsSAModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative z-10 glass border border-amber-500/20 rounded-[2rem] p-10 w-full max-w-md bg-vpoint-dark space-y-6">
                            <div className="flex items-center gap-3">
                                <Star size={22} className="text-amber-400" />
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Super Admin Credentials</h2>
                            </div>
                            <div className="space-y-4">
                                <input type="password" value={saForm.currentPassword} onChange={e => setSaForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                                <input type="text" value={saForm.newLoginId} onChange={e => setSaForm(p => ({ ...p, newLoginId: e.target.value.toUpperCase() }))} placeholder="New Login ID (leave blank = keep current)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-mono font-bold text-neon-cyan focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                                <input type="password" value={saForm.newPassword} onChange={e => setSaForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="New Password (leave blank = keep current)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600" />
                            </div>
                            {saError && <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">{saError}</p>}
                            {saSuccess && <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{saSuccess}</p>}
                            <div className="flex gap-4">
                                <button onClick={() => setIsSAModalOpen(false)} className="flex-1 py-4 glass-dark border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                                <button onClick={handleSAChange} disabled={saLoading} className="flex-1 py-4 bg-amber-500 text-vpoint-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 disabled:opacity-50 transition-all">
                                    {saLoading ? "Updating..." : "Update Credentials"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {confirmDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setConfirmDelete(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative z-10 glass border border-red-500/20 rounded-[2rem] p-10 max-w-sm w-full text-center space-y-6 bg-vpoint-dark">
                            <AlertTriangle size={40} className="text-red-400 mx-auto" />
                            <h3 className="text-xl font-black text-white uppercase">Terminate Operator?</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 glass-dark border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Cancel</button>
                                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-400 transition-colors shadow-2xl shadow-red-500/20">Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
