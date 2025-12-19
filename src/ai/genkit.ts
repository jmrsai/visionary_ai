import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { offlineTextAnalysisTool } from './tools/offline-text-analysis-tool';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  tools: [offlineTextAnalysisTool],
});
