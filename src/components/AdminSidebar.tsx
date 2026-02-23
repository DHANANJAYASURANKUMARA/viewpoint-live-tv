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
        { icon: Radio, label: "Signals", path: "/admin/signals", color: "text-neon-purple" },
        { icon: Users, label: "Users", path: "/admin/users", color: "text-emerald-500" },
        { icon: Bell, label: "Alerts", path: "/admin/notifications", color: "text-amber-500" },
        { icon: UserCog, label: "Staff", path: "/admin/operators", color: "text-neon-magenta" },
        { icon: Database, label: "Core Data", path: "/admin/database", color: "text-slate-400" },
        { icon: Terminal, label: "Logs & System", path: "/admin/system", color: "text-neon-cyan" },
        { icon: Zap, label: "Appearance", path: "/admin/appearance", color: "text-neon-purple" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("vpoint-admin-auth");
        router.push("/admin/login");
    };

    return (
        <aside className="w-80 h-full glass-dark border-r border-white/5 flex flex-col p-8 overflow-hidden relative shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50">
            {/* Admin Brand Header */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative group">
                    <div className="absolute inset-0 bg-neon-cyan/20 rounded-2xl blur-xl group-hover:bg-neon-cyan/40 transition-all" />
                    <Shield size={24} className="text-neon-cyan relative z-10" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                        VPOINT<span className="text-neon-cyan">CMD</span>
                    </h2>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Neural Command Center</p>
                </div>
            </div>

            {/* Active Operator Badge */}
            <div className="mb-10 px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Online</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">{activeOpCount}</span>
            </div>

            {/* Navigation Layer */}
            <nav className="flex-1 space-y-12 overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-6">
                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Sector Control</h3>
                    <div className="space-y-3">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group relative ${isActive
                                        ? "bg-white/[0.08] border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                                        : "hover:bg-white/[0.03] border border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? "bg-white/10 " + item.color : "text-slate-600 group-hover:text-white"}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="admin-active-indicator"
                                            className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_15px_rgba(34,211,238,1)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Action Footer */}
            <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                <div className="px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                        <UserCog size={16} className="text-neon-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{adminName}</p>
                        <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active Session</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.4em] shadow-lg shadow-red-500/5"
                >
                    <LogOut size={16} />
                    Terminate
                </button>

                <div className="px-2 flex items-center justify-between opacity-30">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-neon-cyan" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Grid Active</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">v2.1.0</span>
                </div>
            </div>
        </aside>
    );
}
