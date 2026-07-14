export function formatDuration(
  start: string | null,
  end: string | null,
): string {
  if (!start || !end) return "—";

  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  if (diffMs < 0 || Number.isNaN(diffMs)) return "—";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  return `${hours}h ${minutes}min`;
}
