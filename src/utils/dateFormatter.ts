const TIME_UNITS = {
  year: 31536000,
  month: 2628000,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

/**
 * Displays the time distance from now in a simple format, e.g., "3 days ago".
 * This function uses the native Intl.RelativeTimeFormat API.
 * @param dateString The ISO date string from the database.
 * @returns A formatted string like "3 days ago", "5 hours ago", etc.
 */
export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    // Get the difference in seconds
    const elapsed = (date.getTime() - now.getTime()) / 1000;

    // Find the best unit to display
    for (const unit in TIME_UNITS) {
      const interval = elapsed / TIME_UNITS[unit as keyof typeof TIME_UNITS];
      if (Math.abs(interval) >= 1) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        return rtf.format(Math.round(interval), unit as Intl.RelativeTimeFormatUnit);
      }
    }
    return 'just now';
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Displays a full, readable date, e.g., "June 7, 2025".
 * This function uses the native Intl.DateTimeFormat API.
 * @param dateString The ISO date string from the database.
 * @returns A formatted date string.
 */
export function formatFullDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}