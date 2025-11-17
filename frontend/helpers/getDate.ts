export const getDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: 'numeric',
    minute: 'numeric',
    month: "short",
    day: "numeric",
    timeZone: "Asia/Yerevan",
  }).format(new Date(dateStr));
};