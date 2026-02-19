"use client";

import React, { useState } from "react";
import {
    Search,
    Menu,
    X,
    Star,
    LayoutGrid,
    Flame,
    Music2,
    Trophy,
    Settings as SettingsIcon,
    Radio,
    ChevronRight,
    SearchX,
    MessageCircle,
    Clapperboard,
    Globe,
    Music,
    Gamepad2,
    Newspaper,
    Film,
    Zap,
    ExternalLink,
    Heart,
    Settings,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Channel {
    id: string | number;
    name: string;
    url: string;
    category: string;
    description: string;
    isLive: boolean;
}

const channels: Channel[] = [
    {
        id: "asia-tv",
        name: "ASIA TV",
        url: "https://stream.asiatvnet.com/1/live/master.m3u8",
        category: "Entertainment",
        description: "Live Asian entertainment and news broadcasting.",
        isLive: true
    },
    {
        id: "hiru-tv",
        name: "HIRU TV",
        url: "https://tv.hiruhost.com:1936/8012/8012/playlist.m3u8",
        category: "Entertainment",
        description: "Sri Lanka's number one entertainment channel.",
        isLive: true
    },
    {
        id: "siyatha-tv",
        name: "SIYATHA TV",
        url: "https://rtmp01.voaplus.com/hls/6x6ik312qk4grfxocfcv.m3u8",
        category: "Entertainment",
        description: "Premium Sinhala entertainment and lifestyle channel.",
        isLive: true
    },
    {
        id: "swarnawahini",
        name: "SWARNAWAHINI",
        url: "https://jk3lz8xklw79-hls-live.5centscdn.com/live/6226f7cbe59e99a90b5cef6f94f966fd.sdp/playlist.m3u8",
        category: "Entertainment",
        description: "The golden channel of Sri Lankan television.",
        isLive: true
    },
    {
        id: "tv-1",
        name: "TV 1",
        url: "https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8",
        category: "Entertainment",
        description: "Innovative programming and global content for Sri Lanka.",
        isLive: true
    },
    {
        id: "apple-event",
        name: "Apple Event Stream",
        url: "https://apple-event.apple.com/main.m3u8",
        category: "Tech",
        description: "Official Apple events and product launches.",
        isLive: false
    },
    {
        id: "mux-test",
        name: "Mux Global Stream",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        category: "Sports",
        description: "Worldwide sports and news coverage.",
        isLive: true
    },
    {
        id: "star-sports-1",
        name: "STAR SPORTS 01",
        url: "https://playerado.top/embed2.php?id=starsp",
        category: "Sports",
        description: "Premier cricket and international sports coverage.",
        isLive: true
    },
    {
        id: "star-sports-2",
        name: "STAR SPORTS 02",
        url: "https://playerado.top/embed2.php?id=starsp2",
        category: "Sports",
        description: "Live football, tennis, and secondary cricket feeds.",
        isLive: true
    },
    {
        id: "star-sports-3",
        name: "STAR SPORTS 03",
        url: "https://playerado.top/embed2.php?id=starsp3",
        category: "Sports",
        description: "Regional sports content and dedicated match analysis.",
        isLive: true
    },
    {
        id: "sky-sports",
        name: "SKY SPORTS",
        url: "https://playerado.top/embed2.php?id=crich2",
        category: "Sports",
        description: "World-class football, F1, and multi-sport broadcasting.",
        isLive: true
    },
    {
        id: "willow-sports",
        name: "WILLOW SPORTS",
        url: "https://playerado.top/embed2.php?id=willow",
        category: "Sports",
        description: "Dedicated 24/7 cricket streaming for international fans.",
        isLive: true
    },
    {
        id: "willow-extra",
        name: "WILLOW EXTRA",
        url: "https://playerado.top/embed2.php?id=willowextra",
        category: "Sports",
        description: "Secondary Willow feed for simultaneous live matches.",
        isLive: true
    },
    {
        id: "a-sports",
        name: "A SPORTS",
        url: "https://playerado.top/embed2.php?id=asports",
        category: "Sports",
        description: "Premium HD sports broadcasting from Pakistan.",
        isLive: true
    },
    {
        id: "akamai-hls",
        name: "HLS News Live",
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        category: "News",
        description: "Global breaking news and reports.",
        isLive: true
    },
    {
        id: "akamai-dash",
        name: "DASH Cinema HD",
        url: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
        category: "Movies",
        description: "Premium cinematic experiences in UHD.",
        isLive: false
    },
    {
        id: "bitmovin-test",
        name: "Art & Culture TV",
        url: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
        category: "Culture",
        description: "Fine arts, style, and international culture.",
        isLive: true
    }
];

const categories = ["All", "Entertainment", "Sports", "News", "Movies", "Tech", "Culture", "Custom"];

interface SidebarProps {
    onClose: () => void;
    activeChannelUrl?: string;
}

export default function Sidebar({ onClose, activeChannelUrl }: SidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [favorites, setFavorites] = useState<string[]>([]);

    // Custom URL support
    const [customUrl, setCustomUrl] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);

    const handleChannelSelect = (channel: Channel | { url: string; name: string; category: string }) => {
        window.dispatchEvent(new CustomEvent("vpoint-channel-select", {
            detail: {
                url: channel.url,
                name: channel.name,
                category: (channel as Channel).category || 'Custom'
            }
        }));
        onClose(); // Auto-close on selection for mobile better UX
    };

    const toggleFavorite = (id: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(id.toString())
                ? prev.filter(f => f !== id.toString())
                : [...prev, id.toString()]
        );
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customUrl.trim()) {
            handleChannelSelect({
                url: customUrl,
                name: "CUSTOM TRANSMISSION",
                category: "Custom"
            });
            setCustomUrl("");
        }
    };

    const filteredChannels = channels.filter(c => {
        const matchesCategory = activeCategory === "All" || c.category === activeCategory;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryIcons: Record<string, any> = {
        All: <Globe size={16} />,
        Entertainment: <Music size={16} />,
        Sports: <Gamepad2 size={16} />,
        News: <Newspaper size={16} />,
        Movies: <Film size={16} />,
        Tech: <Zap size={16} />,
        Culture: <Globe size={16} />,
        Custom: <ExternalLink size={16} />
    };

    return (
        <div className="w-full lg:w-96 h-full glass border-r border-white/5 flex flex-col p-6 overflow-hidden relative shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
            {/* Sidebar Branding */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                        VIEW<span className="text-neon-purple">POINT</span>
                    </h2>
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Premium Streaming</p>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Neural Search */}
            <div className="relative mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-neon-cyan transition-colors" size={16} />
                <input
                    type="text"
                    placeholder="SCAN NETWORK..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/30 focus:bg-white/[0.04] transition-all uppercase tracking-widest"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-neon-cyan animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-neon-magenta animate-pulse delay-75" />
                </div>
            </div>

            {/* Scrolling Navigation Layer */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
                {/* Categories */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Transmission Sectors</h3>
                        <Activity className="text-slate-700" size={10} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 6).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-2.5 p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat
                                    ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    : "bg-white/[0.02] border-white/5 text-slate-500 hover:text-white hover:border-white/10"
                                    }`}
                            >
                                {categoryIcons[cat]}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Channel Flux */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Available Signals</h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[7px] font-black text-slate-600">{filteredChannels.length} ON</span>
                    </div>

                    <div className="space-y-2.5">
                        {filteredChannels.length > 0 ? (
                            filteredChannels.map((channel) => {
                                const isActive = activeChannelUrl === channel.url;

                                // Map category to Lucide icon for premium look
                                const ChannelIcon = channel.category === "Sports" ? Trophy :
                                    channel.category === "News" ? Globe :
                                        channel.category === "Movies" ? Film :
                                            channel.category === "Entertainment" ? Radio : Activity;

                                return (
                                    <motion.div
                                        key={channel.id}
                                        layout
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleChannelSelect(channel)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleChannelSelect(channel);
                                            }
                                        }}
                                        className={`mx-1 group relative flex items-center justify-between p-4 rounded-2xl transition-all duration-500 cursor-pointer outline-none focus-visible:border-neon-cyan/50 focus-visible:bg-white/[0.05] ${isActive ?
                                            "bg-white/[0.08] border-neon-magenta/50 shadow-[0_0_20px_rgba(255,45,85,0.15)] ring-1 ring-neon-magenta/30" :
                                            "bg-white/[0.01] border-white/5 hover:border-neon-cyan/20 hover:bg-white/[0.03]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500 ${isActive ? "bg-neon-magenta/20 text-neon-magenta shadow-[0_0_15px_rgba(255,45,85,0.3)]" :
                                                channel.category === "Entertainment" ? "bg-amber-500/10 text-amber-500" :
                                                    channel.category === "Sports" ? "bg-emerald-500/10 text-emerald-500" :
                                                        channel.category === "News" ? "bg-blue-500/10 text-blue-500" : "bg-neon-magenta/10 text-neon-magenta"
                                                }`}>
                                                <ChannelIcon size={18} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className={`text-[10px] font-black group-hover:text-neon-cyan transition-colors uppercase tracking-widest ${isActive ? "text-neon-magenta" : "text-white"}`}>
                                                    {channel.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {isActive ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="relative flex h-1.5 w-1.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-magenta opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-magenta"></span>
                                                            </div>
                                                            <span className="text-[7px] font-black text-neon-magenta uppercase tracking-tighter">NOW PLAYING</span>
                                                        </div>
                                                    ) : channel.isLive && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-tighter">LIVE FEED</span>
                                                        </div>
                                                    )}
                                                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">HD • {channel.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => toggleFavorite(channel.id, e)}
                                                className={`p-2 rounded-lg transition-all ${favorites.includes(channel.id.toString()) ? "text-neon-magenta" : "text-slate-700 hover:text-white"}`}
                                            >
                                                <Heart size={14} fill={favorites.includes(channel.id.toString()) ? "currentColor" : "none"} />
                                            </button>
                                            <ChevronRight size={14} className="text-slate-800 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                <SearchX size={24} className="mb-2" />
                                <p className="text-[9px] font-black uppercase tracking-widest">No Signal Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Link Terminal */}
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                {!showCustomInput ? (
                    <button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full py-4 glass-dark border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-neon-magenta hover:border-neon-magenta/30 transition-all text-[9px] font-black uppercase tracking-[0.2em]"
                    >
                        <Zap size={14} />
                        Inject Custom Stream
                    </button>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleCustomSubmit}
                        className="space-y-3"
                    >
                        <div className="relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="PASTE M3U8 / MPD LINK..."
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className="w-full bg-black/40 border border-neon-magenta/20 rounded-xl py-3 px-4 text-[9px] font-black text-white focus:outline-none focus:border-neon-magenta/50 transition-all uppercase tracking-widest"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(false)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-neon-magenta/80 hover:bg-neon-magenta text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,45,85,0.2)]"
                        >
                            Sync Signal
                        </button>
                    </motion.form>
                )}

                <button
                    onClick={() => window.dispatchEvent(new CustomEvent("vpoint-open-settings"))}
                    className="w-full py-4 glass-dark border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all text-[9px] font-black uppercase tracking-[0.2em]"
                >
                    <Settings size={14} />
                    Advanced Settings
                </button>

                <div className="px-2 flex items-center justify-between text-slate-800">
                    <span className="text-[7px] font-black uppercase tracking-widest">VIEWPOINT MODULE v2.0.4</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                </div>
            </div>
        </div>
    );
}
