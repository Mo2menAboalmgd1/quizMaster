export function formatTime(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `من ${diffMins} دقيقة`;
  }

  if (diffHours < 24 && now.getDate() === created.getDate()) {
    return `من ${diffHours} ساعة`;
  }

  const wasYesterday =
    diffDays === 1 && now.getDate() - created.getDate() === 1;

  if (wasYesterday) {
    return `أمس الساعة ${created.toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  return created.toLocaleString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
