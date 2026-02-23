"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, BellRing, Info, AlertTriangle, CheckCircle,
    XCircle, Trash2, Check, ExternalLink, X
} from "lucide-react";
import { getNotifications, markNotificationAsRead, deleteNotification, clearNotifications } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { config } = useConfig();

    const loadNotifications = async () => {
        const data = await getNotifications();
        setNotifs(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
    };

    useEffect(() => {
        loadNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string) => {
        const res = await markNotificationAsRead(id);
        if (res.success) loadNotifications();
    };

    const handleDelete = async (id: string) => {
        const res = await deleteNotification(id);
        if (res.success) loadNotifications();
    };

    const handleClearAll = async () => {
        const res = await clearNotifications();
        if (res.success) loadNotifications();
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "ALERT": return <AlertTriangle className="text-amber-500" size={16} />;
            case "SUCCESS": return <CheckCircle className="text-emerald-500" size={16} />;
            case "WARNING": return <XCircle className="text-rose-500" size={16} />;
            default: return <Info className="text-neon-cyan" size={16} />;
        }
    };

    if (!config.notificationsEnabled) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 glass border border-white/5 rounded-xl hover:bg-white/5 transition-all group"
            >
                {unreadCount > 0 ? (
                    <BellRing className="text-neon-cyan animate-pulse" size={20} />
                ) : (
                    <Bell className="text-white/60 group-hover:text-white" size={20} />
                )}

                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-neon-magenta text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[100]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed lg:absolute top-24 lg:top-auto lg:right-0 lg:mt-4 inset-x-4 lg:inset-x-auto lg:w-96 z-[110] glass-dark border border-white/10 rounded-3xl lg:rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl"
                        >
                            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Signal Hub</span>
                                    <span className="text-[10px] text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        {notifs.length} Logs
                                    </span>
                                </div>
                                {notifs.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-[10px] font-black text-rose-500/70 hover:text-rose-500 uppercase tracking-tighter transition-colors"
                                    >
                                        Clear Deck
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifs.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                        <Bell className="w-12 h-12" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Transmissions</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifs.slice().reverse().map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-5 transition-colors group relative ${n.isRead ? "opacity-60" : "bg-neon-cyan/[0.02] border-l-2 border-neon-cyan"}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1">
                                                        {getTypeIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{n.title}</h4>
                                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                                            {n.message}
                                                        </p>
                                                        <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!n.isRead && (
                                                                <button
                                                                    onClick={() => handleMarkRead(n.id)}
                                                                    className="flex items-center gap-1.5 text-[8px] font-black text-neon-cyan uppercase tracking-widest hover:text-white transition-colors"
                                                                >
                                                                    <Check size={10} /> Mark Read
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(n.id)}
                                                                className="flex items-center gap-1.5 text-[8px] font-black text-rose-500 uppercase tracking-widest hover:text-white transition-colors"
                                                            >
                                                                <Trash2 size={10} /> Purge
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] italic"> VIEWPOINT NEURAL LINK </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
