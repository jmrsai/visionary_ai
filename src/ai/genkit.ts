import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-1.5-flash-latest',
});
