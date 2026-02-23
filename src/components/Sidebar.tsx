"use client";

import React, { useState, useEffect } from "react";
import { getChannels } from "@/lib/actions";
import {
    Search,
    Tv,
    X,
    Globe,
    Music,
    Gamepad2,
    Newspaper,
    Film,
    Zap,
    ExternalLink,
    Heart,
    Settings,
    Activity,
    Radio,
    SearchX,
    LogOut,
    User,
    Trophy,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConfig } from "./ConfigContext";

interface Channel {
    id: string;
    name: string;
    url: string;
    category: string;
    description: string;
    isLive: boolean;
}

const categories = ["All", "Entertainment", "Sports", "News", "Movies", "Tech", "Culture", "Custom"];

interface SidebarProps {
    onClose: () => void;
    activeChannelUrl?: string;
}

export default function Sidebar({ onClose, activeChannelUrl }: SidebarProps) {
    const { config } = useConfig();
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) {
            try {
                const user = JSON.parse(session);
                // Wrap in a microtask or check if different to avoid cascading
                Promise.resolve().then(() => {
                    setCurrentUser(user.name || "User");
                });
            } catch { }
        }
    }, []);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                const data = await getChannels();
                setChannels(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load channels:", error);
                setLoading(false);
            }
        };
        loadChannels();

        const savedFavorites = localStorage.getItem("vpoint-favorites");
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                Promise.resolve().then(() => {
                    setFavorites(parsed);
                });
            } catch { }
        }
    }, []);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavs = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(newFavs);
        localStorage.setItem("vpoint-favorites", JSON.stringify(newFavs));
    };

    const handleChannelSelect = (channel: any) => {
        onClose();
        router.push(`/watch?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`);
    };

    const [customUrl, setCustomUrl] = useState("");

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
        const isActuallyLive = c.isLive;
        return matchesCategory && matchesSearch && isActuallyLive;
    }).sort((a, b) => a.name.localeCompare(b.name));

    const categoryIcons: Record<string, React.ReactNode> = {
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
        <div className="w-screen lg:w-96 h-full glass border-r border-white/5 flex flex-col p-6 overflow-hidden relative shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
            {/* Sidebar Branding */}
            <div className="flex items-center justify-between mb-8 lg:mb-10">
                <Link href="/#hero" className="flex items-center gap-3 group">
                    <div className="flex flex-col">
                        <h2 className="text-sm lg:text-xl font-black text-white tracking-tighter uppercase leading-none">
                            {config.brandingText.split('').map((char: string, i: number) => (
                                <span key={i} className={i >= config.brandingText.length - 5 ? "text-neon-purple" : ""}>{char}</span>
                            ))}
                        </h2>
                        <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Premium Streaming</p>
                    </div>
                </Link>
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
                    <h3 className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
                        <Activity size={10} className="text-neon-cyan" /> Network Sectors
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${activeCategory === cat
                                    ? "bg-white text-vpoint-dark border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                    : "bg-white/[0.02] text-slate-500 border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                                    }`}
                            >
                                <span className={activeCategory === cat ? "text-vpoint-dark" : "text-slate-600"}>
                                    {categoryIcons[cat]}
                                </span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Signals Hub */}
                <div className="space-y-4">
                    <h3 className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] px-2 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Radio size={10} className="text-neon-magenta" /> Transmissions</span>
                        <span className="text-neon-cyan">{filteredChannels.length} ACTIVE</span>
                    </h3>

                    <div className="space-y-2">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="h-16 w-full glass-dark border border-white/5 rounded-2xl animate-pulse" />
                            ))
                        ) : filteredChannels.length > 0 ? (
                            filteredChannels.map((channel) => (
                                <button
                                    key={channel.id}
                                    onClick={() => handleChannelSelect(channel)}
                                    className={`w-full group relative p-4 rounded-2xl border transition-all flex items-center justify-between overflow-hidden ${activeChannelUrl === channel.url
                                        ? "bg-neon-cyan/5 border-neon-cyan/20 shadow-[0_0_20px_rgba(0,255,243,0.05)]"
                                        : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 glass border rounded-xl flex items-center justify-center transition-all ${activeChannelUrl === channel.url ? "border-neon-cyan/40 bg-neon-cyan/10" : "border-white/5"}`}>
                                            <Tv size={18} className={activeChannelUrl === channel.url ? "text-neon-cyan" : "text-slate-500"} />
                                        </div>
                                        <div className="text-left">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${activeChannelUrl === channel.url ? "text-neon-cyan" : "text-white"}`}>
                                                {channel.name}
                                            </div>
                                            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                {channel.category} • SIGNAL OPTIMAL
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 relative z-10">
                                        <button
                                            onClick={(e) => toggleFavorite(channel.id, e)}
                                            className={`p-2 rounded-lg transition-all ${favorites.includes(channel.id) ? "text-neon-magenta" : "text-slate-600 hover:text-white"}`}
                                        >
                                            <Heart size={14} fill={favorites.includes(channel.id) ? "currentColor" : "none"} />
                                        </button>
                                        <ChevronRight size={14} className="text-slate-700 group-hover:text-neon-cyan transition-colors" />
                                    </div>

                                    {activeChannelUrl === channel.url && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan animate-pulse" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 glass border border-white/5 rounded-3xl flex items-center justify-center text-slate-700">
                                    <SearchX size={32} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest">No Signals Found</div>
                                    <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Try adjusting your scan</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Neural Custom Injector */}
                <div className="space-y-4 pb-10">
                    <h3 className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] px-2 flex items-center gap-2">
                        <Zap size={10} className="text-amber-500" /> Manual Signal Injection
                    </h3>
                    <form onSubmit={handleCustomSubmit} className="relative group">
                        <input
                            type="text"
                            placeholder="PASTE HUD URL..."
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            className="w-full bg-vpoint-dark border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-[9px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-white/20 transition-all uppercase tracking-widest shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 glass border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/5 transition-all"
                        >
                            <ArrowRight size={14} />
                        </button>
                    </form>
                </div>
            </div>

            {/* User Identity Matrix */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="p-4 glass border border-white/5 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 glass border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                                <User className="text-white/40" size={18} />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-vpoint-dark" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">{currentUser || "GUEST PROTOCOL"}</div>
                            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Rank: New Citizen</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-600 hover:text-neon-cyan transition-colors">
                            <Settings size={14} />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-neon-magenta transition-colors">
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* HUD Decoration */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[6px] font-black text-white/5 uppercase tracking-[1em] pointer-events-none whitespace-nowrap">
                VIEWPOINT NEURAL HUD v2.4.9
            </div>
        </div>
    );
}

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);
