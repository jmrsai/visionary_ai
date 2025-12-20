
import {tool} from 'genkit';
import {readFile} from '../../services/file-system';
import * as z from 'zod';

export const fileSystemTool = tool(
  'fileSystem',
  z.object({
    path: z.string().describe('The path to the file to read'),
  }),
  async ({path}) => {
    return await readFile(path);
  }
);
