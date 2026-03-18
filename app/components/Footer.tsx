"use client";

import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#141416] text-white relative z-50">
            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-5">
                        <h2
                            className="text-2xl md:text-3xl tracking-[0.3em] uppercase font-light"
                            style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}
                        >
                            APEX
                        </h2>
                        <p className="text-white/40 text-[13px] font-sans leading-[1.8] max-w-[280px]">
                            Full-service freight brokerage built on carrier relationships, operational discipline, and consistent execution.
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-[10px] font-bold tracking-[0.3em] font-mono uppercase text-white/25 mb-5">
                            Navigation
                        </h3>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "HOME", href: "/" },
                                { name: "SERVICES", href: "/services" },
                                { name: "ABOUT", href: "/about" },
                                { name: "REQUEST A QUOTE", href: "/quote" },
                                { name: "CONTACT", href: "/contact" },
                            ].map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-[12px] text-white/45 hover:text-white/80 font-mono tracking-[0.15em] transition-colors duration-300 w-fit"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Capabilities Column */}
                    <div className="lg:col-span-3">
                        <h3 className="text-[10px] font-bold tracking-[0.3em] font-mono uppercase text-white/25 mb-5">
                            Capabilities
                        </h3>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "FULL TRUCKLOAD", href: "/services" },
                                { name: "LTL", href: "/services" },
                                { name: "SPECIALIZED & HEAVY HAUL", href: "/services" },
                                { name: "EXPEDITED", href: "/services" },
                                { name: "CARRIER PARTNERSHIPS", href: "/carrier" },
                            ].map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-[12px] text-white/45 hover:text-white/80 font-mono tracking-[0.15em] transition-colors duration-300 w-fit"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Legal Column */}
                    <div className="lg:col-span-2">
                        <h3 className="text-[10px] font-bold tracking-[0.3em] font-mono uppercase text-white/25 mb-5">
                            Legal
                        </h3>
                        <nav className="flex flex-col gap-3">
                            {[
                                { name: "PRIVACY POLICY", href: "/privacy" },
                                { name: "TERMS OF SERVICE", href: "/terms" },
                            ].map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-[12px] text-white/45 hover:text-white/80 font-mono tracking-[0.15em] transition-colors duration-300 w-fit"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Bar — Contact + Authority + Copyright */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
                    {/* Contact Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <a
                                href="mailto:info@apexfreightbrokerage.com"
                                className="text-[12px] text-white/40 hover:text-white/70 font-mono tracking-[0.1em] transition-colors duration-300"
                            >
                                info@apexfreightbrokerage.com
                            </a>
                            <a
                                href="tel:8183300000"
                                className="text-[12px] text-white/40 hover:text-white/70 font-mono tracking-[0.1em] transition-colors duration-300"
                            >
                                818-330-0000
                            </a>
                        </div>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=4670+N+El+Capitan+Ave,+Fresno,+CA+93722"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-white/30 hover:text-white/60 font-mono tracking-[0.1em] transition-colors duration-300"
                        >
                            Fresno, CA
                        </a>
                    </div>

                    {/* Authority + Copyright */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-5 border-t border-white/[0.04]">
                        <p className="text-[9px] font-mono tracking-[0.2em] text-white/15 uppercase">
                            MC / DOT Authority: Pending
                        </p>
                        <p className="text-[9px] font-mono tracking-[0.2em] text-white/15 uppercase">
                            © {currentYear} Apex Freight Brokerage
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
