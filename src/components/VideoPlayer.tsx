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
    ShieldCheck,
    Settings,
    Camera,
    SlidersHorizontal,
    Plus,
    Minus,
    Sun,
    Contrast,
    RotateCcw,
    X
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
}

export default function VideoPlayer({ url, title = "Live Stream", sniMask, proxyActive }: VideoPlayerProps) {
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
        fps: 0,
        codec: "Pending..."
    });
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [volumeBoost, setVolumeBoost] = useState(1);
    const [visualTuning, setVisualTuning] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100
    });
    const [showSettings, setShowSettings] = useState(false);
    const [isScreenshotting, setIsScreenshotting] = useState(false);
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
        setQualityLevels([]);
        setCurrentQuality(-1);
        setShowQualityMenu(false);
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

    // Advanced Audio Engine (Volume Boost)
    useEffect(() => {
        const video = document.querySelector(".video-container video") as HTMLVideoElement;
        if (!video || volumeBoost <= 1) return;

        let audioCtx: AudioContext | null = null;
        let source: MediaElementAudioSourceNode | null = null;
        let gainNode: GainNode | null = null;

        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            source = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();

            gainNode.gain.value = volumeBoost;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        } catch (e) {
            console.error("Audio Boost Error:", e);
        }

        return () => {
            if (audioCtx) {
                audioCtx.close();
            }
        };
    }, [volumeBoost]);

    // Playback Speed Engine
    useEffect(() => {
        const video = document.querySelector(".video-container video") as HTMLVideoElement;
        if (video) {
            video.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

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

    const isDirectStream = url.toLowerCase().match(/\.(m3u8|mp4|webm|ogg|mpd|m4s|ts|mkv|m4v|mov|avi|flv|wmv)(\?.*)?$/i) ||
        url.toLowerCase().includes("playlist.m3u8") ||
        url.toLowerCase().includes("manifest.mpd") ||
        url.toLowerCase().includes("master.m3u8");
    const isSpecialPlayer = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com") || url.includes("twitch.tv") || url.includes("streamable.com") || url.includes("facebook.com") || url.includes("dailymotion.com");

    const useReactPlayer = isDirectStream || isSpecialPlayer;

    const takeScreenshot = () => {
        const video = document.querySelector(".video-container video") as HTMLVideoElement;
        if (!video) return;

        setIsScreenshotting(true);
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `V-PULSE-SHOT-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
        }

        setTimeout(() => setIsScreenshotting(false), 1000);
    };

    const handlePip = async () => {
        const video = document.querySelector(".video-container video") as HTMLVideoElement;
        if (video && document.pictureInPictureEnabled) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await video.requestPictureInPicture();
                }
            } catch (e) { console.error("PiP Error:", e); }
        }
    };

    return (
        <div
            className={`video-container relative w-full overflow-hidden glass shadow-[0_0_100px_rgba(0,0,0,0.6)] group border border-white/5 transition-all duration-700 ${isCinemaMode ? "z-[60] scale-105" : "rounded-none"} aspect-video`}
            style={{
                filter: `brightness(${visualTuning.brightness}%) contrast(${visualTuning.contrast}%) saturate(${visualTuning.saturation}%)`
            }}
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
                        <button
                            onClick={() => {
                                setError(null);
                                setIsReady(false);
                            }}
                            className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neon-cyan transition-all"
                        >
                            Retry Connection
                        </button>
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
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-modals allow-popups-to-escape-sandbox"
                    referrerPolicy="strict-origin-when-cross-origin"
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

                        // Sync initial quality levels immediately
                        const internal = playerRef.current?.getInternalPlayer?.();
                        if (internal?.hls) {
                            setQualityLevels(internal.hls.levels || []);
                            setCurrentQuality(internal.hls.currentLevel);
                        } else if (internal?.dash) {
                            setQualityLevels(internal.dash.getBitrateInfoListFor('video') || []);
                            setCurrentQuality(internal.dash.getQualityFor('video'));
                        }
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
                                    <div className="flex items-center justify-between gap-4 text-amber-500">
                                        <span className="text-[7px] lg:text-[8px] font-black opacity-60 uppercase tracking-widest">Codec</span>
                                        <span className="text-[9px] lg:text-[10px] font-black uppercase text-right truncate max-w-[80px]">{techStats.codec}</span>
                                    </div>
                                    <div className="h-[px] bg-white/5 w-full hidden lg:block" />
                                    <div className="hidden lg:flex items-center gap-2 text-[7px] font-black text-slate-600 uppercase tracking-tighter">
                                        <Zap size={8} className="text-neon-cyan" />
                                        <span>Engine: {isDirectStream ? 'SHAKA' : (url.includes('youtube.com') ? 'YOUTUBE' : 'SYSTEM')} v2.5.0</span>
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
                        <div className="absolute bottom-6 lg:bottom-10 left-4 lg:left-10 right-4 lg:left-10 flex items-center justify-center pointer-events-auto">
                            {useReactPlayer && (
                                <div className="glass-dark border border-white/10 rounded-2xl lg:rounded-[3rem] p-2 lg:p-3 pr-4 lg:pr-8 flex items-center gap-3 lg:gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] max-w-full">
                                    <button
                                        onClick={() => setPlaying(!playing)}
                                        className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-500 transform active:scale-90 flex-shrink-0"
                                    >
                                        {playing ? <Pause fill="currentColor" size={20} className="lg:w-6 lg:h-6" /> : <Play fill="currentColor" size={20} className="lg:w-6 lg:h-6 ml-1" />}
                                    </button>

                                    <div className="h-6 lg:h-8 w-[1px] bg-white/10 flex-shrink-0" />

                                    <div className="flex items-center gap-2 lg:gap-4 group/vol">
                                        <button
                                            onClick={() => setMuted(!muted)}
                                            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
                                        >
                                            {muted || volume === 0 ? <VolumeX size={18} className="lg:w-5 lg:h-5" /> : <Volume2 size={18} className="lg:w-5 lg:h-5" />}
                                        </button>
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
                                        <button
                                            onClick={takeScreenshot}
                                            className={`transition-all duration-300 ${isScreenshotting ? "text-neon-cyan scale-125" : "text-white/40 hover:text-white"}`}
                                            title="SNAPSHOT"
                                        >
                                            <Camera size={20} />
                                        </button>

                                        <button
                                            onClick={handlePip}
                                            className="text-white/40 hover:text-white transition-colors"
                                            title="PICTURE IN PICTURE"
                                        >
                                            <MonitorPlay size={20} />
                                        </button>



                                        <button
                                            onClick={() => setShowSettings(!showSettings)}
                                            className={`transition-all duration-500 ${showSettings ? "text-neon-cyan rotate-90" : "text-white/40 hover:text-white"}`}
                                            title="SURGICAL SETTINGS"
                                        >
                                            <Settings size={20} />
                                        </button>

                                        <button
                                            onClick={handleFullscreen}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <Maximize size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Sidebar Backdrop */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSettings(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                    />
                )}
            </AnimatePresence>

            {/* Settings Sidebar */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 bottom-0 w-full sm:w-80 glass-dark border-l border-white/10 z-[100] backdrop-blur-3xl overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-8 space-y-12 relative z-10">
                            {/* Scanning Pulse Background */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <motion.div
                                    animate={{ opacity: [0.02, 0.05, 0.02], y: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 10, repeat: Infinity }}
                                    className="w-full h-px bg-neon-cyan/30 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Neural Config</h3>
                                <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Speed Control */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temporal Rate</span>
                                    <span className="text-[10px] font-black text-neon-cyan">{playbackSpeed}x</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0.5, 1, 1.5, 2].map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => setPlaybackSpeed(speed)}
                                            className={`py-2 text-[9px] font-black rounded-lg border transition-all ${playbackSpeed === speed ? "bg-neon-cyan/20 border-neon-cyan text-white" : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"}`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Signal Resolution */}
                            {useReactPlayer && qualityLevels.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Layers size={14} className="text-neon-cyan" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Resolution</span>
                                        </div>
                                        <span className="text-[10px] font-black text-neon-cyan">
                                            {currentQuality === -1
                                                ? 'AUTO'
                                                : qualityLevels[currentQuality]?.height
                                                    ? `${qualityLevels[currentQuality].height}P`
                                                    : 'HD'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                if (!isDirectStream) {
                                                    const internal = playerRef.current?.getInternalPlayer?.();
                                                    if (internal?.hls) internal.hls.currentLevel = -1;
                                                    if (internal?.dash) internal.dash.setAutoSwitchQualityFor('video', true);
                                                }
                                                setCurrentQuality(-1);
                                            }}
                                            className={`py-3 text-[9px] font-black rounded-xl border transition-all ${currentQuality === -1 ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"}`}
                                        >
                                            AUTO SIGNAL
                                        </button>
                                        {qualityLevels.map((lvl, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (!isDirectStream) {
                                                        const internal = playerRef.current?.getInternalPlayer?.();
                                                        if (internal?.hls) internal.hls.currentLevel = idx;
                                                        if (internal?.dash) {
                                                            internal.dash.setAutoSwitchQualityFor('video', false);
                                                            internal.dash.setQualityFor('video', idx);
                                                        }
                                                    }
                                                    setCurrentQuality(idx);
                                                }}
                                                className={`py-3 text-[9px] font-black rounded-xl border transition-all ${currentQuality === idx ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "bg-white/5 border-white/5 text-white/30 hover:bg-white/10"}`}
                                            >
                                                {lvl.height ? `${lvl.height}P MANUAL` : `${Math.round((lvl.bandwidth || 0) / 1000)}K`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Volume Boost */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Boost</span>
                                    <span className="text-[10px] font-black text-neon-magenta">{Math.round(volumeBoost * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Minus size={14} className="text-white/20" />
                                    <input
                                        type="range" min="1" max="2" step="0.1"
                                        value={volumeBoost}
                                        onChange={(e) => setVolumeBoost(parseFloat(e.target.value))}
                                        className="flex-1 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
                                    />
                                    <Plus size={14} className="text-white/20" />
                                </div>
                            </div>

                            {/* Visual Tuning */}
                            <div className="space-y-8">
                                <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Luminance & Chroma</h4>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sun size={12} className="text-amber-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Brightness</span>
                                        </div>
                                        <span className="text-[9px] font-black text-white">{visualTuning.brightness}%</span>
                                    </div>
                                    <input
                                        type="range" min="50" max="150" value={visualTuning.brightness}
                                        onChange={(e) => setVisualTuning(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                                        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Contrast size={12} className="text-neon-cyan" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contrast</span>
                                        </div>
                                        <span className="text-[9px] font-black text-white">{visualTuning.contrast}%</span>
                                    </div>
                                    <input
                                        type="range" min="50" max="150" value={visualTuning.contrast}
                                        onChange={(e) => setVisualTuning(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                                        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal size={12} className="text-neon-magenta" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saturation</span>
                                        </div>
                                        <span className="text-[9px] font-black text-white">{visualTuning.saturation}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="200" value={visualTuning.saturation}
                                        onChange={(e) => setVisualTuning(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                                        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
                                    />
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setPlaybackSpeed(1);
                                    setVolumeBoost(1);
                                    setVisualTuning({ brightness: 100, contrast: 100, saturation: 100 });
                                }}
                                className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-white/40 uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all"
                            >
                                Reset Neural Link
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
