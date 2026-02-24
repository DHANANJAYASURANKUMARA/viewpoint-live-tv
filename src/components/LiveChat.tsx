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

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 space-y-2 flex flex-col custom-scrollbar pointer-events-auto"
                style={{
                    maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)'
                }}
            >
                <div className="flex-1" />
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-2 py-10 opacity-30">
                        <MessageCircle size={30} className="text-slate-500" />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Awaiting signal fragments...</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                                opacity: idx < messages.length - 5 ? 0.3 : 1,
                                transition: { duration: 0.5 }
                            }}
                            className="flex items-start gap-2 group"
                        >
                            <button
                                onClick={() => handleShowProfile(msg.userId)}
                                className="w-7 h-7 rounded-full border border-white/10 overflow-hidden shrink-0 hover:border-neon-cyan transition-colors"
                            >
                                {msg.user?.profilePicture ? (
                                    <img src={msg.user.profilePicture} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-600">
                                        <User size={12} />
                                    </div>
                                )}
                            </button>

                            <div className="flex flex-col gap-1 max-w-[85%]">
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 relative">
                                    <p className="text-[10px] leading-tight">
                                        <button
                                            onClick={() => handleShowProfile(msg.userId)}
                                            className="font-black text-neon-cyan mr-1.5 capitalize hover:text-white transition-colors active:scale-95"
                                        >
                                            {msg.user?.displayName || msg.user?.name}
                                        </button>
                                        <span className="text-slate-100/90 font-medium break-words">{msg.content}</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Input Area (Refined Row) */}
            <div className="p-4 flex items-center gap-2 pointer-events-auto">
                <button
                    onClick={() => triggerHearts()}
                    className="p-3 bg-white/10 text-white rounded-full hover:bg-neon-magenta/40 transition-colors shadow-[0_0_15px_rgba(255,45,85,0.2)]"
                >
                    <Heart size={20} />
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Add comment..."
                        className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-full py-2.5 px-4 text-[12px] text-white focus:outline-none focus:border-neon-magenta/30 transition-all"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isSending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neon-magenta hover:scale-110 transition-transform disabled:opacity-0 active:scale-90"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Profile Modal v4 (Centered Neural Hub) */}
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
                                        <Send size={32} className="text-neon-cyan sm:hidden" />
                                        <Send size={40} className="text-neon-cyan hidden sm:block" />
                                    </motion.div>
                                    <p className="absolute bottom-1/4 text-neon-cyan font-black uppercase tracking-[0.5em] text-[8px] sm:text-xs animate-pulse">Establishing Neural Link...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-vpoint-dark border border-white/10 rounded-2xl lg:rounded-[2.5rem] shadow-[0_0_100px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] touch-none"
                        >
                            {/* Header / Close */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
                                <button
                                    onClick={() => setSelectedProfile(null)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-all border border-white/5 group active:scale-95"
                                >
                                    <X size={20} className="text-slate-400 group-hover:text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-8 sm:space-y-10 touch-pan-y">
                                {/* Identity Core */}
                                <div className="flex flex-col items-center space-y-6 sm:space-y-8 pt-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-28 h-28 sm:w-44 sm:h-44 rounded-full border-[6px] border-neon-cyan/20 p-2 relative shadow-[0_0_80px_rgba(0,242,255,0.2)]"
                                    >
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden bg-white/5 flex items-center justify-center relative z-10">
                                            {selectedProfile.profilePicture ? (
                                                <img src={selectedProfile.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <>
                                                    <User size={30} className="text-slate-700 sm:hidden" />
                                                    <User size={60} className="text-slate-700 hidden sm:block" />
                                                </>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-2xl animate-pulse" />
                                    </motion.div>

                                    <div className="text-center space-y-3">
                                        <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-widest italic leading-none drop-shadow-2xl">
                                            {selectedProfile.displayName || selectedProfile.name}
                                        </h2>
                                        <div className="flex items-center justify-center gap-3">
                                            <p className="text-neon-magenta font-black uppercase tracking-[0.4em] text-[8px] sm:text-[10px] bg-neon-magenta/10 px-3 py-1 rounded-full border border-neon-magenta/20">Verified Identity</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio Sector */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full glass-dark border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden group hover:border-neon-cyan/20 transition-all shadow-inner"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)]" />
                                    <p className="text-slate-300 text-sm sm:text-xl font-medium leading-relaxed italic">
                                        "{selectedProfile.bio || "In the matrix, code is reality. Identity is a fragment."}"
                                    </p>
                                </motion.div>

                                {/* Neural Grid Controls */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                                    {currentUser && selectedProfile.id !== currentUser.id && (
                                        <>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleFriendRequest}
                                                className={`py-5 sm:py-6 rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[11px] transition-all flex flex-col items-center gap-2 group ${friendshipStatus?.status === 'accepted'
                                                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                                                    : friendshipStatus?.status === 'pending'
                                                        ? 'bg-white/5 text-slate-500 border border-white/10 opacity-50'
                                                        : 'bg-neon-cyan text-black shadow-[0_15px_30px_rgba(0,242,255,0.2)] hover:shadow-[0_20px_40px_rgba(0,242,255,0.3)] hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <User size={18} className={`sm:w-5 sm:h-5 ${friendshipStatus?.status === 'accepted' ? "" : "group-hover:animate-bounce"}`} />
                                                {friendshipStatus?.status === 'accepted' ? 'Following' :
                                                    friendshipStatus?.status === 'pending' ? 'Pending' : 'Connect'}
                                            </motion.button>

                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleDMTouch}
                                                className="py-5 sm:py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:bg-neon-magenta hover:text-black hover:border-neon-magenta transition-all flex flex-col items-center gap-2 hover:shadow-[0_15px_30px_rgba(255,45,85,0.2)] group"
                                            >
                                                <Send size={18} className="sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                                                DM Transmit
                                            </motion.button>
                                        </>
                                    )}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.href = `/nexus?user=${selectedProfile.id}`}
                                        className={`py-5 sm:py-6 rounded-2xl bg-white/[0.02] border border-white/5 text-white font-black uppercase tracking-widest text-[9px] sm:text-[11px] hover:bg-white/10 transition-all flex flex-col items-center gap-2 group ${currentUser && selectedProfile.id !== currentUser.id ? 'col-span-2' : 'col-span-2'}`}
                                    >
                                        <ExternalLink size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
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
                                        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
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
                                                            <div className="h-1 w-5 sm:w-8 bg-neon-cyan/10 rounded-full group-hover:bg-neon-cyan shadow-sm group-hover:shadow-[0_0_12px_rgba(0,242,255,0.5)] transition-all" />
                                                        </motion.div>
                                                    ));
                                                } catch { return null; }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Sync */}
                            <div className="p-6 sm:p-8 bg-black/40 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div className="text-[8px] font-black tracking-[0.3em] uppercase flex items-center gap-1.5 opacity-30">
                                    <span className="text-white">ID</span>
                                    <span className="text-neon-cyan">M-CORE</span>
                                    <span className="text-white ml-2">FRAGMENT</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Linked</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

