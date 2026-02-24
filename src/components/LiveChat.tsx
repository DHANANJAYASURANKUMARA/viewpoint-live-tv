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

    const handleShowProfile = async (userId: string) => {
        const profile = await getUserProfile(userId);
        setSelectedProfile(profile);
    };

    if (isHidden) {
        return (
            <button
                onClick={() => setIsHidden(false)}
                className="fixed right-6 bottom-32 w-10 h-10 bg-white/5 text-white/40 rounded-xl flex items-center justify-center border border-white/10 hover:bg-neon-magenta hover:text-white hover:border-neon-magenta/50 transition-all z-50 lg:relative lg:right-0 lg:bottom-0 lg:h-12 lg:w-12 lg:rounded-2xl group"
                title="Expand Neural Chat"
            >
                <div className="absolute inset-0 bg-neon-magenta/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={18} className="relative z-10" />
            </button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-[500px] lg:h-full w-full lg:w-[400px] glass border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/[0.02] backdrop-blur-3xl shrink-0 relative"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neon-magenta/20 flex items-center justify-center text-neon-magenta border border-neon-magenta/20">
                        <MessageCircle size={16} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Neural Chat</h3>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            Live Transmission
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsHidden(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all"
                    title="Minimize"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                        <MessageCircle size={40} className="text-slate-500" />
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Awaiting signal fragments...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="space-y-2 group">
                            {msg.parentId && (
                                <div className="ml-4 pl-4 border-l border-white/10 text-[9px] text-slate-500 italic mb-1 flex items-center gap-2">
                                    <Reply size={10} className="rotate-180" />
                                    Replying to a thought
                                </div>
                            )}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleShowProfile(msg.userId)}
                                    className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden hover:border-neon-cyan/50 transition-colors"
                                >
                                    {msg.user?.profilePicture ? (
                                        <img src={msg.user.profilePicture} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={14} className="text-slate-700" />
                                    )}
                                </button>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleShowProfile(msg.userId)}
                                            className="text-[10px] font-black text-white hover:text-neon-cyan transition-colors uppercase tracking-tight truncate max-w-[120px]"
                                        >
                                            {msg.user?.displayName || msg.user?.name}
                                        </button>
                                        <span className="text-[7px] text-slate-600 font-black uppercase">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {editingId === msg.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-black/40 border border-neon-cyan/30 rounded-xl p-3 text-[11px] text-white focus:outline-none"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdate(msg.id)} className="px-3 py-1 bg-neon-cyan text-black rounded-lg text-[8px] font-black uppercase">Sync</button>
                                                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-white/5 text-white rounded-lg text-[8px] font-black uppercase">Abort</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[12px] text-slate-400 leading-relaxed break-words font-medium">
                                            {msg.content}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 pt-1 transition-opacity">
                                        <button
                                            onClick={() => handleToggleLike(msg.id)}
                                            className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${msg.hasLiked ? 'text-neon-magenta' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            <Heart size={10} className={msg.hasLiked ? 'fill-neon-magenta' : ''} />
                                            {msg.likes}
                                        </button>
                                        <button
                                            onClick={() => setReplyTo(msg)}
                                            className="text-[8px] font-black text-slate-600 hover:text-white uppercase tracking-widest flex items-center gap-1"
                                        >
                                            <Reply size={10} />
                                            Reply
                                        </button>
                                        {msg.userId === currentUser?.id && !editingId && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(msg.id);
                                                        setEditContent(msg.content);
                                                    }}
                                                    className="text-[8px] font-black text-slate-600 hover:text-neon-cyan uppercase tracking-widest"
                                                >
                                                    <Edit3 size={10} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="text-[8px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Profile Popup Overlay */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute inset-x-6 top-1/4 z-50 glass p-8 rounded-[2rem] border border-white/20 shadow-2xl bg-black/60 backdrop-blur-3xl space-y-6"
                    >
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 p-1">
                                <div className="w-full h-full rounded-[1.8rem] bg-black border border-white/10 overflow-hidden">
                                    {selectedProfile.profilePicture ? (
                                        <img src={selectedProfile.profilePicture} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">
                                    {selectedProfile.displayName || selectedProfile.name}
                                </h4>
                                <p className="text-neon-cyan text-[8px] font-black uppercase tracking-[0.3em]">Neural Resident</p>
                            </div>

                            {selectedProfile.bio ? (
                                <p className="text-slate-400 text-[10px] leading-relaxed italic px-4">
                                    "{selectedProfile.bio}"
                                </p>
                            ) : (
                                <p className="text-slate-600 text-[10px] italic">Fragment protocol undefined.</p>
                            )}

                            <div className="pt-4 border-t border-white/5 w-full">
                                <div className="flex justify-center gap-6">
                                    {/* Social Links Summary */}
                                    {selectedProfile.socialLinks && (
                                        (() => {
                                            try {
                                                const links = JSON.parse(selectedProfile.socialLinks);
                                                return Object.entries(links).map(([platform, url]: [any, any]) => (
                                                    <span key={platform} className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-neon-cyan cursor-default">
                                                        {platform}
                                                    </span>
                                                ));
                                            } catch { return null; }
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5 space-y-4">
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-3 bg-neon-magenta/5 border border-neon-magenta/10 rounded-2xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Reply size={12} className="text-neon-magenta" rotate={180} />
                                <span className="text-[9px] text-slate-500 font-black uppercase">
                                    Replying to <span className="text-white">{replyTo.user?.displayName || replyTo.user?.name}</span>
                                </span>
                            </div>
                            <button onClick={() => setReplyTo(null)} className="text-slate-600 hover:text-white">
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Injet thought into matrix..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-[11px] text-white focus:outline-none focus:border-neon-magenta/30 transition-all resize-none h-14 custom-scrollbar"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isSending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-neon-magenta text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,45,85,0.3)] disabled:opacity-30 disabled:hover:scale-100"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
