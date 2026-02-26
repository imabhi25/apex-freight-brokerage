"use client";

import React, { useState, useRef, useEffect } from "react";
import { searchByZip, type USCity } from "../data/us-cities";

interface ZipAutocompleteProps {
    label: string;
    value: string;                              // Controlled from parent
    onChange: (zip: string) => void;            // Called on every keystroke and selection
    onBlurValidate?: () => void;
    error?: string;
    inputBaseClass: string;
    labelClass: string;
    errorClass: string;
}

export default function ZipAutocomplete({
    label,
    value,
    onChange,
    onBlurValidate,
    error,
    inputBaseClass,
    labelClass,
    errorClass,
}: ZipAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<USCity[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits, max 5
        const val = e.target.value.replace(/\D/g, "").slice(0, 5);
        onChange(val); // Always propagate to parent — parent drives the value
        setHighlightedIndex(-1);
        if (val.length >= 2) {
            const results = searchByZip(val);
            setSuggestions(results);
            setIsOpen(results.length > 0);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (city: USCity) => {
        setSuggestions([]);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange(city.zip); // Propagate selected zip to parent
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[highlightedIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsOpen(false);
            onBlurValidate?.();
        }, 150);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full group"
            style={{ zIndex: isOpen ? 50 : "auto" }}
        >
            <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={value}                   // Fully controlled by parent
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={`${inputBaseClass}`}
                placeholder=" "
                autoComplete="off"
            />
            <label className={labelClass}>{label}</label>
            {error && <span className={errorClass}>{error}</span>}

            {/* ZIP dropdown */}
            {isOpen && suggestions.length > 0 && (
                <ul
                    className="absolute top-full left-0 w-full list-none p-0 m-0"
                    style={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        zIndex: 9999,
                        maxHeight: "240px",
                        overflowY: "auto",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        marginTop: "4px"
                    }}
                >
                    {suggestions.map((city, idx) => (
                        <li
                            key={`${city.zip}-${city.city}`}
                            onMouseDown={() => handleSelect(city)}
                            style={{
                                background: idx === highlightedIndex ? "var(--bg-alt)" : "transparent",
                                padding: "16px 16px",
                                cursor: "pointer",
                                transition: "background 0.1s",
                            }}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseLeave={() => setHighlightedIndex(-1)}
                        >
                            <span className="text-[14px] text-[var(--text-primary)] font-mono block uppercase tracking-wide">
                                {city.zip}
                            </span>
                            <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5 tracking-wider">
                                {city.city}, {city.abbr}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
