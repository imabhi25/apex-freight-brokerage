"use client";

import React from "react";
import FadeInUpBox from "../components/FadeInUpBox";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white pt-40 pb-24 px-6 flex flex-col items-center text-left font-sans text-[var(--charcoal)]">
            <div className="w-full max-w-4xl">
                <FadeInUpBox delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-extralight mb-12 tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), serif' }}>
                        Terms of Service
                    </h1>
                </FadeInUpBox>

                <div className="space-y-12">
                    <FadeInUpBox delay={0.2}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Agreement to Terms</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                By accessing the Apex Freight Brokerage platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.25}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Operational Scope</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                Apex Freight Brokerage acts as a technology-enabled intermediary between shippers and carriers. All brokerage operations are subject to federal and state regulations.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.3}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">User Conduct</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                Users are responsible for providing accurate shipment data and compliance credentials. Misrepresentation may result in service termination.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.35}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Limitations of Liability</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                While we strive for absolute precision, Apex is not liable for indirect or consequential damages arising from service usage during this pre-launch phase.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.4}>
                        <div className="pt-12 border-t border-[var(--light-gray)]">
                            <p className="text-[11px] font-mono tracking-[0.2em] text-[var(--charcoal)]/40 uppercase">
                                Last Updated: February 2026
                            </p>
                        </div>
                    </FadeInUpBox>
                </div>
            </div>
        </div>
    );
}
