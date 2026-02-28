"use client";

import React, { useEffect, useRef } from 'react';

const AdBanner728 = () => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const banner = bannerRef.current;
        const container = containerRef.current;
        if (!banner || !container) return;

        // Initialize Ad if not already present
        if (!banner.querySelector('iframe')) {
            try {
                banner.innerHTML = '';
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
                script.async = true;
                banner.appendChild(script);
            } catch (error) {
                console.error("Ad Banner Error:", error);
            }
        }

        // Responsive Scaling Logic
        const handleResize = () => {
            if (!container || !banner) return;
            const containerWidth = container.offsetWidth;
            const targetWidth = 728;

            if (containerWidth < targetWidth) {
                const scale = containerWidth / targetWidth;
                banner.style.transform = `scale(${scale})`;
                banner.style.transformOrigin = 'center top';
                container.style.height = `${90 * scale}px`;
            } else {
                banner.style.transform = 'scale(1)';
                container.style.height = '90px';
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize(); // Initial call

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="w-full py-8 bg-vpoint-dark/30 border-y border-white/5 overflow-hidden flex flex-col items-center">
            <div
                ref={containerRef}
                className="w-full max-w-[728px] relative flex justify-center transition-all duration-300"
                style={{ height: '90px' }}
            >
                <div
                    ref={bannerRef}
                    style={{ width: '728px', height: '90px' }}
                    className="bg-white/5 flex items-center justify-center rounded-lg shadow-lg border border-white/10 absolute top-0"
                >
                    {/* The script will inject the iframe here */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Signal Slot</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdBanner728;
