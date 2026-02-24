"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Scroll to top immediately on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    mass: 1,
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
