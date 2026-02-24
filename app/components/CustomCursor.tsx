"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring-follow for the ring
    const springX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.5 });
    const springY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.5 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleEnter = () => setIsVisible(true);
        const handleLeave = () => setIsVisible(false);

        // Track hover over kinetic buttons
        const trackHover = () => {
            const targets = document.querySelectorAll(
                "button, a, [data-cursor-hover]"
            );
            targets.forEach((el) => {
                el.addEventListener("mouseenter", () => setIsHovering(true));
                el.addEventListener("mouseleave", () => setIsHovering(false));
            });
        };

        window.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseenter", handleEnter);
        document.addEventListener("mouseleave", handleLeave);

        // Slight delay so DOM is ready
        const t = setTimeout(trackHover, 500);
        // Re-attach as DOM mutates
        const observer = new MutationObserver(trackHover);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseenter", handleEnter);
            document.removeEventListener("mouseleave", handleLeave);
            clearTimeout(t);
            observer.disconnect();
        };
    }, [isVisible, mouseX, mouseY]);

    if (typeof window === "undefined") return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <motion.div
                animate={{
                    width: isHovering ? 36 : 16,
                    height: isHovering ? 36 : 16,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.6 }}
                className="rounded-full border border-white bg-transparent"
            />
        </motion.div>
    );
}
