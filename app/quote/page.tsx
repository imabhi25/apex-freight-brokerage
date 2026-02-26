"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const inputBaseClass = "block w-full h-[52px] px-0 text-[16px] font-sans text-[var(--charcoal)] bg-transparent border-b border-[var(--charcoal)]/10 focus:border-[var(--maroon)] focus:ring-0 focus:outline-none transition-all duration-300 placeholder-transparent peer rounded-none";
  const labelClass = "absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--charcoal)] uppercase tracking-[0.2em] font-mono transition-all duration-300 pointer-events-none peer-focus:-translate-y-[44px] peer-focus:text-[var(--maroon)] peer-[:not(:placeholder-shown)]:-translate-y-[44px]";
  const errorClass = "text-[10px] font-bold text-red-500 uppercase tracking-[0.1em] font-mono mt-1 absolute";

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
            subtext={"Your quote request has been received and logged.\nOur team will review lane and capacity conditions and respond shortly.\nPlease keep your reference ID for follow-up."}
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
                  Precision logistics, engineered for your supply chain. Provide your shipment requirements below for a tailored analysis.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col items-end gap-3 w-full md:w-64">
                <span className="text-[11px] font-mono text-[var(--charcoal)] tracking-[0.2em] uppercase">
                  {`0${currentStep} / 03`}
                </span>
                <div className="w-full h-px bg-[var(--charcoal)]/10 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: currentStep === 1 ? "33.33%" : currentStep === 2 ? "66.66%" : "100%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 h-full bg-[var(--maroon)]"
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
                      label="ZIP CODE *"
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
                      label="ZIP CODE *"
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
                  <div className="pt-12 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={isValidating || !(formData.organization.trim() && formData.email.trim() && formData.originCity.trim() && formData.originZip.trim() && formData.destinationCity.trim() && formData.destinationZip.trim())}
                      className={`text-[14px] font-bold tracking-[0.2em] uppercase font-mono transition-all duration-500 hover:scale-105 origin-right inline-block ease-[0.16,1,0.3,1] ${(isValidating || !(formData.organization.trim() && formData.email.trim() && formData.originCity.trim() && formData.originZip.trim() && formData.destinationCity.trim() && formData.destinationZip.trim())) ? 'text-[var(--charcoal)]/20 cursor-not-allowed' : 'text-[var(--charcoal)] hover:text-[var(--maroon)]'}`}
                    >
                      {isValidating ? "VALIDATING..." : "NEXT: THE LOAD"}
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
                  <div>
                    <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-[var(--charcoal)]/30 uppercase mb-1">STEP 2 OF 3</p>
                    <h2 className="text-[28px] font-bold tracking-[0.15em] uppercase font-mono text-[var(--charcoal)]">THE LOAD</h2>
                    <div className="mt-3 h-px bg-[var(--charcoal)]/10 w-full" />
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
                        className={`${inputBaseClass} text-left w-full flex items-center justify-between`}
                      >
                        <span className={formData.equipment ? "text-[var(--charcoal)]" : "text-transparent select-none"}>
                          {formData.equipment ? formData.equipment.toUpperCase() : "placeholder"}
                        </span>
                        <svg
                          className={`w-3 h-3 text-[var(--charcoal)]/30 transition-transform duration-200 ${equipOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <label
                        className={`${labelClass} ${formData.equipment ? "text-[10px] -translate-y-6 scale-75" : ""}`}
                        style={{ pointerEvents: "none" }}
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
                  <div className="space-y-5 text-left">
                    <label className="text-[10px] font-bold text-[var(--charcoal)]/30 uppercase tracking-[0.2em] font-mono block">
                      HAZARDOUS MATERIALS?
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isHazardous: true })}
                        className={`px-10 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-all duration-300 border w-full sm:w-auto ${formData.isHazardous ? 'bg-[var(--maroon)] text-white border-[var(--maroon)]' : 'bg-transparent text-[var(--charcoal)]/40 border-[var(--charcoal)]/10 hover:border-[var(--maroon)]/30'}`}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isHazardous: false })}
                        className={`px-10 py-3 text-[11px] font-bold tracking-[0.2em] font-mono transition-all duration-300 border w-full sm:w-auto ${!formData.isHazardous ? 'bg-[var(--maroon)] text-white border-[var(--maroon)]' : 'bg-transparent text-[var(--charcoal)]/40 border-[var(--charcoal)]/10 hover:border-[var(--maroon)]/30'}`}
                      >
                        NO
                      </button>
                    </div>
                    <AnimatePresence>
                      {formData.isHazardous && (
                        <motion.p
                          key="sds"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.3 }}
                          className="text-[11px] text-[var(--midnight-blue)]/30 font-mono tracking-wide"
                        >
                          A Safety Data Sheet (SDS) will be required upon booking.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nav buttons */}
                  <div className="pt-8 flex gap-12 items-baseline justify-end">
                    <button
                      onClick={handleBack}
                      className="text-[14px] font-bold tracking-[0.2em] uppercase font-mono text-[var(--charcoal)]/40 hover:text-[var(--maroon)] hover:scale-105 origin-right inline-block transition-all duration-500 ease-[0.16,1,0.3,1]"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!(formData.commodity.trim() && formData.equipment && formData.weight.trim() && formData.cargoValue.trim())}
                      className={`text-[14px] font-bold tracking-[0.2em] uppercase font-mono transition-all duration-500 hover:scale-105 origin-right inline-block ease-[0.16,1,0.3,1] ${(formData.commodity.trim() && formData.equipment && formData.weight.trim() && formData.cargoValue.trim()) ? 'text-[var(--charcoal)] hover:text-[var(--maroon)]' : 'text-[var(--charcoal)]/20 cursor-not-allowed'}`}
                    >
                      NEXT: CONTACT INFO
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
                  className="space-y-20"
                >
                  {/* Section heading */}
                  <div>
                    <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-[var(--charcoal)]/30 uppercase mb-1">STEP 3 OF 3</p>
                    <h2 className="text-[28px] font-bold tracking-[0.15em] uppercase font-mono">THE CONTACT</h2>
                    <div className="mt-3 h-px bg-[var(--charcoal)]/10 w-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-32 gap-y-16 md:gap-y-20 text-left">
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
                  <div className="pt-8 flex flex-col sm:flex-row gap-6 sm:gap-12 items-center sm:items-baseline justify-end w-full">
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="text-[14px] font-bold tracking-[0.2em] uppercase font-mono text-[var(--charcoal)]/40 hover:text-[var(--maroon)] hover:scale-105 origin-right inline-block transition-all duration-500 ease-[0.16,1,0.3,1] disabled:opacity-30 w-full sm:w-auto text-center"
                    >
                      BACK
                    </button>
                    <motion.div
                      className="inline-block w-full sm:w-auto"
                    >
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !(formData.contactName.trim() && formData.phone.trim() && formData.jobTitle.trim())}
                        className={`premium-btn py-5 md:py-6 px-8 md:px-16 w-full text-white font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[13px] md:text-[15px] font-mono shadow-2xl ${isSubmitting || !(formData.contactName.trim() && formData.phone.trim() && formData.jobTitle.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <span className="w-1.5 h-1.5 bg-white animate-ping rounded-full" />
                            SUBMITTING...
                          </span>
                        ) : (
                          'REQUEST QUOTE'
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                  <p className="mt-8 text-center text-[10px] font-mono tracking-widest text-[var(--charcoal)]/40 uppercase">
                    Typical response time &lt; 15 mins • Data secure & encrypted
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
