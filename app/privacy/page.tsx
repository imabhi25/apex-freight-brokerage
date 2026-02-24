"use client";

import React from "react";
import FadeInUpBox from "../components/FadeInUpBox";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white pt-40 pb-24 px-6 flex flex-col items-center text-left font-sans text-[var(--charcoal)]">
            <div className="w-full max-w-4xl">
                <FadeInUpBox delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-extralight mb-12 tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), serif' }}>
                        Privacy Policy
                    </h1>
                </FadeInUpBox>

                <div className="space-y-12">
                    <FadeInUpBox delay={0.2}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Overview</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                At Apex Freight Brokerage, your privacy is paramount. This policy outlines how we collect, use, and safeguard your information as we scale our operations.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.25}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Information Collection</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                We collect information necessary to coordinate logistics services, including contact details, shipment requirements, and carrier compliance data. We never sell your personal data to third parties.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.3}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Security Standards</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                All data transmission is encrypted using industry-standard protocols. We maintain rigorous internal security measures to protect your operational data.
                            </p>
                        </section>
                    </FadeInUpBox>

                    <FadeInUpBox delay={0.35}>
                        <section className="space-y-4">
                            <h2 className="text-[14px] font-bold tracking-[0.2em] font-mono uppercase text-[var(--maroon)]">Policy Updates</h2>
                            <p className="text-[var(--charcoal)]/60 text-lg font-light leading-relaxed">
                                As our operations expand, this policy may be updated. We encourage users to review this page periodically for any changes.
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
