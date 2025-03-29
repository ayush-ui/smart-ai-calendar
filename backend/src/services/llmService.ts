import { getLLMPrompt } from "./promptService";

export const callLLM = async (
  userInput: string,
  promptType: "create" | "update" = "create"
): Promise<string> => {
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";
  const systemPrompt = getLLMPrompt(promptType);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Calendar Planner AI"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-exp-03-25:free",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Input: ${userInput}`
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();
    const generatedText = data.choices?.[0]?.message?.content?.trim();
    console.log("Generated JSON:", generatedText);

    return generatedText;
  } catch (err) {
    console.error("LLM API error:", err);
    throw err;
  }
};
