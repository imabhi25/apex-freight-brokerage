"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import FadeInUpBox from "../components/FadeInUpBox";
import SuccessMessage from "../components/SuccessMessage";

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

    const rawEquipmentTypes = ["DRY VAN", "REEFER", "FLATBED", "STEP DECK", "HOTSHOT"];
    const equipmentTypes = rawEquipmentTypes
        .map(t => (t || "").trim())
        .filter(t => t.length > 0)
        .filter((t, i, arr) => arr.indexOf(t) === i);

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

        if (selectedEquipment.length === 0) {
            newErrors.equipment = "AT LEAST ONE EQUIPMENT TYPE REQUIRED";
        }

        if (Object.keys(newErrors).length > 0) {
            console.warn("Validation errors:", newErrors);
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});
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
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Transmission failed");

            const refId = data.refId;
            setCurrentRefId(refId);

            console.log(`[CARRIER SUCCESS] Payload sent. Response:`, data);

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
        } catch (err: any) {
            console.error("Submission error:", err);
            setErrors(prev => ({ ...prev, submit: err.message || "TRANSMISSION FAILED. PLEASE RETRY." }));
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

    const inputBaseClass = "block w-full h-[52px] px-0 text-[15px] font-medium font-sans text-[var(--charcoal)] bg-transparent border-b border-[var(--charcoal)]/30 focus:border-[var(--maroon)] focus:ring-0 focus:outline-none transition-colors duration-500 placeholder-transparent peer rounded-none [&:not(:placeholder-shown)]:border-[var(--charcoal)]/50";
    const labelClass = "absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--charcoal)]/60 uppercase tracking-[0.2em] font-mono transition-all duration-500 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--maroon)] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-translate-y-[44px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--charcoal)]/80";

    return (
        <div className="min-h-screen bg-white pt-32 pb-16 flex justify-center text-left relative overflow-hidden">
            <div className="w-full max-w-7xl px-6">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white"
                        >
                            <SuccessMessage
                                variant="carrier"
                                headline="APPLICATION RECEIVED"
                                subtext={"Your carrier application has been received and logged.\nOur team will review your details and contact you with next steps shortly.\nPlease keep your reference ID for follow-up."}
                                referenceId={currentRefId}
                                onReset={() => {
                                    setIsSubmitted(false);
                                    setOrganization("");
                                    setDispatcherName("");
                                    setEmail("");
                                    setMcDot("");
                                    setTaxId("");
                                    setSelectedEquipment([]);
                                    setErrors({});
                                    setCurrentRefId("");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                                {/* Left Column - Context */}
                                <div className="lg:col-span-4 xl:col-span-5 lg:sticky lg:top-32 pr-0 lg:pr-8 flex flex-col pt-2">
                                    <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), serif' }}>
                                        JOIN CARRIER NETWORK
                                    </h1>
                                    <p className="text-[var(--charcoal)]/60 text-[14px] md:text-base font-sans max-w-[420px] leading-relaxed tracking-[0.05em] mb-12">
                                        Partner with Apex to access premium freight opportunities and dedicated support. Currently onboarding select partners.
                                    </p>

                                    <div className="w-8 h-[1px] bg-[var(--charcoal)]/10 mb-12"></div>

                                    <div className="mb-12">
                                        <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] font-bold text-[var(--charcoal)] uppercase mb-5 text-left">
                                            COMPLIANCE REQUIREMENTS
                                        </p>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-[13px] md:text-[14px] text-[var(--charcoal)]/60">
                                                <Check className="w-4 h-4 text-[var(--maroon)]/80 shrink-0 mt-[2px]" />
                                                Active Operating Authority (6+ Months)
                                            </li>
                                            <li className="flex items-start gap-3 text-[13px] md:text-[14px] text-[var(--charcoal)]/60">
                                                <Check className="w-4 h-4 text-[var(--maroon)]/80 shrink-0 mt-[2px]" />
                                                $100,000 Cargo Liability Insurance
                                            </li>
                                            <li className="flex items-start gap-3 text-[13px] md:text-[14px] text-[var(--charcoal)]/60">
                                                <Check className="w-4 h-4 text-[var(--maroon)]/80 shrink-0 mt-[2px]" />
                                                $1,000,000 Auto Liability Insurance
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-6 border-t border-[var(--charcoal)]/10 max-w-[420px]">
                                        <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--charcoal)]/40 uppercase mb-3">Questions before onboarding?</p>
                                        <a href="mailto:info@apexfreightbrokerage.com" className="text-[var(--maroon)] font-bold text-[13px] hover:text-[var(--maroon)]/80 transition-all flex items-center gap-2 group w-fit">
                                            Email Operations
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                {/* Right Column - Form */}
                                <div className="lg:col-span-8 xl:col-span-7 flex flex-col relative pt-2">
                                    <div className="hidden lg:block absolute left-[-32px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[var(--charcoal)]/[0.06] to-transparent" />
                                    <div className="w-full max-w-2xl">
                                        <form onSubmit={handleSubmit} className="space-y-12 md:space-y-16" noValidate>
                                            <FadeInUpBox delay={0.1}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
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
                                                    <label className={`text-[12px] font-bold uppercase tracking-[0.2em] font-mono ${errors.equipment ? 'text-red-500' : 'text-[var(--charcoal)]/40'}`}>
                                                        EQUIPMENT TYPE *
                                                    </label>
                                                    <div className="flex flex-wrap gap-4">
                                                        {equipmentTypes.map((type) => (
                                                            <motion.button
                                                                key={type}
                                                                type="button"
                                                                onClick={() => {
                                                                    toggleEquipment(type);
                                                                    if (errors.equipment) setErrors(prev => ({ ...prev, equipment: "" }));
                                                                }}
                                                                whileHover={{ scale: 1.05 }}
                                                                className={`px-6 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-all duration-300 border rounded-none ${selectedEquipment.includes(type)
                                                                    ? 'bg-[var(--maroon)]/[0.03] text-[var(--maroon)] border-[var(--maroon)]/40 shadow-sm'
                                                                    : 'bg-transparent text-[var(--charcoal)]/40 border-[var(--charcoal)]/15 hover:border-[var(--charcoal)]/30 hover:text-[var(--charcoal)]/60 hover:bg-[var(--charcoal)]/[0.01]'
                                                                    }`}
                                                            >
                                                                {type}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                    <AnimatePresence>
                                                        {errors.equipment && (
                                                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-red-500 font-mono tracking-widest block uppercase mt-2">
                                                                {errors.equipment}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
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
                                                <div className="pt-8 md:pt-12 flex flex-col items-end gap-4 w-full">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className={`group inline-flex items-center justify-center sm:justify-end gap-3 text-[var(--maroon)] transition-all duration-500 ease-[0.25,1,0.4,1] hover:-translate-y-[2px] hover:scale-[1.02] hover:drop-shadow-[0_8px_16px_rgba(114,35,46,0.2)] ${isSubmitting ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="inline-flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.25em] font-bold whitespace-nowrap">
                                                                <span className="w-1.5 h-1.5 bg-[var(--maroon)] animate-ping rounded-full shrink-0" />
                                                                SUBMITTING...
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <span className="font-mono text-[12px] uppercase tracking-[0.25em] font-bold whitespace-nowrap">Submit Application</span>
                                                                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1.5 transition-transform duration-500 ease-[0.25,1,0.4,1]" />
                                                            </>
                                                        )}
                                                    </button>
                                                    <div className="flex flex-col items-end mt-4 sm:mt-5">
                                                        <p className="text-[9px] font-mono tracking-[0.15em] text-[var(--charcoal)]/40 uppercase text-right leading-relaxed mb-3">
                                                            Reviewed typically under 24 hours.<br />Carrier details remain confidential.
                                                        </p>
                                                        <AnimatePresence>
                                                            {errors.submit && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -4 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="w-full text-right"
                                                                >
                                                                    <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-red-500 bg-red-50 px-3 py-2 rounded border border-red-100 inline-block">
                                                                        {errors.submit}
                                                                    </span>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </FadeInUpBox>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
