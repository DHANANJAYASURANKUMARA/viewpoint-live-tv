"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { ConfigProvider } from "@/components/ConfigContext";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return <div className="min-h-screen bg-vpoint-dark">{children}</div>;
    }

    return (
        <ConfigProvider>
            <div className="flex h-screen bg-vpoint-dark overflow-hidden font-sans selection:bg-neon-cyan/30 relative">
                {/* MOBILE HEADER */}
                <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass z-[60] flex items-center justify-between px-6 border-b border-white/5">
                    <h2 className="text-sm font-black text-white uppercase tracking-tighter">
                        VPOINT<span className="text-neon-cyan">CMD</span>
                    </h2>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* PERSISTENT COMMAND SIDEBAR */}
                <div className={`fixed inset-y-0 left-0 z-[70] transition-transform duration-500 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <AdminSidebar />
                </div>

                {/* MOBILE OVERLAY */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* DYNAMIC SECTOR VIEWPORT */}
                <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.03)_0%,transparent_50%)] pt-16 lg:pt-0">
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="relative z-10 min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ConfigProvider>
    );
}
