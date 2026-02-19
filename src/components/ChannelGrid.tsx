"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, TrendingUp, Search } from "lucide-react";

const channels = [
    {
        id: "asia-tv",
        name: "ASIA TV",
        url: "https://stream.asiatvnet.com/1/live/master.m3u8",
        category: "Entertainment",
        logo: "📡",
        viewers: "12.4k",
        trending: true
    },
    {
        id: "hiru-tv",
        name: "HIRU TV",
        url: "https://tv.hiruhost.com:1936/8012/8012/playlist.m3u8",
        category: "Entertainment",
        logo: "🏮",
        viewers: "450k",
        trending: true
    },
    {
        id: "siyatha-tv",
        name: "SIYATHA TV",
        url: "https://rtmp01.voaplus.com/hls/6x6ik312qk4grfxocfcv.m3u8",
        category: "Entertainment",
        logo: "📺",
        viewers: "210k",
        trending: false
    },
    {
        id: "swarnawahini",
        name: "SWARNAWAHINI",
        url: "https://jk3lz8xklw79-hls-live.5centscdn.com/live/6226f7cbe59e99a90b5cef6f94f966fd.sdp/playlist.m3u8",
        category: "Entertainment",
        logo: "🎭",
        viewers: "840k",
        trending: true
    },
    {
        id: "tv-1",
        name: "TV 1",
        url: "https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8",
        category: "Entertainment",
        logo: "🌟",
        viewers: "150k",
        trending: false
    },
    {
        id: "apple-event",
        name: "Apple Event Stream",
        url: "https://apple-event.apple.com/main.m3u8",
        category: "Tech",
        logo: "🍎",
        viewers: "1.2M",
        trending: true
    },
    {
        id: "mux-test",
        name: "Mux Global Stream",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        category: "Sports",
        logo: "⚽",
        viewers: "45.2k",
        trending: true
    },
    {
        id: "star-sports-1",
        name: "STAR SPORTS 01",
        url: "https://playerado.top/embed2.php?id=starsp",
        category: "Sports",
        logo: "🏏",
        viewers: "1.5M",
        trending: true
    },
    {
        id: "star-sports-2",
        name: "STAR SPORTS 02",
        url: "https://playerado.top/embed2.php?id=starsp2",
        category: "Sports",
        logo: "🎾",
        viewers: "850k",
        trending: false
    },
    {
        id: "star-sports-3",
        name: "STAR SPORTS 03",
        url: "https://playerado.top/embed2.php?id=starsp3",
        category: "Sports",
        logo: "🏑",
        viewers: "420k",
        trending: false
    },
    {
        id: "sky-sports",
        name: "SKY SPORTS",
        url: "https://playerado.top/embed2.php?id=crich2",
        category: "Sports",
        logo: "🏎️",
        viewers: "2.1M",
        trending: true
    },
    {
        id: "willow-sports",
        name: "WILLOW SPORTS",
        url: "https://playerado.top/embed2.php?id=willow",
        category: "Sports",
        logo: "🏏",
        viewers: "640k",
        trending: true
    },
    {
        id: "willow-extra",
        name: "WILLOW EXTRA",
        url: "https://playerado.top/embed2.php?id=willowextra",
        category: "Sports",
        logo: "🏏",
        viewers: "320k",
        trending: false
    },
    {
        id: "a-sports",
        name: "A SPORTS",
        url: "https://playerado.top/embed2.php?id=asports",
        category: "Sports",
        logo: "🏆",
        viewers: "910k",
        trending: true
    },
    {
        id: "akamai-hls",
        name: "HLS News Live",
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        category: "News",
        logo: "🌐",
        viewers: "8.9k",
        trending: false
    },
    {
        id: "akamai-dash",
        name: "DASH Cinema HD",
        url: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
        category: "Movies",
        logo: "🎬",
        viewers: "15.4k",
        trending: false
    },
    {
        id: "bitmovin-test",
        name: "Art & Culture TV",
        url: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
        category: "Culture",
        logo: "🎨",
        viewers: "4.2k",
        trending: false
    }
];

const categories = ["All", "Entertainment", "Sports", "News", "Movies", "Tech", "Culture"];

interface ChannelGridProps {
    onChannelSelect: (url: string, title: string) => void;
}

export default function ChannelGrid({ onChannelSelect }: ChannelGridProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredChannels = activeCategory === "All"
        ? channels
        : channels.filter(c => c.category === activeCategory);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredChannels.map((channel, index) => (
                    <motion.button
                        key={channel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onChannelSelect(channel.url, channel.name)}
                        className="group relative h-48 rounded-2xl overflow-hidden glass hover:border-neon-cyan/50 transition-all duration-300 text-left"
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

                        <div className="absolute top-4 right-4 z-20">
                            {channel.trending && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded-full">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple"></span>
                                    </span>
                                    <span className="text-[9px] font-bold text-neon-purple uppercase tracking-tight">Trending</span>
                                </div>
                            )}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="w-12 h-12 rounded-full bg-neon-cyan text-vpoint-dark flex items-center justify-center shadow-xl shadow-neon-cyan/30 transform scale-75 group-hover:scale-100 transition-transform">
                                <Play fill="currentColor" className="ml-1" size={20} />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                            <div className="text-3xl mb-1 group-hover:scale-110 transition-transform origin-left duration-500">{channel.logo}</div>
                            <p className="text-[8px] font-black text-neon-cyan uppercase tracking-widest mb-1">{channel.category}</p>
                            <h4 className="text-white font-black truncate leading-tight uppercase tracking-wide group-hover:text-neon-cyan transition-colors">{channel.name}</h4>
                            <p className="text-slate-400 text-[8px] mt-1.5 flex items-center gap-1.5 uppercase font-black tracking-widest">
                                <span className={`w-1.5 h-1.5 rounded-full ${channel.id === 'apple-event' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                                {channel.viewers} Viewers
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
