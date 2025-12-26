import { GoogleGenAI, Type } from "@google/genai";
import { DocumentMetadata, Language } from "../types";

const createClient = () => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing. Search and Translate features will mock responses or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Uses Gemini to translate text.
 */
export const translateText = async (
  text: string,
  targetLang: Language
): Promise<string> => {
  const client = createClient();
  if (!client) return "API Key missing. Cannot translate.";

  try {
    const prompt = `Translate the following text to ${targetLang === Language.EN ? 'English' : 'Spanish'}. 
    Maintain professional tone suitable for a CV/Academic Archive.
    
    Text: "${text}"`;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Translation unavailable.";
  } catch (error) {
    console.error("Translation error:", error);
    return "Error during translation.";
  }
};

/**
 * Semantic Search using Gemini.
 * Takes the user query and the list of documents, returns IDs of matches.
 */
export const semanticSearch = async (
  query: string,
  documents: DocumentMetadata[]
): Promise<string[]> => {
  const client = createClient();
  // Fallback if no API key: simple filter
  if (!client) {
    const lowerQ = query.toLowerCase();
    return documents
      .filter(d => 
        d.title.toLowerCase().includes(lowerQ) || 
        d.description.toLowerCase().includes(lowerQ) ||
        d.tags.some(t => t.toLowerCase().includes(lowerQ))
      )
      .map(d => d.id);
  }

  try {
    // We send a lightweight version of the metadata to save tokens, though Gemini Context is huge.
    const docSummary = documents.map(d => ({
      id: d.id,
      txt: `${d.title} | ${d.description} | ${d.date} | ${d.tags.join(', ')} | ${d.category}`
    }));

    const prompt = `
      You are an intelligent archivist for Alicia Chacalo Hilú's CV.
      User Query: "${query}"
      
      Here is the document database:
      ${JSON.stringify(docSummary)}
      
      Return a JSON object containing an array called "matchIds". 
      Include IDs of documents that are semantically relevant to the query.
      If the user asks for "awards from the 90s", find items with category "Awards" and dates in the 1990s.
      Be smart about synonyms (e.g., "school" matches "Education").
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{\"matchIds\": []}");
    return json.matchIds || [];

  } catch (error) {
    console.error("AI Search error:", error);
    return [];
  }
};
