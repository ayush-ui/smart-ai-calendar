import { Response } from "express";
import { callLLM } from "../services/llmService";
import {
  saveCalendarJson,
  loadCalendarJson,
  deleteCalendarJson,
  getLatestCalendarId,
} from "../services/jsonStorage";
import {
  CalendarEvent,
  generateIcsFile,
} from "../services/iCalService";
import { JwtPayloadRequest } from "../auth/authType";

interface IdParams {
  id: string;
}

interface GenerateBody {
  input: string;
}

interface UpdateBody {
  instruction: string;
}

export const generatePlan = async (
  req: JwtPayloadRequest<null, any, GenerateBody>,
  res: Response
): Promise<void> => {
  try {
    const { input } = req.body;
    const userId = req.auth?.payload.sub;

    if (!input || !userId) {
      res.status(400).json({ error: "Missing input or user" });
      return;
    }

    const planText = await callLLM(input, "create");
    const cleanedText = planText.replace(/```json|```/g, "").trim();
    const calendar = JSON.parse(cleanedText) as CalendarEvent[];

    const calendarId = saveCalendarJson(calendar, userId);
    res.status(200).json({ message: "Calendar saved", calendarId });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Could not generate plan" });
  }
};

export const downloadCalendar = async (
  req: JwtPayloadRequest<IdParams>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.payload.sub;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const calendar = loadCalendarJson(userId, id);
    const fileName = await generateIcsFile(calendar);

    res.download(`calendar_files/${fileName}`);
  } catch (err) {
    console.error("Download error:", err);
    res.status(404).json({ error: "Calendar not found" });
  }
};

export const getLatestCalendar = (
  req: JwtPayloadRequest,
  res: Response
): void => {
  try {
    const userId = req.auth?.payload.sub;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const latestId = getLatestCalendarId(userId);
    if (!latestId) {
      res.status(404).json({ error: "No calendar found" });
      return;
    }

    const calendar = loadCalendarJson(userId, latestId);
    res.status(200).json({ calendar, calendarId: latestId });
  } catch (err) {
    console.error("Error fetching latest calendar:", err);
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
};

export const updateCalendarById = async (
  req: JwtPayloadRequest<IdParams, any, UpdateBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.payload.sub;
    const { instruction } = req.body;

    if (!userId || !instruction) {
      res.status(400).json({ error: "Missing user or instruction." });
      return;
    }

    let { id } = req.params;
    if (!id) {
      id = userId??getLatestCalendarId(userId);
      if (!id) {
        res.status(404).json({ error: "No existing calendar found to update." });
        return;
      }
    }

    const existingCalendar = loadCalendarJson(userId, id);
    const prompt = `Existing Events:\n${JSON.stringify(
      existingCalendar,
      null,
      2
    )}\n\nInstruction:\n${instruction}`;
    const updatedText = await callLLM(prompt, "update");
    const cleanedText = updatedText.replace(/```json|```/g, "").trim();
    const updatedCalendar = JSON.parse(cleanedText) as CalendarEvent[];

    const newId = saveCalendarJson(updatedCalendar, userId);
    res.status(200).json({ message: "Calendar updated", newCalendarId: newId });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update calendar." });
  }
};
export const viewCalendar = (
  req: JwtPayloadRequest<IdParams>,
  res: Response
): void => {
  try {
    const userId = req.auth?.payload.sub;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const calendar = loadCalendarJson(userId, id);
    res.status(200).json({ calendar });
  } catch (err) {
    console.error("View error:", err);
    res.status(404).json({ error: "Calendar not found" });
  }
};

export const deleteCalendar = (
  req: JwtPayloadRequest<IdParams>,
  res: Response
): void => {
  try {
    const userId = req.auth?.payload.sub;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    deleteCalendarJson(userId, id);
    res.status(200).json({ message: "Calendar deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(404).json({ error: "Calendar not found or already deleted" });
  }
};
