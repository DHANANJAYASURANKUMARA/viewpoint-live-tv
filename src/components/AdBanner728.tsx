"use client";

import React, { useEffect, useRef } from 'react';

const AdBanner728 = () => {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bannerRef.current && !bannerRef.current.firstChild) {
            const script1 = document.createElement('script');
            script1.innerHTML = `
        atOptions = {
          'key' : '2dd2ac378fb6daf67f65d1e16b202bb0',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
            bannerRef.current.appendChild(script1);

            const script2 = document.createElement('script');
            script2.src = 'https://www.highperformanceformat.com/2dd2ac378fb6daf67f65d1e16b202bb0/invoke.js';
            script2.async = true;
            bannerRef.current.appendChild(script2);
        }
    }, []);

    return (
        <div className="w-full flex justify-center py-8 bg-vpoint-dark/30 border-y border-white/5">
            <div
                ref={bannerRef}
                style={{ width: '728px', height: '90px' }}
                className="bg-white/5 flex items-center justify-center overflow-hidden rounded-lg shadow-lg border border-white/10"
            >
                {/* Ad will be injected here */}
                <span className="text-[10px] font-bold text-white/5 uppercase tracking-[0.3em]">Neural Transmission Slot</span>
            </div>
        </div>
    );
};

export default AdBanner728;
