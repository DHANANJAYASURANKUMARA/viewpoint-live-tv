"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Tv, MousePointer2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LiveChat from "@/components/LiveChat";
import { getUserProfile } from "@/lib/actions";

export default function WatchPage() {
    const router = useRouter();
    const [currentUrl, setCurrentUrl] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentSniMask, setCurrentSniMask] = useState("");
    const [currentProxyActive, setCurrentProxyActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [fullUser, setFullUser] = useState<any>(null);

    const loadFullUser = async (id: string) => {
        const profile = await getUserProfile(id);
        setFullUser(profile);
    };

    React.useEffect(() => {
        // Auth guard: check for user session
        const session = localStorage.getItem("vpoint-user");
        if (!session) {
            router.push("/login");
            return;
        }
        try {
            const user = JSON.parse(session);
            setIsAuthenticated(true);
            setUserName(user.name || "User");
            loadFullUser(user.id);
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
        <div className="h-full w-full relative flex flex-col lg:flex-row items-stretch gap-4 p-4 lg:p-6 overflow-hidden bg-vpoint-dark/50">
            {/* Player Panel Area */}
            <div className="flex-1 flex flex-col justify-center bg-black/40 backdrop-blur-xl rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <AnimatePresence mode="wait">
                    {currentUrl ? (
                        <motion.div
                            key="player"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full"
                        >
                            <VideoPlayer
                                url={currentUrl}
                                title={currentTitle}
                                sniMask={currentSniMask}
                                proxyActive={currentProxyActive}
                                isPanel={true}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center text-center space-y-8 p-12 glass rounded-[3rem] border border-white/10"
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
                                    Select a channel from the sidebar or paste a custom link below to start your premium viewing experience.
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

            {/* Live Chat Panel Area */}
            {currentUrl && (
                <div className="lg:w-[380px] shrink-0 bg-black/40 backdrop-blur-xl rounded-[2.5rem] lg:rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                    <LiveChat
                        channelId={currentUrl}
                        currentUser={fullUser}
                        isPanel={true}
                    />
                </div>
            )}
        </div>
    );
}
