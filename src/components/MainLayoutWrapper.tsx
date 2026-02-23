"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SettingsModal from "./SettingsModal";
import CookieConsent from "./CookieConsent";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Shield, ShieldAlert, Gift, Sparkles } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import PWAManager from "./PWAManager";

import { useConfig } from "./ConfigContext";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { config } = useConfig();
    const pathname = usePathname();
    const router = useRouter();
    const isWatchPage = pathname === "/watch";
    const isAdminSector = pathname.startsWith("/admin");
    const isAdminLogin = pathname === "/admin/login";

    const [activeChannelUrl, setActiveChannelUrl] = useState("");
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState('cyan');
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handlers for custom events
    const handleCinemaToggle = useCallback((e: any) => {
        const detail = (e as CustomEvent).detail;
        setIsCinemaMode(detail.isCinemaMode);
    }, []);

    const handleSettingsChange = useCallback((e: any) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.accentColor) {
            setTheme(detail.accentColor);
        }
    }, []);

    const handleOpenSettings = useCallback(() => {
        setIsSettingsOpen(true);
    }, []);

    const handleSidebarToggle = useCallback((e: any) => {
        const detail = (e as CustomEvent).detail;
        setIsSidebarOpen(detail.isOpen);
    }, []);

    const handleChannelSelectSync = useCallback((e: any) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.url) {
            setActiveChannelUrl(detail.url);
        }
    }, []);

    // Effect for window resize and initial mount
    useEffect(() => {
        setIsMounted(true);
        let prevWidth = window.innerWidth;

        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const mobile = currentWidth < 1024;
            const wasDesktop = prevWidth >= 1024;

            setIsMobile(mobile);

            // Only auto-close sidebar if we just transitioned FROM desktop TO mobile
            if (mobile && wasDesktop) {
                setIsSidebarOpen(false);
            }

            prevWidth = currentWidth;
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        // Initial loading simulation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3500);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timer);
        };
    }, []);

    // Effect for initial theme load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("vpoint-settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.accentColor) {
                    setTheme(parsed.accentColor);
                }
            } catch { /* ignore parse error */ }
        }
    }, [isMounted]);

    // DevTools Protection — false-positive-safe version
    useEffect(() => {
        if (!isMounted || pathname === "/warning") return;

        // Block right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Block common devtools keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F12") {
                e.preventDefault();
                router.push("/warning");
            }
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
                e.preventDefault();
                router.push("/warning");
            }
            if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
                e.preventDefault();
                router.push("/warning");
            }
        };

        // Window size check — only on explicit resize, not on load
        const detectDevToolsOnResize = () => {
            const threshold = 160;
            const isOpen =
                window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold;
            if (isOpen) router.push("/warning");
        };

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", detectDevToolsOnResize);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", detectDevToolsOnResize);
        };
    }, [isMounted, pathname, router]);

    // Effect for event listeners
    useEffect(() => {
        if (!isMounted) return;

        window.addEventListener("vpoint-cinema-toggle", handleCinemaToggle as EventListener);
        window.addEventListener("vpoint-settings-change", handleSettingsChange as EventListener);
        window.addEventListener("vpoint-open-settings", handleOpenSettings as EventListener);
        window.addEventListener("vpoint-sidebar-toggle", handleSidebarToggle as EventListener);
        window.addEventListener("vpoint-channel-select", handleChannelSelectSync as EventListener);

        return () => {
            window.removeEventListener("vpoint-cinema-toggle", handleCinemaToggle as EventListener);
            window.removeEventListener("vpoint-settings-change", handleSettingsChange as EventListener);
            window.removeEventListener("vpoint-open-settings", handleOpenSettings as EventListener);
            window.removeEventListener("vpoint-sidebar-toggle", handleSidebarToggle as EventListener);
            window.removeEventListener("vpoint-channel-select", handleChannelSelectSync as EventListener);
        };
    }, [isMounted, handleCinemaToggle, handleSettingsChange, handleOpenSettings, handleSidebarToggle, handleChannelSelectSync]);

    // Maintenance Mode Overlay
    const isMaintenanceActive = config.maintenanceMode && !isAdminSector;
    const maintenanceMessage = config.maintenanceMessage || "The Viewpoint matrix is currently undergoing scheduled structural refinement. Signal stability is being recalibrated for enhanced digital density.";
    const [showBirthdayGreeting, setShowBirthdayGreeting] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("vpoint-user");
        if (session) {
            try {
                const user = JSON.parse(session);
                if (user.birthday) {
                    const bday = new Date(user.birthday);
                    const today = new Date();
                    if (bday.getDate() === today.getDate() && bday.getMonth() === today.getMonth()) {
                        // Only show once per session
                        const lastShown = sessionStorage.getItem("vpoint-bday-shown");
                        if (!lastShown) {
                            setShowBirthdayGreeting(true);
                            sessionStorage.setItem("vpoint-bday-shown", "true");
                        }
                    }
                }
            } catch { }
        }
    }, []);

    return (
        <div className={`flex w-full h-screen overflow-hidden vpoint-bg transition-colors duration-300 ${theme === 'magenta' ? 'theme-magenta' : ''}`}>
            {/* Global Birthday Greeting Overlay */}
            <AnimatePresence>
                {showBirthdayGreeting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            className="glass border border-neon-magenta/30 p-12 rounded-[3.5rem] bg-neon-magenta/5 relative overflow-hidden text-center space-y-8 max-w-lg w-full"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-magenta to-transparent" />
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-24 h-24 mx-auto bg-neon-magenta/20 rounded-full flex items-center justify-center text-neon-magenta shadow-[0_0_40px_rgba(255,45,85,0.4)]"
                            >
                                <Gift size={48} />
                            </motion.div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Neural <span className="text-neon-magenta">Birthday</span></h2>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Nexus Optimization Event Detected</p>
                            </div>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 border-neon-magenta/30 pl-8 text-left">
                                The Viewpoint Matrix wishes you a productive solar iteration. Your personal signal density has been recalibrated for maximum throughput today.
                            </p>
                            <button
                                onClick={() => setShowBirthdayGreeting(false)}
                                className="w-full py-5 bg-neon-magenta text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(255,45,85,0.3)] hover:scale-[1.02] transition-all"
                            >
                                Accept Transmission
                            </button>
                            <Sparkles className="absolute top-12 left-12 text-neon-cyan/20 animate-pulse" size={48} />
                            <Sparkles className="absolute bottom-12 right-12 text-neon-magenta/20 animate-pulse delay-700" size={48} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <PWAManager />
            <AnimatePresence>
                {isLoading && <LoadingScreen key="loader" />}
            </AnimatePresence>

            <AnimatePresence>
                {isMaintenanceActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[1000] bg-vpoint-dark flex items-center justify-center p-10 overflow-hidden"
                    >
                        {/* Maintenance Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="w-full h-full border-[0.5px] border-white/5 grid grid-cols-12 grid-rows-12">
                                {[...Array(144)].map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/5" />
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-32 h-32 mx-auto bg-neon-magenta/10 border border-neon-magenta/30 rounded-[2rem] flex items-center justify-center text-neon-magenta"
                            >
                                <Shield size={64} />
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic">
                                    System <span className="text-neon-magenta">Maintenance</span>
                                </h1>
                                <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">Sector Lockdown in Progress</p>
                            </div>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 border-neon-magenta/30 pl-6 text-left max-w-md mx-auto">
                                {maintenanceMessage}
                                <span className="block mt-4 text-neon-magenta/70 font-bold uppercase text-[10px]">Access Restoration: PENDING</span>
                            </p>

                            <div className="pt-10 opacity-30 flex items-center justify-center gap-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic tracking-[0.3em]">Institutional Integrity ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSidebarOpen && isMobile && isWatchPage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>


            <AnimatePresence>
                {(!isCinemaMode && isWatchPage) && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{
                            x: isMobile ? (isSidebarOpen ? 0 : "-100%") : 0,
                            opacity: 1
                        }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed lg:relative z-[60] h-full w-full lg:w-auto"
                    >
                        <Sidebar
                            onClose={() => setIsSidebarOpen(false)}
                            activeChannelUrl={activeChannelUrl}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <main className={`flex-1 h-full flex flex-col transition-all duration-300 ${isCinemaMode ? "p-0" : ""}`}>
                <AnimatePresence>
                    {!isCinemaMode && isWatchPage && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <TopBar />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${isCinemaMode ? "" : "p-0"}`}>
                    {children}
                </div>

                {isCinemaMode && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => window.dispatchEvent(new CustomEvent("vpoint-cinema-toggle", { detail: { isCinemaMode: false } }))}
                        className="fixed bottom-10 right-10 z-[100] px-6 py-3 glass-dark border border-white/10 rounded-full text-white/50 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        Exit Cinema Mode
                    </motion.button>
                )}
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Cookie Consent - only on public pages */}
            {!isAdminSector && <CookieConsent />}
        </div>
    );
}
