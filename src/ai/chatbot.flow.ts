
'use server';
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {fileSystemTool} from '../tools/file-system-tool';

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.object({
      question: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({question}) => {
    const llmResponse = await ai.generate({
      prompt: question,
      model: 'googleai/gemini-1.5-flash-latest',
      tools: [fileSystemTool],
    });

    return llmResponse.text;
  }
);
