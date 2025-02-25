export default function getDateDifference(
  startDate: Date | string | number,
  endDate: Date | string | number
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  const hoursDifference = timeDifference / (1000 * 3600);
  const minutesDifference = timeDifference / (1000 * 60);

  if (daysDifference >= 365) {
    const years = Math.floor(daysDifference / 365);
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  } else if (daysDifference >= 31) {
    const months = Math.floor(daysDifference / 30); // Approximating a month as 30 days
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (daysDifference >= 1) {
    return `${daysDifference.toFixed(0)} ${
      daysDifference === 1 ? 'day' : 'days'
    }`;
  } else if (hoursDifference >= 1) {
    return `${hoursDifference.toFixed(0)} ${
      hoursDifference === 1 ? 'hour' : 'hours'
    }`;
  } else {
    return `${minutesDifference.toFixed(0)} ${
      minutesDifference === 1 ? 'minute' : 'minutes'
    }`;
  }
}
