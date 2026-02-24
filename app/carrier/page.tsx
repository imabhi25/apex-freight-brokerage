"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import FadeInUpBox from "../components/FadeInUpBox";
import SuccessMessage from "../components/SuccessMessage";
import { generateRefId } from "../lib/utils";

export default function Carrier() {
    const [organization, setOrganization] = useState("");
    const [dispatcherName, setDispatcherName] = useState("");
    const [email, setEmail] = useState("");
    const [mcDot, setMcDot] = useState("");
    const [taxId, setTaxId] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState(0);
    const [isVerifyingMc, setIsVerifyingMc] = useState(false);
    const [isMcVerified, setIsMcVerified] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentRefId, setCurrentRefId] = useState("");

    const equipmentTypes = ["DRY VAN", "REEFER", "FLATBED", "STEP DECK", "HOTSHOT"];

    const loadingMessages = [
        "Analyzing market capacity...",
        "Vetting carrier network...",
        "Finalizing analysis...",
    ];

    const validateEmail = (val: string) => {
        if (!val) return "REQUIRED";
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(val) || val.includes("..")) {
            return "INVALID EMAIL FORMAT";
        }
        return null;
    };

    const handleEmailBlur = () => {
        const error = validateEmail(email);
        if (error) {
            setErrors((prev) => ({ ...prev, email: error }));
        }
    };

    const handleTaxIdBlur = () => {
        if (taxId && !/^\d{2}-?\d{7}$/.test(taxId)) {
            setErrors((prev) => ({ ...prev, taxId: "INVALID EIN" }));
        }
    };

    const isValidAuthorityFormat = (val: string) => {
        const cleaned = val.replace(/[\s-]/g, "");
        const mcRegex = /^(mc)?\d{6,7}$/i;
        const dotRegex = /^\d{5,8}$/;
        return mcRegex.test(cleaned) || dotRegex.test(cleaned);
    };

    const handleMcDotVerification = async (val: string) => {
        const digits = val.replace(/\D/g, "");
        if (digits.length >= 6) {
            setIsVerifyingMc(true);
            setIsMcVerified(false);
            setErrors((prev) => ({ ...prev, mcDot: "" }));

            // Simulate API verification
            await new Promise(r => setTimeout(r, 1500));

            setIsVerifyingMc(false);
            setIsMcVerified(true);
        } else {
            setIsMcVerified(false);
            setIsVerifyingMc(false);
        }
    };

    const handleMcDotBlur = async () => {
        if (mcDot) {
            const digitsOnly = mcDot.replace(/\D/g, "");
            if (digitsOnly.length > 0 && digitsOnly.length < 6) {
                setErrors((prev) => ({ ...prev, mcDot: "MINIMUM 6 DIGITS" }));
                setIsMcVerified(false);
                return;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!organization) newErrors.organization = "REQUIRED";
        if (!dispatcherName) newErrors.dispatcherName = "REQUIRED";

        const emailErr = validateEmail(email);
        if (emailErr) newErrors.email = emailErr;

        if (!mcDot) {
            newErrors.mcDot = "REQUIRED";
        } else {
            const digitsOnly = mcDot.replace(/\D/g, "");
            if (digitsOnly.length > 0 && digitsOnly.length < 5) {
                newErrors.mcDot = "INVALID";
            } else if (!isValidAuthorityFormat(mcDot)) {
                newErrors.mcDot = "INVALID FORMAT";
            }
        }

        if (!taxId) {
            newErrors.taxId = "REQUIRED";
        } else if (!/^\d{2}-?\d{7}$/.test(taxId)) {
            newErrors.taxId = "INVALID EIN";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        const refId = generateRefId('I');
        setCurrentRefId(refId);
        try {
            const res = await fetch("/api/carrier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organization,
                    dispatcherName,
                    email,
                    mcDot,
                    taxId,
                    equipment: selectedEquipment,
                    referenceId: refId,
                }),
            });

            if (!res.ok) throw new Error("Transmission failed");

            // Cycle through loading phases for UX
            await new Promise<void>((resolve) => {
                let phase = 0;
                const interval = setInterval(() => {
                    phase += 1;
                    if (phase >= loadingMessages.length) {
                        clearInterval(interval);
                        resolve();
                    } else {
                        setLoadingPhase(phase);
                    }
                }, 800);
            });

            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Submission error:", err);
            setErrors(prev => ({ ...prev, submit: "TRANSMISSION FAILED. PLEASE RETRY." }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleEquipment = (type: string) => {
        setSelectedEquipment(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const formatTaxId = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 9);
        if (digits.length > 2) {
            return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        }
        return digits;
    };

    const inputBaseClass = "block w-full h-[52px] px-0 text-[16px] font-sans text-[var(--charcoal)] bg-transparent focus:outline-none transition-all duration-300 placeholder-transparent peer border-b border-[var(--light-gray)] focus:border-[var(--maroon)] rounded-none";
    const labelClass = "absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--charcoal)]/50 uppercase tracking-[0.2em] font-mono transition-all duration-300 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--maroon)] peer-[:not(:placeholder-shown)]:-translate-y-[44px]";

    return (
        <div className="min-h-screen bg-white pt-40 pb-16 flex flex-col items-center text-left text-[var(--charcoal)] relative overflow-hidden">
            {/* Technical Grid — DISABLED for Muted Industrial */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-0" />

            <div className="w-full max-w-6xl relative z-10">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <SuccessMessage
                            key="success"
                            variant="carrier"
                            headline="APPLICATION Received"
                            subtext="Your credentials have been successfully injected into our System. Our team is currently verifying your safety ratings and operating authority. Expect an onboarding package via email once your profile is validated."
                            onReset={() => {
                                setIsSubmitted(false);
                                setOrganization("");
                                setMcDot("");
                                setSelectedEquipment([]);
                            }}
                        />
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="mb-24 relative z-10">
                                <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), serif' }}>
                                    JOIN CARRIER NETWORK
                                </h1>
                                <p className="text-[var(--charcoal)]/60 text-[14px] md:text-base font-sans max-w-[520px] leading-relaxed tracking-[0.05em]">
                                    Partner with Apex to access premium freight opportunities and dedicated support. Currently onboarding select partners.
                                </p>
                                <div className="mt-8 pt-6 border-t border-[var(--light-gray)]/30 max-w-[520px]">
                                    <p className="text-[11px] font-mono tracking-[0.2em] text-[var(--charcoal)]/40 uppercase mb-2">Questions before onboarding?</p>
                                    <a href="mailto:info@apexfreightbrokerage.com" className="text-[var(--maroon)] font-bold text-sm hover:underline transition-all">
                                        Email us for carrier inquiries
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-16" noValidate>
                                <FadeInUpBox delay={0.1}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                                        <div className="relative z-0 w-full group pt-4">
                                            <input
                                                type="text"
                                                id="organization"
                                                value={organization}
                                                onChange={(e) => {
                                                    setOrganization(e.target.value);
                                                    if (errors.organization) setErrors(prev => ({ ...prev, organization: "" }));
                                                }}
                                                className={`${inputBaseClass}`}
                                                placeholder=" "
                                            />
                                            <label htmlFor="organization" className={`${labelClass} ${errors.organization ? 'text-red-500' : ''}`}>
                                                CARRIER NAME *
                                            </label>
                                            {errors.organization && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-mono tracking-widest">{errors.organization}</span>}
                                        </div>
                                        <div className="relative z-0 w-full group pt-4">
                                            <input
                                                type="text"
                                                id="dispatcherName"
                                                value={dispatcherName}
                                                onChange={(e) => {
                                                    setDispatcherName(e.target.value);
                                                    if (errors.dispatcherName) setErrors(prev => ({ ...prev, dispatcherName: "" }));
                                                }}
                                                className={`${inputBaseClass}`}
                                                placeholder=" "
                                            />
                                            <label htmlFor="dispatcherName" className={`${labelClass} ${errors.dispatcherName ? 'text-red-500' : ''}`}>
                                                DISPATCHER NAME *
                                            </label>
                                            {errors.dispatcherName && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-mono tracking-widest">{errors.dispatcherName}</span>}
                                        </div>
                                    </div>
                                </FadeInUpBox>

                                <FadeInUpBox delay={0.15}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                                        <div className="relative z-0 w-full group pt-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="mcDot"
                                                    value={mcDot}
                                                    onBlur={handleMcDotBlur}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                                                        setMcDot(val);
                                                        if (errors.mcDot) setErrors(prev => ({ ...prev, mcDot: "" }));
                                                        if (val.length >= 6 && val !== mcDot) {
                                                            handleMcDotVerification(val);
                                                        } else if (val.length < 6) {
                                                            setIsMcVerified(false);
                                                            setIsVerifyingMc(false);
                                                        }
                                                    }}
                                                    className={`${inputBaseClass} pr-12`}
                                                    placeholder=" "
                                                />
                                                <AnimatePresence>
                                                    {isMcVerified && !isVerifyingMc && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                                        >
                                                            <Check className="w-5 h-5 text-[var(--maroon)]" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                <label htmlFor="mcDot" className={`${labelClass} ${errors.mcDot ? 'text-red-500' : ''}`}>
                                                    MC / DOT NUMBER *
                                                </label>
                                            </div>
                                            <AnimatePresence>
                                                {errors.mcDot && (
                                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-mono tracking-widest uppercase">
                                                        {errors.mcDot}
                                                    </motion.span>
                                                )}
                                                {isVerifyingMc && !errors.mcDot && (
                                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-5 left-0 text-[10px] text-[var(--text-secondary)] font-mono tracking-widest uppercase">
                                                        VERIFYING...
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="relative z-0 w-full group pt-4">
                                            <input
                                                type="text"
                                                id="taxId"
                                                value={formatTaxId(taxId)}
                                                onBlur={handleTaxIdBlur}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                                                    setTaxId(val);
                                                    if (errors.taxId) setErrors(prev => ({ ...prev, taxId: "" }));
                                                }}
                                                className={`${inputBaseClass}`}
                                                placeholder=" "
                                            />
                                            <label htmlFor="taxId" className={`${labelClass} ${errors.taxId ? 'text-red-500' : ''}`}>
                                                FEDERAL TAX ID (EIN) *
                                            </label>
                                            {errors.taxId && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-mono tracking-widest">{errors.taxId}</span>}
                                        </div>
                                    </div>
                                </FadeInUpBox>

                                <FadeInUpBox delay={0.18}>
                                    <div className="space-y-6">
                                        <label className="text-[12px] font-bold text-[var(--charcoal)]/40 uppercase tracking-[0.2em] font-mono">
                                            EQUIPMENT TYPE *
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            {equipmentTypes.map((type) => (
                                                <motion.button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => toggleEquipment(type)}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`px-6 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-all duration-300 border rounded-lg ${selectedEquipment.includes(type)
                                                        ? 'bg-[var(--maroon)] text-white border-[var(--maroon)] shadow-lg'
                                                        : 'bg-transparent text-[var(--charcoal)]/40 border-[var(--light-gray)] hover:border-[var(--maroon)]/50'
                                                        }`}
                                                >
                                                    {type}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </FadeInUpBox>

                                <FadeInUpBox delay={0.2}>
                                    <div className="relative z-0 w-full group pt-4">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onBlur={handleEmailBlur}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                            }}
                                            className={`${inputBaseClass}`}
                                            placeholder=" "
                                        />
                                        <label htmlFor="email" className={`${labelClass} ${errors.email ? 'text-red-500' : ''}`}>
                                            PRIMARY DISPATCH EMAIL *
                                        </label>
                                        {errors.email && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-mono tracking-widest">{errors.email}</span>}
                                    </div>
                                </FadeInUpBox>

                                <FadeInUpBox delay={0.25}>
                                    <div className="pt-12 flex justify-end">
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            className={`text-left transition-all duration-300 text-[var(--charcoal)] font-bold uppercase tracking-[0.2em] text-[15px] font-mono origin-left inline-block ${isSubmitting
                                                ? 'opacity-30 cursor-not-allowed'
                                                : 'hover:text-[var(--maroon)]'}`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 bg-[var(--maroon)] animate-ping rounded-full" />
                                                    {loadingMessages[loadingPhase]}
                                                </span>
                                            ) : (
                                                'SUBMIT'
                                            )}
                                        </motion.button>
                                    </div>
                                </FadeInUpBox>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
