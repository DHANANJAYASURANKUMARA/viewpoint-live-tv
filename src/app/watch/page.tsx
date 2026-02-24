"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { MousePointer2, Shield } from "lucide-react";
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
        <div className="h-full flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-5xl mx-auto">
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
                            className="flex flex-col items-center justify-center text-center space-y-8 p-12 glass rounded-[3rem] border border-white/10"
                        >
                            <div className="relative h-12" />

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
        </div>
    );
}
