/**
 * Generates a unique reference ID for Apex Freight submissions.
 * Format: APX-[TYPE]-[YY]-[SUFFIX]
 * 
 * @param type - 'C' for Carrier, 'Q' for Quote, 'N' for Contact/Inquiry
 * @returns {string} - The generated Reference ID
 */
export function generateRefId(type: 'C' | 'Q' | 'N'): string {
    const year = new Date().getFullYear().toString().slice(-2);

    // Generate 4-character uppercase alphanumeric suffix
    // Excluding ambiguous characters (0, O, 1, I, L) for better readability
    const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `APX-${type}-${year}-${suffix}`;
}
