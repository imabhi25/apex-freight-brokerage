"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FadeInUpBox from "../components/FadeInUpBox";

const SPRING = { type: "spring", stiffness: 260, damping: 20, mass: 1 } as const;
const ELASTIC = [0.16, 1, 0.3, 1] as const;

function WorkWithUsButton() {
    const [hovered, setHovered] = useState(false);
    return (
        <Link href="/contact" className="no-underline">
            <motion.div whileHover={{ scale: 1.03 }} transition={SPRING} className="inline-block">
                <motion.button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="px-12 py-6 bg-[var(--maroon)] shadow-xl hover:bg-[var(--maroon-hover)] text-white text-[15px] font-bold uppercase font-mono flex items-center gap-4 h-[80px] min-w-[320px] justify-center transition-all rounded-xl"
                >
                    <motion.span
                        animate={{ letterSpacing: hovered ? "0.2em" : "0.2em" }}
                        transition={{ duration: 0.5, ease: ELASTIC }}
                        className="inline-block"
                    >
                        WORK WITH US
                    </motion.span>
                </motion.button>
            </motion.div>
        </Link>
    );
}

export default function About() {
    const [hoveredColumn, setHoveredColumn] = React.useState<number | null>(null);

    return (
        <div className="min-h-screen bg-white pt-40 pb-24 px-6 flex flex-col items-center text-left font-sans transition-colors duration-500 relative overflow-hidden">
            <div className="w-full max-w-7xl relative z-10">
                {/* Header Section */}
                <FadeInUpBox delay={0.1}>
                    <div className="mb-16 md:mb-24">
                        <h1
                            className="text-6xl md:text-8xl lg:text-[120px] font-extralight text-[var(--charcoal)] tracking-tight leading-[0.9] uppercase mb-12"
                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                        >
                            Logistics,<br />Redefined.
                        </h1>
                        <p className="text-[var(--charcoal)]/40 text-lg md:text-2xl font-light tracking-[0.2em] uppercase font-mono max-w-3xl leading-relaxed">
                            "ABSOLUTE CERTAINTY IN AN UNCERTAIN WORLD."
                        </p>
                    </div>
                </FadeInUpBox>

                {/* Values 3-Column Grid */}
                <FadeInUpBox delay={0.2}>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--light-gray)] mb-16 md:mb-24 relative z-10"
                        onMouseLeave={() => setHoveredColumn(null)}
                    >
                        {/* Precision */}
                        <motion.div
                            className="pt-12 pb-16 md:pr-12 md:border-r border-[var(--light-gray)] flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(0)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 0 ? 0.4 : 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl font-light text-[var(--text-charcoal)] mb-8 uppercase tracking-tight"
                                    style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                                >
                                    Precision
                                </h2>
                                <p className="text-[var(--text-charcoal)]/60 text-base md:text-lg leading-relaxed tracking-wide font-light">
                                    Every movement is engineered for absolute accuracy. We leverage advanced predictive
                                    analytics and live data streams to orchestrate complex supply chains with surgical
                                    attention to detail.
                                </p>
                            </div>
                        </motion.div>

                        {/* Transparency */}
                        <motion.div
                            className="pt-12 pb-16 md:px-12 md:border-r border-[var(--light-gray)] flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(1)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 1 ? 0.4 : 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl font-light text-[var(--text-charcoal)] mb-8 uppercase tracking-tight"
                                    style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                                >
                                    Transparency
                                </h2>
                                <p className="text-[var(--text-charcoal)]/60 text-base md:text-lg leading-relaxed tracking-wide font-light">
                                    Trust is built through visibility. Our platform provides uncompromising clarity
                                    into every mile, milestone, and cost, ensuring that performance is measurable
                                    and data is indisputable.
                                </p>
                            </div>
                        </motion.div>

                        {/* Reliability */}
                        <motion.div
                            className="pt-12 pb-16 md:pl-12 flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(2)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 2 ? 0.4 : 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl font-light text-[var(--text-charcoal)] mb-8 uppercase tracking-tight"
                                    style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                                >
                                    Reliability
                                </h2>
                                <p className="text-[var(--text-charcoal)]/60 text-base md:text-lg leading-relaxed tracking-wide font-light">
                                    We operate in the space where certainty meets speed. Our network is vetted
                                    for excellence, providing a fail-safe infrastructure that delivers consistent
                                    results in an ever-shifting global market.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </FadeInUpBox>

                {/* Narrative Section */}
                <FadeInUpBox delay={0.25}>
                    <div className="mb-24">
                        <h2
                            className="text-5xl md:text-7xl font-extralight text-[var(--text-charcoal)] mb-12 uppercase tracking-tighter"
                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                        >
                            Built for the Bold.
                        </h2>
                        <div className="max-w-4xl">
                            <p className="text-[var(--text-charcoal)]/70 text-lg md:text-2xl leading-[1.8] font-light tracking-wide font-light">
                                We don't just move freight; we move economies. Apex was founded on the belief that logistics
                                should be a competitive advantage, not a secondary concern. Our partners are visionaries
                                who demand more than just transportation—they demand a standard of excellence that scales
                                with their ambition.
                            </p>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Stats Row */}
                <FadeInUpBox delay={0.3}>
                    {/* Managed Value */}
                    <motion.div
                        className="text-center md:border-r border-[var(--light-gray)] last:border-0 py-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-2">ONBOARDING</div>
                        <div className="text-xl font-bold text-[var(--text-charcoal)] px-4">PREPARING FOR OPERATIONS</div>
                    </motion.div>
                    {/* Carrier Network */}
                    <motion.div
                        className="text-center md:border-r border-[var(--light-gray)] last:border-0 py-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-2">PARTNERSHIPS</div>
                        <div className="text-xl font-bold text-[var(--text-charcoal)] px-4">ACCEPTING CARRIER INQUIRIES</div>
                    </motion.div>
                    {/* Support */}
                    <motion.div
                        className="text-center md:border-r border-[var(--light-gray)] last:border-0 py-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-2">SUPPORT</div>
                        <div className="text-xl font-bold text-[var(--text-charcoal)] px-4">DIRECT COORDINATION READY</div>
                    </motion.div>
                    {/* Quotes */}
                    <motion.div
                        className="text-center md:border-r border-[var(--light-gray)] last:border-0 py-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-2">QUOTES</div>
                        <div className="text-xl font-bold text-[var(--text-charcoal)] px-4">REQUESTS WELCOME DURING LAUNCH</div>
                    </motion.div>
                </FadeInUpBox>

                {/* Footer CTA */}
                <FadeInUpBox delay={0.35}>
                    <div className="mt-20 flex justify-center md:justify-end">
                        <WorkWithUsButton />
                    </div>
                </FadeInUpBox>
            </div>
        </div>
    );
}
