"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
        const saved = localStorage.getItem("vpoint-platform-config");
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse config", e);
            }
        }
        setIsInitialized(true);
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
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetConfig = () => {
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
