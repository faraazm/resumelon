export function formatRelativeDate(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;

  const date = new Date(timestamp);
  return `Updated ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}
