"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatMessages, sendChatMessage } from "@/lib/actions";

interface Message {
    id: string;
    userName: string;
    message: string;
    createdAt: Date | null;
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
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadMessages = async () => {
        const data = await getChatMessages(channelId);
        if (data) {
            setMessages(data.reverse());
        }
    };

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [channelId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const msgContent = newMessage.trim();
        setNewMessage("");
        setSending(true);

        // Optimistic update
        const tempId = Math.random().toString();
        const optimisticMsg: Message = {
            id: tempId,
            userName,
            message: msgContent,
            createdAt: new Date(),
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const res = await sendChatMessage({
            userId,
            userName,
            message: msgContent,
            channelId
        });

        if (!res.success) {
            // Remove optimistic message if failed
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }

        setSending(false);
    };

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
                    messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={msg.id}
                            className="space-y-1.5 group"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-neon-cyan">
                                    {msg.userName}
                                </span>
                                <span className="text-[6px] font-black text-slate-600 uppercase">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                            </div>
                            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-white/[0.05] transition-all">
                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic antialiased">
                                    {msg.message}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/5 space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="TRANSMIT IDEA..."
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
        </div>
    );
}
