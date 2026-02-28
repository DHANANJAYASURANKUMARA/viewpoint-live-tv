"use client";

import React, { useEffect, useRef } from 'react';

const AdBanner728 = () => {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Avoid double injection in development
        const banner = bannerRef.current;
        if (banner && !banner.querySelector('iframe')) {
            try {
                // Clear any existing scripts or content
                banner.innerHTML = '';

                // Some ad networks expect atOptions to be in the global window scope
                (window as any).atOptions = {
                    'key': '2dd2ac378fb6daf67f65d1e16b202bb0',
                    'format': 'iframe',
                    'height': 90,
                    'width': 728,
                    'params': {}
                };

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://www.highperformanceformat.com/2dd2ac378fb6daf67f65d1e16b202bb0/invoke.js`;
                // Ad scripts are often timing-sensitive in SPAs
                script.async = true;

                banner.appendChild(script);

                return () => {
                    // Cleanup on unmount
                    if (banner.contains(script)) {
                        banner.removeChild(script);
                    }
                    // Optionally clear window.atOptions if it's strictly for this component
                    // delete (window as any).atOptions;
                };
            } catch (error) {
                console.error("Ad Banner Error:", error);
            }
        }
    }, []);

    return (
        <div className="w-full flex justify-center py-8 bg-vpoint-dark/30 border-y border-white/5">
            <div
                ref={bannerRef}
                style={{ width: '728px', height: '90px' }}
                className="bg-white/5 flex items-center justify-center overflow-hidden rounded-lg shadow-lg border border-white/10 relative"
            >
                {/* The script will inject the iframe here */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Signal Slot</span>
                </div>
            </div>
        </div>
    );
};

export default AdBanner728;
