
import { flow, prompt } from "genkit";
import { gemini15Flash } from "@genkit-ai/google-genai";
import * as z from "zod";
import { fileSystemTool } from "../tools/file-system-tool";

const CODE_PROMPT = `You are a chatbot that can answer questions about the codebase. 
Your task is to provide the user with a comprehensive answer to their questions about the codebase. 
When you need to read a file, you can use the fileSystemTool.`;

export const chatbotFlow = flow( {
        name: 'chatbotFlow',
        inputSchema: z.object({
            question: z.string(),
        }),
        outputSchema: z.string(),
    },
    async ({ question }) => {
        const llmResponse = await prompt(CODE_PROMPT, {
            model: gemini15Flash,
            tools: [fileSystemTool],
            prompt: question
        });

        return llmResponse.text();
    }
);
