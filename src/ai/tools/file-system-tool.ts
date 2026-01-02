
import { ai } from 'genkit';
import {tool} from 'genkit';
import {readFile} from '../../services/file-system';
import * as z from 'zod';

export const fileSystemTool = ai.defineTool(
  {
    name: 'fileSystem',
    description: 'Read a file from the file system.',
    inputSchema: z.object({
      path: z.string().describe('The path to the file to read'),
    }),
    outputSchema: z.string(),
  },
  async ({path}) => {
    try {
      return await readFile(path);
    } catch (error: any) {
      return `Error reading file: ${error.message}`;
    }
  }
);
