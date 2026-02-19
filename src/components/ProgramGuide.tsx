"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";

const programs = [
    { time: "17:00", title: "PL: Liverpool vs Man City", channel: "Sky Sports", duration: "120 min", 进度: 75 },
    { time: "18:30", title: "Sports Center: Nightly", channel: "ESPN", duration: "60 min", 进度: 0 },
    { time: "19:00", title: "The Dark Knight", channel: "HBO Max", duration: "150 min", 进度: 0 },
    { time: "20:00", title: "Evening News", channel: "CNN", duration: "30 min", 进度: 0 },
    { time: "21:00", title: "Planet Earth III", channel: "Nat Geo", duration: "60 min", 进度: 0 },
];

export default function ProgramGuide() {
    return (
        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 text-neon-cyan">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-widest uppercase mb-0.5">Program Guide</h3>
                        <p className="text-slate-500 text-[9px] font-bold tracking-[0.2em] uppercase">Daily Transmission Schedule</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={14} />
                    <span>WEDNESDAY, FEB 18</span>
                </div>
            </div>

            <div className="space-y-4">
                {programs.map((prog, i) => (
                    <div
                        key={i}
                        className={`group relative p-5 rounded-3xl transition-all duration-500 border premium-shimmer overflow-hidden ${prog.进度 > 0
                            ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.05)]"
                            : "bg-transparent border-white/5 hover:border-white/10"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className={`text-[11px] font-black w-14 text-center tracking-widest ${prog.进度 > 0 ? "text-neon-cyan" : "text-slate-600"}`}>
                                    {prog.time}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-black truncate group-hover:text-neon-cyan transition-colors uppercase tracking-wide">
                                        {prog.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-1.5">
                                        {prog.channel} • {prog.duration}
                                    </p>
                                </div>
                            </div>

                            {prog.进度 > 0 && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                                    <span className="text-[9px] font-black text-neon-cyan uppercase tracking-widest">Watching Now</span>
                                </div>
                            )}
                        </div>

                        {prog.进度 > 0 && (
                            <div className="mt-5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${prog.进度}%` }}
                                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                View Full Neural Schedule
            </button>
        </div>
    );
}
