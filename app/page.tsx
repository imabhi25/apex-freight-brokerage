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
            <span className="text-[var(--charcoal)] font-mono text-[12px] uppercase tracking-[0.2em] mb-6 block opacity-80">
              Now onboarding carrier partners for active operations
            </span>
            <h1 className="mb-8 text-5xl md:text-7xl lg:text-8xl leading-tight text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif' }}>
              Connecting Shippers<br className="hidden md:block" /> and Carriers Seamlessly
            </h1>
            <p className="text-[var(--charcoal)]/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12">
              Technology-enabled freight brokerage providing seamless coordination between elite shippers and premium carriers through data-informed routing and real-time execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
              <a href="/quote" className="premium-btn px-12 py-6 text-white font-bold uppercase tracking-[0.2em] text-[12px] w-full sm:w-auto shadow-2xl">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Request a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/carrier" className="px-12 py-6 border border-[var(--charcoal)]/10 text-[var(--charcoal)] font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-[var(--maroon)] hover:border-[var(--maroon)] hover:text-white transition-all duration-500 w-full sm:w-auto">
                Join Carrier Network
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative z-10 border-t border-[var(--text-primary)]/5 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--maroon)]" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--maroon)]/80">Data-driven Logistics</span>
              </div>
              <h2 className="mb-4 uppercase text-[var(--charcoal)]">Precision Services</h2>
              <p className="text-[var(--charcoal)]/60 text-lg max-w-lg font-light">Comprehensive logistics solutions engineered with streamlined coordination for the modern supply chain.</p>
            </div>
            <a href="/services" className="hidden md:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity mt-8 md:mt-0 text-[var(--maroon)]">
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

      {/* Stats / Why Choose Us */}
      <section id="about" className="py-32 relative bg-white text-[var(--charcoal)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--maroon)]/30" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--maroon)]/60">Modern Logistics Network</span>
              </div>
              <h2 className="mb-6 text-[var(--charcoal)]" style={{ letterSpacing: '-0.02em' }}>THE APEX <br /> ADVANTAGE.</h2>
              <p className="text-[var(--charcoal)]/60 text-lg font-light mb-8 max-w-md">
                We leverage technology and industry expertise to deliver unparalleled reliability. Your freight, handled with absolute precision.
              </p>
              <div className="space-y-6">
                {[
                  { title: "24/7 Monitoring", desc: "Round-the-clock tracking and support." },
                  { title: "Vetted Carriers", desc: "Access to elite, compliance-verified carriers." },
                  { title: "Market-Informed Pricing", desc: "Fair, transparent rates based on real-time data." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 mt-2 bg-[var(--maroon)]/20"></div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 text-[var(--charcoal)]">{item.title}</h4>
                      <p className="text-[var(--charcoal)]/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-sm mx-auto lg:mx-0">
              <div className="p-12 flex flex-col justify-center items-center text-center bg-white border border-[var(--light-gray)]/30 shadow-2xl relative overflow-hidden bg-noise">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--maroon)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <span className="text-[10px] font-mono tracking-[0.4em] text-[var(--maroon)] uppercase font-bold mb-4 opacity-60">ONBOARDING STATUS</span>
                <span className="text-2xl font-light text-[var(--charcoal)] leading-tight uppercase tracking-tight">Now accepting quote & carrier inquiries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="quote" className="pt-32 pb-16 relative z-10 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-white border border-[var(--cool-gray)] p-10 md:p-16 rounded-2xl relative overflow-hidden shadow-sm">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-black opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 relative z-10">
              <div className="lg:col-span-2">
                <span className="text-[var(--maroon)] font-mono text-[11px] uppercase tracking-[0.2em] mb-4 block opacity-60">Ready to move?</span>
                <h2 className="mb-6 text-4xl text-[var(--charcoal)]">REQUEST A RATE.</h2>
                <p className="text-[var(--charcoal)]/50 font-light mb-4">
                  Get a fast, accurate rate for your next shipment. Our team responds within 15 minutes.
                </p>
                <div className="mt-8 pt-6 border-t border-[var(--light-gray)]/30">
                  <p className="text-[11px] font-mono tracking-[0.2em] text-[var(--charcoal)]/40 uppercase mb-2">Prefer direct contact?</p>
                  <a href="mailto:info@apexfreightbrokerage.com" className="text-[var(--maroon)] font-bold text-sm hover:underline transition-all">
                    Email us for quote inquiries
                  </a>
                </div>
              </div>

              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className={labelStyle}>Origin (City / Zip)</label>
                    <input type="text" required placeholder="e.g. Los Angeles, CA" className={inputStyle} value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} />
                  </div>

                  <div className="col-span-1">
                    <label className={labelStyle}>Destination (City / Zip)</label>
                    <input type="text" required placeholder="e.g. Chicago, IL" className={inputStyle} value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className={labelStyle}>Equipment Needed</label>
                    <select className={inputStyle} value={formData.equipment} onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}>
                      <option className="text-white bg-[var(--maroon)]">Dry Van</option>
                      <option className="text-white bg-[var(--maroon)]">Flatbed</option>
                      <option className="text-white bg-[var(--maroon)]">Reefer</option>
                      <option className="text-white bg-[var(--maroon)]">Step Deck</option>
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className={labelStyle}>Total Weight (lbs)</label>
                    <input type="number" required placeholder="e.g. 45000" className={inputStyle} value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                  </div>

                  <div className="col-span-1">
                    <label className={labelStyle}>Date Ready</label>
                    <input type="date" required className={inputStyle} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-8">
                    <button type="submit" className="premium-btn w-full px-12 py-6 text-white font-bold uppercase tracking-[0.2em] text-[12px] shadow-2xl">
                      <span className="relative z-10 text-white transition-colors duration-300">REQUEST QUOTE</span>
                    </button>
                    <p className="mt-6 text-center text-[10px] font-mono tracking-widest text-[var(--charcoal)]/30 uppercase font-medium">
                      Typical response time &lt; 15 mins • Data secure & encrypted
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
