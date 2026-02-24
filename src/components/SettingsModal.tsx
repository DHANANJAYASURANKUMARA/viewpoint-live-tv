"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Settings2,
    Activity,
    Palette,
    Database,
    RefreshCcw,
    Trash2,
    Zap,
    Wind,
    ShieldCheck,
    Gauge,
    MonitorPlay,
    Cpu,
    Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Settings {
    lowLatency: boolean;
    maxBufferLength: number;
    accentColor: 'cyan' | 'magenta';
    dataSaver: boolean;
    performanceProfile: 'lowLatency' | 'balanced' | 'highQuality';
    neuralHud: boolean;
    adaptiveBuffer: boolean;
    soundFx: boolean;
}

const defaultSettings: Settings = {
    lowLatency: true,
    maxBufferLength: 30,
    accentColor: 'cyan',
    dataSaver: false,
    performanceProfile: 'balanced',
    neuralHud: false,
    adaptiveBuffer: true,
    soundFx: true
};

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isResetting, setIsResetting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const saved = localStorage.getItem("vpoint-settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({
                    ...prev,
                    ...parsed
                }));
            } catch { /* ignore */ }
        }
    }, [isOpen]);

    const updateSetting = (key: keyof Settings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem("vpoint-settings", JSON.stringify(newSettings));
        window.dispatchEvent(new CustomEvent("vpoint-settings-change", { detail: newSettings }));
    };

    const handleClearData = () => {
        setIsResetting(true);
        setTimeout(() => {
            localStorage.removeItem("vpoint-favorites");
            localStorage.removeItem("vpoint-custom-channels");
            localStorage.removeItem("vpoint-settings");
            window.location.reload();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-vpoint-dark border border-white/10 rounded-2xl lg:rounded-[2.5rem] shadow-[0_0_100px_rgba(34,211,238,0.1)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <div className="p-2 lg:p-3 bg-neon-cyan/10 rounded-xl lg:rounded-2xl border border-neon-cyan/20 text-neon-cyan">
                                    <Settings2 size={20} className="lg:w-6 lg:h-6" />
                                </div>
                                <div>
                                    <h2 className="text-sm lg:text-xl font-black text-white tracking-widest uppercase mb-0.5">Advanced Settings</h2>
                                    <p className="text-slate-500 text-[8px] lg:text-[10px] font-bold tracking-[0.2em] uppercase">Neural Interface v2.0.4</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 lg:p-3 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl lg:rounded-2xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 lg:p-8 space-y-8 lg:space-y-10 max-h-[70vh] lg:max-h-[60vh] overflow-y-auto custom-scrollbar">

                            {/* Transmission Tuning */}
                            <section className="space-y-4 lg:space-y-6">
                                <div className="flex items-center gap-3 text-neon-cyan">
                                    <Activity size={14} className="lg:w-4 lg:h-4" />
                                    <h3 className="text-[9px] lg:text-[11px] font-black tracking-[0.2em] uppercase">Transmission Tuning</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="p-4 lg:p-5 bg-white/[0.03] border border-white/5 rounded-2xl lg:rounded-3xl space-y-3 lg:space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Zap size={14} className="text-amber-500 lg:w-4 lg:h-4" />
                                                <span className="text-[9px] lg:text-[10px] font-black text-white uppercase tracking-widest">Low Latency Mode</span>
                                            </div>
                                            <button
                                                onClick={() => updateSetting('lowLatency', !settings.lowLatency)}
                                                className={`w-9 lg:w-10 h-4.5 lg:h-5 rounded-full relative transition-all duration-300 ${settings.lowLatency ? 'bg-neon-cyan' : 'bg-slate-800'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: settings.lowLatency ? (isMobile ? 18 : 22) : 4 }}
                                                    className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                                                />
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                            Optimizes stream for minimal delay. Recommended for live sports.
                                        </p>
                                    </div>

                                    <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck size={16} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Data Saver Mode</span>
                                            </div>
                                            <button
                                                onClick={() => updateSetting('dataSaver', !settings.dataSaver)}
                                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.dataSaver ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: settings.dataSaver ? 22 : 4 }}
                                                    className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                                                />
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                            Reduces bandwidth consumption by optimizing buffer and quality.
                                        </p>
                                    </div>

                                    <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Cpu size={16} className="text-neon-cyan" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Adaptive Buffer Pool</span>
                                            </div>
                                            <button
                                                onClick={() => updateSetting('adaptiveBuffer', !settings.adaptiveBuffer)}
                                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.adaptiveBuffer ? 'bg-neon-cyan' : 'bg-slate-800'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: settings.adaptiveBuffer ? 22 : 4 }}
                                                    className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                                                />
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                            Automatically jumps over stream gaps and stalls to maintain playback.
                                        </p>
                                    </div>

                                    <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Gauge size={16} className="text-neon-magenta" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Neural HUD</span>
                                            </div>
                                            <button
                                                onClick={() => updateSetting('neuralHud', !settings.neuralHud)}
                                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.neuralHud ? 'bg-neon-magenta' : 'bg-slate-800'}`}
                                            >
                                                <motion.div
                                                    animate={{ x: settings.neuralHud ? 22 : 4 }}
                                                    className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                                                />
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                            Permanently display technical performance telemetry on active streams.
                                        </p>
                                    </div>

                                    <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4 col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-3 text-neon-cyan mb-2">
                                            <Gauge size={16} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Performance Profile</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'lowLatency', label: 'Ultra-Low', icon: Zap, color: 'text-amber-500' },
                                                { id: 'balanced', label: 'Balanced', icon: Activity, color: 'text-neon-cyan' },
                                                { id: 'highQuality', label: 'Cinema HQ', icon: MonitorPlay, color: 'text-neon-magenta' }
                                            ].map((profile) => (
                                                <button
                                                    key={profile.id}
                                                    onClick={() => updateSetting('performanceProfile', profile.id as any)}
                                                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${settings.performanceProfile === profile.id
                                                        ? 'bg-white/10 border-white/20 shadow-lg'
                                                        : 'bg-white/5 border-transparent opacity-40 hover:opacity-100'}`}
                                                >
                                                    <profile.icon size={16} className={profile.color} />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">{profile.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Appearance Neural */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 text-neon-magenta">
                                    <Palette size={16} />
                                    <h3 className="text-[11px] font-black tracking-[0.2em] uppercase">Appearance Neural</h3>
                                </div>

                                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Primary Accent</span>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => updateSetting('accentColor', 'cyan')}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === 'cyan' ? 'border-white bg-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-transparent bg-neon-cyan/20'}`}
                                            />
                                            <button
                                                onClick={() => updateSetting('accentColor', 'magenta')}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === 'magenta' ? 'border-white bg-neon-magenta shadow-[0_0_15px_rgba(255,45,85,0.5)]' : 'border-transparent bg-neon-magenta/20'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Volume2 size={16} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Interface Sound FX</span>
                                        </div>
                                        <button
                                            onClick={() => updateSetting('soundFx', !settings.soundFx)}
                                            className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.soundFx ? 'bg-neon-magenta' : 'bg-slate-800'}`}
                                        >
                                            <motion.div
                                                animate={{ x: settings.soundFx ? 22 : 4 }}
                                                className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5"
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                            Interface changes are applied in real-time.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Memory Core */}
                            <section className="space-y-4 lg:space-y-6">
                                <div className="flex items-center gap-3 text-red-500">
                                    <Database size={14} className="lg:w-4 lg:h-4" />
                                    <h3 className="text-[9px] lg:text-[11px] font-black tracking-[0.2em] uppercase">Memory Core</h3>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleClearData}
                                        disabled={isResetting}
                                        className="flex-1 p-4 lg:p-5 bg-red-500/10 border border-red-500/20 rounded-2xl lg:rounded-3xl text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                                    >
                                        {isResetting ? (
                                            <>
                                                <RefreshCcw size={16} className="animate-spin" />
                                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Purging Memory...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Reset All App Data</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <div className="text-[9px] font-black tracking-[0.3em] uppercase flex items-center gap-1.5">
                                <span className="text-slate-700">VIEW</span>
                                <span className="text-neon-purple">POINT</span>
                                <span className="text-slate-700 ml-2">MODULE v2.0.4</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-10 py-3 bg-neon-cyan text-vpoint-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all transform active:scale-95"
                            >
                                Sync & Exit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
