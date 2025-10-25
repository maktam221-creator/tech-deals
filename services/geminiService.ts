import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export async function generateBuyingGuide(topic: string, languageCode: string): Promise<string> {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("Gemini API key not found. Using fallback response.");
    return Promise.resolve(languageCode === 'ar' 
        ? "خدمة الذكاء الاصطناعي غير متاحة حاليًا. يرجى التأكد من تكوين مفتاح API."
        : "AI service is currently unavailable. Please ensure the API key is configured."
    );
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const languageName = languageCode === 'ar' ? 'العربية' : 'English';

  try {
    const prompt = `
      As a tech expert, write a concise and helpful buying guide in ${languageName} about the following topic: "${topic}".
      
      The guide should include:
      1. A short introduction.
      2. The most important 3-4 points to consider when buying.
      3. A recommendation of 1-2 products as examples, if possible.
      4. A concluding tip.

      Keep the text easy to read and well-structured.
      The entire response must be in ${languageName}.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate buying guide.");
  }
}

export async function generateProductFromUrl(url: string, languageCode: string): Promise<Partial<Product>> {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.warn("Gemini API key not found. URL generation disabled.");
        throw new Error("API key not configured.");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const languageName = languageCode === 'ar' ? 'Arabic' : 'English';

    const schema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The full name of the product." },
            description: { type: Type.STRING, description: `A concise, compelling description of the product in one or two sentences, written in ${languageName}.` },
            price: { type: Type.NUMBER, description: "The main price of the product as a number, without currency symbols." },
            originalPrice: { type: Type.NUMBER, description: "The original price if a discount is shown, otherwise null." },
            category: { 
                type: Type.STRING, 
                description: "The most relevant category from this list: laptops, smartphones, headphones, monitors, tablets, cameras, accessories."
            },
            imageUrl: { type: Type.STRING, description: "A direct, publicly accessible URL to the main product image." },
            store: { type: Type.STRING, description: "The name of the store (e.g., Amazon, Jarir, Noon)." }
        },
        required: ["name", "description", "price", "category", "imageUrl", "store"]
    };

    try {
        const prompt = `
            Analyze the content of this product page URL: ${url}
            Extract the product information according to the provided JSON schema.
            The 'description' field must be in ${languageName}.
            Ensure the 'category' is one of the allowed values.
            If you cannot find a specific field, use a sensible default or null where appropriate (like for originalPrice).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const productData = JSON.parse(jsonText);
        
        return {
            ...productData,
            rating: 0,
            reviewCount: 0,
            affiliateLink: url, 
            priceComparison: [],
        };

    } catch (error) {
        console.error("Error generating product from URL with Gemini API:", error);
        throw new Error("Failed to extract product data from the URL.");
    }
}
