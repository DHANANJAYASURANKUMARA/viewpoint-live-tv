"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    Shield,
    ExternalLink,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [admin, setAdmin] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadAuth = () => {
            const userSession = localStorage.getItem("vpoint-user");
            if (userSession) {
                try {
                    setUser(JSON.parse(userSession));
                } catch { }
            }

            const adminSession = localStorage.getItem("vpoint-admin-auth");
            if (adminSession) {
                try {
                    setAdmin(JSON.parse(adminSession));
                } catch { }
            }
        };

        loadAuth();
        // Listen for storage changes in case of login/logout in other tabs or components
        window.addEventListener("storage", loadAuth);
        return () => window.removeEventListener("storage", loadAuth);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("vpoint-user");
        localStorage.removeItem("vpoint-admin-auth");
        setUser(null);
        setAdmin(null);
        setIsOpen(false);
        router.push("/#hero");
    };

    const handleOpenSettings = () => {
        window.dispatchEvent(new CustomEvent("vpoint-open-settings"));
        setIsOpen(false);
    };

    if (!user && !admin) return null;

    const displayName = user?.displayName || user?.name || admin?.name || "Matrix Citizen";
    const profilePic = user?.profilePicture;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08]"
            >
                <div className="w-8 h-8 rounded-full border border-neon-cyan/30 p-0.5 overflow-hidden">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-500 rounded-full">
                            <User size={16} />
                        </div>
                    )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[80px]">
                        {displayName}
                    </span>
                    <span className="text-[7px] font-black text-neon-cyan uppercase tracking-widest opacity-70">
                        {admin ? "Operator" : "Citizen"}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 glass-dark border border-white/10 rounded-[2rem] shadow-2xl p-4 z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 mb-2 border-b border-white/5 space-y-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{displayName}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                                <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">Verified Matrix Identity</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-1">
                            {user && (
                                <button
                                    onClick={() => {
                                        router.push("/nexus");
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group"
                                >
                                    <User size={16} className="group-hover:text-neon-cyan" />
                                    Nexus Identity
                                </button>
                            )}

                            <button
                                onClick={handleOpenSettings}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group"
                            >
                                <Settings size={16} className="group-hover:text-neon-cyan" />
                                Advanced Settings
                            </button>

                            {admin && (
                                <button
                                    onClick={() => {
                                        router.push("/admin/dashboard");
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 transition-all text-[9px] font-black uppercase tracking-widest mt-2"
                                >
                                    <Shield size={16} />
                                    Admin Command Sector
                                </button>
                            )}

                            <div className="h-px bg-white/5 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-[9px] font-black uppercase tracking-widest group"
                            >
                                <LogOut size={16} className="group-hover:text-red-400" />
                                Matrix De-sync
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
