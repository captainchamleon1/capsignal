const PT = "America/Los_Angeles";

const TIMES = [
  { hour: 9, minute: 0, label: "9:00 AM" },
  { hour: 10, minute: 30, label: "10:30 AM" },
  { hour: 13, minute: 0, label: "1:00 PM" },
  { hour: 14, minute: 30, label: "2:30 PM" },
] as const;

export type BookCallSlot = {
  id: string;
  label: string;
  weekday: string;
  time: string;
  timezone: string;
};

function isWeekday(date: Date, tz: string): boolean {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: tz }).format(date);
  return day !== "Sat" && day !== "Sun";
}

function formatWeekday(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  }).format(date);
}

/** Next available weekday call slots in Pacific Time. */
export function getBookCallSlots(maxSlots = 16): BookCallSlot[] {
  const slots: BookCallSlot[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let dayOffset = 1; dayOffset < 21 && slots.length < maxSlots; dayOffset++) {
    const day = new Date(cursor);
    day.setDate(cursor.getDate() + dayOffset);
    if (!isWeekday(day, PT)) continue;

    const weekday = formatWeekday(day, PT);

    for (const t of TIMES) {
      if (slots.length >= maxSlots) break;
      const id = `${weekday}|${t.label}|PT`;
      slots.push({
        id,
        label: `${weekday} · ${t.label} PT`,
        weekday,
        time: t.label,
        timezone: "PT",
      });
    }
  }

  return slots;
}

export function findBookCallSlot(id: string): BookCallSlot | undefined {
  return getBookCallSlots().find((s) => s.id === id);
}
