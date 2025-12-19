'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { analyzeTextOffline } from '../offline-ai-agent';

export const offlineTextAnalysisTool = ai.defineTool({
  name: 'offlineTextAnalysis',
  description: 'Performs simple offline text analysis.',
  inputSchema: z.object({
    text: z.string().describe('The text to analyze.'),
  }),
  outputSchema: z.string(),
  run: async (input) => {
    return analyzeTextOffline(input.text);
  },
});
