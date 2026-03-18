"use client";

import React, { useState, useRef, useEffect } from "react";
import { searchCities, type USCity } from "../data/us-cities";

interface CityResult {
    city: string;   // e.g. "Los Angeles, CA"
    zip: string;    // primary zip for auto-population
}

interface CityAutocompleteProps {
    label: React.ReactNode;
    value: string;
    onChange: (result: CityResult) => void;
    onError: (cityError: string, zipError?: string) => void;
    error?: string;
    inputBaseClass: string;
    labelClass: string;
    errorClass: string;
    compact?: boolean;
}

export default function CityAutocomplete({
    label,
    value,
    onChange,
    onError,
    error,
    inputBaseClass,
    labelClass,
    errorClass,
    compact = false,
}: CityAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<USCity[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync with parent
    useEffect(() => {
        setInputValue(value);
    }, [value]);

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
        const val = e.target.value;
        setInputValue(val);
        setHighlightedIndex(-1);

        if (val.trim() === "") {
            // User cleared the city — also clear zip and errors in parent
            setSuggestions([]);
            setIsOpen(false);
            onChange({ city: "", zip: "" });
            onError("", "");
            return;
        }

        if (val.trim().length >= 1) {
            let results = searchCities(val);
            setSuggestions(results);
            setIsOpen(results.length > 0);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
        if (error) onError("", "");
    };

    const handleSelect = (city: USCity) => {
        const fullCity = `${city.city}, ${city.abbr}`;
        setInputValue(fullCity);
        setSuggestions([]);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange({ city: fullCity, zip: city.zip });
        onError("", "");
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

    return (
        <div
            ref={containerRef}
            className="relative w-full group"
            style={{ zIndex: isOpen ? 50 : "auto" }}
        >
            {compact && <label className={labelClass}>{label}</label>}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={`${inputBaseClass}`}
                placeholder=" "
                autoComplete="off"
            />
            {!compact && <label className={labelClass}>{label}</label>}
            {error && <span className={errorClass}>{error}</span>}

            {/* Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <ul
                    className={`absolute top-full left-0 w-full list-none p-0 m-0 ${compact ? 'border-none bg-[#fdfdfd] shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-black/[0.04]' : ''}`}
                    style={{
                        background: compact ? "#FAF9F6" : "var(--background)",
                        border: compact ? "1px solid rgba(0,0,0,0.06)" : "1px solid var(--border)",
                        zIndex: 9999,
                        maxHeight: compact ? "160px" : "240px",
                        overflowY: "auto",
                        boxShadow: compact ? "0 4px 12px rgba(0, 0, 0, 0.04)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        borderRadius: compact ? "0 0 4px 4px" : "12px",
                        marginTop: compact ? "0" : "4px"
                    }}
                >
                    {suggestions.map((city, idx) => (
                        <li
                            key={`${city.city}-${city.abbr}`}
                            onMouseDown={() => handleSelect(city)}
                            style={{
                                background: idx === highlightedIndex ? (compact ? "rgba(0,0,0,0.03)" : "var(--bg-alt)") : "transparent",
                                padding: compact ? "12px 12px" : "16px 16px",
                                cursor: "pointer",
                                transition: "background 0.1s",
                                borderBottom: compact && idx < suggestions.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                            }}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseLeave={() => setHighlightedIndex(-1)}
                        >
                            <span className={`${compact ? 'text-[11px]' : 'text-[14px]'} text-[var(--charcoal)] font-mono block uppercase tracking-wide font-bold`}>
                                {city.city}, {city.abbr}
                            </span>
                            {!compact && (
                                <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5 tracking-wider">
                                    {city.state} &middot; {city.zip}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
