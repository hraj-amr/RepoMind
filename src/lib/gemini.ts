import { GoogleGenerativeAI } from '@google/generative-ai'; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const aiSummariseCommit = async (diff: string): Promise<string> => {
    try {
        const prompt = `Summarize the following code commit diff in a concise, human-readable sentence or two. Focus on the main purpose or change introduced by the commit. The summary should be short (e.g., max 100 characters) and should not include markdown formatting.\n\nDiff:\n${diff}`;

        const result = await model.generateContent([prompt]); // <--- Pass the prompt here
        const response = await result.response;
        const summary = response.text(); // Assuming .text() extracts the string summary

        return summary.trim(); // <--- Return the generated summary

    } catch (error) {
        console.error("Error summarizing commit with Gemini AI:", error);
        // Important: Always return a string, even if there's an error.
        // This satisfies the Promise<string> return type.
        return "Failed to generate AI summary.";
    }
}