"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[2000] bg-vpoint-dark flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Background & Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.15)_0%,_transparent_70%)] opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-12">
                {/* Logo Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.2
                    }}
                    className="relative w-48 h-24"
                >
                    <Image
                        src="/app-logo.png"
                        alt="App Logo"
                        fill
                        className="object-contain filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        priority
                    />
                </motion.div>

                {/* Animated Loading Bar */}
                <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                            repeat: Infinity
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-40"
                    />
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 3,
                            ease: [0.65, 0, 0.35, 1],
                            repeat: Infinity,
                            repeatDelay: 0.5
                        }}
                        className="h-full bg-neon-cyan shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                    />
                </div>

                {/* Status Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center space-y-2"
                >
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                        Initializing Matrix
                    </span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ scaleY: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-0.5 h-2 bg-neon-cyan/50"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/5 rounded-tl-3xl" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/5 rounded-br-3xl" />
        </motion.div>
    );
}
