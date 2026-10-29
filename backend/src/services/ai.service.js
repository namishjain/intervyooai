const { GoogleGenAI, Type } = require("@google/genai")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")

const geminiReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        matchScore: { type: Type.NUMBER },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER },
                    focus: { type: Type.STRING },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
}


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

    technicalQuestions:  z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the prepartion plan starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively")
    })),
    title:z.string().describe("The title of the job for which the interview report is generated")
})

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `
        Generate an interview report using the candidate details below.

        Resume:
        ${resume}

        Self-description:
        ${selfDescription}

        Job description:
        ${jobDescription}

        Return:
        - A match score from 0 to 100 as matchScore
        - At least 5 technical questions as technicalQuestions
        - At least 5 behavioral questions as behavioralQuestions
        - Skill gaps as skillGaps
        - A 7-day preparation plan. Each day must include a focus and a list of specific tasks as preparationPlan
        - The job title as title. If the description does not state a title explicitly, infer a concise title from the role.
        `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: geminiReportSchema
        }
    })
    console.log(response.text)
    return interviewReportSchema.parse(JSON.parse(response.text))
}

module.exports = generateInterviewReport
