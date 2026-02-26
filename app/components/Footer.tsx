"use client";

import React from "react";
import FadeInUpBox from "./FadeInUpBox";

const Footer = () => {
    return (
        <footer className="w-full bg-[var(--charcoal)] px-6 pb-20 md:pb-32 flex justify-center text-left text-white relative z-50">
            <div className="w-full max-w-7xl">
                <FadeInUpBox delay={0.2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 py-12 md:py-16 text-left">
                        {/* Branding Column */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
                                    APEX
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500" />
                                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/40">
                                        SYSTEM STATUS: OPERATIONAL
                                    </span>
                                </div>
                            </div>
                            <p className="text-white/50 text-[14px] font-sans leading-relaxed max-w-xs">
                                Pioneering next-generation freight solutions. Combining precision logistics with cutting-edge technology to move the world&apos;s most critical assets.
                            </p>
                        </div>

                        {/* Platform Column */}
                        <div className="space-y-6 md:space-y-8 md:text-center flex flex-col md:items-center">
                            <h3 className="text-[11px] font-bold tracking-[0.4em] font-mono uppercase text-white/30">
                                PLATFORM
                            </h3>
                            <nav className="flex flex-col gap-3 md:gap-4">
                                {[
                                    { name: "DASHBOARD", href: "/" },
                                    { name: "CARRIER LOGIN", href: "/carrier" },
                                    { name: "SHIPPER PORTAL", href: "/quote" },
                                    { name: "SYSTEM STATUS", href: "/contact" }
                                ].map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-[13px] text-white/50 hover:text-[var(--maroon)] font-mono tracking-[0.2em] transition-colors w-fit md:mx-auto"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Solutions & Legal Column */}
                        <div className="space-y-6 md:space-y-8 md:text-right flex flex-col md:items-end">
                            <h3 className="text-[11px] font-bold tracking-[0.4em] font-mono uppercase text-white/30">
                                SOLUTIONS
                            </h3>
                            <nav className="flex flex-col gap-3 md:gap-4 mb-8">
                                {[
                                    { name: "FULL TRUCKLOAD", href: "/services" },
                                    { name: "LTL STRATEGY", href: "/services" },
                                    { name: "SPECIALIZED", href: "/services" }
                                ].map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-[13px] text-white/50 hover:text-[var(--maroon)] font-mono tracking-[0.15em] transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                            <h3 className="text-[11px] font-bold tracking-[0.4em] font-mono uppercase text-white/30">
                                LEGAL
                            </h3>
                            <nav className="flex flex-col gap-3 md:gap-4">
                                {[
                                    { name: "PRIVACY POLICY", href: "/privacy" },
                                    { name: "TERMS OF SERVICE", href: "/terms" }
                                ].map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-[13px] text-white/50 hover:text-[var(--maroon)] font-mono tracking-[0.15em] transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </FadeInUpBox>

                {/* Contact row */}
                <div className="border-t border-white/5 py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-white/20 uppercase">HEADQUARTERS</p>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=4670+N+El+Capitan+Ave,+Fresno,+CA+93722"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] md:text-[14px] text-white/60 hover:text-[var(--maroon)] font-sans block leading-relaxed transition-colors"
                        >
                            4670 N El Capitan Ave, Fresno, CA 93722
                        </a>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                        <a href="mailto:info@apexfreightbrokerage.com" className="text-[13px] md:text-[14px] text-white/60 hover:text-[var(--maroon)] font-sans block transition-colors">
                            info@apexfreightbrokerage.com
                        </a>
                        <a href="tel:8885550199" className="text-[13px] md:text-[14px] text-white/60 hover:text-[var(--maroon)] font-sans block transition-colors">
                            888-555-0199
                        </a>
                    </div>
                </div>

                {/* Compliance row - Hidden until authority active */}
                <div className="border-t border-white/5 pt-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-3">
                    <p className="text-[9px] md:text-[10px] font-mono tracking-[0.25em] text-white/20 uppercase">
                        Authority (MC/DOT): Pending
                    </p>
                    <p className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-white/10 uppercase">
                        © {new Date().getFullYear()} Apex Freight Brokerage. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
