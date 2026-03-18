'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isOverHero, setIsOverHero] = useState(true);
    const pathname = usePathname();

    // Handle scroll detection for sticky header and visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Handle styling background changes
            if (currentScrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Handle hide/show top header logic based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down past threshold
                setIsVisible(false);
            } else {
                // Scrolling up or at top
                setIsVisible(true);
            }

            // Only remember scroll states when menu isn't covering the screen
            if (!isMenuOpen) {
                setLastScrollY(currentScrollY);
            }

            // Smart Contrast Detection
            // Baseline hero height for most pages
            let threshold = 400;
            if (pathname === '/') threshold = 850;

            // Handle Home page's second maroon section
            const secondMaroonStart = 1600;
            const secondMaroonEnd = 2400;

            const isPageHero = currentScrollY < threshold;
            const isHomeSecondaryMaroon = pathname === '/' && currentScrollY > secondMaroonStart && currentScrollY < secondMaroonEnd;

            if (isPageHero || isHomeSecondaryMaroon) {
                setIsOverHero(true);
            } else {
                setIsOverHero(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isMenuOpen]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    // Handle ESC key to close menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMenuOpen]);

    const navLinks = [
        { id: '01', title: 'Home', subtitle: 'MAIN DASHBOARD', href: '/' },
        { id: '02', title: 'Services', subtitle: 'CAPABILITIES', href: '/services' },
        { id: '03', title: 'Quote', subtitle: 'REQUEST A RATE', href: '/quote' },
        { id: '04', title: 'Carrier', subtitle: 'JOIN OUR NETWORK', href: '/carrier' },
        { id: '05', title: 'About', subtitle: 'COMPANY & TRUST', href: '/about' },
        { id: '06', title: 'Contact', subtitle: 'GET IN TOUCH', href: '/contact' },
    ];

    const overlayVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.08,
                staggerDirection: -1,
                when: "afterChildren"
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
            opacity: 0,
            y: 40,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const headerModeClass = 'header-mode-tech';

    return (
        <>
            {/* Sticky Header */}
            <motion.header
                initial={{ y: 0, opacity: 1 }}
                animate={{
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 w-full z-[70] transition-all duration-500 ${headerModeClass} ${isScrolled ? 'py-4' : 'py-8'
                    } ${isScrolled && !isMenuOpen ? 'bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--text-charcoal)]/10 shadow-lg' : 'bg-transparent border-transparent'}`}
            >
                <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                    {/* Left: Branding */}
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="group cursor-pointer flex items-center">
                        <span
                            className={`text-xl md:text-[22px] font-medium tracking-[0.08em] transition-all duration-500 ease-[0.25,1,0.5,1] group-hover:opacity-90 group-hover:scale-[1.01] origin-left ${isMenuOpen ? 'text-white' : 'text-[var(--charcoal)]'}`}
                            style={{ fontFamily: 'var(--font-didone), serif' }}
                        >
                            APEX FREIGHT
                        </span>
                    </Link>

                    {/* Right: Contact & Menu */}
                    <div className="flex items-center gap-8">
                        <a href="tel:8183300000" className="hidden md:block font-mono text-[11px] tracking-[0.4em] opacity-60 hover:opacity-100 transition-all duration-300 nav-hover-tech text-[var(--charcoal)]">818-330-0000</a>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`group flex items-center gap-3 transition-colors duration-300 ${isMenuOpen ? 'text-white' : 'text-[var(--charcoal)]'}`}
                        >
                            {/* Slide-up MENU → CLOSE morph */}
                            <span className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 w-[60px] overflow-hidden relative inline-block h-[14px] text-right cursor-pointer font-mono text-[11px] tracking-[0.4em] uppercase font-bold align-middle">
                                {/* MENU — slides up and fades out on open */}
                                <motion.span
                                    animate={isMenuOpen ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                    className="absolute inset-0 flex items-center justify-end whitespace-nowrap"
                                >
                                    MENU
                                </motion.span>
                                {/* CLOSE — slides up from below and fades in on open */}
                                <motion.span
                                    animate={isMenuOpen ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                    className="absolute inset-0 flex items-center justify-end whitespace-nowrap"
                                >
                                    CLOSE
                                </motion.span>
                            </span>
                            <div className="relative w-5 h-5 flex flex-col items-end justify-center gap-[5px]">
                                <motion.div
                                    initial={false}
                                    animate={isMenuOpen ? { rotate: 45, y: 3.1, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                    className={`h-[1.2px] opacity-60 group-hover:opacity-100 ${isMenuOpen ? 'bg-white' : 'bg-[var(--charcoal)]'}`}
                                />
                                <motion.div
                                    initial={false}
                                    animate={isMenuOpen ? { rotate: -45, y: -3.1, width: "100%" } : { rotate: 0, y: 0, width: "60%" }}
                                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                    className={`h-[1.2px] opacity-60 group-hover:opacity-100 ${isMenuOpen ? 'bg-white' : 'bg-[var(--charcoal)]'}`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Full Screen Overlay Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={overlayVariants}
                        className="fixed inset-0 z-[60] bg-[var(--charcoal)] flex flex-col"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {/* Overlay Spacer */}
                        <div
                            className={`container mx-auto px-6 flex justify-between items-center opacity-0 pointer-events-none ${isScrolled ? 'py-4' : 'py-8'}`}
                        >
                            <div className="h-8"></div>
                        </div>

                        {/* Split-Screen Navigation Grid */}
                        <div
                            className="flex-1 flex flex-col md:flex-row h-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Left Side: Structural Sidebar */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="w-full md:w-[380px] lg:w-[450px] border-r border-white/5 flex flex-col p-12 md:p-16 lg:p-20 justify-end bg-black/20"
                            >
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase font-bold">Inquiries</h4>
                                        <div className="space-y-2">
                                            <a href="mailto:info@apexfreightbrokerage.com" className="block text-lg text-white/60 hover:text-[var(--maroon)] transition-colors">info@apexfreightbrokerage.com</a>
                                            <a href="tel:8183300000" className="block text-xl md:text-2xl font-medium text-white/80">818-330-0000</a>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase font-bold">Headquarters</h4>
                                        <p className="text-white/50 leading-relaxed text-[15px] font-light italic">
                                            4670 N El Capitan Ave<br />
                                            Fresno, CA 93722
                                        </p>
                                    </div>

                                    <div className="pt-12 border-t border-white/5">
                                        <span className="text-[9px] font-mono tracking-[0.2em] text-white/10 uppercase">
                                            System Status: Operational
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Side: Massive Primary Links */}
                            <div className="flex-1 flex flex-col justify-center p-12 md:p-20 lg:p-32 overflow-y-auto">
                                <nav className="space-y-4 md:space-y-8 lg:space-y-10">
                                    {navLinks.map((link, idx) => (
                                        <motion.div
                                            key={link.id}
                                            variants={itemVariants}
                                            custom={idx}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="group flex gap-8 items-center"
                                            >
                                                <span className="hidden md:block text-[11px] font-mono tracking-[0.3em] text-white/10 group-hover:text-white/40 transition-colors pt-2 shrink-0">
                                                    {link.id}
                                                </span>
                                                <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-4 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                                                    <span
                                                        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter uppercase text-white/30 transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:text-white group-hover:opacity-100"
                                                        style={{
                                                            fontFamily: 'var(--font-didone), "Bodoni MT", "Didot", serif',
                                                            ...((pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))) ? { color: 'white', opacity: 1 } : {})
                                                        }}
                                                    >
                                                        {link.title}
                                                    </span>
                                                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono font-medium text-[var(--maroon)]/40 uppercase tracking-[0.3em] mt-2 transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:text-[var(--maroon)] group-hover:tracking-[0.5em]">
                                                        {link.subtitle}
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
