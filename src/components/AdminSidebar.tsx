"use client";

import React from "react";
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
    Users
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard", color: "text-neon-cyan" },
        { icon: Radio, label: "Signal Control", path: "/admin/signals", color: "text-neon-purple" },
        { icon: Activity, label: "Analytics", path: "/admin/analytics", color: "text-emerald-500" },
        { icon: Zap, label: "Appearance", path: "/admin/appearance", color: "text-neon-magenta" },
        { icon: Users, label: "Operators", path: "/admin/operators", color: "text-amber-500" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("vpoint-admin-auth");
        router.push("/admin/login");
    };

    return (
        <div className="w-80 h-full glass border-r border-white/5 flex flex-col p-8 overflow-hidden relative shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
            {/* Admin Brand Header */}
            <div className="flex items-center gap-4 mb-14">
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

            {/* Navigation Layer */}
            <div className="flex-1 space-y-10">
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
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group"
                        >
                            <Settings size={18} className="group-hover:rotate-45 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Config</span>
                        </Link>
                        <Link
                            href="/admin/system"
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group"
                        >
                            <Terminal size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Master Logs</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
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
