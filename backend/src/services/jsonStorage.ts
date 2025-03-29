import fs from "fs";
import path from "path";
import { CalendarEvent } from "./iCalService";

const storePath = path.join(__dirname, "../../calendar_store");

if (!fs.existsSync(storePath)) {
  fs.mkdirSync(storePath);
}

export const saveCalendarJson = (calendar: CalendarEvent[], userId: string): string => {
  const userDir = path.join(storePath, userId);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const id = `calendar_${Date.now()}`;
  const filePath = path.join(userDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(calendar, null, 2));

  // Save reference to latest calendar
  const latestPath = path.join(userDir, `latest.json`);
  fs.writeFileSync(latestPath, JSON.stringify({ id }));

  return id;
};

export const loadCalendarJson = (userId: string, id: string): CalendarEvent[] => {
  const filePath = path.join(storePath, userId, `${id}.json`);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

export const deleteCalendarJson = (userId: string, id: string): void => {
  const filePath = path.join(storePath, userId, `${id}.json`);
  if (!fs.existsSync(filePath)) throw new Error("File not found");
  fs.unlinkSync(filePath);
};

export const getLatestCalendarId = (userId: string): string | null => {
  const latestPath = path.join(storePath, userId, "latest.json");
  if (!fs.existsSync(latestPath)) return null;

  const content = fs.readFileSync(latestPath, "utf-8");
  const data = JSON.parse(content);
  return data.id || null;
};