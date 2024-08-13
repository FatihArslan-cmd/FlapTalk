import { getCurrentDate } from './date';

export const calculateMembershipDuration = (signupDate) => {
    const now = new Date(getCurrentDate());
    const signup = new Date(signupDate);

    const diffTime = Math.abs(now - signup);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0) {
        return `${diffYears} year(s)`;
    } else if (diffMonths > 0) {
        return `${diffMonths} month(s)`;
    } else if (diffWeeks >= 4) {
        return `1 month`;
    } else if (diffWeeks > 0) {
        return `${diffWeeks} week(s)`;
    } else {
        return `${diffDays} day(s)`;
    }
};
