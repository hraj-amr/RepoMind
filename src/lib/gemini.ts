import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
})

export const aiSummariseCommit = async (diff: string) => {
    const response = await model.generateContent([
    `You are an expert software engineer and code reviewer.

Your task is to read the following git commit diff and generate a detailed, human-readable summary of the changes. 
Focus on the intent, impact, and any important details about the modifications. 
Highlight new features, bug fixes, refactoring, deleted code, and any changes to logic or dependencies. 
If relevant, mention affected files, functions, classes, or modules. 
If the diff contains code comments, incorporate their meaning into your summary.
Avoid quoting the diff directly; instead, paraphrase and explain in plain English.

Format your response as follows:
- **Summary:** A concise overview of the commit.
- **Details:** Bullet points describing key changes.
- **Potential Impact:** Any risks, improvements, or considerations for reviewers.

Here is the commit diff:
${diff}`,
    ])
    return response.response.text()
}


