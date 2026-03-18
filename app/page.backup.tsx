"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Globe, Shield, Clock, Radar, ShieldCheck, BarChart3, UserCheck, Workflow, Scale, Calendar } from "lucide-react";
import ServiceShowcase from "./components/ServiceShowcase";
import CityAutocomplete from "./components/CityAutocomplete";


export default function Home() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    equipment: "",
    weight: "",
    date: "",
  });
  const [dateError, setDateError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.origin.trim()) newErrors.origin = "REQUIRED";
    if (!formData.destination.trim()) newErrors.destination = "REQUIRED";
    if (!formData.equipment) newErrors.equipment = "REQUIRED";
    if (!formData.weight.trim()) newErrors.weight = "REQUIRED";
    if (!formData.date.trim()) newErrors.date = "REQUIRED";
    else if (dateError) newErrors.date = dateError;
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Quote Request Sent!");
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    if (numericValue) {
      setFormData({ ...formData, weight: Number(numericValue).toLocaleString("en-US") });
    } else {
      setFormData({ ...formData, weight: "" });
    }
  };

  const validateDate = (mmddyyyy: string) => {
    if (mmddyyyy.length < 10) { setDateError(""); return; }
    const [mm, dd, yyyy] = mmddyyyy.split("-").map(Number);
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getMonth() !== mm - 1 || d.getDate() !== dd || d.getFullYear() !== yyyy) {
      setDateError("INVALID DATE"); return;
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) { setDateError("DATE CANNOT BE IN THE PAST"); return; }
    const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (d > maxDate) { setDateError("DATE IS TOO FAR IN THE FUTURE"); return; }
    setDateError("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = val;
    if (val.length >= 5) {
      formatted = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4, 8)}`;
    } else if (val.length >= 3) {
      formatted = `${val.slice(0, 2)}-${val.slice(2, 4)}`;
    }
    setFormData({ ...formData, date: formatted });
    validateDate(formatted);
  };

  // Strict Form Layout: Native Top-Labels and Open Inputs
  const inputBaseClass = "block w-full text-[15px] font-medium font-sans text-[var(--charcoal)] bg-transparent border-0 border-b border-[var(--charcoal)]/25 pb-3 focus:border-[var(--maroon)] focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-[var(--charcoal)]/35";
  const labelClass = "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] font-mono text-[var(--charcoal)]/70 block mb-4";
  const errorClass = "text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-2 block";

  const services = [
    { icon: <Truck className="w-8 h-8" />, title: "Full Truckload", desc: "Dedicated capacity across North America with real-time tracking." },
    { icon: <Globe className="w-8 h-8" />, title: "LTL Freight", desc: "Cost-effective solutions for partial loads without sacrificing speed." },
    { icon: <Shield className="w-8 h-8" />, title: "Specialized", desc: "Handling complex oversize, heavy-haul, and sensitive freight." },
    { icon: <Clock className="w-8 h-8" />, title: "Expedited", desc: "Time-critical delivery solutions when every minute counts." },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-noise">
        {/* Background Overlay & Video */}
        <div className="absolute inset-0 z-0 bg-white overflow-hidden">
          {/* The video layer - slightly desaturated and muted to act as atmosphere */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.25] grayscale mix-blend-multiply"
          >
            <source src="/hero-truck-bg.mp4" type="video/mp4" />
          </video>

          {/* Vertical gradient: Solid white at the top for perfect text/logo readability, smoothly transitioning to reveal the video at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>

          {/* Horizontal gradient: Softens the edges so the video feels like a subtle cinematic element rather than a harsh bounding box */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-[var(--charcoal)] font-mono text-[10px] md:text-[12px] uppercase tracking-[0.3em] mb-4 md:mb-6 block opacity-70 px-4">
              Focused Freight Brokerage for North American Shipments
            </span>
            <h1 className="mb-6 md:mb-8 text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[var(--charcoal)] max-w-4xl mx-auto uppercase" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
              PRECISION FREIGHT SOLUTIONS<br className="hidden md:block" /> FOR DRY VAN & REEFER
            </h1>
            <p className="text-[var(--charcoal)]/80 text-lg md:text-xl font-light max-w-lg mx-auto mb-12 leading-relaxed">
              Built for shippers who value responsive communication, disciplined execution, and dependable capacity across North America.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 md:mt-16 w-full max-w-sm sm:max-w-none mx-auto">
              <a href="/quote" className="premium-btn group px-8 sm:px-12 py-5 sm:py-6 text-white font-bold uppercase tracking-[0.2em] text-[11px] sm:text-[12px] w-full sm:w-auto shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Request a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-[5px] transition-transform duration-[320ms] ease-[0.25,1,0.5,1]" />
                </span>
              </a>
              <a href="/carrier" className="group px-8 sm:px-12 py-5 sm:py-6 border border-[var(--charcoal)]/15 text-[var(--charcoal)] font-bold uppercase tracking-[0.2em] text-[11px] sm:text-[12px] hover:bg-[var(--charcoal)]/[0.02] hover:border-[var(--charcoal)]/30 hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-[0_15px_35px_-5px_rgba(28,28,30,0.06),0_8px_15px_-5px_rgba(28,28,30,0.04)] transition-all duration-[320ms] ease-[0.25,1,0.5,1] w-full sm:w-auto text-center cursor-pointer">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Join Carrier Network <ArrowRight className="w-4 h-4 group-hover:translate-x-[5px] transition-transform duration-[320ms] ease-[0.25,1,0.5,1]" />
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <ServiceShowcase />

      {/* Advantage Section */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-28">

            {/* Left Column: Sticky Header */}
            <div className="lg:w-5/12">
              <div className="sticky top-32 md:top-44">
                <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-[var(--charcoal)]/40 font-bold block mb-8">Operating Advantages</span>
                <h2 className="uppercase text-[var(--charcoal)] mb-8 text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-[0.95]" style={{ fontFamily: 'var(--font-didone), serif' }}>The Apex<br /> Advantage</h2>
                <p className="max-w-sm text-[var(--charcoal)]/60 text-[16px] font-light leading-relaxed">
                  Six operational disciplines that define how we manage every shipment — from carrier vetting to final delivery confirmation.
                </p>
                <div className="mt-12 pt-8 border-t border-black/[0.06]">
                  <a href="/services" className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--charcoal)]/60 hover:text-[var(--charcoal)] transition-colors duration-500">
                    View all capabilities
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Scrolling Cards with Reveal */}
            <motion.div
              className="lg:w-7/12 flex flex-col gap-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
            >
              {[
                { title: "Proactive Freight Tracking", desc: "Continuous visibility and exception management from dispatch to delivery.", num: "01", icon: Radar },
                { title: "Strict Carrier Compliance", desc: "Stringent vetting protocols ensuring every load is moved by high-performing operators.", num: "02", icon: ShieldCheck },
                { title: "Dynamic Market Analytics", desc: "Data-backed rate intelligence providing fair, accurate, and consistent lane pricing.", num: "03", icon: BarChart3 },
                { title: "Single-Point Accountability", desc: "Direct access to experienced brokers who own your freight through the entire lifecycle.", num: "04", icon: UserCheck },
                { title: "Streamlined Operations", desc: "Efficient load matching and centralized documentation to eliminate administrative friction.", num: "05", icon: Workflow },
                { title: "Risk Mitigation", desc: "Proactive adherence to industry regulations to protect cargo and brand reputation.", num: "06", icon: Scale },
              ].map((adv, idx) => {
                const Icon = adv.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.9, ease: [0.25, 1, 0.4, 1] }
                      }
                    }}
                    className="group relative border-t border-black/[0.06] pt-10 pb-14 px-4 md:px-14 bg-transparent transition-all duration-700 ease-[0.16,1,0.3,1] hover:bg-[var(--maroon)]/[0.02] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)] hover:border-[var(--maroon)]/[0.12]"
                  >
                    <div className="flex items-start gap-8 md:gap-12">
                      {/* Icon + Number Column */}
                      <div className="flex flex-col items-center gap-4 shrink-0 pt-1">
                        <Icon className="w-5 h-5 stroke-[1.5px] text-[var(--charcoal)]/20 group-hover:text-[var(--maroon)]/70 transition-colors duration-500" />
                        <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--charcoal)]/20">
                          {adv.num}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="max-w-sm">
                        <h3 className="font-medium text-lg md:text-xl tracking-tight mb-3 text-[var(--charcoal)] group-hover:text-[var(--charcoal)] transition-colors duration-500">
                          {adv.title}
                        </h3>
                        <p className="text-[14px] md:text-[15px] leading-relaxed font-light text-[var(--charcoal)]/50">
                          {adv.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Quote Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden bg-[#F8F8F9] border-t border-black/[0.04] selection:bg-blue-500/20 selection:text-blue-900">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Create a better sense of boundary across the layout, balanced columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

            {/* Left Column - Editorial */}
            <motion.div
              className="lg:col-span-5 pt-4 pb-6 flex flex-col justify-between"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                {/* Heading — Scaled up to match Advantage section */}
                <h2 className="mb-8 uppercase text-[var(--charcoal)] leading-[0.95] text-4xl md:text-5xl lg:text-7xl tracking-tighter" style={{ fontFamily: 'var(--font-didone), serif' }}>
                  Submit a<br />Freight Inquiry
                </h2>

                {/* Body Text */}
                <p className="text-[var(--charcoal)]/60 text-[16px] font-light leading-[1.8] max-w-[340px]">
                  Expanding your routing guide or managing a disruption? We review new shipper inquiries with priority attention.
                </p>
              </div>

              {/* Balanced horizontal rule sitting freely in the flex-between column geometry */}
              <div className="w-full max-w-[340px] border-t border-black/[0.05]" />

              {/* Direct contact link */}
              <div className="max-w-[340px]">
                <p className="text-[10px] font-mono tracking-[0.2em] text-[var(--charcoal)]/35 uppercase mb-3">Prefer direct contact?</p>
                <a href="mailto:info@apexfreightbrokerage.com" className="group inline-flex items-center gap-2 text-[var(--maroon)]/80 font-medium text-[13px] hover:text-[var(--maroon)] transition-colors duration-300">
                  info@apexfreightbrokerage.com
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              className="lg:col-span-7 lg:pl-6 xl:pl-8 relative flex flex-col pb-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Vertical divider - slightly more visible but still subtle */}
              <div className="hidden lg:block absolute left-0 top-32 bottom-32 w-[1px] bg-black/[0.07]" />

              {/* Open Editorial Form Layout - No Box */}
              <div className="relative pt-2 flex-grow flex flex-col">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full justify-between">
                  {/* Strict 2-Column Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">

                    {/* Row 1 */}
                    <div className="flex flex-col relative z-20">
                      <CityAutocomplete
                        label="ORIGIN CITY *"
                        value={formData.origin}
                        onChange={(res) => { setFormData({ ...formData, origin: res.city }); if (formErrors.origin) setFormErrors({ ...formErrors, origin: "" }); }}
                        onError={() => { }}
                        inputBaseClass={inputBaseClass}
                        labelClass={labelClass}
                        errorClass="text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-1 absolute bottom-[-20px] left-0"
                        compact={true}
                        error={formErrors.origin}
                      />
                      {/* Reserved error slot — keeps layout stable */}
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-2 block min-h-[16px]">&nbsp;</span>
                    </div>
                    <div className="flex flex-col relative z-10">
                      <CityAutocomplete
                        label="DESTINATION CITY *"
                        value={formData.destination}
                        onChange={(res) => { setFormData({ ...formData, destination: res.city }); if (formErrors.destination) setFormErrors({ ...formErrors, destination: "" }); }}
                        onError={() => { }}
                        inputBaseClass={inputBaseClass}
                        labelClass={labelClass}
                        errorClass="text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-1 absolute bottom-[-20px] left-0"
                        compact={true}
                        error={formErrors.destination}
                      />
                      {/* Reserved error slot — keeps layout stable */}
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-2 block min-h-[16px]">&nbsp;</span>
                    </div>

                    {/* Row 2/3 */}
                    <div className="flex flex-col relative z-0">
                      <label className={labelClass}>EQUIPMENT *</label>
                      <select className={`${inputBaseClass} appearance-none cursor-pointer`} value={formData.equipment} onChange={(e) => { setFormData({ ...formData, equipment: e.target.value }); if (formErrors.equipment) setFormErrors({ ...formErrors, equipment: "" }); }}>
                        <option value="" disabled>Select Equipment</option>
                        <option value="Dry Van">DRY VAN</option>
                        <option value="Flatbed">FLATBED</option>
                        <option value="Reefer">REFRIGERATED</option>
                        <option value="Step Deck">STEP DECK</option>
                      </select>
                      <span className={`${errorClass} min-h-[16px]`}>{formErrors.equipment || ' '}</span>
                    </div>

                    <div className="flex flex-col relative z-0">
                      <label className={labelClass}>TOTAL WEIGHT (LBS) *</label>
                      <input
                        type="text"
                        placeholder="e.g. 40,000"
                        className={inputBaseClass}
                        value={formData.weight}
                        onChange={(e) => { handleWeightChange(e); if (formErrors.weight) setFormErrors({ ...formErrors, weight: "" }); }}
                      />
                      <span className={`${errorClass} min-h-[16px]`}>{formErrors.weight || ' '}</span>
                    </div>

                    <div className="flex flex-col relative z-0">
                      <label className={labelClass}>PICKUP DATE</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="mm-dd-yyyy"
                          className={`${inputBaseClass} tracking-widest text-[14px]`}
                          value={formData.date}
                          onChange={(e) => { handleDateChange(e); if (formErrors.date) setFormErrors({ ...formErrors, date: "" }); }}
                        />
                        <div className="absolute right-0 top-0 bottom-3 flex items-center text-[var(--charcoal)]/30 hover:text-[var(--maroon)] transition-colors duration-300">
                          <input
                            title="Select Date"
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                              const d = e.target.value;
                              if (d) {
                                const parts = d.split('-');
                                if (parts.length === 3) {
                                  const formatted = `${parts[1]}-${parts[2]}-${parts[0]}`;
                                  setFormData({ ...formData, date: formatted });
                                  validateDate(formatted);
                                  if (formErrors.date) setFormErrors({ ...formErrors, date: "" });
                                }
                              }
                            }}
                          />
                          <Calendar className="w-4 h-4 pointer-events-none" />
                        </div>
                      </div>
                      <span className={`${errorClass} min-h-[16px]`}>{formErrors.date || dateError || '\u00a0'}</span>
                    </div>
                  </div>

                  {/* Refined Right-Aligned Action Zone — top aligned with PREFER DIRECT CONTACT label */}
                  <div className="mt-auto pt-[47px] flex flex-col items-end">
                    <button
                      type="submit"
                      className="group flex items-center gap-4 text-[var(--maroon)] hover:text-[var(--maroon-dark)] transition-all duration-500 ease-[0.25,1,0.4,1] hover:-translate-y-[2px] hover:scale-[1.02] hover:drop-shadow-[0_4px_8px_rgba(114,35,46,0.15)]"
                    >
                      <span className="font-mono text-[12px] uppercase tracking-[0.25em] font-bold">Submit Inquiry</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 ease-[0.25,1,0.4,1]" />
                    </button>
                    <div className="flex flex-col items-end mt-6 space-y-2 text-right">
                      <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-[var(--charcoal)]/40">
                        Reviewed by our operations team during business hours
                      </p>
                      <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-[var(--charcoal)]/30">
                        Freight details remain confidential
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

      </section>
    </main>
  );
}
