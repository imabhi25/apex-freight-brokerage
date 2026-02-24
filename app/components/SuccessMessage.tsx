"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SuccessMessageProps {
    variant?: 'carrier' | 'quote' | 'contact';
    headline: string;
    subtext: string;
    referenceId?: string;
    onReset?: () => void;
}

export default function SuccessMessage({
    variant = "quote",
    headline,
    subtext,
    referenceId,
    onReset
}: SuccessMessageProps) {
    const [typedRefId, setTypedRefId] = useState("");

    useEffect(() => {
        if (!referenceId) return;
        let i = 0;
        const interval = setInterval(() => {
            setTypedRefId(referenceId.slice(0, i + 1));
            i++;
            if (i >= referenceId.length) clearInterval(interval);
        }, 70);
        return () => clearInterval(interval);
    }, [referenceId]);

    const isCarrier = variant === 'carrier';
    const isContact = variant === 'contact';
    const isQuote = variant === 'quote';

    const resetLabel = isCarrier
        ? "Submit Another Application"
        : isQuote
            ? "Request Another Quote"
            : "Send Another Message";

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, mass: 1 }}
            className="min-h-[80vh] flex flex-col justify-center items-center text-center py-24 px-6 max-w-4xl mx-auto"
        >
            {/* Pulsing Emerald Green Dot for Carrier */}
            <div className="flex items-center gap-4 mb-10">
                {(isCarrier || isContact || isQuote) && (
                    <div className="relative flex items-center justify-center">
                        <div className={`w-3 h-3 ${isCarrier ? "bg-emerald-500" : "bg-[var(--maroon)]"} rounded-full animate-pulse`} />
                        <div className={`absolute w-6 h-6 border-2 ${isCarrier ? "border-emerald-500/30" : "border-[var(--maroon)]/30"} rounded-full animate-ping`} />
                    </div>
                )}
                <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[var(--text-secondary-label)]">
                    {isCarrier ? "AI-ENGINE: PROCESSING" : isQuote ? "ROUTING ENGINE: SUCCESS" : "MESSAGE TERMINAL: LOGGED"}
                </span>
            </div>

            {/* Main Heading */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--charcoal)] mb-12 leading-none uppercase"
                style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
            >
                {headline}
            </motion.h2>

            {/* Monospaced Receipt ID */}
            {referenceId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--charcoal)]/40 block mb-2">DIGITAL RECEIPT</span>
                    <span className="text-2xl md:text-3xl font-mono tracking-tighter text-[var(--charcoal)] bg-[var(--maroon)]/5 px-6 py-3 border border-[var(--maroon)]/10">
                        {typedRefId}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-1.5 h-6 ml-2 bg-[var(--maroon)] vertical-middle"
                        />
                    </span>
                </motion.div>
            )}

            {/* Body Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-[var(--charcoal)]/60 text-lg md:text-xl font-sans leading-relaxed max-w-2xl mb-16 tracking-wide"
            >
                {subtext}
            </motion.p>

            {/* Interactive Actions */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="flex flex-col items-center gap-8"
            >
                <button
                    onClick={onReset}
                    className="premium-btn min-w-[320px] text-white py-6 px-12 uppercase font-bold font-mono tracking-[0.2em] text-[15px] shadow-xl"
                >
                    {resetLabel}
                </button>

                <Link
                    href="/"
                    className="text-[11px] font-mono font-bold tracking-[0.4em] uppercase text-[var(--charcoal)]/40 hover:text-[var(--maroon)] transition-colors"
                >
                    Return to Home
                </Link>
            </motion.div>
        </motion.div>
    );
}

