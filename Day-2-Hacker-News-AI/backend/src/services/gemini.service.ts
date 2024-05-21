import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';


export async function summarizeWithGemini(text: string): Promise<string> {
  try {
    // Initialize Google Generative AI client
    const API_KEY = process.env.GEMINI_API_KEY; // Add this line to define the API_KEY variable

    const genAI = new GoogleGenerativeAI(API_KEY!); // Add the '!' operator to assert that API_KEY is not undefined

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-latest',
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
        ],
    }); // Removed httpsAgent 

    // Assemble the prompt
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Summarize this Hacker News item:\n\n${text}`,
          },
        ],
      },
    ];

    // Generate text
    const result = await model.generateContent(`Summarize this Hacker News item:\n\n${text}`)
    console.log('Generated text:', result.response.text());

    return result.response.text()
    } catch (error) {
        console.error('Error summarizing text:', error);
        throw error;
    }
}
