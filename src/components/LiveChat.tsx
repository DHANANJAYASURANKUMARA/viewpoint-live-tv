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
                                        <span className="font-black text-neon-cyan mr-1.5 capitalize">{msg.user?.displayName || msg.user?.name}</span>
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

            {/* Profile Overlay v3 (Immersive Social) */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto no-scrollbar"
                    >
                        {/* DM Transmit FX Overlay */}
                        <AnimatePresence>
                            {isDMAnimate && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[110] bg-neon-cyan/10 flex items-center justify-center backdrop-blur-sm"
                                >
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-40 h-40 border-4 border-neon-cyan rounded-full flex items-center justify-center"
                                    >
                                        <Send size={40} className="text-neon-cyan" />
                                    </motion.div>
                                    <p className="absolute bottom-1/4 text-neon-cyan font-black uppercase tracking-[0.5em] text-xs animate-pulse">Establishing Neural Link...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute top-8 left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 group active:scale-90"
                        >
                            <ChevronLeft size={24} className="text-white group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="w-full max-w-md flex flex-col items-center space-y-10 py-10">
                            {/* Header Section */}
                            <div className="flex flex-col items-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-44 h-44 rounded-full border-[6px] border-neon-cyan/20 p-2 relative shadow-[0_0_80px_rgba(0,242,255,0.2)]"
                                >
                                    <div className="w-full h-full rounded-full bg-black overflow-hidden bg-white/5 flex items-center justify-center relative z-10">
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
                                    <div className="flex items-center justify-center gap-3">
                                        <p className="text-neon-magenta font-black uppercase tracking-[0.4em] text-[10px] bg-neon-magenta/10 px-3 py-1 rounded-full border border-neon-magenta/20">Verified Identity</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-full glass-dark border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-neon-cyan/30 transition-all"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan group-hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all" />
                                <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed italic pr-4">
                                    "{selectedProfile.bio || "In the matrix, code is reality. Identity is a fragment."}"
                                </p>
                            </motion.div>

                            {/* Interaction Matrix */}
                            <div className="grid grid-cols-2 gap-4 w-full px-2">
                                {currentUser && selectedProfile.id !== currentUser.id && (
                                    <>
                                        <button
                                            onClick={handleFriendRequest}
                                            className={`py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex flex-col items-center gap-1 group ${friendshipStatus?.status === 'accepted'
                                                ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                                                : friendshipStatus?.status === 'pending'
                                                    ? 'bg-white/5 text-slate-500 border border-white/10 opacity-50'
                                                    : 'bg-neon-cyan text-black shadow-[0_20px_40px_rgba(0,242,255,0.3)] hover:shadow-[0_30px_60px_rgba(0,242,255,0.4)] hover:scale-[1.05]'
                                                }`}
                                        >
                                            <User size={20} className={friendshipStatus?.status === 'accepted' ? "" : "group-hover:animate-bounce"} />
                                            {friendshipStatus?.status === 'accepted' ? 'Following' :
                                                friendshipStatus?.status === 'pending' ? 'Pending' : 'Connect'}
                                        </button>

                                        <button
                                            onClick={handleDMTouch}
                                            className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-neon-magenta hover:text-black hover:border-neon-magenta transition-all flex flex-col items-center gap-1 hover:shadow-[0_20px_40px_rgba(255,45,85,0.3)] group"
                                        >
                                            <Send size={20} className="group-hover:rotate-12 transition-transform" />
                                            DM Transmit
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => window.location.href = `/nexus?user=${selectedProfile.id}`}
                                    className={`py-5 rounded-2xl bg-white/[0.02] border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all flex flex-col items-center gap-1 group ${currentUser && selectedProfile.id !== currentUser.id ? 'col-span-2' : 'col-span-2'}`}
                                >
                                    <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                                    View Full Nexus Identity
                                </button>
                            </div>

                            {/* Signal Fragments (Social Links) */}
                            {selectedProfile.socialLinks && (
                                <div className="w-full space-y-4 pt-4 pb-8">
                                    <div className="flex items-center gap-4 px-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Signal Fragments</span>
                                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-8">
                                        {(() => {
                                            try {
                                                const links = JSON.parse(selectedProfile.socialLinks);
                                                return Object.entries(links).map(([platform, url]: [any, any]) => (
                                                    <motion.div
                                                        key={platform}
                                                        whileHover={{ scale: 1.1 }}
                                                        className="flex flex-col items-center gap-2 group cursor-pointer"
                                                        onClick={() => window.open(url, '_blank')}
                                                    >
                                                        <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">{platform}</span>
                                                        <div className="h-1 w-6 bg-neon-cyan/20 rounded-full group-hover:bg-neon-cyan group-hover:shadow-[0_0_10px_rgba(0,242,255,0.8)] transition-all" />
                                                    </motion.div>
                                                ));
                                            } catch { return null; }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

