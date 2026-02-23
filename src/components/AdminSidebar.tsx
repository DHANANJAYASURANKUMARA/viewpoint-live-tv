"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Radio,
    Activity,
    Settings,
    LogOut,
    Shield,
    Terminal,
    Zap,
    Users,
    Database,
    UserCog,
    Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { getActiveOperatorCount } from "@/lib/actions";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [activeOpCount, setActiveOpCount] = useState<number>(0);
    const [adminName, setAdminName] = useState("Admin");

    useEffect(() => {
        getActiveOperatorCount().then(res => {
            if (res.success) setActiveOpCount(res.count);
        });
        const admin = localStorage.getItem("vpoint-admin-auth");
        if (admin) {
            try {
                const parsed = JSON.parse(admin);
                setAdminName(parsed.name || "Admin");
            } catch { }
        }
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard", color: "text-neon-cyan" },
        { icon: Radio, label: "Signal Control", path: "/admin/signals", color: "text-neon-purple" },
        { icon: Activity, label: "Analytics", path: "/admin/analytics", color: "text-emerald-500" },
        { icon: Users, label: "User Management", path: "/admin/users", color: "text-neon-cyan" },
        { icon: Zap, label: "Appearance", path: "/admin/appearance", color: "text-neon-magenta" },
        { icon: UserCog, label: "Operators", path: "/admin/operators", color: "text-amber-500" },
        { icon: Bell, label: "Notifications", path: "/admin/notifications", color: "text-amber-500" },
        { icon: Database, label: "Database", path: "/admin/database", color: "text-emerald-500" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("vpoint-admin-auth");
        router.push("/admin/login");
    };

    return (
        <div className="w-80 h-full glass border-r border-white/5 flex flex-col p-8 overflow-hidden relative shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
            {/* Admin Brand Header */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Shield size={20} className="text-neon-cyan" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-black text-white tracking-tighter uppercase leading-none">
                        CMD<span className="text-neon-cyan">CENTER</span>
                    </h2>
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Admin v2.0.4</p>
                </div>
            </div>

            {/* Active Operator Badge */}
            <div className="mb-8 px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Operators</span>
                </div>
                <span className="text-lg font-black text-emerald-400">{activeOpCount}</span>
            </div>

            {/* Navigation Layer */}
            <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 mb-6">Management Sectors</h3>
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isActive
                                        ? "bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                        : "hover:bg-white/[0.03] border border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg transition-all ${isActive ? "bg-white/5 " + item.color : "text-slate-500 group-hover:text-white"}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="admin-active-indicator"
                                            className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 mb-6">System Control</h3>
                    <div className="space-y-2">
                        <Link
                            href="/admin/appearance"
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border ${pathname === "/admin/appearance" ? "bg-white/10 border-white/10" : "border-transparent text-slate-500 hover:text-white hover:bg-white/[0.03]"}`}
                        >
                            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Config</span>
                        </Link>
                        <Link
                            href="/admin/system"
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border ${pathname === "/admin/system" ? "bg-white/10 border-white/10" : "border-transparent text-slate-500 hover:text-white hover:bg-white/[0.03]"}`}
                        >
                            <Terminal size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Master Logs</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                {/* Current Admin Display */}
                <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                        <Shield size={14} className="text-neon-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{adminName}</p>
                        <p className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest">Super Admin</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full py-4 glass-dark border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-red-500/80 hover:text-red-500 hover:border-red-500/30 transition-all text-[9px] font-black uppercase tracking-[0.3em]"
                >
                    <LogOut size={14} />
                    Terminate Session
                </button>

                <div className="px-2 flex items-center justify-between opacity-30">
                    <div className="flex items-center gap-2">
                        <Zap size={10} className="text-neon-cyan" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-white">Neural Active</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                </div>
            </div>
        </div>
    );
}
