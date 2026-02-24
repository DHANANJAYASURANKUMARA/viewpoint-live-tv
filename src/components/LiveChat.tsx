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
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getLiveChatMessages,
    sendLiveChatMessage,
    updateLiveChatMessage,
    deleteLiveChatMessage,
    toggleLiveChatLike,
    getUserProfile
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
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (!channelId) return;
        const data = await getLiveChatMessages(channelId, currentUser?.id);
        // Reverse to show latest at bottom if needed, but our action orders by desc(createdAt)
        // Usually chat shows latest at bottom, so we reverse the desc order
        setMessages(data.reverse());
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000); // Poll every 4s
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

    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);

    const handleShowProfile = async (userId: string) => {
        const profile = await getUserProfile(userId);
        setSelectedProfile(profile);
    };

    const triggerHearts = () => {
        const id = Date.now();
        const colors = ["#00f2ff", "#ff0055", "#7000ff", "#00ff88"];
        const newHeart = {
            id,
            x: Math.random() * 60 - 30, // Random drift
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

    return (
        <div className="flex flex-col h-[400px] lg:h-[70%] w-full lg:w-[350px] shrink-0 relative lg:absolute lg:right-10 lg:bottom-10 z-40">
            {/* Heart Burst Container */}
            <div className="absolute right-4 bottom-24 w-20 h-64 pointer-events-none overflow-hidden z-20">
                <AnimatePresence>
                    {hearts.map(heart => (
                        <motion.div
                            key={heart.id}
                            initial={{ y: 0, opacity: 1, x: heart.x, scale: 0.5 }}
                            animate={{ y: -300, opacity: 0, x: heart.x + (Math.random() * 40 - 20), scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        >
                            <Heart size={24} color={heart.color} fill={heart.color} className="drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Header (Compact) */}
            <div className="p-4 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">Neural Stream Chat</span>
                </div>
                <button
                    onClick={() => setIsHidden(true)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white transition-all border border-white/10"
                >
                    <X size={12} />
                </button>
            </div>

            {/* Messages Area (TikTok Style) */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 space-y-3 flex flex-col custom-scrollbar pointer-events-auto mask-fade-top"
                style={{
                    maskImage: 'linear-gradient(to top, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)'
                }}
            >
                <div className="flex-1" /> {/* Push messages to bottom */}
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-2 py-10 opacity-30">
                        <MessageCircle size={30} className="text-slate-500" />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Awaiting signal fragments...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="flex items-start gap-3 group"
                        >
                            <button
                                onClick={() => handleShowProfile(msg.userId)}
                                className="w-8 h-8 rounded-full border-2 border-white/10 overflow-hidden shrink-0 hover:border-neon-cyan transition-colors"
                            >
                                {msg.user?.profilePicture ? (
                                    <img src={msg.user.profilePicture} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-600">
                                        <User size={14} />
                                    </div>
                                )}
                            </button>

                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-none p-3 relative group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <button
                                            onClick={() => handleShowProfile(msg.userId)}
                                            className="text-[10px] font-black text-neon-cyan uppercase tracking-tighter"
                                        >
                                            {msg.user?.displayName || msg.user?.name}
                                        </button>
                                        <span className="text-[7px] text-slate-600 font-bold">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {editingId === msg.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-black/40 border border-neon-cyan/30 rounded-xl p-2 text-[11px] text-white focus:outline-none"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdate(msg.id)} className="px-2 py-0.5 bg-neon-cyan text-black rounded text-[8px] font-black uppercase">Sync</button>
                                                <button onClick={() => setEditingId(null)} className="px-2 py-0.5 bg-white/5 text-white rounded text-[8px] font-black uppercase">Abort</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-slate-100/90 leading-snug font-medium break-words">
                                            {msg.content}
                                        </p>
                                    )}

                                    {/* Quick Actions (Hover) */}
                                    <div className="absolute -right-2 top-0 flex flex-col gap-2 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                                        <button
                                            onClick={() => {
                                                handleToggleLike(msg.id);
                                                if (!msg.hasLiked) triggerHearts();
                                            }}
                                            className={`p-1.5 rounded-full bg-black/60 border border-white/10 transition-colors ${msg.hasLiked ? 'text-neon-magenta border-neon-magenta/30' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <Heart size={12} fill={msg.hasLiked ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            onClick={() => setReplyTo(msg)}
                                            className="p-1.5 rounded-full bg-black/60 border border-white/10 text-slate-400 hover:text-white"
                                        >
                                            <Reply size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 space-y-3 pointer-events-auto">
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center justify-between"
                        >
                            <span className="text-[8px] text-slate-500 font-black uppercase flex items-center gap-2 px-2">
                                <Reply size={10} className="text-neon-magenta" rotate={180} />
                                Replying to <span className="text-neon-cyan">{replyTo.user?.displayName || replyTo.user?.name}</span>
                            </span>
                            <button onClick={() => setReplyTo(null)} className="p-1 text-slate-600 hover:text-white">
                                <X size={10} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative group">
                    <div className="absolute inset-0 bg-neon-magenta/5 blur-xl group-focus-within:bg-neon-magenta/10 transition-all rounded-3xl" />
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Say something..."
                        className="w-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-[12px] text-white focus:outline-none focus:border-neon-magenta/50 transition-all resize-none h-12 custom-scrollbar relative z-10"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                                triggerHearts();
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            handleSend();
                            triggerHearts();
                        }}
                        disabled={!inputText.trim() || isSending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-neon-magenta text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,45,85,0.4)] disabled:opacity-20 z-20"
                    >
                        <Heart size={14} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Profile Popup Overlay (Refined) */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-x-4 bottom-20 z-50 glass p-6 rounded-[2rem] border border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl"
                    >
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute right-4 top-4 p-1 text-slate-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-16 h-16 rounded-full border-2 border-neon-cyan p-0.5">
                                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                    {selectedProfile.profilePicture ? (
                                        <img src={selectedProfile.profilePicture} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-white font-black uppercase tracking-widest text-[12px]">
                                    {selectedProfile.displayName || selectedProfile.name}
                                </h4>
                                <p className="text-neon-magenta text-[7px] font-black uppercase tracking-[0.3em]">Matrix Citizen</p>
                            </div>

                            <p className="text-slate-400 text-[10px] leading-relaxed italic px-2">
                                {selectedProfile.bio || "Fragment protocol undefined."}
                            </p>

                            <div className="flex justify-center gap-4 pt-2 border-t border-white/5 w-full">
                                {selectedProfile.socialLinks && (
                                    (() => {
                                        try {
                                            const links = JSON.parse(selectedProfile.socialLinks);
                                            return Object.entries(links).map(([platform, url]: [any, any]) => (
                                                <span key={platform} className="text-[8px] font-black text-neon-cyan uppercase tracking-widest">
                                                    {platform}
                                                </span>
                                            ));
                                        } catch { return null; }
                                    })()
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
