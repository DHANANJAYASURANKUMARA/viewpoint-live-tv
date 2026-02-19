"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function TopBar() {
    const [uptime, setUptime] = useState(49);
    const [playerStatus, setPlayerStatus] = useState<"Playing" | "Paused" | "Buffering" | "Error" | "Standby">("Standby");
    const [channelTitle, setChannelTitle] = useState("NO SIGNAL DETECTED");
    const [channelCategory, setChannelCategory] = useState("Awaiting Stream");

    const [networkType, setNetworkType] = useState<string>("5G");

    const toggleSidebar = () => {
        window.dispatchEvent(new CustomEvent("vpoint-sidebar-toggle", { detail: { isOpen: true } }));
    };

    useEffect(() => {
        const uptimeInterval = setInterval(() => {
            setUptime((prev) => prev + 1);
        }, 1000);

        const handleStatus = (e: any) => {
            if (e.detail?.status) setPlayerStatus(e.detail.status);
        };

        const handleChannelSelect = (e: any) => {
            if (e.detail?.name) setChannelTitle(e.detail.name);
            if (e.detail?.category) setChannelCategory(e.detail.category);
        };

        const updateNetworkInfo = () => {
            const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            if (conn) {
                const type = conn.effectiveType || "5G";
                setNetworkType(type.toUpperCase());
            }
        };

        updateNetworkInfo();
        const conn = (navigator as any).connection;
        if (conn) conn.addEventListener('change', updateNetworkInfo);

        window.addEventListener("vpoint-player-status", handleStatus);
        window.addEventListener("vpoint-channel-select", handleChannelSelect);

        return () => {
            clearInterval(uptimeInterval);
            if (conn) conn.removeEventListener('change', updateNetworkInfo);
            window.removeEventListener("vpoint-player-status", handleStatus);
            window.removeEventListener("vpoint-channel-select", handleChannelSelect);
        };
    }, []);

    const formatUptime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const statusColors = {
        Playing: "text-neon-cyan",
        Paused: "text-amber-500",
        Buffering: "text-neon-magenta",
        Error: "text-red-500",
        Standby: "text-slate-600",
    };

    const networkColors: Record<string, string> = {
        "4G": "text-emerald-500",
        "5G": "text-neon-magenta",
        "3G": "text-emerald-500",
        "2G": "text-amber-500",
    };

    return (
        <header className="h-14 w-full glass border-b border-white/5 flex items-center justify-between px-4 lg:px-10 z-40 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-slate-400 hover:text-white"
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-sm lg:text-base font-black text-white tracking-tight uppercase leading-none truncate max-w-[120px] lg:max-w-none">
                        {channelTitle}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none">
                            {channelCategory}
                        </span>
                        <span className="text-slate-600 font-bold leading-none">•</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                            UPTIME: {formatUptime(uptime)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-end gap-0.5 h-2.5">
                            {[1, 2, 3, 4].map((bar) => {
                                const isActive =
                                    (networkType === "2G" && bar === 1) ||
                                    (networkType === "3G" && bar <= 2) ||
                                    (networkType === "4G" && bar <= 3) ||
                                    (networkType === "5G" && bar <= 4);

                                return (
                                    <div
                                        key={bar}
                                        className={`w-0.5 rounded-full transition-all duration-500 ${isActive ? (
                                            networkType === "2G" ? "bg-amber-500" :
                                                (networkType === "3G" || networkType === "4G") ? "bg-emerald-500" : "bg-neon-magenta shadow-[0_0_8px_rgba(255,45,85,0.4)]"
                                        ) : "bg-white/10"
                                            }`}
                                        style={{ height: `${bar * 25}%` }}
                                    />
                                );
                            })}
                        </div>
                        <span className={`text-[10px] font-black tracking-widest uppercase ${networkColors[networkType] || "text-neon-magenta"}`}>
                            {networkType}
                        </span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/10 mx-2" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full ${playerStatus === "Standby" ? "bg-slate-700" : "animate-pulse"} ${playerStatus === "Playing" ? "bg-neon-cyan" :
                            playerStatus === "Paused" ? "bg-amber-500" :
                                playerStatus === "Error" ? "bg-red-500" :
                                    playerStatus === "Standby" ? "bg-slate-700" : "bg-neon-magenta"
                            }`} />
                        <span className={`text-sm font-black tracking-widest uppercase ${statusColors[playerStatus]}`}>
                            {playerStatus}
                        </span>
                    </div>
                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-[0.2em] mt-0.5">
                        Streaming Status
                    </span>
                </div>
            </div>
        </header>
    );
}
