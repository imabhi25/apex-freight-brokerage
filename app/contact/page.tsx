"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeInUpBox from "../components/FadeInUpBox";
import SuccessMessage from "../components/SuccessMessage";

const SPRING = { type: "spring", stiffness: 260, damping: 20, mass: 1 } as const;
const ELASTIC = [0.16, 1, 0.3, 1] as const;

type SendState = "idle" | "loading" | "success" | "error";

function SendMessageButton({ sendState }: { sendState: SendState }) {
    const [hovered, setHovered] = useState(false);
    const isIdle = sendState === "idle";

    const label =
        sendState === "loading" ? "SUBMITTING..." :
            sendState === "success" ? "MESSAGE DELIVERED" :
                sendState === "error" ? "RETRY TRANSMISSION" :
                    "Send Message";

    return (
        <motion.div
            whileHover={isIdle ? { scale: 1.05 } : {}}
            transition={SPRING}
            className="inline-block"
        >
            <motion.button
                type="submit"
                onMouseEnter={() => isIdle && setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                disabled={sendState === "loading"}
                className={`premium-btn flex items-center justify-center gap-2 sm:gap-4 py-6 sm:py-8 w-full sm:min-w-[320px] ${sendState === "success" ? "!bg-green-600" :
                    sendState === "error" ? "!bg-red-600" :
                        "text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold font-mono tracking-[0.15em] sm:tracking-[0.2em] text-[13px] sm:text-[15px] shadow-2xl`}
            >
                <div className="flex items-center gap-3 h-6 w-full justify-center">
                    {sendState === "loading" && (
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping shrink-0" />
                    )}
                    {sendState === "success" && (
                        <span className="text-white font-mono text-[13px] shrink-0">✓</span>
                    )}

                    <span>{label}</span>
                </div>
            </motion.button>
        </motion.div>
    );
}

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sendState, setSendState] = useState<SendState>("idle");
    const [currentRefId, setCurrentRefId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const newErrors: Record<string, string> = {};
        if (!name) newErrors.name = "REQUIRED";
        if (!email) {
            newErrors.email = "REQUIRED";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.includes("..")) {
            newErrors.emailFormat = "INVALID EMAIL FORMAT";
        }
        if (!message) newErrors.message = "REQUIRED";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setSendState("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Transmission failed");

            const refId = data.refId;
            setCurrentRefId(refId);

            setSendState("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            setSendState("error");
            // Auto-reset error after 4s
            setTimeout(() => setSendState("idle"), 4000);
        }
    };

    const inputBaseClass = "block w-full h-[52px] px-0 text-[16px] font-sans text-[var(--charcoal)] bg-transparent focus:outline-none transition-all duration-300 placeholder-transparent peer border-b border-[var(--light-gray)] focus:border-[var(--maroon)] rounded-none";
    const labelClass = "absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--charcoal)]/50 uppercase tracking-[0.2em] font-mono transition-all duration-300 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--maroon)] peer-[:not(:placeholder-shown)]:-translate-y-[44px]";

    return (
        <div className="min-h-screen bg-white pt-32 pb-16 flex justify-center text-left text-[var(--charcoal)] relative overflow-hidden">
            {/* Technical Grid — DISABLED for Muted Industrial */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-0" />

            <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">
                    {sendState === "success" ? (
                        <SuccessMessage
                            key="success"
                            variant="contact"
                            headline="MESSAGE RECEIVED"
                            subtext={"Your message has been sent successfully.\nOur team will review your inquiry and get back to you shortly.\nPlease keep your reference ID for follow-up."}
                            referenceId={currentRefId}
                            onReset={() => {
                                setSendState("idle");
                                setName("");
                                setEmail("");
                                setMessage("");
                                setErrors({});
                                setCurrentRefId("");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col md:flex-row gap-16 md:gap-24 items-stretch"
                        >
                            {/* Left Side: Heading & Info */}
                            <div className="w-full md:w-1/2 flex flex-col justify-between">
                                <div className="mb-12 md:mb-24 relative z-10">
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight mb-4 md:mb-6 tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
                                        GET IN TOUCH
                                    </h1>
                                    <p className="text-[var(--charcoal)]/60 text-[14px] md:text-base font-sans max-w-xl leading-relaxed tracking-[0.05em]">
                                        Seamless communication for a global supply chain.<br className="hidden md:block" /> Reach out to our specialized teams for direct assistance.
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <FadeInUpBox delay={0.2}>
                                    <div className="grid grid-cols-1 gap-16 pt-0 md:mt-auto mt-24 text-left pb-8 mt-12 md:mt-16">
                                        <div>
                                            <h3 className="text-[14px] font-bold text-[var(--charcoal)]/40 uppercase tracking-[0.4em] font-mono mb-6">LOCATION</h3>
                                            <a
                                                href="https://www.google.com/maps/search/?api=1&query=4670+N+El+Capitan+Ave,+Fresno,+CA+93722"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-base md:text-lg lg:text-2xl text-[var(--text-primary)]/70 font-sans leading-relaxed hover:text-[var(--text-primary)] transition-colors block mb-8"
                                            >
                                                4670 N El Capitan Ave,<br />Fresno, CA 93722
                                            </a>
                                            {/* Colorful Map Embed — Height matched to baseline of Message on right */}
                                            <div className="w-full overflow-hidden border border-[var(--light-gray)] h-[250px] md:h-[380px]">
                                                <iframe
                                                    title="Apex Freight Location"
                                                    width="100%"
                                                    height="100%"
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    style={{ border: 0 }}
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.2!2d-119.8!3d36.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80945b4c5d5d5d5d%3A0x1!2s4670+N+El+Capitan+Ave%2C+Fresno%2C+CA+93722!5e0!3m2!1sen!2sus!4v1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-bold text-[var(--charcoal)]/40 uppercase tracking-[0.3em] font-mono mb-6">CONTACT</h3>
                                            <a href="mailto:info@apexfreightbrokerage.com" className="text-base md:text-lg lg:text-2xl text-[var(--charcoal)]/70 font-sans hover:text-[var(--maroon)] transition-colors block mb-3 break-all sm:break-normal">
                                                info@apexfreightbrokerage.com
                                            </a>
                                            <a href="tel:8885550199" className="text-base md:text-lg lg:text-2xl text-[var(--charcoal)]/70 font-sans hover:text-[var(--maroon)] transition-colors block">
                                                888-555-0199
                                            </a>
                                        </div>
                                    </div>
                                </FadeInUpBox>
                            </div>

                            {/* Right Side: Form */}
                            <div className="w-full md:w-1/2 flex flex-col justify-between">
                                <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between" noValidate>
                                    <div className="w-full space-y-24">
                                        {/* Name */}
                                        <FadeInUpBox delay={0.1}>
                                            <div className="relative z-0 w-full group pt-4">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: "" })); }}
                                                    className={`${inputBaseClass}`}
                                                    placeholder=" "
                                                />
                                                <label htmlFor="name" className={`${labelClass} ${errors.name ? 'text-red-500 peer-focus:text-red-500' : ''}`}>FULL NAME *</label>
                                                {errors.name && (
                                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-5 left-0 text-[9px] text-red-500 font-mono tracking-widest">{errors.name}</motion.p>
                                                )}
                                            </div>
                                        </FadeInUpBox>

                                        {/* Email */}
                                        <FadeInUpBox delay={0.2}>
                                            <div className="relative z-0 w-full group pt-4">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (errors.email || errors.emailFormat) setErrors(prev => { const n = { ...prev }; delete n.email; delete n.emailFormat; return n; });
                                                    }}
                                                    className={`${inputBaseClass}`}
                                                    placeholder=" "
                                                />
                                                <label htmlFor="email" className={`${labelClass} ${(errors.email || errors.emailFormat) ? 'text-red-500 peer-focus:text-red-500' : ''}`}>OFFICIAL EMAIL *</label>
                                                {(errors.email || errors.emailFormat) && (
                                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-5 left-0 text-[9px] text-red-500 font-mono tracking-widest">{errors.email || errors.emailFormat}</motion.p>
                                                )}
                                            </div>
                                        </FadeInUpBox>

                                        {/* Message — 1px full border box */}
                                        <FadeInUpBox delay={0.3}>
                                            <div className="relative z-0 w-full group pt-4">
                                                <textarea
                                                    id="message"
                                                    value={message}
                                                    onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(prev => ({ ...prev, message: "" })); }}
                                                    rows={6}
                                                    className={`block py-4 px-0 w-full text-[16px] font-sans text-[var(--charcoal)] bg-transparent focus:outline-none transition-all duration-300 placeholder-transparent peer resize-none border-b border-[var(--light-gray)] focus:border-[var(--maroon)] rounded-none`}
                                                    placeholder=" "
                                                />
                                                <label
                                                    htmlFor="message"
                                                    className={`absolute left-0 top-4 text-[12px] font-bold text-[var(--charcoal)]/50 uppercase tracking-[0.2em] font-mono transition-all duration-300 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--maroon)] peer-[:not(:placeholder-shown)]:-translate-y-[44px] ${errors.message ? 'text-red-500' : ''}`}
                                                >
                                                    MESSAGE *
                                                </label>
                                                {errors.message && (
                                                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-5 left-0 text-[9px] text-red-500 font-mono tracking-widest">{errors.message}</motion.p>
                                                )}
                                            </div>
                                        </FadeInUpBox>

                                        {/* Submit + error message */}
                                        <FadeInUpBox delay={0.4}>
                                            <div className="pt-2 text-left w-full space-y-4">
                                                <SendMessageButton sendState={sendState} />
                                                <AnimatePresence>
                                                    {sendState === "error" && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-[10px] font-mono tracking-[0.2em] uppercase text-red-400"
                                                        >
                                                            CONNECTION FAILED. PLEASE TRY AGAIN.
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <p className="mt-6 md:mt-8 text-center md:text-left text-[9px] md:text-[10px] font-mono tracking-widest text-[var(--charcoal)]/40 uppercase">
                                                Inquiries monitored 24/7 • Response within 15 mins
                                            </p>
                                        </FadeInUpBox>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
