"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Terminal, Zap, User } from "lucide-react";
import { createPost, getPosts } from "@/lib/actions";

interface Message {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    user?: {
        name: string;
        displayName: string | null;
        profilePicture: string | null;
    };
}

interface LiveChatProps {
    roomId?: string; // Future proofing for channel-specific chat
    currentUser: {
        id: string;
        name: string;
    };
    onClose: () => void;
}

export default function LiveChat({ currentUser, onClose }: LiveChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        const data = await getPosts(currentUser.id);
        // Only take the last 50 for the chat window
        setMessages((data as any[]).reverse());
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // 5s refresh for "real-time" feel without WS
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        const res = await createPost(currentUser.id, input.trim());
        if (res.success) {
            setInput("");
            await fetchMessages();
        }
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] z-[100] flex flex-col glass-dark border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30">
                            <MessageSquare size={14} className="text-neon-cyan" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Signal Hub</h3>
                        <p className="text-[7px] font-black text-neon-cyan/50 uppercase tracking-widest">Neural Link Active</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                        <Terminal size={32} className="text-white" />
                        <p className="text-[8px] font-black text-white uppercase tracking-widest">Awaiting Neural Pulses...</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.userId === currentUser.id;
                        return (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                        {msg.user?.displayName || msg.user?.name || 'Local User'}
                                    </span>
                                    <span className="text-[6px] font-black text-slate-700 uppercase">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed ${isMe
                                        ? 'bg-neon-cyan/10 border border-neon-cyan/20 text-blue-100 rounded-tr-none'
                                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/40 border-t border-white/5">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a neural pulse..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/50 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20">
                            <Zap size={10} className="text-neon-cyan" />
                        </div>
                    </div>
                    <button
                        disabled={!input.trim() || isLoading}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isLoading
                                ? 'bg-neon-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95'
                                : 'bg-white/5 text-white/20'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-px bg-white/5 flex-1" />
                    <span className="text-[6px] font-black text-slate-600 uppercase tracking-[0.3em]">Encrypted Signal Link</span>
                    <div className="h-px bg-white/5 flex-1" />
                </div>
            </div>
        </motion.div>
    );
}
