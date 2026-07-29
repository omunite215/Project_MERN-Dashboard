import { useState } from "react";

interface UseDateRangeResult {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export function useDateRange(
  initialStart: Date,
  initialEnd: Date
): UseDateRangeResult {
  const [startDate, setStartDate] = useState<Date>(initialStart);
  const [endDate, setEndDate] = useState<Date>(initialEnd);

  return { startDate, endDate, setStartDate, setEndDate };
}
