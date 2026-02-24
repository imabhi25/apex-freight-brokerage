"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-10"
            >
                {/* Error code tag */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex items-center gap-3"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white/50" />
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">
                        System Error — Node Not Found
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[110px] font-extralight text-white tracking-tight leading-[0.9] uppercase"
                    style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                >
                    404:<br />Route<br />Unavailable.
                </motion.h1>

                {/* Sub-text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.8 }}
                    className="text-white/40 text-[13px] font-mono uppercase tracking-[0.25em] max-w-sm leading-relaxed"
                >
                    The requested logistics route is currently unavailable.
                </motion.p>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-px w-32 bg-white/10 origin-center"
                />

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85, duration: 0.8 }}
                >
                    <Link href="/">
                        <button
                            className="text-[13px] font-bold tracking-[0.4em] uppercase font-mono text-white/50 hover:text-white transition-all duration-500 hover:scale-105 hover:tracking-[0.5em] origin-center"
                        >
                            Return to Terminal
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
