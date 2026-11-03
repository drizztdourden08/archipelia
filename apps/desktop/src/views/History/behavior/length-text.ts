/* @layer renderer-app @kind logic */
const MINUTE_MS = 60_000;

const lengthText = (ms: number): string => {
  const minutes = Math.floor(Math.max(0, ms) / MINUTE_MS);
  if (minutes < 1) return 'under 1 min';
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${String(minutes % 60).padStart(2, '0')} min`;
};

export { lengthText };
