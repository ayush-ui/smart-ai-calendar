import { createEvents } from "ics";
import fs from "fs";
import path from "path";

export interface CalendarEvent {
  title: string;
  start: [number, number, number, number, number];
  duration: { hours: number; minutes?: number };
  location?: string;
}

export const generateIcsFile = async (schedule: CalendarEvent[]): Promise<string> => {
  const { error, value } = createEvents(schedule);

  if (error) throw error;

  const fileName = `calendar_${Date.now()}.ics`;
  const filePath = path.join(__dirname, "../../calendar_files", fileName);
  fs.writeFileSync(filePath, value!);

  return fileName;
};
