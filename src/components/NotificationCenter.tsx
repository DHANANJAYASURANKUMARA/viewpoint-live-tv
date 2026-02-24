"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, BellRing, Info, AlertTriangle, CheckCircle,
    XCircle, Trash2, Check, ExternalLink, X, Activity
} from "lucide-react";
import { getNotifications, markNotificationAsRead, deleteNotification, clearNotifications } from "@/lib/actions";
import { useConfig } from "@/components/ConfigContext";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [lastNotifId, setLastNotifId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<any>(null);
    const { config } = useConfig();

    const loadNotifications = async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        const data = await getNotifications(true);

        // Ghost Sync: Check for new transmissions for Toast
        if (!showLoading && data.length > 0 && lastNotifId && data[0].id !== lastNotifId && !data[0].isRead) {
            setShowToast(data[0]);
            // Auto-dismiss toast after 5 seconds
            setTimeout(() => setShowToast(null), 5000);
        }

        setNotifs(data);
        if (data.length > 0) setLastNotifId(data[0].id);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
        setIsLoading(false);
    };

    useEffect(() => {
        loadNotifications(true);
        // Turbo Polling: 5 seconds for real-time feel
        const interval = setInterval(() => loadNotifications(false), 5000);
        return () => clearInterval(interval);
    }, [lastNotifId]);

    const handleMarkRead = async (id: string) => {
        const res = await markNotificationAsRead(id);
        if (res.success) loadNotifications();
    };

    const handleDelete = async (id: string) => {
        const res = await deleteNotification(id);
        if (res.success) loadNotifications();
    };

    const handleClearAll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const res = await clearNotifications();
        if (res.success) loadNotifications();
    };

    const handleMarkAllRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await Promise.all(notifs.filter(n => !n.isRead).map(n => markNotificationAsRead(n.id)));
        loadNotifications();
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
                                <div className="flex items-center gap-4">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[10px] font-black text-neon-cyan/70 hover:text-neon-cyan uppercase tracking-tighter transition-colors"
                                        >
                                            Read All
                                        </button>
                                    )}
                                    {notifs.length > 0 && (
                                        <button
                                            onClick={handleClearAll}
                                            className="text-[10px] font-black text-rose-500/70 hover:text-rose-500 uppercase tracking-tighter transition-colors"
                                        >
                                            Clear Deck
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[60vh] lg:max-h-[400px] overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                        <Activity className="w-12 h-12 animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Scanning Frequency...</p>
                                    </div>
                                ) : notifs.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                        <Bell className="w-12 h-12" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Transmissions</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifs.map((n) => (
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
                                                                    onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}
                                                                    className="flex items-center gap-1.5 text-[8px] font-black text-neon-cyan uppercase tracking-widest hover:text-white transition-colors"
                                                                >
                                                                    <Check size={10} /> Mark Read
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
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

                {/* Instant Toast Notification */}
                {showToast && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        onClick={() => { setIsOpen(true); setShowToast(null); }}
                        className="fixed bottom-6 right-6 z-[200] w-80 glass-dark border border-neon-cyan/30 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer hover:border-neon-cyan transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-1">{getTypeIcon(showToast.type)}</div>
                            <div className="flex-1 space-y-1">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">New Transmission</h4>
                                <p className="text-[11px] font-bold text-white uppercase tracking-tight line-clamp-1">{showToast.title}</p>
                                <p className="text-[9px] text-slate-400 font-medium line-clamp-2 italic">{showToast.message}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setShowToast(null); }}>
                                <X size={14} className="text-slate-500 hover:text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
