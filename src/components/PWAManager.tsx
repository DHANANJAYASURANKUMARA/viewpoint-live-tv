"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, X, ShieldAlert } from "lucide-react";

export default function PWAManager() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showUpdateToast, setShowUpdateToast] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Handle Install Prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Broadcast to components that install is available
            window.dispatchEvent(new CustomEvent("vpoint-pwa-installable", { detail: { available: true } }));
        };

        // Handle Service Worker Updates
        const handleServiceWorkerUpdate = () => {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.ready.then((reg) => {
                    setRegistration(reg);
                    reg.addEventListener("updatefound", () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                    setShowUpdateToast(true);
                                }
                            });
                        }
                    });
                });
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
        handleServiceWorkerUpdate();

        // Listener for manual install trigger
        const handleManualInstall = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === "accepted") {
                    setDeferredPrompt(null);
                    window.dispatchEvent(new CustomEvent("vpoint-pwa-installable", { detail: { available: false } }));
                }
            }
        };

        window.addEventListener("vpoint-pwa-install-trigger", handleManualInstall as EventListener);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
            window.removeEventListener("vpoint-pwa-install-trigger", handleManualInstall as EventListener);
        };
    }, [deferredPrompt]);

    const handleUpdate = () => {
        if (registration?.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {showUpdateToast && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-10 left-10 z-[3000] max-w-sm w-full"
                >
                    <div className="glass-dark border border-neon-cyan/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-5">
                        <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0">
                            <ShieldAlert size={24} className="animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Protocol Update</h4>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                                    A new architectural layer is available. Signal stability recalibration required.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleUpdate}
                                    className="px-5 py-2.5 bg-neon-cyan text-vpoint-dark rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                >
                                    <RefreshCw size={12} /> Sync Manifest
                                </button>
                                <button
                                    onClick={() => setShowUpdateToast(false)}
                                    className="p-2.5 glass border border-white/5 text-slate-500 rounded-lg hover:text-white transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
