import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface StructuredReport {
  location: string;
  resource: 'Food' | 'Water' | 'Medicine' | 'Shelter';
  urgency: 'Low' | 'Medium' | 'High';
  people: number;
}

export const extractFieldData = async (base64Image: string): Promise<StructuredReport> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `
Convert the disaster field report in this image into structured JSON.

Rules:
- Extract: location, resource, urgency, people
- Resource must be one of: Food, Water, Medicine, Shelter

Normalization:
- "medical", "medical kits", "first aid" → Medicine
- "water shortage", "drinking water" → Water
- "food", "ration" → Food
- "shelter", "housing" → Shelter

Urgency:
- If "urgent", "critical" → High
- If missing → Medium

People:
- If number of items is given (e.g., 20 kits), assume people ≈ that number
- If families mentioned → 1 family = 4 people

Output ONLY valid JSON:
{
  "location": "",
  "resource": "",
  "urgency": "",
  "people": number
}
`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          resource: { type: Type.STRING, enum: ["Food", "Water", "Medicine", "Shelter"] },
          urgency: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          people: { type: Type.NUMBER },
        },
        required: ["location", "resource", "urgency", "people"],
      },
    },
  });

  return JSON.parse(response.text);
};

export interface AllocationPlan {
  priorityList: {
    location: string;
    urgency: string;
    count: number;
  }[];
  distributionStrategy: string;
}

export const generateAllocationPlan = async (reports: StructuredReport[]): Promise<AllocationPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Analyze these field reports and suggest a prioritized resource distribution plan.
            Reports: ${JSON.stringify(reports)}
            Consider urgency and magnitude of impact (people reached) for prioritization.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priorityList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                urgency: { type: Type.STRING },
                count: { type: Type.NUMBER },
              },
              required: ["location", "urgency", "count"],
            },
          },
          distributionStrategy: { type: Type.STRING },
        },
        required: ["priorityList", "distributionStrategy"],
      },
    },
  });

  return JSON.parse(response.text);
};
