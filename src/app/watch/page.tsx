"use client";

import React, { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import LiveChat from "@/components/LiveChat";
import { Tv, MousePointer2, MessageCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WatchPage() {
    const router = useRouter();
    const [currentUrl, setCurrentUrl] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentSniMask, setCurrentSniMask] = useState("");
    const [currentProxyActive, setCurrentProxyActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [showChat, setShowChat] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Auth guard: check for user session
        const session = localStorage.getItem("vpoint-user");
        if (!session) {
            router.push("/login");
            return;
        }
        try {
            const user = JSON.parse(session);
            setIsAuthenticated(true);
            setUserName(user.displayName || user.name || "User");
            setUserId(user.id);
        } catch {
            localStorage.removeItem("vpoint-user");
            router.push("/login");
            return;
        }

        const handleChannelSelect = (e: any) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.url) {
                setCurrentUrl(detail.url);
                setCurrentTitle(detail.name || "Custom Stream");
                setCurrentSniMask(detail.sniMask || "");
                setCurrentProxyActive(!!detail.proxyActive);
            }
        };

        window.addEventListener("vpoint-channel-select", handleChannelSelect);
        return () => window.removeEventListener("vpoint-channel-select", handleChannelSelect);
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col lg:flex-row overflow-hidden relative">
            {/* Primary Flux Area (Player) */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500`}>
                <div className="flex-1 flex items-center justify-center p-4 lg:p-10 relative">
                    <div className="w-full max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            {currentUrl ? (
                                <motion.div
                                    key="player"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <VideoPlayer
                                        url={currentUrl}
                                        title={currentTitle}
                                        sniMask={currentSniMask}
                                        proxyActive={currentProxyActive}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center text-center space-y-8 p-12 glass rounded-[3rem] border border-white/5 shadow-2xl shadow-black/40"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-neon-cyan/20 blur-[60px] rounded-full animate-pulse" />
                                        <div className="relative w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-2xl">
                                            <Tv size={48} className="text-neon-cyan animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black text-white tracking-[0.1em] uppercase">
                                            Ready for Transmission
                                        </h2>
                                        <p className="text-slate-500 text-[10px] max-w-xs mx-auto font-black leading-relaxed uppercase tracking-widest">
                                            Select a channel from the sidebar or inject a custom link to start your premium viewing experience.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-full">
                                        <MousePointer2 size={14} className="text-neon-magenta animate-bounce" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Awaiting Input Signal
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sub-Header / Chat Toggle (Mobile/Tablet Only) */}
                {!isMobile && currentUrl && (
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`fixed bottom-10 z-[70] p-4 glass rounded-2xl border transition-all duration-500 ${showChat ? 'right-[420px] border-neon-cyan/50 text-neon-cyan' : 'right-10 border-white/10 text-slate-500 hover:text-white'}`}
                    >
                        {showChat ? <ChevronRight size={20} /> : <MessageCircle size={20} />}
                    </button>
                )}
            </div>

            {/* Neural Chat Sidebar (Desktop Only) */}
            <AnimatePresence>
                {showChat && !isMobile && currentUrl && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        className="w-[400px] h-full flex-shrink-0 relative z-[65]"
                    >
                        <LiveChat userName={userName} userId={userId} channelId={currentTitle} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Chat Overlay / Section (Optional, keeping it simple for now as a bottom segment if mobile) */}
            {isMobile && currentUrl && (
                <div className="h-[400px] w-full flex-shrink-0 border-t border-white/5">
                    <LiveChat userName={userName} userId={userId} channelId={currentTitle} />
                </div>
            )}
        </div>
    );
}
