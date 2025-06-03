export function formatTime(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // تنسيق التاريخ زي 26/5/2025: 7:40 AM
  const formattedDate = `${created.getDate()}/${
    created.getMonth() + 1
  }/${created.getFullYear()}: ${created.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  if (diffMins < 60) {
    return `منذ ${diffMins} دقيقة`;
  }

  if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  }

  if (diffDays < 7) {
    const dayText = diffDays === 1 ? "يوم" : "أيام";
    return `منذ ${diffDays} ${dayText}`;
  }

  // لو أكتر من أسبوع
  return formattedDate;
}
