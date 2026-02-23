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
    version: string;
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
    version: "2.0.4",
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
                Object.keys(dbSettings).forEach(key => {
                    if (key in newConfig) {
                        const val = dbSettings[key];
                        if (typeof (newConfig as any)[key] === "boolean") {
                            (newConfig as any)[key] = val === "true";
                        } else {
                            (newConfig as any)[key] = val;
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
                    } catch (e) {
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
        const keys = Object.keys(newConfig);
        keys.forEach(key => {
            const val = (newConfig as any)[key];
            updateSetting(key, val.toString());
        });
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetConfig = async () => {
        // Reset in DB as well
        Object.keys(defaultConfig).forEach(key => {
            updateSetting(key, (defaultConfig as any)[key].toString());
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
