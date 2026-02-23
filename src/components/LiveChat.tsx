"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare, Sparkles, Smile, Reply, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatMessages, sendChatMessage, addMessageReaction, getMessageReactions } from "@/lib/actions";
import ProfileModal from "./ProfileModal";

interface Message {
    id: string;
    userId: string;
    userName: string;
    message: string;
    replyToId?: string | null;
    createdAt: Date | null;
}

interface Reaction {
    id: string;
    messageId: string;
    userName: string;
    emoji: string;
}

interface LiveChatProps {
    channelId?: string;
    userName: string;
    userId: string;
}



export default function LiveChat({ channelId, userName, userId }: LiveChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadMessages = React.useCallback(async () => {
        const data = await getChatMessages(channelId);
        if (data) {
            const reversedData = data.reverse();
            setMessages(reversedData);
            // Fetch reactions for messages efficiently
            const reactsPromises = reversedData.map(async (msg) => {
                const reacts = await getMessageReactions(msg.id);
                return { id: msg.id, reacts };
            });
            const allReacts = await Promise.all(reactsPromises);
            const reactionsMap: Record<string, Reaction[]> = {};
            allReacts.forEach(item => {
                reactionsMap[item.id] = item.reacts;
            });
            setReactions(reactionsMap);
        }
    }, [channelId]);

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [loadMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, reactions]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const msgContent = newMessage.trim();
        const rId = replyingTo?.id;
        setNewMessage("");
        setReplyingTo(null);
        setSending(true);

        const tempId = Math.random().toString();
        const optimisticMsg: Message = {
            id: tempId,
            userId,
            userName,
            message: msgContent,
            replyToId: rId,
            createdAt: new Date(),
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const res = await sendChatMessage({
            userId,
            userName,
            message: msgContent,
            channelId,
            replyToId: rId
        });

        if (!res.success) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }

        setSending(false);
    };

    const handleReact = async (messageId: string, emoji: string) => {
        setShowEmojiPicker(null);
        const res = await addMessageReaction(messageId, userId, userName, emoji);
        if (res.success) {
            const newReacts = await getMessageReactions(messageId);
            setReactions(prev => ({ ...prev, [messageId]: newReacts }));
        }
    };

    const EMOJIS = ["🔥", "❤️", "👍", "💡", "😮", "😂"];

    return (
        <div className="flex flex-col h-full glass border border-white/5 bg-black/20 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                        <MessageSquare size={16} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Chat</h3>
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Global Idea Flux</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                        <Sparkles size={32} className="text-neon-cyan" />
                        <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                            Signal established.<br />Awaiting intellectual transmission.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const reply = msg.replyToId ? messages.find(m => m.id === msg.replyToId) : null;
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={msg.id}
                                className="space-y-1.5 group relative"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedProfileId(msg.userId)}
                                            className="text-[8px] font-black uppercase tracking-widest text-neon-cyan hover:underline decoration-white/20 underline-offset-2"
                                        >
                                            {msg.userName}
                                        </button>
                                        <span className="text-[6px] font-black text-slate-600 uppercase">
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setReplyingTo(msg)}
                                            className="p-1 hover:text-neon-cyan transition-colors"
                                            title="Reply"
                                        >
                                            <Reply size={10} />
                                        </button>
                                        <button
                                            onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                                            className="p-1 hover:text-neon-cyan transition-colors"
                                            title="React"
                                        >
                                            <Smile size={10} />
                                        </button>
                                    </div>
                                </div>

                                {reply && (
                                    <div className="ml-2 pl-2 border-l border-white/10 mb-1 opacity-50">
                                        <p className="text-[7px] font-black text-neon-cyan uppercase tracking-widest">@{reply.userName}</p>
                                        <p className="text-[8px] text-slate-500 truncate">{reply.message}</p>
                                    </div>
                                )}

                                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-white/[0.05] transition-all relative">
                                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic antialiased">
                                        {msg.message}
                                    </p>

                                    {/* Reactions */}
                                    {reactions[msg.id]?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {Object.entries(
                                                reactions[msg.id].reduce((acc: Record<string, number>, r) => {
                                                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                                    return acc;
                                                }, {})
                                            ).map(([emoji, count]) => (
                                                <div key={emoji} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-lg text-[8px] flex items-center gap-1">
                                                    <span>{emoji}</span>
                                                    <span className="text-slate-500">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Emoji Picker Pop-up */}
                                    <AnimatePresence>
                                        {showEmojiPicker === msg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-full left-0 mb-2 p-2 glass border border-white/10 rounded-xl flex gap-2 z-50 bg-black/80 backdrop-blur-xl"
                                            >
                                                {EMOJIS.map(e => (
                                                    <button
                                                        key={e}
                                                        onClick={() => handleReact(msg.id, e)}
                                                        className="hover:scale-125 transition-transform p-1"
                                                    >
                                                        {e}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/5 space-y-4 relative">
                {/* Reply Indicator */}
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 right-0 p-3 bg-neon-cyan/10 border-t border-neon-cyan/20 flex items-center justify-between backdrop-blur-md"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Reply size={12} className="text-neon-cyan" />
                                <span className="text-[8px] font-black text-neon-cyan uppercase tracking-widest">Replying to {replyingTo.userName}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <input
                        type="text"
                        placeholder={replyingTo ? "TRANSMIT REPLY..." : "TRANSMIT IDEA..."}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[10px] font-black text-white focus:outline-none focus:border-neon-cyan/40 transition-all uppercase tracking-widest"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-neon-cyan text-black rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-2 px-2">
                    <User size={10} className="text-slate-600" />
                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Connected as {userName}</span>
                </div>
            </form>

            <ProfileModal
                userId={selectedProfileId || ""}
                currentUser={{ id: userId, name: userName }}
                isOpen={!!selectedProfileId}
                onClose={() => setSelectedProfileId(null)}
            />
        </div>
    );
}
