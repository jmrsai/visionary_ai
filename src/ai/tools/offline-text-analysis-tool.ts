'use server';

/**
 * @fileOverview A Genkit tool for performing offline text analysis.
 */

import { defineTool } from 'genkit';
import { z } from 'zod';
import { analyzeTextOffline } from '../offline-ai-agent';

export const offlineTextAnalysisTool = defineTool(
  {
    name: 'offlineTextAnalysis',
    description: 'Performs simple offline text analysis.',
    inputSchema: z.object({
      text: z.string().describe('The text to analyze.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    return analyzeTextOffline(input.text);
  }
);
