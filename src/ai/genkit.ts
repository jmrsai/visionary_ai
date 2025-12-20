import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { offlineTextAnalysisTool } from './tools/offline-text-analysis-tool';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
  tools: [offlineTextAnalysisTool],
});
