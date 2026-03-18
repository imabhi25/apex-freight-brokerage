"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FadeInUpBox from "../components/FadeInUpBox";
import { Snowflake, Truck, Clock, ArrowRight } from "lucide-react";

// Image local paths: instructions will be given to the user to place their uploaded images here.
const services = [
    {
        id: "01",
        abbr: "TEMP",
        title: "Cold Chain, Handled With Precision",
        icon: Snowflake,
        description: "Dedicated reefer capacity for produce, pharmaceuticals, and other temperature-sensitive freight, with monitored handling that protects compliance from pickup through delivery.",
        supportLine: "Built for shippers moving sensitive freight where timing, handling, and temperature control matter.",
        badge: "Temperature-Controlled",
        cta: "SECURE REEFER CAPACITY",
        specs: [
            "53-FT REFRIGERATED TRAILERS",
            "PRODUCE & PERISHABLES",
            "PHARMACEUTICAL & HEALTHCARE",
            "CONTINUOUS TEMPERATURE MONITORING",
        ],
        image: "/images/reefer-interior.jpg",
        imageAlt: "Inside of a refrigerated semi-trailer",
        layout: "text-left" // text on left, image on right
    },
    {
        id: "02",
        abbr: "VAN",
        title: "Dry Van Capacity Across Key Lanes",
        icon: Truck,
        description: "Reliable dry van capacity across key North American lanes for consumer goods, retail, and manufacturing freight, with disciplined execution and consistent service.",
        badge: "53-FT DRY VAN",
        cta: "SECURE DRY VAN CAPACITY",
        specs: [
            "53-FT DRY VAN CAPACITY",
            "CONSISTENT LANE COMMITMENTS",
            "DROP-TRAILER CAPABILITIES",
            "REAL-TIME TRACKING VISIBILITY",
        ],
        image: "/images/dry-van.png",
        imageAlt: "Open dry van truck trailer",
        layout: "image-left" // image on left, text on right
    },
    {
        id: "03",
        abbr: "EXP",
        title: "Time-Critical Freight",
        icon: Clock,
        description: "Expedited freight solutions for urgent shipments, with responsive coverage and disciplined execution for sensitive delivery schedules.",
        badge: "TIME-CRITICAL",
        cta: "REQUEST EXPEDITED CAPACITY",
        specs: [
            "PRIORITY SCHEDULING",
            "EXPEDITED LTL SHIPMENTS",
            "SENSITIVE DELIVERY WINDOWS",
            "RAPID CAPACITY RESPONSE",
        ],
        image: "/images/expedited-truck.jpg",
        imageAlt: "Red semi truck on highway",
        layout: "text-left" // text on left, image on right
    }
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6] pt-24 md:pt-32 pb-24 text-[var(--charcoal)] font-sans selection:bg-[var(--maroon)] selection:text-white">
            <div className="max-w-[1300px] w-full mx-auto px-6 md:px-12">

                <FadeInUpBox delay={0.1}>
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16 border-b border-[var(--charcoal)]/5 pb-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4 text-[var(--charcoal)]/40">
                                SERVICES / 01
                            </span>
                            <h1 className="text-2xl md:text-3xl lg:text-[40px] font-light leading-tight tracking-tight mb-0 text-[var(--charcoal)] shrink-0" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
                                FREIGHT CAPABILITIES
                            </h1>
                        </div>
                        <p className="text-[15px] md:text-[16px] font-light text-[var(--charcoal)]/60 max-w-[340px] leading-relaxed md:text-right md:pb-1">
                            Built around temperature-controlled and dry van capacity across key freight lanes.
                        </p>
                    </div>
                </FadeInUpBox>

                {/* Service Sections */}
                <div className="flex flex-col w-full">
                    {services.map((service, index) => {
                        // For mobile, default to natural stacking. Only alternate order on large screens.
                        const isTextLeft = service.layout === "text-left";

                        return (
                            <FadeInUpBox key={service.id} delay={0.2 + (index * 0.1)}>
                                <div className={`group grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start mb-16 pb-16 ${index !== services.length - 1 ? "border-b border-[var(--charcoal)]/10 transition-colors duration-700 hover:border-[var(--charcoal)]/20" : ""}`}>

                                    {/* Text Block */}
                                    <div className={`flex flex-col lg:col-span-6 pt-2 ${!isTextLeft ? "lg:order-2" : "lg:order-1"}`}>

                                        {/* Icon & Label Row */}
                                        <div className="flex items-center gap-4 mb-8">
                                            <service.icon className="w-5 h-5 stroke-[1.5] text-[var(--charcoal)]/60 group-hover:text-[var(--charcoal)] transition-colors duration-500" />
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono tracking-[0.25em] font-semibold text-[var(--charcoal)]/60 group-hover:text-[var(--charcoal)]/90 uppercase border-b border-[var(--charcoal)]/60 group-hover:border-[var(--charcoal)]/90 transition-colors duration-500 pb-0.5">
                                                    {service.abbr}
                                                </span>
                                                <span className="text-[10px] font-mono tracking-widest text-[var(--charcoal)]/30 group-hover:text-[var(--charcoal)]/50 transition-colors duration-500">
                                                    {service.id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h2
                                            className="text-4xl md:text-5xl lg:text-[52px] font-light leading-[1.1] tracking-tight mb-5 text-[var(--charcoal)]/90 group-hover:text-[var(--charcoal)] transition-colors duration-500"
                                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                                        >
                                            {index === 0 ? (
                                                <span className="block max-w-[600px]">
                                                    COLD CHAIN, HANDLED<br />
                                                    WITH PRECISION
                                                </span>
                                            ) : index === 1 ? (
                                                <span className="block max-w-[600px]">
                                                    DRY VAN CAPACITY<br />
                                                    ACROSS KEY LANES
                                                </span>
                                            ) : (
                                                <span className="block max-w-[600px]">
                                                    TIME-CRITICAL<br />
                                                    FREIGHT
                                                </span>
                                            )}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-[15px] leading-[1.8] font-light text-[var(--charcoal)]/60 group-hover:text-[var(--charcoal)]/80 transition-colors duration-500 mb-2">
                                            {service.description}
                                        </p>

                                        {/* Support Line (Optional) */}
                                        {service.supportLine && (
                                            <p className="text-[12.5px] font-sans text-[var(--charcoal)]/60 mb-6 leading-relaxed font-medium">
                                                {service.supportLine}
                                            </p>
                                        )}

                                        {/* Divider */}
                                        <div className="w-full h-[1px] bg-[var(--charcoal)]/10 group-hover:bg-[var(--charcoal)]/15 transition-colors duration-500 mb-6"></div>

                                        {/* Bullet Specs */}
                                        <ul className="flex flex-col gap-3.5 mb-10">
                                            {service.specs.map((spec, i) => (
                                                <li key={i} className="flex items-center gap-4">
                                                    <span className="w-1 h-1 bg-[var(--charcoal)]/50 group-hover:bg-[var(--maroon)]/80 transition-colors duration-500 rounded-full shrink-0"></span>
                                                    <span className="text-[11px] md:text-[13px] font-mono uppercase tracking-[0.05em] font-black text-[var(--charcoal)]/90 group-hover:text-[var(--charcoal)] transition-colors duration-500">
                                                        {spec}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Button */}
                                        <div className="mt-auto">
                                            <Link href="/quote">
                                                <button
                                                    className="premium-btn group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-white font-bold uppercase tracking-[0.2em] text-[11px] sm:text-[12px] shadow-2xl"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        {service.cta || "REQUEST A QUOTE"}
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-[5px] transition-transform duration-[320ms] ease-[0.25,1,0.5,1]" />
                                                    </span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Image Block */}
                                    <div className={`mt-12 lg:mt-0 lg:col-span-6 ${!isTextLeft ? "lg:order-1" : "lg:order-2"}`}>
                                        {/* Taller, more editorial aspect ratio */}
                                        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--charcoal)]/5 h-full min-h-[500px] max-h-[700px] border border-[var(--charcoal)]/[0.08] shadow-[0_12px_40px_rgb(28,28,30,0.08)] group-hover:shadow-[0_20px_60px_rgb(28,28,30,0.12)] rounded-[8px] transition-all duration-[1000ms] ease-[0.25,1,0.4,1]">
                                            <img
                                                src={service.image}
                                                alt={service.imageAlt}
                                                className="absolute inset-0 w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-[1.03] duration-[1200ms] ease-[0.25,1,0.4,1] transition-all"
                                            />
                                            {service.badge && (
                                                <div className={`absolute bg-white/95 backdrop-blur-md px-6 py-3 border border-[var(--charcoal)]/10 shadow-lg z-20 ${
                                                    index === 0 ? "top-8 right-8" : 
                                                    index === 1 ? "bottom-8 right-8" : 
                                                    "top-8 left-8"
                                                }`}>
                                                    <span className="text-[10px] font-mono tracking-[0.15em] font-bold text-[var(--charcoal)] uppercase">{service.badge}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </FadeInUpBox>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
