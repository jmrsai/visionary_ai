import { ai } from 'genkit';
import { defineTool } from 'genkit/tools';
import z from 'zod';
import { listFiles, readFile } from '@/services/file-system';

const codebaseQASchema = z.object({
  question: z.string().describe('The question to ask about the codebase'),
});

export const codebaseQATool = ai.defineTool(
  {
    name: 'codebaseQA',
    description: 'Ask questions about the codebase',
    inputSchema: codebaseQASchema,
    outputSchema: z.string(),
  },
  async ({ question }) => {
    const files = await listFiles('.');
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const content = await readFile(file);
        return { file, content };
      })
    );

    const prompt = `You are a helpful AI assistant that can answer questions about a codebase. The user has the following files in their project:\n\n${fileContents
      .map(({ file, content }) => `**${file}**\n\`\`\`\n${content}\n\`\`\`\n`)
      .join('\n')};`

    const { text } = await ai.generate({ prompt });
    return text;
  }
);
