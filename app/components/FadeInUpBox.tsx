"use client";

import React from "react";
import { motion } from "framer-motion";

interface FadeInUpBoxProps {
    children: React.ReactNode;
    delay?: number;
}

export const FadeInUpBox = ({ children, delay = 0 }: FadeInUpBoxProps) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

export default FadeInUpBox;
