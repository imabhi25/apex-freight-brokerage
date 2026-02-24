/**
 * Generates a unique reference ID for form submissions.
 * Format: APX + Year (last 2) + Form Code (Q/C/I) + 4 Random Digits
 * Example: APX-26-Q-8102
 */
export function generateRefId(formType: 'Q' | 'C' | 'I'): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `APX-${year}-${formType}-${random}`;
}
