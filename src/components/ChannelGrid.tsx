"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, TrendingUp, Search } from "lucide-react";
import { getChannels } from "@/lib/actions";

const categories = ["All", "Entertainment", "Sports", "News", "Movies", "Tech", "Culture"];

interface ChannelGridProps {
    onChannelSelect: (url: string, title: string) => void;
}

export default function ChannelGrid({ onChannelSelect }: ChannelGridProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                const data = await getChannels();
                if (data && data.length > 0) {
                    setChannels(data);
                }
            } catch (err) {
                console.error("ChannelGrid DB sync failed:", err);
            } finally {
                setLoading(false);
            }
        };
        loadChannels();
    }, []);

    const filteredChannels = channels.filter(c => {
        const matchesCategory = activeCategory === "All" || c.category === activeCategory;
        const isLive = (c.status || "Live") === "Live";
        return matchesCategory && isLive;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
                    <TrendingUp className="text-neon-cyan" />
                    Featured Now
                </h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[9px] uppercase font-black tracking-widest transition-all ${activeCategory === cat
                                ? "bg-neon-cyan text-vpoint-dark shadow-lg shadow-neon-cyan/20"
                                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-8">
                {filteredChannels.map((channel, index) => (
                    <motion.button
                        key={channel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onChannelSelect(channel.url, channel.name)}
                        className="group relative h-40 lg:h-48 rounded-2xl overflow-hidden glass hover:border-neon-cyan/50 transition-all duration-300 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-vpoint-dark via-vpoint-dark/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Mock Animation Layer */}
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <motion.div
                                animate={{
                                    opacity: [0.1, 0.2, 0.1],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-neon-magenta/10"
                            />
                        </div>

                        <div className="absolute top-3 right-3 lg:top-4 lg:right-4 z-20">
                            {channel.trending && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded-full">
                                    <span className="relative flex h-1.5 w-1.5 lg:h-2 lg:w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 lg:h-2 lg:w-2 bg-neon-purple"></span>
                                    </span>
                                    <span className="text-[7px] lg:text-[9px] font-bold text-neon-purple uppercase tracking-tight">Trending</span>
                                </div>
                            )}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-neon-cyan text-vpoint-dark flex items-center justify-center shadow-xl shadow-neon-cyan/30 transform scale-75 group-hover:scale-100 transition-transform">
                                <Play fill="currentColor" className="ml-1" size={18} />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-20">
                            <div className="text-2xl lg:text-3xl mb-1 group-hover:scale-110 transition-transform origin-left duration-500">{channel.logo}</div>
                            <p className="text-[7px] lg:text-[8px] font-black text-neon-cyan uppercase tracking-widest mb-1">{channel.category}</p>
                            <h4 className="text-xs lg:text-sm font-black truncate leading-tight uppercase tracking-wide group-hover:text-neon-cyan transition-colors">{channel.name}</h4>
                            <p className="text-slate-400 text-[7px] lg:text-[8px] mt-1 lg:mt-1.5 flex items-center gap-1.5 uppercase font-black tracking-widest">
                                <span className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full ${channel.id === 'apple-event' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                                {channel.viewers} Viewers
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
