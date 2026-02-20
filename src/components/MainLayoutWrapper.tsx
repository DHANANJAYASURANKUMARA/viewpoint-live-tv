"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import AdminSidebar from "./AdminSidebar";
import TopBar from "./TopBar";
import SettingsModal from "./SettingsModal";
import CookieConsent from "./CookieConsent";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Shield, ShieldAlert } from "lucide-react";

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

    // DevTools Protection
    useEffect(() => {
        if (!isMounted || pathname === "/warning") return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block F12
            if (e.key === "F12") {
                e.preventDefault();
                router.push("/warning");
            }
            // Block Ctrl+Shift+I, J, C
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
                e.preventDefault();
                router.push("/warning");
            }
            // Block Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
                e.preventDefault();
                router.push("/warning");
            }
        };

        // Ultra-Robust DevTools Detection
        const detectDevTools = () => {
            // Method 1: Window Size Comparison
            const threshold = 160;
            const isDevToolsOpenBySize =
                window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold;

            if (isDevToolsOpenBySize) {
                router.push("/warning");
                return true;
            }

            // Method 2: Performance Timing (Debugger Trap)
            const startTime = performance.now();
            (function () {
                return false;
            })["constructor"]("debugger")["call"]();
            if (performance.now() - startTime > 100) {
                router.push("/warning");
                return true;
            }

            return false;
        };

        // Method 3: Browser Cache Detection
        const checkCache = () => {
            try {
                const navEntry = window.performance.getEntriesByType("navigation")[0] as any;
                // If transferSize is 0, it typically indicates the resource was served from cache
                // DeliveryType 'cache' is a more direct indicator in modern browsers
                if (navEntry && (navEntry.transferSize === 0 || navEntry.deliveryType === 'cache')) {
                    router.push("/warning"); // Redirect to ensure structural integrity
                }
            } catch (e) {
                console.error("Matrix Integrity Check Failed", e);
            }
        };

        // Method 4: Console Trap (Custom Getter)
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: () => {
                router.push("/warning");
            }
        });

        const checkConsole = () => {
            // Trigger the getter if the console is open and trying to render the object
            console.log('%c', element);
        }

        window.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", detectDevTools);

        // High-frequency polling for detection
        const detectionInterval = setInterval(() => {
            detectDevTools();
            checkConsole();
            checkCache();
        }, 500); // 500ms for even faster detection

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", detectDevTools);
            clearInterval(detectionInterval);
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

    if (!isMounted) return <div className="fixed inset-0 bg-vpoint-dark" />;

    return (
        <div className={`flex w-full h-screen overflow-hidden vpoint-bg transition-colors duration-300 ${theme === 'magenta' ? 'theme-magenta' : ''}`}>
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
                                The Viewpoint matrix is currently undergoing scheduled structural refinement. Signal stability is being recalibrated for enhanced digital density.
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
                {isAdminSector && !isAdminLogin && (
                    <div className="hidden lg:block h-full">
                        <AdminSidebar />
                    </div>
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
                    {isAdminSector && !isAdminLogin && (
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-neon-cyan" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Institutional Access Level: Alpha</span>
                            </div>
                        </div>
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
