"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Command, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const AIAssistant = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", content: "System initialized. I am APEX-1, your intelligent logistics consultant. How can I assist with your supply chain today?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [actionCount, setActionCount] = useState(0);
    const MAX_ACTIONS = 5;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim().toLowerCase();
        setMessages(prev => [...prev, { role: "user", content: input.trim() }]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Response with Intent Detection
        setTimeout(() => {
            let response = "I am processing your command through our neural network. Currently, market rates for that lane are showing high stability. Would you like a precise quote?";
            let actionPerformed = false;

            if (actionCount < MAX_ACTIONS) {
                if (userMsg.includes("quote") || userMsg.includes("rate")) {
                    response = "IDENTIFIED INTENT: QUOTE ANALYSIS. Navigating to our intelligence-driven rate engine now.";
                    router.push("/quote");
                    actionPerformed = true;
                } else if (userMsg.includes("carrier") || userMsg.includes("join")) {
                    response = "IDENTIFIED INTENT: CARRIER SYNC. Redirecting you to our high-yield carrier network portal.";
                    router.push("/carrier");
                    actionPerformed = true;
                } else if (userMsg.includes("contact") || userMsg.includes("touch") || userMsg.includes("help")) {
                    response = "IDENTIFIED INTENT: COMMUNICATION. Opening our direct support interface.";
                    router.push("/contact");
                    actionPerformed = true;
                } else if (userMsg.includes("home") || userMsg.includes("dashboard")) {
                    response = "IDENTIFIED INTENT: SYSTEM ROOT. Returning to the main command dashboard.";
                    router.push("/");
                    actionPerformed = true;
                }
            } else {
                response = "SYSTEM ALERT: ACTION LIMIT REACHED. To maintain security, I have reached my command execution limit for this session. I can still provide information, however.";
            }

            if (actionPerformed) {
                setActionCount(prev => prev + 1);
            }

            setMessages(prev => [...prev, { role: "ai", content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white border border-[var(--cool-gray)] rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--text-charcoal)]/10 flex items-center justify-between bg-[var(--text-charcoal)]/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--midnight-blue)]">APEX-1 ENGINE</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--cobalt-blue)]" />
                                        <span className="text-[8px] text-[var(--midnight-blue)]/40 uppercase tracking-widest">NEURAL LINK ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-[var(--text-charcoal)]/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-[var(--bg)]/40">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-xl text-[13px] font-sans leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[var(--midnight-blue)] text-white'
                                        : 'bg-white text-[var(--midnight-blue)] border border-[var(--cool-gray)]'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-[var(--text-charcoal)]/5 p-3 rounded-xl flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-[var(--text-charcoal)]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-[var(--text-charcoal)]/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-[var(--text-charcoal)]/40 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/[0.02] border-t border-white/10">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="COMMAND SYSTEM..."
                                    className="w-full bg-white border border-[var(--text-charcoal)]/10 rounded-xl py-3 pl-4 pr-12 text-[11px] font-mono text-[var(--foreground)] placeholder:text-[var(--text-charcoal)]/20 focus:outline-none focus:border-[var(--apex-navy)] transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--midnight-blue)]/40 hover:text-[var(--cobalt-blue)] transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[var(--midnight-blue)] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(10,15,28,0.3)] relative group overflow-hidden border border-white/10"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sparkle"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                            className="relative"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300 bg-white">
                                <div className="w-1.5 h-1.5 bg-[var(--cobalt-blue)] rounded-full animate-ping" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Visual Accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1] pointer-events-none" />
            </motion.button>
        </div >
    );
};

export default AIAssistant;
