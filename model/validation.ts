
export function validatePhone(phone: string): boolean {
    // Regular expression for international phone numbers:
    // - Starts with +
    // - Followed by country code (1-3 digits)
    // - Followed by 7-14 digits (allowing spaces, hyphens, or dots as separators)
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    // Basic check for minimum length and + prefix
    if (!phone.startsWith('+') || phone.length < 8 || phone.length > 16) {
        return false;
    }

    // Remove all non-digit characters for final validation
    const digitsOnly = phone.replace(/[^\d]/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function validateEmail(email: string): boolean {
    // Regular expression for email validation (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Basic checks before regex validation
    if (!email || email.length > 254) {
        return false;
    }

    // Split email into local part and domain
    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domain] = parts;

    // Check local part and domain lengths
    if (localPart.length > 64 || domain.length > 253) {
        return false;
    }

    // Check for consecutive dots
    if (localPart.includes('..') || domain.includes('..')) {
        return false;
    }

    return emailRegex.test(email);
}