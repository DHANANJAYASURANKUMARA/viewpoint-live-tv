"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useConfig } from "./ConfigContext";
import NotificationCenter from "./NotificationCenter";
import ProfileDropdown from "./ProfileDropdown";

export default function TopBar() {
    const { config } = useConfig();
    const [uptime, setUptime] = useState(49);
    const [playerStatus, setPlayerStatus] = useState<"Playing" | "Paused" | "Buffering" | "Error" | "Standby">("Standby");
    const [channelTitle, setChannelTitle] = useState(config.brandingText + " SIGNAL");
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
        <header className="h-14 w-full glass border-b border-white/5 flex items-center justify-between px-4 lg:px-10 z-40 sticky top-0 backdrop-blur-3xl">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-3 -ml-2 text-slate-400 hover:text-white transition-all transform active:scale-90"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={22} />
                </button>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <h1 className="text-sm lg:text-lg font-black text-white tracking-widest uppercase leading-none truncate max-w-[200px] lg:max-w-none">
                        {channelTitle}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                <NotificationCenter />
                <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
                <ProfileDropdown />
            </div>
        </header>
    );
}
