import { GoogleGenerativeAI } from '@google/generative-ai'; 
import { Document } from '@langchain/core/documents'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const aiSummariseCommit = async (diff: string) => {
 const response = await model.generateContent([
   `You are an expert software engineer and technical writer.`,
        `Your task is to analyze the following Git commit diff and provide a clear, concise, and insightful summary.`,
        `The summary should help a junior developer or new team member quickly understand the purpose and impact of the changes.`,
        `Be specific about what was added, removed, or modified. Mention any new features, bug fixes, refactoring, or documentation updates.`,
        `If relevant, explain why the changes were made and how they affect the overall project.`,
        `Use simple language, avoid jargon, and keep the summary under 120 words.`,
        `Format your response as a single paragraph.`,
        `Here is the commit diff:`,
        `---`,
        `${diff}`,
        `---`,
        `Summary:`
    ]);
    return response.response.text();    
}

export async function summariseCode(doc: Document){
    console.log("getting summary for", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await model.generateContent([
        `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects`,
        `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
        Here is the code:
        ---
        ${code}
        ---
        Give a summary no more than 100 words of the code above`,
    ]);
    return response.response.text()
    } catch (error) {
        return ''
    }
}

export async function generateEmbedding(summary: string){
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    const result = await model.embedContent(summary)
    const embedding = result.embedding
    return embedding.values
}