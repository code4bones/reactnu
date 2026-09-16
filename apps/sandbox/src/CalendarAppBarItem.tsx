import { useEffect, useState } from "react";
import { AppBarItem } from "@deadragdoll/reactnu";

function formatCalendarStamp(value: Date) {
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
    .format(value)
    .replace(/ /g, " ")
    .toUpperCase();
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(value);

  return `${datePart} ${timePart}`;
}

export function CalendarAppBarItem() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <AppBarItem
      alignment="end"
      aria-label="Current date and time"
      title={formatCalendarStamp(now)}
    >
      {formatCalendarStamp(now)}
    </AppBarItem>
  );
}
