"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Truck, Globe, Shield, Clock, PackageCheck, ShieldCheck, Snowflake } from "lucide-react";
import Image from "next/image";

const services = [
    {
        id: "dry-van",
        title: "Dry Van",
        icon: Truck,
        description: "Dependable capacity for standard freight across primary North American lanes.",
        image: "/services/user-truck-1.jpg",
        bgPosition: "object-center"
    },
    {
        id: "temp-controlled",
        title: "Temperature-Controlled",
        icon: Snowflake,
        description: "Disciplined execution for sensitive shipments requiring strict climate maintenance.",
        image: "/services/user-warehouse.jpg",
        bgPosition: "object-center"
    },
    {
        id: "expedited",
        title: "Expedited",
        icon: Clock,
        description: "Time-sensitive shipment support when practical execution and speed are critical.",
        image: "/services/user-truck-2.jpg",
        bgPosition: "object-center"
    },
    {
        id: "specialized",
        title: "Specialized",
        icon: ShieldCheck,
        description: "Coordinated transport for flatbed, step-deck, and oversized freight requirements.",
        image: "/services/user-heavy-haul.jpg",
        bgPosition: "object-[80%_50%]"
    }
];

export default function ServiceShowcase() {
    const [activeIdx, setActiveIdx] = useState(0);
    // Track intentional hover separately from current visual active state
    const [hoverIntent, setHoverIntent] = useState<number | null>(null);
    // Track second-level deep interaction on the "Explore" link
    const [hoveredExploreIdx, setHoveredExploreIdx] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (idx: number) => {
        setHoverIntent(idx);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Require 300ms of stable hover before switching the heavy background & layout to prevent flickering
        timeoutRef.current = setTimeout(() => {
            setActiveIdx(idx);
        }, 300);
    };

    const handleMouseLeave = () => {
        setHoverIntent(null);
        setHoveredExploreIdx(null); // Clear explore hover when leaving card
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // Suppress rapid mobile taps from causing jank
    const handleTap = (idx: number) => {
        if (idx === activeIdx) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveIdx(idx);
    };

    const cinematicEase: any = [0.25, 1, 0.5, 1]; // Smooth, low bounce, premium ease out
    const fadeEase: any = [0.4, 0, 0.2, 1];

    return (
        <section className="relative w-full min-h-screen md:min-h-0 md:h-[800px] overflow-hidden bg-white flex flex-col justify-end">

            {/* 
              Background Visuals 
              Using a sophisticated multi-stop eased mask to ensure a mathematically 
              seamless dissolve into white. This eliminates the "gray band" effect 
              by lengthening the transition and softening the falloff at the edges.
            */}
            <div
                className="absolute inset-0 z-0 bg-black"
                style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0.5) 22%, black 35%, black 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0.05) 95%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0.5) 22%, black 35%, black 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0.05) 95%, transparent 100%)'
                }}
            >
                {services.map((service, idx) => {
                    const isActiveBg = activeIdx === idx;
                    return (
                        <motion.div
                            key={service.id}
                            className="absolute inset-0 w-full h-full"
                            initial={false}
                            animate={{
                                opacity: isActiveBg ? 0.9 : 0,
                                scale: isActiveBg ? 1.05 : 1.1 // Very subtle ambient scale difference to prevent motion stop
                            }}
                            transition={{
                                opacity: { duration: 1.5, ease: fadeEase }, // Longer 1.5s premium crossfade
                                scale: { duration: 15, ease: "linear" }
                            }}
                            style={{ pointerEvents: 'none', zIndex: isActiveBg ? 1 : 0 }}
                        >
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className={`object-cover ${service.bgPosition}`}
                                priority={idx === 0} // Only prioritize first load
                            />
                        </motion.div>
                    );
                })}

                {/* Refined Overlays - Clean, uniform tint with a rich bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none transition-opacity duration-1500" />
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-20 h-full flex flex-col justify-end pb-12 md:pb-24 pt-24 md:pt-32">

                {/* Header Section */}
                <div className="mb-8 md:mb-16 max-w-2xl pointer-events-none pt-20 md:pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: cinematicEase }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[var(--maroon)]" />
                            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/90 drop-shadow-md">OPERATIONAL FOCUS</span>
                        </div>
                        <h2 className="mb-4 uppercase text-white font-light tracking-tight text-4xl md:text-5xl drop-shadow-lg">FREIGHT SOLUTIONS</h2>
                        <p className="text-white/80 text-base md:text-lg max-w-lg font-light leading-relaxed drop-shadow-md">
                            Built for shippers who value responsive communication, disciplined coordination, and dependable freight movement across key lanes.
                        </p>
                    </motion.div>
                </div>

                {/* Interactive Cards Container - Fixed Height to prevent layout shift */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative h-[450px] md:h-[400px]">
                    {services.map((service, idx) => {
                        const isActive = activeIdx === idx;
                        const isIntent = hoverIntent === idx;
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.id}
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleTap(idx)}
                                layout="position" // Only animate position, not dimensions causing reflows
                                animate={{
                                    backgroundColor: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(28, 28, 30, 0.4)', // var(--charcoal) at 40%
                                    borderColor: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)',
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: cinematicEase
                                }}
                                className={`group relative overflow-hidden cursor-pointer flex flex-col justify-end backdrop-blur-md border-t border-white/10 transition-all duration-700 ease-[0.16,1,0.3,1]
                                           ${isActive
                                        ? (hoveredExploreIdx === idx
                                            ? 'bg-white shadow-[0_50px_100px_-10px_rgba(0,0,0,0.6)] z-10 scale-[1.02] -translate-y-4'
                                            : 'bg-white shadow-[0_40px_80px_-10px_rgba(0,0,0,0.5)] z-10 -translate-y-2')
                                        : 'bg-[var(--charcoal)]/30 hover:bg-[var(--charcoal)]/50 hover:-translate-y-1'
                                    }`}
                                style={{
                                    height: '100%',
                                    borderRadius: '0px' // Architectural sharp corners
                                }}
                            >
                                {/* Strong Top Rule - The Signature Detail */}
                                <motion.div
                                    animate={{
                                        height: isActive ? '6px' : '1px',
                                        backgroundColor: isActive ? 'var(--maroon)' : 'rgba(255,255,255,0.1)'
                                    }}
                                    className="absolute top-0 left-0 w-full z-20"
                                />

                                <div className="p-8 md:p-10 flex flex-col h-full">
                                    {/* Icon & Index Area */}
                                    <div className="flex justify-between items-start mb-12">
                                        <motion.div
                                            animate={{
                                                color: isActive ? 'var(--maroon)' : 'rgba(255,255,255,0.4)',
                                            }}
                                            className="transform origin-left"
                                        >
                                            <Icon className="w-6 h-6 md:w-7 md:h-7 stroke-[1.5px]" />
                                        </motion.div>
                                        <span className={`font-mono text-[10px] tracking-[0.3em] font-bold ${isActive ? 'text-[var(--charcoal)]/30' : 'text-white/20'}`}>
                                            0{idx + 1}
                                        </span>
                                    </div>

                                    {/* Content Area */}
                                    <div className="mt-auto">
                                        <motion.h3
                                            animate={{
                                                color: isActive ? 'var(--charcoal)' : 'rgba(255,255,255,0.95)',
                                            }}
                                            className="text-2xl md:text-3xl font-medium tracking-tighter mb-4 uppercase"
                                        >
                                            {service.title}
                                        </motion.h3>

                                        <div className="relative h-[120px] overflow-hidden">
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        key={`content-${service.id}`}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={{
                                                            hidden: { opacity: 0, y: 10 },
                                                            visible: {
                                                                opacity: 1,
                                                                y: 0,
                                                                transition: {
                                                                    staggerChildren: 0.1,
                                                                    delayChildren: 0.1
                                                                }
                                                            },
                                                            exit: {
                                                                opacity: 0,
                                                                y: 10,
                                                                transition: { duration: 0.3 }
                                                            }
                                                        }}
                                                        className="absolute inset-0 flex flex-col justify-between"
                                                    >
                                                        <motion.p
                                                            variants={{
                                                                hidden: { opacity: 0, y: 10 },
                                                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cinematicEase } }
                                                            }}
                                                            className="text-[var(--charcoal)]/70 font-light text-[15px] leading-relaxed max-w-xs"
                                                        >
                                                            {service.description}
                                                        </motion.p>

                                                        <motion.div
                                                            variants={{
                                                                hidden: { opacity: 0, y: 10 },
                                                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cinematicEase } }
                                                            }}
                                                            className="mt-4"
                                                        >
                                                            <a
                                                                href="/services"
                                                                onMouseEnter={() => setHoveredExploreIdx(idx)}
                                                                onMouseLeave={() => setHoveredExploreIdx(null)}
                                                                className="group/link inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--maroon)]"
                                                            >
                                                                <span className="relative">
                                                                    Explore
                                                                    <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-[var(--maroon)] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left" />
                                                                </span>
                                                                <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-2 transition-transform duration-500" />
                                                            </a>
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
