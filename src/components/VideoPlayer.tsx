"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    MonitorPlay,
    Activity,
    Zap,
    Gauge,
    Layers,
    AlertCircle,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Video Engines to avoid SSR issues
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const ShakaPlayer = dynamic(() => import("./ShakaPlayer"), { ssr: false }) as any;

interface VideoPlayerProps {
    url: string;
    title?: string;
    sniMask?: string;
    proxyActive?: boolean;
    isPanel?: boolean;
}

export default function VideoPlayer({ url, title = "Live Stream", sniMask, proxyActive, isPanel }: VideoPlayerProps) {
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const playerRef = useRef<any>(null);
    const [settings, setSettings] = useState({
        lowLatency: true,
        maxBufferLength: 30,
        dataSaver: false,
        performanceProfile: 'balanced' as 'lowLatency' | 'balanced' | 'highQuality'
    });
    const [qualityLevels, setQualityLevels] = useState<any[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [techStats, setTechStats] = useState({
        bitrate: 0,
        latency: 0,
        buffer: 0,
        fps: 0
    });
    const [showTechStats, setShowTechStats] = useState(false);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    useEffect(() => {
        // Use functional updates or refs if these need to be sync but avoid cascading if possible
        // These are fine as they only run when URL changes
        setError(null);
        setIsReady(false);
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [url]);

    useEffect(() => {
        const handleCinemaToggle = (e: any) => {
            setIsCinemaMode(e.detail.isCinemaMode);
        };

        const handleSettingsChange = (e: any) => {
            if (e.detail) {
                setSettings({
                    lowLatency: e.detail.lowLatency,
                    maxBufferLength: e.detail.maxBufferLength,
                    dataSaver: e.detail.dataSaver,
                    performanceProfile: e.detail.performanceProfile || 'balanced'
                });
                if (e.detail.neuralHud !== undefined) {
                    setShowTechStats(e.detail.neuralHud);
                }
            }
        };

        const saved = localStorage.getItem("vpoint-settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // We use a slight delay or conditional to avoid the "cascading render" warning if it's considered heavy
                // but for small settings objects it's usually acceptable although frowned upon by newer lint rules.
                setSettings(prev => ({
                    ...prev,
                    lowLatency: parsed.lowLatency ?? prev.lowLatency,
                    maxBufferLength: parsed.maxBufferLength ?? prev.maxBufferLength,
                    dataSaver: parsed.dataSaver ?? prev.dataSaver,
                    performanceProfile: (parsed.performanceProfile as "lowLatency" | "balanced" | "highQuality") ?? prev.performanceProfile
                }));
                if (parsed.neuralHud !== undefined) {
                    setShowTechStats(parsed.neuralHud);
                }
            } catch { /* ignore parse error */ }
        }

        window.addEventListener("vpoint-cinema-toggle", handleCinemaToggle);
        window.addEventListener("vpoint-settings-change", handleSettingsChange);
        return () => {
            window.removeEventListener("vpoint-cinema-toggle", handleCinemaToggle);
            window.removeEventListener("vpoint-settings-change", handleSettingsChange);
        };
    }, []);

    const dispatchStatus = (status: "Playing" | "Paused" | "Buffering" | "Error") => {
        window.dispatchEvent(new CustomEvent("vpoint-player-status", { detail: { status } }));
    };

    const toggleCinemaMode = () => {
        const nextMode = !isCinemaMode;
        setIsCinemaMode(nextMode);
        window.dispatchEvent(new CustomEvent("vpoint-cinema-toggle", { detail: { isCinemaMode: nextMode } }));
    };

    const handleFullscreen = () => {
        const el = document.querySelector(".video-container");
        if (el?.requestFullscreen) {
            el.requestFullscreen();
        }
    };

    const isDirectStream = url.toLowerCase().match(/\.(m3u8|mp4|webm|ogg|mpd|m4s|ts|mkv|m4v|mov)(\?.*)?$/i) ||
        url.toLowerCase().includes("playlist.m3u8") ||
        url.toLowerCase().includes("manifest.mpd");
    const isSpecialPlayer = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com") || url.includes("twitch.tv") || url.includes("streamable.com") || url.includes("facebook.com");

    const useReactPlayer = isDirectStream || isSpecialPlayer;

    return (
        <div
            className={`video-container relative w-full overflow-hidden group transition-all duration-700 ${isCinemaMode ? "z-[60] scale-105" : (isPanel ? "rounded-none" : "glass shadow-[0_0_100px_rgba(0,0,0,0.6)] border border-white/5")} aspect-video`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                setShowControls(false);
                setShowQualityMenu(false);
            }}
        >
            {/* Neural Scanning Loading Animation */}
            {!isReady && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl z-30 overflow-hidden">
                    <div className="relative flex items-center justify-center w-64 h-64">
                        {/* Outer Scanning Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-[1px] border-dashed border-neon-cyan/20 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 border-[1px] border-neon-magenta/10 rounded-full border-t-neon-magenta/40"
                        />

                        {/* Scanning Bar Animation */}
                        <motion.div
                            animate={{
                                top: ["10%", "90%", "10%"],
                                opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)] z-0"
                        />

                        {/* Core Interface */}
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 border-2 border-neon-cyan/30 rounded-2xl"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-neon-cyan/5 flex items-center justify-center border border-neon-cyan/20 backdrop-blur-md">
                                    <Activity className="text-neon-cyan animate-pulse" size={32} />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white font-black tracking-[0.4em] uppercase text-[10px] mb-2">Neural Link Active</h3>
                                <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-neon-magenta animate-ping" />
                                    <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Scanning Data Stream</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-2xl z-40 p-8 text-center">
                    <div className="max-w-md space-y-6">
                        <div className="inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
                            <AlertCircle size={48} />
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-black tracking-widest mb-2 uppercase">Stream Transmission Interrupted</h3>
                            <p className="text-slate-400 text-[10px] leading-relaxed antialiased uppercase font-bold tracking-tighter">
                                The remote server failed to respond or the link has expired. Our systems are attempting to reconnect, or you may try another channel.
                            </p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setError(null);
                                setIsReady(false);
                            }}
                            className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neon-cyan transition-all"
                        >
                            Retry Connection
                        </motion.button>
                    </div>
                </div>
            )}

            {!useReactPlayer && !isDirectStream ? (
                <iframe
                    src={url}
                    className="w-full h-full border-none relative z-0 overflow-hidden"
                    scrolling="no"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
                    referrerPolicy="no-referrer"
                    onLoad={() => {
                        setIsReady(true);
                        dispatchStatus("Playing");
                    }}
                />
            ) : isDirectStream ? (
                <ShakaPlayer
                    url={url}
                    playing={playing && !error}
                    volume={volume}
                    muted={muted}
                    onReady={() => {
                        setIsReady(true);
                        dispatchStatus(playing ? "Playing" : "Paused");
                    }}
                    onError={(e: any) => {
                        console.error("Shaka Error:", e);
                        setError("Source Transmission Error");
                        dispatchStatus("Error");
                    }}
                    onBuffering={(isBuffering: boolean) => {
                        dispatchStatus(isBuffering ? "Buffering" : (playing ? "Playing" : "Paused"));
                    }}
                    onStats={setTechStats}
                    onQualityLevels={(levels: any[]) => {
                        setQualityLevels(levels);
                    }}
                    currentQuality={currentQuality}
                    performanceProfile={settings.performanceProfile}
                    sniMask={sniMask}
                    proxyActive={proxyActive}
                />
            ) : (
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={playing && !error}
                    volume={volume}
                    muted={muted}
                    onReady={() => {
                        setIsReady(true);
                        dispatchStatus(playing ? "Playing" : "Paused");
                    }}
                    onError={(e: any) => {
                        console.error("Player Error:", e);
                        setError("Source failed");
                        dispatchStatus("Error");
                    }}
                    onPlay={() => dispatchStatus("Playing")}
                    onPause={() => dispatchStatus("Paused")}
                    config={{
                        file: {
                            forceHLS: url.toLowerCase().includes(".m3u8"),
                            forceDASH: url.toLowerCase().includes(".mpd"),
                            attributes: {
                                crossOrigin: "anonymous",
                                className: 'w-full h-full',
                                onWaiting: () => dispatchStatus("Buffering"),
                                onPlaying: () => dispatchStatus(playing ? "Playing" : "Paused")
                            },
                            hlsOptions: {
                                enableWorker: true,
                                lowLatencyMode: settings.lowLatency,
                                backBufferLength: 60,
                                maxBufferLength: 90, // Massive buffer
                                maxMaxBufferLength: 180, // High ceiling for stability
                                maxBufferHole: 0.5,
                                manifestLoadingMaxRetry: 20,
                                fragLoadingMaxRetry: 20,
                                nudgeOffset: 0.1,
                                nudgeMaxRetry: 20,
                                liveSyncDurationCount: settings.performanceProfile === 'lowLatency' ? 2 : 5,
                                liveMaxLatencyDurationCount: settings.performanceProfile === 'lowLatency' ? 4 : 10,
                                abrEwmaDefaultEstimate: 2000000,
                                enableSoftwareAES: true,
                                progressive: true, // Fast processing
                            },
                            dashConfig: {
                                setFastSwitchEnabled: true,
                                setABRStrategy: 'abrDynamic',
                                setBufferTimeAtTopQuality: 60, // Deep buffer
                                setStableBufferTime: 60,
                                setLowLatencyEnabled: settings.lowLatency,
                                setJumpGaps: true
                            }
                        }
                    }}
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    onProgress={(p: any) => {
                        if (playerRef.current) {
                            const internal = playerRef.current.getInternalPlayer?.();
                            if (internal?.hls) {
                                setTechStats(prev => ({
                                    ...prev,
                                    bitrate: Math.round(internal.hls.levels[internal.hls.currentLevel]?.bitrate / 1000) || 0,
                                    buffer: Math.round(internal.hls.mainForwardBufferInfo?.len * 10) / 10 || 0,
                                    latency: Math.round(internal.hls.latency * 100) / 100 || 0,
                                    fps: 60 // Simulated or real if available
                                }));
                                if (qualityLevels.length === 0) {
                                    setQualityLevels(internal.hls.levels);
                                    setCurrentQuality(internal.hls.currentLevel);
                                }
                            } else if (internal?.dash) {
                                const dash = internal.dash;
                                setTechStats(prev => ({
                                    ...prev,
                                    bitrate: Math.round(dash.getSafeBitrateFor('video')) || 0,
                                    buffer: Math.round(dash.getBufferLength('video') * 10) / 10 || 0,
                                    fps: 60
                                }));
                                if (qualityLevels.length === 0) {
                                    setQualityLevels(dash.getBitrateInfoListFor('video'));
                                    setCurrentQuality(dash.getQualityFor('video'));
                                }
                            }
                        }
                    }}
                />
            )}

            <AnimatePresence>
                {showControls && !error && useReactPlayer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                        {/* Status Overlay (Top Left) */}
                        <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-auto">
                            <div className="px-4 py-2 glass-dark border border-white/5 rounded-2xl flex items-center gap-3 backdrop-blur-3xl">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-neon-magenta animate-ping absolute" />
                                    <div className="w-2 h-2 rounded-full bg-neon-magenta relative" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{title}</span>
                            </div>

                            {showTechStats && (
                                <div className="glass-dark border border-white/10 rounded-2xl p-3 lg:p-4 backdrop-blur-3xl space-y-2 lg:space-y-3 min-w-[140px] lg:min-w-[180px] pointer-events-auto">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[7px] lg:text-[8px] font-black text-slate-500 uppercase tracking-widest">Bitrate</span>
                                        <span className="text-[9px] lg:text-[10px] font-black text-neon-cyan">{techStats.bitrate} KB/S</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[7px] lg:text-[8px] font-black text-slate-500 uppercase tracking-widest">Buffer</span>
                                        <span className="text-[9px] lg:text-[10px] font-black text-neon-magenta">{techStats.buffer}S</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-emerald-500">
                                        <span className="text-[7px] lg:text-[8px] font-black opacity-60 uppercase tracking-widest">Latency</span>
                                        <span className="text-[9px] lg:text-[10px] font-black">{techStats.latency}S</span>
                                    </div>
                                    <div className="h-[px] bg-white/5 w-full hidden lg:block" />
                                    <div className="hidden lg:flex items-center gap-2 text-[7px] font-black text-slate-600 uppercase tracking-tighter">
                                        <Zap size={8} className="text-neon-cyan" />
                                        <span>Engine: {isDirectStream ? 'SHAKA' : (url.includes('youtube.com') ? 'YOUTUBE' : 'SYSTEM')} v2.0.4</span>
                                    </div>
                                </div>
                            )}

                            {!useReactPlayer && (
                                <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 backdrop-blur-3xl pointer-events-auto">
                                    <ShieldCheck className="text-emerald-500" size={12} />
                                    <span className="text-[7px] lg:text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Verified</span>
                                </div>
                            )}
                        </div>

                        {/* Control Interface (Bottom - Glass Floating) */}
                        <div className="absolute bottom-6 lg:bottom-10 left-4 lg:left-10 right-4 lg:right-10 flex items-center justify-center pointer-events-auto">
                            {useReactPlayer && (
                                <div className="glass-dark border border-white/10 rounded-2xl lg:rounded-[3rem] p-2 lg:p-3 pr-4 lg:pr-8 flex items-center gap-3 lg:gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] max-w-full overflow-hidden">
                                    <button
                                        onClick={() => setPlaying(!playing)}
                                        className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-500 transform active:scale-90 flex-shrink-0"
                                    >
                                        {playing ? <Pause fill="currentColor" size={20} className="lg:w-6 lg:h-6" /> : <Play fill="currentColor" size={20} className="lg:w-6 lg:h-6 ml-1" />}
                                    </button>

                                    <div className="h-6 lg:h-8 w-[1px] bg-white/10 flex-shrink-0" />

                                    <div className="flex items-center gap-2 lg:gap-4 group/vol">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setMuted(!muted)}
                                            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
                                        >
                                            {muted || volume === 0 ? <VolumeX size={18} className="lg:w-5 lg:h-5" /> : <Volume2 size={18} className="lg:w-5 lg:h-5" />}
                                        </motion.button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => {
                                                setVolume(parseFloat(e.target.value));
                                                if (muted) setMuted(false);
                                            }}
                                            className="w-16 lg:w-24 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:bg-white/10 transition-all font-medium"
                                        />
                                    </div>

                                    <div className="h-6 lg:h-8 w-[1px] bg-white/10 hidden sm:block flex-shrink-0" />

                                    <div className="flex items-center gap-3 lg:gap-6">
                                        <div className="relative">
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowQualityMenu(!showQualityMenu)}
                                                className={`flex items-center gap-1.5 transition-colors ${showQualityMenu ? "text-neon-cyan" : "text-white/40 hover:text-white"}`}
                                                title="QUALITY"
                                            >
                                                <Layers size={18} className="lg:w-5 lg:h-5" />
                                                <span className="text-[7px] lg:text-[8px] font-black uppercase whitespace-nowrap">
                                                    {currentQuality === -1
                                                        ? 'Auto'
                                                        : qualityLevels[currentQuality]
                                                            ? `${qualityLevels[currentQuality].height || qualityLevels[currentQuality].width || 'HD'}p`
                                                            : 'Auto'}
                                                </span>
                                            </motion.button>

                                            <AnimatePresence>
                                                {showQualityMenu && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute bottom-full right-0 mb-4 glass-dark border border-white/10 rounded-2xl overflow-hidden min-w-[120px]"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                // ShakaPlayer reacts to currentQuality prop via its own useEffect
                                                                // ReactPlayer: also apply directly via HLS/DASH API
                                                                if (!isDirectStream) {
                                                                    const internal = playerRef.current?.getInternalPlayer?.();
                                                                    if (internal?.hls) internal.hls.currentLevel = -1;
                                                                    if (internal?.dash) internal.dash.setAutoSwitchQualityFor('video', true);
                                                                }
                                                                setCurrentQuality(-1);
                                                                setShowQualityMenu(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 ${currentQuality === -1 ? 'text-neon-cyan' : 'text-slate-400'}`}
                                                        >
                                                            ✓ Auto (ABR)
                                                        </button>
                                                        {qualityLevels.map((lvl, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    // ShakaPlayer: just set state — Shaka useEffect handles selectVariantTrack
                                                                    // ReactPlayer: also set via HLS/DASH directly
                                                                    if (!isDirectStream) {
                                                                        const internal = playerRef.current?.getInternalPlayer?.();
                                                                        if (internal?.hls) internal.hls.currentLevel = idx;
                                                                        if (internal?.dash) {
                                                                            internal.dash.setAutoSwitchQualityFor('video', false);
                                                                            internal.dash.setQualityFor('video', idx);
                                                                        }
                                                                    }
                                                                    setCurrentQuality(idx);
                                                                    setShowQualityMenu(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 ${currentQuality === idx ? 'text-neon-cyan' : 'text-slate-400'}`}
                                                            >
                                                                {lvl.height ? `${lvl.height}p` : `${Math.round((lvl.bandwidth || 0) / 1000)}kbps`}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {settings.dataSaver && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full" title="DATA SAVER ACTIVE">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">ECO</span>
                                            </div>
                                        )}
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={toggleCinemaMode}
                                            className={`transition-colors duration-300 ${isCinemaMode ? "text-neon-cyan" : "text-white/40 hover:text-white"}`}
                                            title="CINEMA MODE"
                                        >
                                            <MonitorPlay size={20} />
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowTechStats(!showTechStats)}
                                            className={`transition-colors duration-300 ${showTechStats ? "text-neon-magenta" : "text-white/40 hover:text-white"}`}
                                            title="TECH STATS"
                                        >
                                            <Gauge size={20} />
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleFullscreen}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <Maximize size={20} />
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
