"use client";

import React, { useEffect, useRef } from "react";

interface ShakaPlayerProps {
    url: string;
    playing: boolean;
    volume: number;
    muted: boolean;
    onReady: () => void;
    onError: (error: any) => void;
    onBuffering: (isBuffering: boolean) => void;
    onStats: (stats: any) => void;
    onQualityLevels: (levels: any[]) => void;
    currentQuality: number;
    performanceProfile: 'lowLatency' | 'balanced' | 'highQuality';
    sniMask?: string;
    proxyActive?: boolean;
}

export default function ShakaPlayer({
    url,
    playing,
    volume,
    muted,
    onReady,
    onError,
    onBuffering,
    onStats,
    onQualityLevels,
    currentQuality,
    performanceProfile = 'balanced',
    sniMask,
    proxyActive
}: ShakaPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        let shaka: any;
        const player: any = null;

        const initPlayer = async () => {
            if (!videoRef.current) return;

            try {
                // Dynamically import Shaka Player
                const shakaModule = await import("shaka-player");
                shaka = (shakaModule as any).default || shakaModule;

                // Install polyfills
                shaka.polyfill.installAll();

                if (shaka.Player.isBrowserSupported() && videoRef.current) {
                    const player = new shaka.Player(videoRef.current);
                    playerRef.current = player;

                    // LOAD SETTINGS FOR PERFORMANCE
                    const savedSettings = JSON.parse(localStorage.getItem("vpoint-settings") || "{}");
                    const isAdaptiveBuffer = savedSettings.adaptiveBuffer ?? true;

                    // Configure player for ultra-smooth playback
                    const config: any = {
                        streaming: {
                            // Aggressive buffering for zero-lag
                            bufferingGoal: performanceProfile === 'lowLatency' ? 15 : (performanceProfile === 'balanced' ? 60 : 120),
                            rebufferingGoal: performanceProfile === 'lowLatency' ? 3 : (performanceProfile === 'balanced' ? 10 : 15),
                            bufferBehind: 30,

                            // Adaptive Recovery logic
                            stallThreshold: isAdaptiveBuffer ? 2 : 5,
                            stallSkip: isAdaptiveBuffer ? 0.5 : 0,

                            inaccurateManifestTolerance: 2,

                            retryParameters: {
                                timeout: 20000, // Increased timeout
                                maxAttempts: 15, // More attempts for better stability
                                baseDelay: 1000,
                                backoffFactor: 1.5,
                                fuzzFactor: 0.3,
                            }
                        },
                        abr: {
                            enabled: true,
                            switchInterval: 1,
                            bandwidthUpgradeTarget: 0.85, // Faster quality ramp-up
                            defaultBandwidthEstimate: 2000000,
                        },
                        manifest: {
                            retryParameters: {
                                timeout: 20000,
                                maxAttempts: 15,
                                baseDelay: 1000,
                                backoffFactor: 1.5,
                            }
                        }
                    };

                    if (performanceProfile === 'lowLatency') {
                        config.streaming.lowLatencyMode = true;
                        config.streaming.autoLowLatencyMode = true;
                    }

                    player.configure(config);

                    // SNI Masking & Request Interception
                    if (proxyActive && sniMask) {
                        player.getNetworkingEngine().registerRequestFilter((_type: any, request: any) => {
                            // In a real SNI environment, we'd add headers for proxying
                            // For this UI simulation, we log the masked handshake
                            const urlObj = new URL(request.uris[0]);
                            request.headers['X-SNI-Mask'] = sniMask;
                            request.headers['X-Transmission-Logic'] = 'Atmospheric';

                            // Log the intercepted transmission (Internal Telemetry)
                            if (Math.random() > 0.95) {
                                console.log(`[Neural Link] Masking Transmission: ${urlObj.hostname} -> ${sniMask}`);
                            }
                        });
                    }

                    // Event Listeners
                    player.addEventListener('error', (event: any) => {
                        console.error('Shaka Error:', event.detail);
                        onError(event.detail);
                    });

                    player.addEventListener('buffering', (event: any) => {
                        onBuffering(event.buffering);
                    });

                    // Load Source
                    await player.load(url);
                    onReady();

                    // Sync initial quality levels
                    const tracks = player.getVariantTracks();
                    // Map to a consistent format for the UI
                    const formattedTracks = tracks.map((t: any) => ({
                        height: t.height,
                        id: t.id,
                        active: t.active,
                        bandwidth: t.bandwidth
                    })).sort((a: any, b: any) => b.height - a.height);

                    onQualityLevels(formattedTracks);
                } else {
                    onError("Shaka Player: Browser not supported or video element missing");
                }
            } catch (e) {
                console.error('Shaka Init Error:', e);
                onError(e);
            }
        };

        initPlayer();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [url, performanceProfile]);

    // Sync Playback State
    useEffect(() => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
            }
        }
    }, [playing]);

    // Sync Audio State
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = muted;
        }
    }, [volume, muted]);

    // Handle Quality Changes
    useEffect(() => {
        if (playerRef.current) {
            if (currentQuality === -1) {
                playerRef.current.configure({ abr: { enabled: true } });
            } else {
                const tracks = playerRef.current.getVariantTracks().sort((a: any, b: any) => b.height - a.height);
                if (tracks[currentQuality]) {
                    playerRef.current.configure({ abr: { enabled: false } });
                    playerRef.current.selectVariantTrack(tracks[currentQuality], true);
                }
            }
        }
    }, [currentQuality]);

    // Tech Stats Loop (Internal Telemetry)
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && videoRef.current) {
                try {
                    const stats = playerRef.current.getStats();
                    const bufferedInfo = playerRef.current.getBufferedInfo();

                    let bufferLen = 0;
                    if (bufferedInfo && bufferedInfo.total && bufferedInfo.total.length > 0) {
                        const currentTime = videoRef.current.currentTime;
                        for (const range of bufferedInfo.total) {
                            if (range.start <= currentTime && range.end >= currentTime) {
                                bufferLen = range.end - currentTime;
                                break;
                            }
                        }
                    }

                    const activeTrack = playerRef.current.getVariantTracks().find((t: any) => t.active);

                    onStats({
                        bitrate: Math.round(stats.streamBandwidth / 1000) || 0,
                        buffer: Math.round(bufferLen * 10) / 10 || 0,
                        latency: Math.round(stats.liveLatency * 100) / 100 || 0,
                        fps: 60,
                        codec: activeTrack ? `${activeTrack.videoCodec?.split('.')[0]} / ${activeTrack.audioCodec?.split('.')[0]}` : "Detecting..."
                    });
                } catch (e) { }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [onStats]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full bg-black object-contain"
            playsInline
        />
    );
}
