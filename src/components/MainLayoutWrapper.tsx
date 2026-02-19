"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SettingsModal from "./SettingsModal";
import { AnimatePresence, motion } from "framer-motion";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [activeChannelUrl, setActiveChannelUrl] = useState("");
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState('cyan');
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hasLaunched, setHasLaunched] = useState(false);

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
            setHasLaunched(true); // Auto-launch if a channel is selected via other means
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
        return () => window.removeEventListener("resize", handleResize);
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

    // Effect for event listeners
    useEffect(() => {
        if (!isMounted) return;

        window.addEventListener("vpoint-cinema-toggle", handleCinemaToggle as EventListener);
        window.addEventListener("vpoint-settings-change", handleSettingsChange as EventListener);
        window.addEventListener("vpoint-open-settings", handleOpenSettings as EventListener);
        window.addEventListener("vpoint-sidebar-toggle", handleSidebarToggle as EventListener);
        window.addEventListener("vpoint-channel-select", handleChannelSelectSync as EventListener);
        window.addEventListener("vpoint-launch", () => setHasLaunched(true));

        return () => {
            window.removeEventListener("vpoint-cinema-toggle", handleCinemaToggle as EventListener);
            window.removeEventListener("vpoint-settings-change", handleSettingsChange as EventListener);
            window.removeEventListener("vpoint-open-settings", handleOpenSettings as EventListener);
            window.removeEventListener("vpoint-sidebar-toggle", handleSidebarToggle as EventListener);
            window.removeEventListener("vpoint-channel-select", handleChannelSelectSync as EventListener);
            window.removeEventListener("vpoint-launch", () => setHasLaunched(true));
        };
    }, [isMounted, handleCinemaToggle, handleSettingsChange, handleOpenSettings, handleSidebarToggle, handleChannelSelectSync]);

    if (!isMounted) return <div className="fixed inset-0 bg-vpoint-dark" />;

    return (
        <div className={`flex w-full h-screen overflow-hidden vpoint-bg transition-colors duration-300 ${theme === 'magenta' ? 'theme-magenta' : ''}`}>
            <AnimatePresence>
                {isSidebarOpen && isMobile && (
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
                {(!isCinemaMode && hasLaunched) && (
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
                    {!isCinemaMode && hasLaunched && (
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

                <div className={`flex-1 transition-all duration-300 ${isCinemaMode ? "" : "p-0"}`}>
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
        </div>
    );
}
