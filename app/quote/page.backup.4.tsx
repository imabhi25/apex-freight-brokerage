"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FadeInUpBox from "../components/FadeInUpBox";
import CityAutocomplete from "../components/CityAutocomplete";
import ZipAutocomplete from "../components/ZipAutocomplete";
import type { USCity } from "../data/us-cities";
import SuccessMessage from "../components/SuccessMessage";

export default function Quote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organization: "",
    email: "",
    originCity: "",
    originZip: "",
    destinationCity: "",
    destinationZip: "",
    commodity: "",
    serviceType: "",
    cargoValue: "",
    equipment: "",
    weight: "",
    dateReady: "2026-02-22",
    isHazardous: false,
    // Step 3
    contactName: "",
    phone: "",
    jobTitle: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [equipOpen, setEquipOpen] = useState(false);
  const [currentRefId, setCurrentRefId] = useState("");
  const equipRef = React.useRef<HTMLDivElement>(null);

  const equipmentOptions = [
    { value: "Dry Van", label: "DRY VAN" },
    { value: "Refrigerated", label: "REFRIGERATED" },
    { value: "Flatbed", label: "FLATBED" },
    { value: "Step-Deck", label: "STEP-DECK" },
    { value: "Less-Than-Truckload (LTL)", label: "LESS-THAN-TRUCKLOAD (LTL)" },
    { value: "Full-Truckload (FTL)", label: "FULL-TRUCKLOAD (FTL)" },
  ];

  // Close equipment dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (equipRef.current && !equipRef.current.contains(e.target as Node)) setEquipOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const checkZipCity = async (zip: string, city: string) => {
    if (!/^\d{5}$/.test(zip)) return "INVALID ZIP";
    try {
      const resp = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!resp.ok) return "ZIP NOT FOUND";
      const data = await resp.json();
      const place = data.places[0];
      const apiCity = place['place name'].toLowerCase().replace(/\s+/g, '');
      // Strip state abbreviation if present (e.g. "Los Angeles, CA" → "Los Angeles")
      const cityOnly = city.split(',')[0].trim();
      const userCity = cityOnly.toLowerCase().replace(/\s+/g, '');
      if (apiCity !== userCity) return "CITY CODE MISMATCH";
      return null;
    } catch (e) {
      return null;
    }
  };

  const validateZipCityPair = async (
    zip: string,
    city: string,
    cityKey: string,
    zipKey: string
  ) => {
    if (!zip || !city) return;
    const err = await checkZipCity(zip, city);
    if (err === "CITY CODE MISMATCH") {
      setErrors(prev => ({ ...prev, [cityKey]: "CITY CODE MISMATCH", [zipKey]: "" }));
    } else if (err) {
      setErrors(prev => ({ ...prev, [zipKey]: err, [cityKey]: prev[cityKey] || "" }));
    } else {
      setErrors(prev => ({ ...prev, [cityKey]: "", [zipKey]: "" }));
    }
  };

  // Real-time ZIP validation: fires as soon as user finishes typing all 5 digits
  useEffect(() => {
    if (formData.originZip.length === 5 && formData.originCity.trim()) {
      validateZipCityPair(formData.originZip, formData.originCity, 'originCity', 'originZip');
    } else if (formData.originZip.length < 5) {
      setErrors(prev => ({ ...prev, originCity: prev.originCity === "CITY CODE MISMATCH" ? "" : prev.originCity }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.originZip]);

  useEffect(() => {
    if (formData.destinationZip.length === 5 && formData.destinationCity.trim()) {
      validateZipCityPair(formData.destinationZip, formData.destinationCity, 'destinationCity', 'destinationZip');
    } else if (formData.destinationZip.length < 5) {
      setErrors(prev => ({ ...prev, destinationCity: prev.destinationCity === "CITY CODE MISMATCH" ? "" : prev.destinationCity }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.destinationZip]);

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};
    setIsValidating(true);

    if (currentStep === 1) {
      if (!formData.organization.trim()) newErrors.organization = "REQUIRED";
      if (!formData.email.trim()) newErrors.email = "REQUIRED";
      else if (!validateEmail(formData.email)) newErrors.email = "INVALID EMAIL";

      if (!formData.originCity.trim()) newErrors.originCity = "REQUIRED";
      if (!formData.originZip.trim()) newErrors.originZip = "REQUIRED";
      else {
        const err = await checkZipCity(formData.originZip, formData.originCity);
        if (err) newErrors.originCity = "CITY CODE MISMATCH";
      }

      if (!formData.destinationCity.trim()) newErrors.destinationCity = "REQUIRED";
      if (!formData.destinationZip.trim()) newErrors.destinationZip = "REQUIRED";
      else {
        const err = await checkZipCity(formData.destinationZip, formData.destinationCity);
        if (err) newErrors.destinationCity = "CITY CODE MISMATCH";
      }
    } else if (currentStep === 2) {
      if (!formData.commodity.trim()) newErrors.commodity = "REQUIRED";
      if (!formData.equipment) newErrors.equipment = "REQUIRED";
      if (!formData.weight.trim()) newErrors.weight = "REQUIRED";
    }

    setErrors(newErrors);
    setIsValidating(false);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const loadingMessages = [
    "Analyzing market capacity...",
    "Vetting carrier network...",
    "Finalizing analysis...",
  ];

  const handleSubmit = async () => {
    // Validate Step 3 fields
    const newErrors: Record<string, string> = {};
    if (!formData.contactName.trim()) newErrors.contactName = "REQUIRED";
    if (!formData.phone.trim()) {
      newErrors.phone = "REQUIRED";
    } else {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length !== 10) {
        newErrors.phone = "INVALID PHONE";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transmission failed");

      const refId = data.refId;
      setCurrentRefId(refId);

      // Log full payload with Ref ID
      console.log(`APEX QUOTE SUBMISSION [${refId}]:`, JSON.stringify(formData, null, 2));

      // Simulate the analysis phases for UI/UX
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
      setErrors({ submit: "TRANSMISSION FAILED. PLEASE RETRY." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass = "block w-full h-[52px] px-0 text-[15px] font-medium font-sans text-[var(--charcoal)] bg-transparent border-b border-[var(--charcoal)]/30 focus:border-[var(--charcoal)]/80 focus:ring-0 focus:outline-none transition-colors duration-500 placeholder-transparent peer rounded-none [&:not(:placeholder-shown)]:border-[var(--charcoal)]/50";
  const labelClass = "absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--charcoal)]/60 uppercase tracking-[0.2em] font-mono transition-all duration-500 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--charcoal)] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:-translate-y-[44px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--charcoal)]/80";
  const errorClass = "text-[10px] font-medium text-[var(--maroon)] uppercase tracking-[0.1em] font-mono mt-2 absolute flex items-center gap-1.5 opacity-90";

  const stepVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 flex justify-center text-left relative overflow-hidden">
      <div className="w-full max-w-7xl px-6">
        {isSubmitted ? (
          <SuccessMessage
            variant="quote"
            headline="REQUEST RECEIVED"
            subtext={"Your freight inquiry has been received and logged by our team.\nWe will review lane, equipment, and timing requirements and follow up during business hours.\nPlease retain your reference ID for any communication regarding this request."}
            referenceId={currentRefId}
            onReset={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                organization: "",
                email: "",
                originCity: "",
                originZip: "",
                destinationCity: "",
                destinationZip: "",
                commodity: "",
                serviceType: "",
                cargoValue: "",
                equipment: "",
                weight: "",
                dateReady: new Date().toISOString().split('T')[0],
                isHazardous: false,
                contactName: "",
                phone: "",
                jobTitle: "",
                notes: "",
              });
              setErrors({});
              setCurrentRefId("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <div className="space-y-16 md:space-y-24">
            {/* Static Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 max-w-7xl relative z-10">
              <div className="max-w-4xl">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extralight mb-4 md:mb-6 tracking-tight leading-none uppercase text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), serif' }}>
                  REQUEST A QUOTE
                </h1>
                <p className="text-[var(--charcoal)]/50 text-[14px] md:text-base font-sans max-w-2xl leading-relaxed tracking-[0.05em]">
                  Provide your shipment details below and our team will review the routing, equipment, and timing requirements.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col items-start md:items-end justify-end h-full w-full md:w-48 pb-2">
                <span className="text-[10px] font-mono font-bold text-[var(--charcoal)]/60 tracking-[0.3em] uppercase mb-3">
                  {`0${currentStep} / 03`}
                </span>
                <div className="w-full h-px bg-[var(--charcoal)]/10 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: currentStep === 1 ? "33.33%" : currentStep === 2 ? "66.66%" : "100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 h-full bg-[var(--charcoal)]/60"
                  />
                </div>
              </div>
            </div>

            {/* Animated Step Container */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="space-y-16 md:space-y-20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-32 gap-y-16 md:gap-y-20">
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => {
                          setFormData({ ...formData, organization: e.target.value });
                          if (errors.organization) setErrors({ ...errors, organization: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>ORGANIZATION *</label>
                      {errors.organization && <span className={errorClass}>{errors.organization}</span>}
                    </div>
                    <div className="relative z-0 w-full group">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>EMAIL ADDRESS *</label>
                      {errors.email && <span className={errorClass}>{errors.email}</span>}
                    </div>
                    {/* Origin City Autocomplete */}
                    <CityAutocomplete
                      label="ORIGIN CITY *"
                      value={formData.originCity}
                      onChange={({ city, zip }) => {
                        setFormData(prev => ({ ...prev, originCity: city, originZip: zip }));
                        setErrors(prev => ({ ...prev, originCity: "", originZip: "" }));
                      }}
                      onError={(cityErr) => {
                        setErrors(prev => ({ ...prev, originCity: cityErr || "" }));
                      }}
                      error={errors.originCity}
                      inputBaseClass={inputBaseClass}
                      labelClass={labelClass}
                      errorClass={errorClass}
                    />
                    {/* Origin ZIP Autocomplete */}
                    <ZipAutocomplete
                      label="ORIGIN ZIP CODE *"
                      value={formData.originZip}
                      onChange={(zip) => {
                        setFormData(prev => ({ ...prev, originZip: zip }));
                        setErrors(prev => ({ ...prev, originZip: "" }));
                      }}
                      onBlurValidate={() => validateZipCityPair(formData.originZip, formData.originCity, 'originCity', 'originZip')}
                      error={errors.originZip}
                      inputBaseClass={inputBaseClass}
                      labelClass={labelClass}
                      errorClass={errorClass}
                    />
                    {/* Destination City Autocomplete */}
                    <CityAutocomplete
                      label="DESTINATION CITY *"
                      value={formData.destinationCity}
                      onChange={({ city, zip }) => {
                        setFormData(prev => ({ ...prev, destinationCity: city, destinationZip: zip }));
                        setErrors(prev => ({ ...prev, destinationCity: "", destinationZip: "" }));
                      }}
                      onError={(cityErr) => {
                        setErrors(prev => ({ ...prev, destinationCity: cityErr || "" }));
                      }}
                      error={errors.destinationCity}
                      inputBaseClass={inputBaseClass}
                      labelClass={labelClass}
                      errorClass={errorClass}
                    />
                    {/* Destination ZIP Autocomplete */}
                    <ZipAutocomplete
                      label="DESTINATION ZIP CODE *"
                      value={formData.destinationZip}
                      onChange={(zip) => {
                        setFormData(prev => ({ ...prev, destinationZip: zip }));
                        setErrors(prev => ({ ...prev, destinationZip: "" }));
                      }}
                      onBlurValidate={() => validateZipCityPair(formData.destinationZip, formData.destinationCity, 'destinationCity', 'destinationZip')}
                      error={errors.destinationZip}
                      inputBaseClass={inputBaseClass}
                      labelClass={labelClass}
                      errorClass={errorClass}
                    />
                  </div>
                  <div className="pt-16 pb-8 border-t border-[var(--charcoal)]/5 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={isValidating || !(formData.organization.trim() && formData.email.trim() && formData.originCity.trim() && formData.originZip.trim() && formData.destinationCity.trim() && formData.destinationZip.trim())}
                      className={`group relative inline-flex items-center gap-3 text-[12px] md:text-[13px] font-bold tracking-[0.2em] uppercase font-mono transition-all duration-500 ease-[0.25,1,0.4,1] origin-right ${(isValidating || !(formData.organization.trim() && formData.email.trim() && formData.originCity.trim() && formData.originZip.trim() && formData.destinationCity.trim() && formData.destinationZip.trim())) ? 'opacity-30 cursor-not-allowed text-[var(--charcoal)]' : 'text-[var(--charcoal)] hover:text-[var(--maroon)]'}`}
                    >
                      {isValidating ? "VALIDATING..." : (
                        <span className="flex items-center gap-4 relative z-10 transition-transform duration-500 group-hover:translate-x-[-4px]">
                          NEXT: THE LOAD
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-500 ease-[0.25,1,0.5,1]" />
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="space-y-20"
                >
                  {/* Section heading */}
                  <div className="flex justify-between items-end gap-8 pb-4 border-b border-[var(--charcoal)]/10">
                    <div>
                      <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-[var(--charcoal)]/30 uppercase mb-2">STEP 2 OF 3</p>
                      <h2 className="text-[28px] md:text-[32px] font-bold tracking-[0.15em] uppercase font-mono text-[var(--charcoal)] leading-none">THE LOAD</h2>
                    </div>
                    <p className="hidden md:block text-[12px] font-mono tracking-[0.1em] text-[var(--charcoal)]/40 uppercase max-w-[280px] text-right">
                      Specify commodity, equipment, and weight parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-32 gap-y-16 md:gap-y-20">

                    {/* Commodity — full width */}
                    <div className="relative z-0 w-full group md:col-span-2">
                      <input
                        type="text"
                        value={formData.commodity}
                        onChange={(e) => {
                          setFormData({ ...formData, commodity: e.target.value });
                          if (errors.commodity) setErrors({ ...errors, commodity: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>COMMODITY *</label>
                      {errors.commodity && <span className={errorClass}>{errors.commodity}</span>}
                    </div>

                    {/* Equipment — custom overlay dropdown */}
                    <div ref={equipRef} className="relative w-full group md:col-span-2" style={{ zIndex: equipOpen ? 50 : "auto" }}>
                      <button
                        type="button"
                        onClick={() => setEquipOpen((o) => !o)}
                        className={`${inputBaseClass} relative`}
                        style={{ paddingRight: '2rem' }}
                      >
                        <span className={`block w-full text-left truncate ${formData.equipment ? "opacity-100" : "opacity-0"}`}>
                          {formData.equipment ? formData.equipment.toUpperCase() : "PLACEHOLDER"}
                        </span>
                        <svg
                          className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--charcoal)]/40 transition-transform duration-300 ${equipOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <label
                        className={`absolute left-0 text-[12px] font-bold uppercase tracking-[0.2em] font-mono transition-all duration-500 pointer-events-none ${formData.equipment ? "top-1/2 -translate-y-[44px] text-[11px] text-[var(--charcoal)]/80" : "top-1/2 -translate-y-1/2 text-[var(--charcoal)]/60"}`}
                      >
                        EQUIPMENT TYPE *
                      </label>
                      {errors.equipment && <span className={errorClass}>{errors.equipment}</span>}

                      {/* Overlay dropdown */}
                      {equipOpen && (
                        <ul
                          className="absolute top-full left-0 w-full list-none p-0 m-0"
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid var(--cool-gray)",
                            zIndex: 9999,
                          }}
                        >
                          {equipmentOptions.map((opt) => (
                            <li
                              key={opt.value}
                              onMouseDown={() => {
                                setFormData({ ...formData, equipment: opt.value });
                                setErrors({ ...errors, equipment: "" });
                                setEquipOpen(false);
                              }}
                              className="px-4 py-3 cursor-pointer transition-colors duration-150"
                              style={{
                                background: formData.equipment === opt.value ? "rgba(128, 0, 0, 0.05)" : "transparent",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(128, 0, 0, 0.08)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = formData.equipment === opt.value ? "rgba(128, 0, 0, 0.05)" : "transparent")}
                            >
                              <span className="text-[15px] text-[var(--charcoal)] font-mono font-bold uppercase tracking-[0.18em] block">
                                {opt.label}
                              </span>
                              {formData.equipment === opt.value && (
                                <span className="text-[9px] text-[var(--maroon)] font-mono tracking-widest block mt-0.5">SELECTED</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Estimated Cargo Value with $ prefix */}
                    <div className="relative z-0 w-full group">
                      {/* $ prefix — only visible when field has value or is focused */}
                      <span className="absolute left-0 top-4 text-[var(--charcoal)] font-mono text-sm select-none pointer-events-none transition-opacity duration-200"
                        style={{ opacity: formData.cargoValue ? 1 : 0 }}>
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.cargoValue}
                        onFocus={() => { }}
                        onChange={(e) => {
                          // Strip all non-digits, then re-format with US commas
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw ? Number(raw).toLocaleString("en-US") : "";
                          setFormData({ ...formData, cargoValue: formatted });
                        }}
                        className={`${inputBaseClass} transition-all duration-200`}
                        style={{ paddingLeft: formData.cargoValue ? '1rem' : '0' }}
                        placeholder=" "
                      />
                      <label className={labelClass}>ESTIMATED CARGO VALUE</label>
                    </div>

                    {/* Total Weight */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.weight}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw ? Number(raw).toLocaleString("en-US") : "";
                          setFormData({ ...formData, weight: formatted });
                          if (errors.weight) setErrors({ ...errors, weight: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>TOTAL WEIGHT (LBS) *</label>
                      {errors.weight && <span className={errorClass}>{errors.weight}</span>}
                    </div>
                  </div>

                  {/* Hazmat toggle */}
                  <div className="space-y-6 text-left pt-2">
                    <label className="text-[11px] font-bold text-[var(--charcoal)]/80 uppercase tracking-[0.2em] font-mono block">
                      HAZARDOUS MATERIALS?
                    </label>
                    <div className="relative flex w-full sm:w-[240px] bg-[var(--charcoal)]/[0.03] p-1 rounded-sm">
                      {/* Animated sliding background pill */}
                      <motion.div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-[0_2px_8px_rgba(28,28,30,0.08)] rounded-[2px]"
                        initial={false}
                        animate={{
                          x: formData.isHazardous ? 0 : "100%"
                        }}
                        transition={{ duration: 0.4, ease: [0.25, 1, 0.4, 1] }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isHazardous: true })}
                        className={`relative z-10 flex-1 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-colors duration-400 ${formData.isHazardous ? 'text-[var(--charcoal)]' : 'text-[var(--charcoal)]/40 hover:text-[var(--charcoal)]/70'}`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isHazardous: false })}
                        className={`relative z-10 flex-1 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-colors duration-400 ${!formData.isHazardous ? 'text-[var(--charcoal)]' : 'text-[var(--charcoal)]/40 hover:text-[var(--charcoal)]/70'}`}
                      >
                        NO
                      </button>
                    </div>
                    <AnimatePresence>
                      {formData.isHazardous && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.5, ease: [0.25, 1, 0.4, 1] }}
                          className="text-[11px] text-[var(--charcoal)]/40 font-mono tracking-wide overflow-hidden"
                        >
                          A Safety Data Sheet (SDS) will be required upon booking.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nav buttons */}
                  <div className="pt-8 flex gap-8 items-center justify-end">
                    <button
                      onClick={handleBack}
                      className="text-[13px] font-bold tracking-[0.2em] uppercase font-mono text-[var(--charcoal)]/50 hover:text-[var(--maroon)] hover:scale-105 origin-right inline-block transition-all duration-500 ease-[0.16,1,0.3,1]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!(formData.commodity.trim() && formData.equipment && formData.weight.trim() && formData.cargoValue.trim())}
                      className={`group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[var(--charcoal)]/20 text-[12px] font-bold tracking-[0.2em] uppercase font-mono transition-all duration-500 ease-[0.25,1,0.4,1] hover:-translate-y-[2px] hover:shadow-xl hover:bg-[var(--charcoal)] hover:text-white hover:border-[var(--charcoal)] origin-right ${(formData.commodity.trim() && formData.equipment && formData.weight.trim() && formData.cargoValue.trim()) ? 'text-[var(--charcoal)]' : 'opacity-40 cursor-not-allowed'}`}
                    >
                      <span className="flex items-center gap-2 relative z-10">
                        NEXT: CONTACT INFO
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-[5px] transition-transform duration-[320ms] ease-[0.25,1,0.5,1]" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  {/* Section heading */}
                  <div className="flex justify-between items-end gap-8 pb-4 border-b border-[var(--charcoal)]/10">
                    <div>
                      <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-[var(--charcoal)]/30 uppercase mb-2">STEP 3 OF 3</p>
                      <h2 className="text-[28px] md:text-[32px] font-bold tracking-[0.15em] uppercase font-mono text-[var(--charcoal)] leading-none">THE CONTACT</h2>
                    </div>
                    <p className="hidden md:block text-[12px] font-mono tracking-[0.1em] text-[var(--charcoal)]/40 uppercase max-w-[280px] text-right">
                      Share the best contact details for quote review and follow-up.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-32 gap-y-12 text-left">
                    {/* Contact Name — full width */}
                    <div className="relative z-0 w-full group md:col-span-2">
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => {
                          setFormData({ ...formData, contactName: e.target.value });
                          if (errors.contactName) setErrors({ ...errors, contactName: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>CONTACT NAME *</label>
                      {errors.contactName && <span className={errorClass}>{errors.contactName}</span>}
                    </div>

                    {/* Phone */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setFormData({ ...formData, phone: formatted });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        className={`${inputBaseClass}`}
                        placeholder="(###) ###-####"
                      />
                      <label className={labelClass}>PHONE NUMBER *</label>
                      {errors.phone && <span className={errorClass}>{errors.phone}</span>}
                    </div>

                    {/* Job Title */}
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className={`${inputBaseClass}`}
                        placeholder=" "
                      />
                      <label className={labelClass}>JOB TITLE / ROLE</label>
                    </div>

                    {/* Additional Notes — full width textarea */}
                    <div className="relative z-0 w-full group md:col-span-2">
                      <textarea
                        value={formData.notes}
                        rows={4}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className={`${inputBaseClass} resize-none`}
                        placeholder=" "
                      />
                      <label className={labelClass}>ADDITIONAL NOTES</label>
                    </div>
                  </div>

                  {/* Nav + Submit */}
                  <div className="pt-12 mt-4 border-t border-[var(--charcoal)]/5 flex flex-col sm:flex-row gap-8 items-center justify-between w-full">
                    {/* Supporting Info */}
                    <div className="flex flex-col gap-2 order-2 sm:order-1 text-center sm:text-left">
                      <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[var(--charcoal)]/50 uppercase leading-relaxed">
                        Reviewed by our operations team during business hours.
                        <br className="hidden sm:block" />
                        <span className="text-[var(--charcoal)]/30">System encrypted.</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 sm:gap-8 order-1 sm:order-2 w-full sm:w-auto overflow-hidden">
                      <button
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase font-mono text-[var(--charcoal)]/40 hover:text-[var(--maroon)] hover:scale-105 transition-all duration-400 ease-[0.16,1,0.3,1] disabled:opacity-30 origin-right whitespace-nowrap"
                      >
                        BACK
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !(formData.contactName.trim() && formData.phone.trim() && formData.jobTitle.trim())}
                        className={`group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 bg-[var(--charcoal)] text-white text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase font-mono transition-all duration-500 ease-[0.25,1,0.4,1] hover:-translate-y-[2px] shadow-[0_4px_20px_rgba(28,28,30,0.15)] hover:shadow-[0_8px_30px_rgba(28,28,30,0.25)] origin-right w-full sm:w-auto ${isSubmitting || !(formData.contactName.trim() && formData.phone.trim() && formData.jobTitle.trim()) ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <span className="absolute inset-0 bg-[#3A3A3C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.25,1,0.4,1]" />
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3 relative z-10">
                            <span className="w-1.5 h-1.5 bg-white animate-ping rounded-full" />
                            SUBMITTING...
                          </span>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            SUBMIT INQUIRY
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-[5px] transition-transform duration-[320ms] ease-[0.25,1,0.5,1]" />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
