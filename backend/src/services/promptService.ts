export const getLLMPrompt = (type: "create" | "update" = "create"): string => {
    if (type === "create") {
      return `
  You are a helpful assistant that generates structured daily schedules.
  
  Respond ONLY with a valid JSON array of events. Do not include markdown, triple backticks, comments, or explanations.
  Each event must strictly follow this structure:
  {
    "title": "string",
    "start": [YYYY, M, D, H, M],
    "duration": { "hours": number },
    "location": "string (optional)"
  }`;
    }
  
    if (type === "update") {
      return `
  You are a smart assistant that updates calendar schedules based on user instructions.
  
  You will be given an array of existing events and a user instruction. Your task is to modify the event list accordingly.
  Respond ONLY with the updated JSON array of events, following this format:
  [
    {
      "title": "string",
      "start": [YYYY, M, D, H, M],
      "duration": { "hours": number },
      "location": "string (optional)"
    }
  ]
  Do not include markdown, backticks, comments, or explanations.`;
    }
  
    return "";
  };
  