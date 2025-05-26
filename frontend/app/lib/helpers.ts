export function formatDateToCustomString(
  isoString: string,
  full = true
): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const month = getPart("month");
  const day = getPart("day");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const dayPeriod = getPart("dayPeriod").toLowerCase();

  return full
    ? `${month}. ${day}. ${year} ${hour}:${minute}${dayPeriod}`
    : `${month}. ${day}  ${hour}:${minute}${dayPeriod}`;
}
