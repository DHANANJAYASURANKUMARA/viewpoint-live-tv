"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Send,
    Heart,
    Trash2,
    Edit3,
    Reply,
    X,
    MessageCircle,
    User,
    ChevronRight,
    ChevronLeft,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getLiveChatMessages,
    sendLiveChatMessage,
    updateLiveChatMessage,
    deleteLiveChatMessage,
    toggleLiveChatLike,
    getUserProfile,
    sendFriendRequest,
    getFriendshipStatus
} from "@/lib/actions";

interface LiveChatProps {
    channelId: string;
    currentUser: any;
}

export default function LiveChat({ channelId, currentUser }: LiveChatProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [replyTo, setReplyTo] = useState<any | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const [friendshipStatus, setFriendshipStatus] = useState<any | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (!channelId) return;
        const data = await getLiveChatMessages(channelId, currentUser?.id);
        setMessages(data.reverse());
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000);
        return () => clearInterval(interval);
    }, [channelId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !currentUser || isSending) return;
        setIsSending(true);
        const res = await sendLiveChatMessage(channelId, currentUser.id, inputText, replyTo?.id);
        if (res.success) {
            setInputText("");
            setReplyTo(null);
            fetchMessages();
            triggerHearts();
        }
        setIsSending(false);
    };

    const handleUpdate = async (id: string) => {
        if (!editContent.trim()) return;
        const res = await updateLiveChatMessage(id, editContent);
        if (res.success) {
            setEditingId(null);
            fetchMessages();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("De-materialize this message?")) {
            const res = await deleteLiveChatMessage(id);
            if (res.success) fetchMessages();
        }
    };

    const handleToggleLike = async (id: string) => {
        if (!currentUser) return;
        const res = await toggleLiveChatLike(id, currentUser.id);
        if (res.success) fetchMessages();
    };

    const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);

    const handleShowProfile = async (userId: string) => {
        const profile = await getUserProfile(userId);
        setSelectedProfile(profile);
        if (currentUser && userId !== currentUser.id) {
            const status = await getFriendshipStatus(currentUser.id, userId);
            setFriendshipStatus(status);
        } else {
            setFriendshipStatus(null);
        }
    };

    const handleFriendRequest = async () => {
        if (!currentUser || !selectedProfile) return;
        const res = await sendFriendRequest(currentUser.id, selectedProfile.id);
        if (res.success) {
            const status = await getFriendshipStatus(currentUser.id, selectedProfile.id);
            setFriendshipStatus(status);
        } else {
            alert(res.message || "Failed to transmit request.");
        }
    };

    const triggerHearts = () => {
        const id = Date.now();
        const colors = ["#00f2ff", "#ff0055", "#7000ff", "#00ff88"];
        const newHeart = {
            id,
            x: Math.random() * 60 - 30,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id));
        }, 3000);
    };

    if (isHidden) {
        return (
            <button
                onClick={() => setIsHidden(false)}
                className="fixed right-6 bottom-32 w-12 h-12 bg-white/5 text-neon-magenta rounded-full flex items-center justify-center border border-neon-magenta/30 hover:bg-neon-magenta hover:text-white transition-all z-50 lg:absolute lg:right-10 lg:bottom-10 group"
                title="Open Matrix Chat"
            >
                <div className="absolute inset-0 bg-neon-magenta/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={20} className="relative z-10" />
            </button>
        );
    }

    const [isDMAnimate, setIsDMAnimate] = useState(false);

    const handleDMTouch = () => {
        setIsDMAnimate(true);
        setTimeout(() => {
            setIsDMAnimate(false);
            window.location.href = `/nexus?user=${selectedProfile.id}&action=dm`;
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[450px] lg:h-[75%] w-full lg:w-[400px] shrink-0 relative lg:absolute lg:right-6 lg:bottom-6 z-40 pointer-events-none">
            {/* Heart Burst Container */}
            <div className="absolute right-4 bottom-32 w-24 h-80 pointer-events-none overflow-hidden z-20">
                <AnimatePresence mode="popLayout">
                    {hearts.map(heart => (
                        <motion.div
                            key={heart.id}
                            initial={{ y: 0, opacity: 1, x: heart.x, scale: 0.5 }}
                            animate={{ y: -400, opacity: 0, x: heart.x + (Math.random() * 60 - 30), scale: 2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeOut" }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        >
                            <Heart size={28} color={heart.color} fill={heart.color} className="drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4 flex flex-col custom-scrollbar pointer-events-auto"
                style={{
                    maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)'
                }}
            >
                <div className="flex-1 min-h-[50px]" />
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-20 opacity-20">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <MessageCircle size={40} className="text-slate-500" />
                        </motion.div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.6em]">Neural pulse awaiting...</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{
                                opacity: idx < messages.length - 8 ? 0.35 : 1,
                                y: 0,
                                scale: 1,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className={`flex items-end gap-3 group/message ${msg.userId === currentUser?.id ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar with Status Ring */}
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => handleShowProfile(msg.userId)}
                                    className={`w-9 h-9 rounded-full border-2 p-0.5 overflow-hidden transition-all duration-500 shadow-lg ${msg.userId === currentUser?.id ? 'border-neon-magenta/40 hover:border-white' : 'border-white/10 hover:border-neon-cyan'}`}
                                >
                                    {msg.user?.profilePicture ? (
                                        <img src={msg.user.profilePicture} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-slate-500">
                                            <User size={14} />
                                        </div>
                                    )}
                                </button>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black/80 ${msg.userId === currentUser?.id ? 'bg-neon-magenta' : 'bg-neon-cyan'} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                            </div>

                            <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.userId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                                <div className={`group/bubble relative ${msg.userId === currentUser?.id
                                    ? 'bg-gradient-to-br from-neon-magenta/20 to-transparent border border-neon-magenta/30 shadow-[0_10px_30px_rgba(255,0,85,0.15)] rounded-t-3xl rounded-bl-3xl rounded-br-lg'
                                    : 'bg-white/5 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl rounded-br-3xl rounded-bl-lg backdrop-blur-md'
                                    } p-4 transition-all hover:scale-[1.02] active:scale-[0.98]`}>

                                    {/* Advanced Action Matrix */}
                                    <div className={`absolute -top-6 ${msg.userId === currentUser?.id ? 'right-0' : 'left-0'} flex items-center gap-2 opacity-0 group-hover/bubble:opacity-100 transition-all z-20`}>
                                        {msg.userId === currentUser?.id ? (
                                            <>
                                                <button
                                                    onClick={() => { setEditingId(msg.id); setEditContent(msg.content); }}
                                                    className="p-2 bg-black/90 rounded-xl text-slate-300 hover:text-neon-cyan hover:scale-110 border border-white/10 backdrop-blur-xl shadow-2xl transition-all"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-2 bg-black/90 rounded-xl text-slate-300 hover:text-red-500 hover:scale-110 border border-white/10 backdrop-blur-xl shadow-2xl transition-all"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleToggleLike(msg.id)}
                                                    className={`p-2 bg-black/90 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:scale-110 ${msg.likes?.some((l: any) => l.userId === currentUser?.id) ? 'text-neon-magenta border-neon-magenta/40' : 'text-slate-300 hover:text-neon-magenta'}`}
                                                >
                                                    <Heart size={15} fill={msg.likes?.some((l: any) => l.userId === currentUser?.id) ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={() => setReplyTo(msg)}
                                                    className="p-2 bg-black/90 rounded-xl text-slate-300 hover:text-neon-cyan hover:scale-110 border border-white/10 backdrop-blur-xl shadow-2xl transition-all"
                                                >
                                                    <Reply size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {editingId === msg.id ? (
                                        <div className="space-y-3 min-w-[200px]">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-black/60 border border-neon-cyan/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 ring-neon-cyan/20 transition-all"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-4">
                                                <button onClick={() => setEditingId(null)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cancel</button>
                                                <button onClick={() => handleUpdate(msg.id)} className="text-[9px] font-black uppercase tracking-widest text-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]">Update</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {msg.replyTo && (
                                                <div className="mb-3 p-2.5 bg-black/30 border-l-2 border-neon-cyan rounded-r-xl italic opacity-80 flex items-center gap-2 group/reply cursor-pointer hover:bg-black/50 transition-colors" onClick={() => handleShowProfile(msg.replyTo.userId)}>
                                                    <Reply size={12} className="text-neon-cyan shrink-0" />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[8px] font-black uppercase tracking-wider text-neon-cyan mb-0.5">
                                                            {msg.replyTo.user?.displayName || msg.replyTo.user?.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-200 truncate leading-tight">
                                                            {msg.replyTo.content}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleShowProfile(msg.userId)}
                                                    className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 italic transition-all hover:translate-x-1 ${msg.userId === currentUser?.id ? 'text-neon-magenta' : 'text-neon-cyan'}`}
                                                >
                                                    {msg.user?.displayName || msg.user?.name}
                                                </button>
                                                <p className="text-[12px] sm:text-[13px] text-white leading-relaxed font-medium break-words drop-shadow-sm">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* Visual Signal HUD */}
                                    <div className={`mt-2 flex items-center gap-3 transition-opacity ${msg._count?.likes > 0 ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neon-magenta/10 border border-neon-magenta/20 shadow-[0_0_10px_rgba(255,0,85,0.15)]">
                                            <Heart size={10} className="text-neon-magenta fill-neon-magenta" />
                                            <span className="text-[9px] font-black text-neon-magenta">{msg._count?.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Neural Input Beam */}
            <div className="p-6 pt-2 flex flex-col gap-3 pointer-events-auto">
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="bg-vpoint-dark/95 backdrop-blur-2xl border border-neon-cyan/30 rounded-2xl p-4 flex items-center justify-between mb-2 shadow-[0_0_40px_rgba(0,242,255,0.15)] ring-1 ring-white/10"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-neon-cyan/10 rounded-xl">
                                    <Reply size={16} className="text-neon-cyan" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.3em]">Neural Reply Target</span>
                                    <span className="text-xs text-white/70 truncate italic font-medium">"{replyTo.content}"</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setReplyTo(null)}
                                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all active:scale-90"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => triggerHearts()}
                        className="group relative w-12 h-12 flex items-center justify-center shrink-0"
                    >
                        <div className="absolute inset-0 bg-neon-magenta/10 rounded-full blur-xl group-hover:bg-neon-magenta/30 transition-all" />
                        <div className="absolute inset-0 border border-neon-magenta/20 rounded-full group-hover:border-neon-magenta/50 transition-all" />
                        <Heart size={22} className={`relative z-10 text-white transition-colors duration-500 ${hearts.length > 0 ? "fill-neon-magenta text-neon-magenta scale-110" : "group-hover:text-neon-magenta"}`} />
                    </motion.button>

                    <div className="flex-1 relative group/input">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-focus-within/input:via-neon-magenta/80 transition-all" />
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={replyTo ? "Transmit response..." : "Neural Comment..."}
                            className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl py-3.5 px-6 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.07] focus:border-white/20 transition-all shadow-inner"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isSending}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neon-magenta hover:scale-110 transition-transform disabled:opacity-0 active:scale-95 group-hover/input:translate-x-1"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Modal v4 (Centered Neural Hub) remains available as per previous implementation logic */}
            <AnimatePresence>
                {selectedProfile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProfile(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />

                        {/* DM Transmit FX Overlay */}
                        <AnimatePresence>
                            {isDMAnimate && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[120] bg-neon-cyan/10 flex items-center justify-center backdrop-blur-sm"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                                    >
                                        <Send size={40} className="text-neon-cyan" />
                                    </motion.div>
                                    <p className="absolute bottom-1/4 text-neon-cyan font-black uppercase tracking-[0.5em] text-xs animate-pulse">Establishing Neural Link...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-vpoint-dark border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col max-h-[90vh] touch-none"
                        >
                            {/* Header / Close */}
                            <div className="absolute top-8 right-8 z-20">
                                <button
                                    onClick={() => setSelectedProfile(null)}
                                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group active:scale-95"
                                >
                                    <X size={24} className="text-slate-400 group-hover:text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10 touch-pan-y">
                                {/* Identity Core */}
                                <div className="flex flex-col items-center space-y-8 pt-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-44 h-44 rounded-full border-[6px] border-neon-cyan/20 p-2 relative shadow-[0_0_80px_rgba(0,242,255,0.2)]"
                                    >
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center relative z-10">
                                            {selectedProfile.profilePicture ? (
                                                <img src={selectedProfile.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <User size={60} className="text-slate-700" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-2xl animate-pulse" />
                                    </motion.div>

                                    <div className="text-center space-y-3">
                                        <h2 className="text-4xl font-black uppercase text-white tracking-widest italic leading-none drop-shadow-2xl">
                                            {selectedProfile.displayName || selectedProfile.name}
                                        </h2>
                                        <p className="text-neon-magenta font-black uppercase tracking-[0.4em] text-[10px] bg-neon-magenta/10 px-4 py-1.5 rounded-full border border-neon-magenta/20">Verified Identity</p>
                                    </div>
                                </div>

                                {/* Bio Sector */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full glass-dark border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-neon-cyan/20 transition-all shadow-inner"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)]" />
                                    <p className="text-slate-300 text-xl font-medium leading-relaxed italic">
                                        "{selectedProfile.bio || "In the matrix, code is reality. Identity is a fragment."}"
                                    </p>
                                </motion.div>

                                {/* Neural Grid Controls */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {currentUser && selectedProfile.id !== currentUser.id && (
                                        <>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleFriendRequest}
                                                className={`py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex flex-col items-center gap-2 group ${friendshipStatus?.status === 'accepted'
                                                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                                                    : friendshipStatus?.status === 'pending'
                                                        ? 'bg-white/5 text-slate-500 border border-white/10 opacity-50'
                                                        : 'bg-neon-cyan text-black shadow-[0_15px_30px_rgba(0,242,255,0.2)] hover:shadow-[0_20px_40px_rgba(0,242,255,0.3)] hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <User size={20} className={friendshipStatus?.status === 'accepted' ? "" : "group-hover:animate-bounce"} />
                                                {friendshipStatus?.status === 'accepted' ? 'Following' :
                                                    friendshipStatus?.status === 'pending' ? 'Pending' : 'Connect'}
                                            </motion.button>

                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleDMTouch}
                                                className="py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-neon-magenta hover:text-black hover:border-neon-magenta transition-all flex flex-col items-center gap-2 hover:shadow-[0_15px_30px_rgba(255,45,85,0.2)] group"
                                            >
                                                <Send size={20} className="group-hover:rotate-12 transition-transform" />
                                                DM Transmit
                                            </motion.button>
                                        </>
                                    )}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = `/nexus?user=${selectedProfile.id}`}
                                        className="py-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all flex flex-col items-center gap-2 group col-span-2"
                                    >
                                        <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                                        Full Nexus Identity
                                    </motion.button>
                                </div>

                                {/* Signal Fragments */}
                                {selectedProfile.socialLinks && (
                                    <div className="w-full space-y-6 pt-4 pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Signal Fragments</span>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-10">
                                            {(() => {
                                                try {
                                                    const links = JSON.parse(selectedProfile.socialLinks);
                                                    return Object.entries(links).map(([platform, url]: [any, any]) => (
                                                        <motion.div
                                                            key={platform}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="flex flex-col items-center gap-2 group cursor-pointer"
                                                            onClick={() => window.open(url, '_blank')}
                                                        >
                                                            <span className="text-[9px] font-black text-neon-cyan uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{platform}</span>
                                                            <div className="h-1.5 w-10 bg-neon-cyan/10 rounded-full group-hover:bg-neon-cyan shadow-sm group-hover:shadow-[0_0_12px_rgba(0,242,255,0.5)] transition-all" />
                                                        </motion.div>
                                                    ));
                                                } catch { return null; }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Sync */}
                            <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 opacity-30">
                                    <span className="text-white">ID</span>
                                    <span className="text-neon-cyan">M-CORE</span>
                                    <span className="text-white ml-2">FRAGMENT</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Linked</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

