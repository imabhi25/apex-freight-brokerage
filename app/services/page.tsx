"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FadeInUpBox from "../components/FadeInUpBox";

const services = [
    {
        id: "01",
        title: "Full Truckload",
        abbr: "FTL",
        description: "Dedicated capacity across North America. We secure exclusive lanes for your freight — no co-mingling, no delays. Ideal for time-sensitive, high-volume moves.",
        specs: [
            "48 & 53-ft Dry Van",
            "Single-source accountability",
            "Real-time GPS tracking",
            "Guaranteed departure windows",
        ],
    },
    {
        id: "02",
        title: "Less Than Truckload",
        abbr: "LTL",
        description: "Strategic consolidation for partial loads. We optimize multi-stop lanes to reduce cost without sacrificing transit speed or cargo integrity.",
        specs: [
            "Pallet-level visibility",
            "Carrier-neutral routing",
            "Intermodal options available",
            "Industry-leading transit times",
        ],
    },
    {
        id: "03",
        title: "Specialized",
        abbr: "SPEC",
        description: "Engineering-grade solutions for oversize, heavy-haul, and temperature-sensitive freight. We manage permits, routing, and carrier compliance end to end.",
        specs: [
            "Flatbed & Step-Deck",
            "Refrigerated / Reefer",
            "Oversize permit coordination",
            "Hazmat-certified carriers",
        ],
    },
];

// Shared spring + ease config
const SPRING = { type: "spring", stiffness: 260, damping: 20, mass: 1 } as const;
const ELASTIC = [0.16, 1, 0.3, 1] as const;

// Outlined CTA button with kinetic stretch
function RequestRateButton() {
    const [hovered, setHovered] = useState(false);
    return (
        <Link href="/quote">
            <motion.div
                whileHover={{ scale: 1.03 }}
                transition={SPRING}
                className="inline-block"
            >
                <motion.button
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="premium-btn inline-flex items-center gap-3 px-8 py-4 text-white text-[12px] font-bold uppercase font-mono shadow-xl transition-all"
                >
                    <motion.span
                        animate={{ letterSpacing: hovered ? "0.2em" : "0.15em" }}
                        transition={{ duration: 0.5, ease: ELASTIC }}
                    >
                        Request a Quote
                    </motion.span>
                    <motion.span
                        animate={{ x: hovered ? 4 : 0 }}
                        transition={SPRING}
                        className="inline-block"
                    >
                        →
                    </motion.span>
                </motion.button>
            </motion.div>
        </Link>
    );
}

// Bottom CTA button — spring-unified
function StartQuoteButton() {
    const [hovered, setHovered] = useState(false);
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={SPRING}
            className="inline-block"
        >
            <motion.button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="premium-btn px-16 py-8 text-white text-[15px] font-bold uppercase font-mono shadow-2xl"
            >
                <motion.span
                    animate={{ letterSpacing: hovered ? "0.25em" : "0.15em" }}
                    transition={{ duration: 0.5, ease: ELASTIC }}
                    className="inline-block"
                >
                    Start Your Quote
                </motion.span>
            </motion.button>
        </motion.div>
    );
}

export default function ServicesPage() {
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-white pt-40 pb-24 px-6 flex flex-col items-center text-left font-sans text-[var(--charcoal)]">
            <div className="w-full max-w-7xl">

                {/* Hero */}
                <FadeInUpBox delay={0.1}>
                    <div className="mb-24 bg-white px-6 pt-24 pb-16 mt-[-160px] relative">
                        <h1
                            className="text-6xl md:text-8xl lg:text-[140px] font-extralight text-[var(--charcoal)] tracking-[-0.05em] leading-[0.85] uppercase mb-12"
                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                        >
                            Capabilities.
                        </h1>
                        <p className="text-[var(--charcoal)]/30 text-lg md:text-xl font-light tracking-[0.3em] uppercase font-mono max-w-2xl leading-relaxed">
                            "Absolute precision across every discipline."
                        </p>
                    </div>
                </FadeInUpBox>

                {/* 3-Column Grid with Focus Hover */}
                <FadeInUpBox delay={0.2}>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--light-gray)]"
                        onMouseLeave={() => setHoveredColumn(null)}
                    >
                        {services.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                onMouseEnter={() => setHoveredColumn(idx)}
                                animate={{
                                    opacity: hoveredColumn !== null && hoveredColumn !== idx ? 0.4 : 1,
                                    scale: hoveredColumn === idx ? 1.02 : 1,
                                    y: hoveredColumn === idx ? -8 : 0,
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className={`pt-24 pb-24 flex flex-col justify-between cursor-default bg-white ${idx === 0 ? "md:pr-12 md:border-r border-[var(--light-gray)]" : ""
                                    } ${idx === 1 ? "md:px-12 md:border-r border-[var(--light-gray)]" : ""
                                    } ${idx === 2 ? "md:pl-12" : ""
                                    }`}
                            >
                                {/* Top: ID + Title */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-start gap-5">
                                        <span className="text-[var(--charcoal)]/20 font-mono text-[10px] tracking-[0.35em] pt-1 shrink-0">
                                            {service.id}
                                        </span>
                                        <div>
                                            <p className="text-[10px] font-mono tracking-[0.35em] text-[var(--muted-gray)] uppercase mb-3">
                                                {service.abbr}
                                            </p>
                                            <h2
                                                className="text-2xl md:text-3xl font-light text-[var(--text-charcoal)] uppercase tracking-tight"
                                                style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                                            >
                                                {service.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Slightly larger desc text */}
                                    <p className="text-[var(--charcoal)]/60 text-[15px] md:text-base leading-[1.85] tracking-wide font-light">
                                        {service.description}
                                    </p>

                                    {/* Spec List */}
                                    <ul className="border-t border-[var(--light-gray)] pt-8 space-y-4">
                                        {service.specs.map((spec) => (
                                            <li key={spec} className="group/spec flex items-center gap-3">
                                                {/* Square bullet — aligns via flex items-center */}
                                                <motion.span
                                                    animate={{
                                                        backgroundColor: hoveredColumn === idx
                                                            ? "var(--maroon)"
                                                            : "var(--charcoal)",
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-[5px] h-[5px] shrink-0 opacity-20"
                                                />
                                                <span className="text-[12px] font-mono text-[var(--charcoal)]/50 tracking-[0.15em] uppercase leading-none">
                                                    {spec}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Bottom: outlined CTA button */}
                                <div className="mt-14">
                                    <RequestRateButton />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </FadeInUpBox>

                {/* Bottom CTA */}
                <FadeInUpBox delay={0.3}>
                    <div className="mt-20 md:mt-28 border-t border-[var(--light-gray)] pt-16 flex flex-col md:flex-row justify-between items-start gap-12">
                        <p
                            className="text-4xl md:text-6xl font-extralight text-[var(--charcoal)] tracking-tight leading-tight uppercase max-w-2xl"
                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                        >
                            Ready to move with precision?
                        </p>
                        <div className="flex items-center">
                            <Link href="/quote">
                                <StartQuoteButton />
                            </Link>
                        </div>
                    </div>
                </FadeInUpBox>

            </div>
        </div>
    );
}
