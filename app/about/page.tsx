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
                    className="premium-btn px-16 py-8 text-white text-[15px] font-bold uppercase font-mono flex items-center gap-4 h-[80px] min-w-[320px] justify-center shadow-2xl"
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
                    <div className="mb-32 md:mb-48 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-7 xl:col-span-8">
                            <h1
                                className="text-5xl md:text-7xl lg:text-[100px] font-extralight text-[var(--charcoal)] tracking-[-0.04em] leading-[0.9] uppercase"
                                style={{ fontFamily: 'var(--font-didone), serif' }}
                            >
                                Freight,<br />Managed With Precision.
                            </h1>
                        </div>
                        <div className="lg:col-span-5 xl:col-span-4 lg:pb-4">
                            <p className="text-[16px] md:text-[18px] font-medium text-[var(--charcoal)]/80 tracking-tight font-sans leading-[1.6]">
                                We coordinate temperature-controlled, dry van, and time-critical freight with a focus on disciplined execution, trusted visibility, and commercial reliability.
                            </p>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Values 3-Column Grid */}
                <FadeInUpBox delay={0.2}>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--charcoal)]/10 mb-20 md:mb-32 relative z-10"
                        onMouseLeave={() => setHoveredColumn(null)}
                    >
                        {/* Precision */}
                        <motion.div
                            className="pt-16 md:pt-20 pb-16 md:pr-12 md:border-r border-[var(--charcoal)]/10 flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(0)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 0 ? 0.3 : 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl md:text-[34px] font-light text-[var(--charcoal)] mb-6 uppercase tracking-[0.02em]"
                                    style={{ fontFamily: 'var(--font-didone), serif' }}
                                >
                                    Precision
                                </h2>
                                <p className="text-[var(--charcoal)]/80 text-[15px] md:text-base leading-[1.7] tracking-wide font-sans md:pr-4">
                                    Every shipment is coordinated with disciplined attention to routing, timing, and execution so complex moves stay controlled from planning through delivery.
                                </p>
                            </div>
                        </motion.div>

                        {/* Transparency */}
                        <motion.div
                            className="pt-16 md:pt-20 pb-16 md:px-12 md:border-r border-[var(--charcoal)]/10 flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(1)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 1 ? 0.3 : 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl md:text-[34px] font-light text-[var(--charcoal)] mb-6 uppercase tracking-[0.02em]"
                                    style={{ fontFamily: 'var(--font-didone), serif' }}
                                >
                                    Transparency
                                </h2>
                                <p className="text-[var(--charcoal)]/80 text-[15px] md:text-base leading-[1.7] tracking-wide font-sans md:pr-4">
                                    We prioritize visibility across milestones, costs, and shipment status so clients can make decisions with confidence, not assumptions.
                                </p>
                            </div>
                        </motion.div>

                        {/* Reliability */}
                        <motion.div
                            className="pt-16 md:pt-20 pb-16 md:pl-12 flex flex-col justify-between h-full cursor-default"
                            onMouseEnter={() => setHoveredColumn(2)}
                            animate={{ opacity: hoveredColumn !== null && hoveredColumn !== 2 ? 0.3 : 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div>
                                <h2
                                    className="text-3xl md:text-[34px] font-light text-[var(--charcoal)] mb-6 uppercase tracking-[0.02em]"
                                    style={{ fontFamily: 'var(--font-didone), serif' }}
                                >
                                    Reliability
                                </h2>
                                <p className="text-[var(--charcoal)]/80 text-[15px] md:text-base leading-[1.7] tracking-wide font-sans md:pr-4">
                                    We build dependable freight solutions through vetted carrier networks, clear communication, and consistent operational follow-through.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </FadeInUpBox>

                {/* Operating Model Section */}
                <FadeInUpBox delay={0.22}>
                    <div className="mb-24 md:mb-32 border-b border-[var(--charcoal)]/10 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                            <div className="lg:col-span-4">
                                <h2 
                                    className="text-[10px] font-mono tracking-[0.4em] font-bold text-[var(--maroon)] uppercase mb-6"
                                >
                                    OPERATING MODEL
                                </h2>
                                <h3 
                                    className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--charcoal)] leading-[1.1] uppercase"
                                    style={{ fontFamily: 'var(--font-didone), serif' }}
                                >
                                    Built for Modern<br />Freight Demands.
                                </h3>
                            </div>
                            <div className="lg:col-span-8 lg:pt-16">
                                <p className="text-[var(--charcoal)]/70 text-lg md:text-xl leading-[1.8] font-normal tracking-tight font-sans max-w-3xl">
                                    Our approach centers on operational discipline. By integrating specialized capacity with proactive monitoring, we solve the common trade-offs between precision and scale. Whether moving perishable goods or urgent retail inventory, we provide the grounded execution required to protect your commitments.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Narrative Section */}
                <FadeInUpBox delay={0.25}>
                    <div className="mb-32">
                        <h2
                            className="text-4xl md:text-6xl font-extralight text-[var(--charcoal)] mb-12 uppercase tracking-tight"
                            style={{ fontFamily: 'var(--font-didone), serif' }}
                        >
                            Built for High-Standards<br />Freight Operations.
                        </h2>
                        <div className="max-w-4xl">
                            <p className="text-[var(--charcoal)]/80 text-xl md:text-2xl leading-[1.6] font-normal tracking-tight font-sans">
                                Apex is designed for shippers who require more than just capacity. We provide disciplined execution across temperature-controlled, dry van, and time-critical freight requirements, ensuring your commitments are protected through every mile of the journey.
                            </p>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Capabilities Grid */}
                <FadeInUpBox delay={0.3}>
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-[1px] bg-[var(--maroon)]"></div>
                            <span className="text-[10px] font-mono tracking-[0.4em] font-bold text-[var(--charcoal)]/40 uppercase">04 / CAPABILITIES</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--charcoal)]/10">
                            {/* Capacity */}
                            <motion.div
                                className="text-center md:border-r border-[var(--charcoal)]/10 py-12 md:py-16 px-6"
                                whileHover={{ backgroundColor: "rgba(28, 28, 30, 0.02)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-4">CAPACITY</div>
                                <div className="text-lg md:text-xl font-bold text-[var(--text-charcoal)] leading-tight uppercase tracking-tight">TEMPERATURE-CONTROLLED &<br />DRY VAN</div>
                            </motion.div>
                            
                            {/* Service */}
                            <motion.div
                                className="text-center lg:border-r border-[var(--charcoal)]/10 py-12 md:py-16 px-6"
                                whileHover={{ backgroundColor: "rgba(28, 28, 30, 0.02)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-4">SERVICE</div>
                                <div className="text-lg md:text-xl font-bold text-[var(--text-charcoal)] leading-tight uppercase tracking-tight">TIME-CRITICAL &<br />EXPEDITED</div>
                            </motion.div>
                            
                            {/* Execution */}
                            <motion.div
                                className="text-center md:border-r border-[var(--charcoal)]/10 py-12 md:py-16 px-6"
                                whileHover={{ backgroundColor: "rgba(28, 28, 30, 0.02)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-4">EXECUTION</div>
                                <div className="text-lg md:text-xl font-bold text-[var(--text-charcoal)] leading-tight uppercase tracking-tight">DISCIPLINED CARRIER<br />COORDINATION</div>
                            </motion.div>
                            
                            {/* Trust */}
                            <motion.div
                                className="text-center py-12 md:py-16 px-6"
                                whileHover={{ backgroundColor: "rgba(28, 28, 30, 0.02)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--maroon)] font-bold mb-4">TRUST</div>
                                <div className="text-lg md:text-xl font-bold text-[var(--text-charcoal)] leading-tight uppercase tracking-tight">CLEAR MILESTONE<br />VISIBILITY</div>
                            </motion.div>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Footer CTA */}
                <FadeInUpBox delay={0.35}>
                    <div className="mt-32 pb-12 flex flex-col items-center justify-center text-center">
                        <p className="text-[13px] font-mono tracking-[0.3em] text-[var(--charcoal)]/40 uppercase mb-8">Ready to start a conversation?</p>
                        <WorkWithUsButton />
                    </div>
                </FadeInUpBox>
            </div>
        </div>
    );
}
