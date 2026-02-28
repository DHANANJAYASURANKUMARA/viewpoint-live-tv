"use client";

import React, { useEffect } from 'react';

const SocialBarAd = () => {
    useEffect(() => {
        // Check if the script is already present
        const existingScript = document.querySelector('script[src="https://pl28812573.effectivegatecpm.com/f0/78/47/f07847ca5dbd57154268439a5fb34e38.js"]');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://pl28812573.effectivegatecpm.com/f0/78/47/f07847ca5dbd57154268439a5fb34e38.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                // Cleanup script if necessary, though social bar scripts usually 
                // create global side effects that are hard to fully clean up
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, []);

    return null; // This component doesn't render any UI themselves, just injects the script
};

export default SocialBarAd;
