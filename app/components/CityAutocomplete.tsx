"use client";

import React, { useState, useRef, useEffect } from "react";
import { searchCities, type USCity } from "../data/us-cities";

interface CityResult {
    city: string;   // e.g. "Los Angeles, CA"
    zip: string;    // primary zip for auto-population
}

interface CityAutocompleteProps {
    label: string;
    value: string;
    onChange: (result: CityResult) => void;
    onError: (cityError: string, zipError?: string) => void;
    error?: string;
    inputBaseClass: string;
    labelClass: string;
    errorClass: string;
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

        if (val.trim().length >= 2) {
            const results = searchCities(val);
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
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={`${inputBaseClass}`}
                placeholder=" "
                autoComplete="off"
            />
            <label className={labelClass}>{label}</label>
            {error && <span className={errorClass}>{error}</span>}

            {/* Dropdown */}
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
                            key={`${city.city}-${city.abbr}`}
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
                                {city.city}, {city.abbr}
                            </span>
                            <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-0.5 tracking-wider">
                                {city.state} &middot; {city.zip}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
