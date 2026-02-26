"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Globe, Shield, Clock } from "lucide-react";


export default function Home() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    equipment: "Dry Van",
    weight: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Quote Request Sent!");
  };

  const inputStyle = "w-full bg-white border border-[var(--light-gray)] py-4 px-4 text-[var(--charcoal)] focus:outline-none focus:ring-1 focus:ring-[var(--maroon)] transition-all duration-300 placeholder-[var(--charcoal)]/30 font-sans font-light";
  const labelStyle = "block text-[11px] font-bold uppercase tracking-wider text-[var(--charcoal)]/70 mb-2";

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
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-white">
          {/* Subtle grid or noise could go here */}
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-[var(--charcoal)] font-mono text-[10px] md:text-[12px] uppercase tracking-[0.2em] mb-4 md:mb-6 block opacity-80 px-4">
              Now onboarding carrier partners for active operations
            </span>
            <h1 className="mb-6 md:mb-8 text-5xl md:text-7xl lg:text-8xl leading-none text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
              Connecting Shippers<br className="hidden md:block" /> and Carriers Seamlessly
            </h1>
            <p className="text-[var(--charcoal)]/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
              Technology-enabled freight brokerage providing seamless coordination between elite shippers and premium carriers through data-informed routing and real-time execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10 md:mt-16 w-full max-w-sm sm:max-w-none mx-auto">
              <a href="/quote" className="premium-btn px-8 sm:px-12 py-5 sm:py-6 text-white font-bold uppercase tracking-[0.2em] text-[11px] sm:text-[12px] w-full sm:w-auto shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Request a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/carrier" className="px-8 sm:px-12 py-5 sm:py-6 border border-[var(--charcoal)]/10 text-[var(--charcoal)] font-bold uppercase tracking-[0.2em] text-[11px] sm:text-[12px] hover:bg-[var(--maroon)] hover:border-[var(--maroon)] hover:text-white transition-all duration-500 w-full sm:w-auto text-center">
                Join Carrier Network
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 relative z-10 border-t border-[var(--text-primary)]/5 bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--maroon)]" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--maroon)]/80">Data-driven Logistics</span>
              </div>
              <h2 className="mb-4 uppercase text-[var(--charcoal)]">Precision Services</h2>
              <p className="text-[var(--charcoal)]/60 text-base md:text-lg max-w-lg font-light">Comprehensive logistics solutions engineered with streamlined coordination for the modern supply chain.</p>
            </div>
            <a href="/services" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity text-[var(--maroon)]">
              Explore Services <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-12 group hover:-translate-y-2 transition-all duration-700 border border-[var(--light-gray)]/50 hover:border-[var(--maroon)]/20 cursor-default bg-white relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-[var(--maroon)] group-hover:h-full transition-all duration-700" />
                <div className="text-[var(--maroon)] mb-10 group-hover:scale-110 transition-transform duration-500 origin-left">
                  {service.icon}
                </div>
                <h3 className="text-xl mb-4 text-[var(--charcoal)] tracking-tight font-light">{service.title}</h3>
                <p className="text-[var(--muted-gray)] font-light text-[14px] leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantage Section */}
      <section className="py-20 md:py-32 bg-[var(--off-white)] border-t border-[var(--light-gray)]/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--maroon)]/30" />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--maroon)]/60">Modern Logistics Network</span>
            </div>
            <h2 className="uppercase text-[var(--charcoal)]">The Apex Advantage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">24/7 Monitoring</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Round-the-clock tracking and support for peace of mind.</p>
            </div>
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">Vetted Carriers</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Access to elite, compliance-verified carriers for reliability.</p>
            </div>
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">Market-Informed Pricing</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Fair, transparent rates based on real-time data and trends.</p>
            </div>
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">Dedicated Support</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Personalized service from experienced logistics professionals.</p>
            </div>
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">Advanced Technology</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Streamlined processes with cutting-edge logistics software.</p>
            </div>
            <div className="p-8 bg-white border border-[var(--light-gray)]/50 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-[var(--charcoal)]">Safety & Compliance</h3>
              <p className="text-[var(--charcoal)]/60 text-sm">Adherence to the highest safety standards and regulations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Quote Section */}
      <section className="py-20 md:py-32 border-t border-[var(--light-gray)]/50 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative inline-block pb-8 border-b-2 border-[var(--maroon)]/10 mb-8 w-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--maroon)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
                <span className="text-[10px] font-mono tracking-[0.4em] text-[var(--maroon)] uppercase font-bold mb-4 opacity-60 block">ONBOARDING STATUS</span>
                <h2 className="mb-6 uppercase text-[var(--charcoal)]">Submit Inquiry</h2>
                <p className="text-[var(--charcoal)]/60 text-lg md:text-xl font-light leading-relaxed">
                  Experiencing disruptions? Our operations team provides priority onboarding for critical freight requirements.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--light-gray)]/30">
                <p className="text-[11px] font-mono tracking-[0.2em] text-[var(--charcoal)]/40 uppercase mb-2">Prefer direct contact?</p>
                <a href="mailto:info@apexfreightbrokerage.com" className="text-[var(--maroon)] font-bold text-sm hover:underline transition-all">
                  Email us for quote inquiries
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className={labelStyle}>Origin City/Zip</label>
                    <input
                      type="text"
                      placeholder="e.g. Chicago, IL"
                      className={inputStyle}
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Destination City/Zip</label>
                    <input
                      type="text"
                      placeholder="e.g. Dallas, TX"
                      className={inputStyle}
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                  <div className="sm:col-span-1">
                    <label className={labelStyle}>Equipment Needed</label>
                    <select className={inputStyle} value={formData.equipment} onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}>
                      <option className="text-white bg-[var(--maroon)]">Dry Van</option>
                      <option className="text-white bg-[var(--maroon)]">Flatbed</option>
                      <option className="text-white bg-[var(--maroon)]">Reefer</option>
                      <option className="text-white bg-[var(--maroon)]">Step Deck</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelStyle}>Weight (lbs)</label>
                    <input
                      type="number"
                      placeholder="e.g. 40000"
                      className={inputStyle}
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelStyle}>Ready Date</label>
                    <input
                      type="date"
                      className={inputStyle + " uppercase text-[12px]"}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="premium-btn w-full py-5 md:py-6 text-white font-bold uppercase tracking-[0.2em] text-[12px] mt-4 shadow-xl"
                >
                  CONTINUE TO FULL QUOTE
                </button>
                <p className="text-center text-[10px] text-[var(--charcoal)]/40 font-mono tracking-wider pt-2">
                  RESPONSE TYPICALLY WITHIN 15 MINS DURING BUSINESS HOURS
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
