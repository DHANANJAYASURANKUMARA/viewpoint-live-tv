"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, updateSetting } from "@/lib/actions";

interface PlatformConfig {
    accentColor: string;
    secondaryColor: string;
    brandingText: string;
    showHero: boolean;
    showFeatures: boolean;
    showWhatsNew: boolean;
    showFAQ: boolean;
    showAbout: boolean;
    showContact: boolean;
    neuralHudEnabled: boolean;
    maintenanceMode: boolean;
    adSenseActive: boolean;
    globalSniMask: string;
    isMaskingEnabled: boolean;
    notificationsEnabled: boolean;
    version: string;
    maintenanceMessage: string;
}

const defaultConfig: PlatformConfig = {
    accentColor: "#06b6d4", // neon-cyan
    secondaryColor: "#a855f7", // neon-purple
    brandingText: "VIEWPOINT",
    showHero: true,
    showFeatures: true,
    showWhatsNew: true,
    showFAQ: true,
    showAbout: true,
    showContact: true,
    neuralHudEnabled: true,
    maintenanceMode: false,
    adSenseActive: true,
    globalSniMask: "m.facebook.com",
    isMaskingEnabled: true,
    notificationsEnabled: true,
    version: "2.1.0",
    maintenanceMessage: "The Viewpoint matrix is currently undergoing scheduled structural refinement. Signal stability is being recalibrated for enhanced digital density.",
};

interface ConfigContextType {
    config: PlatformConfig;
    updateConfig: (newConfig: Partial<PlatformConfig>) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<PlatformConfig>(defaultConfig);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeConfig = async () => {
            // Always load from DB first — authoritative source
            const dbSettings = await getSettings();

            if (Object.keys(dbSettings).length > 0) {
                const newConfig = { ...defaultConfig };
                Object.entries(dbSettings).forEach(([key, val]) => {
                    const typedKey = key as keyof PlatformConfig;
                    if (typedKey in newConfig) {
                        if (typeof defaultConfig[typedKey] === "boolean") {
                            (newConfig as any)[typedKey] = val === "true";
                        } else {
                            (newConfig as any)[typedKey] = val;
                        }
                    }
                });
                setConfig(newConfig);
                // Sync localStorage from DB so they stay consistent
                localStorage.setItem("vpoint-platform-config", JSON.stringify(newConfig));
            } else {
                // DB is empty — try seeding from localStorage if available
                const saved = localStorage.getItem("vpoint-platform-config");
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setConfig(parsed);
                        // Persist localStorage values into the DB for future loads
                        Object.keys(parsed).forEach((key: string) => {
                            updateSetting(key, String(parsed[key]));
                        });
                    } catch (e: unknown) {
                        console.error("Failed to parse config from localStorage", e);
                    }
                }
            }
            setIsInitialized(true);
        };

        initializeConfig();
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("vpoint-platform-config", JSON.stringify(config));

            // Apply CSS Variables for dynamic colors
            document.documentElement.style.setProperty("--neon-cyan", config.accentColor);
            document.documentElement.style.setProperty("--neon-purple", config.secondaryColor);
            document.documentElement.style.setProperty("--vpoint-accent", config.accentColor);
        }
    }, [config, isInitialized]);

    const updateConfig = (newConfig: Partial<PlatformConfig>) => {
        Object.entries(newConfig).forEach(([key, val]) => {
            if (val !== undefined) {
                updateSetting(key, val.toString());
            }
        });
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetConfig = async () => {
        // Reset in DB as well
        Object.entries(defaultConfig).forEach(([key, val]) => {
            updateSetting(key, val.toString());
        });
        setConfig(defaultConfig);
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}
