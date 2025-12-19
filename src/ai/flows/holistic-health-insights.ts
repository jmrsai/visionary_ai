'use server';

/**
 * @fileOverview An AI that analyzes lifestyle and health data to generate holistic eye health insights.
 *
 * - holisticHealthInsights - A function that generates insights from screen time and symptom data.
 * - HolisticHealthInsightsInput - The input type for the function.
 * - HolisticHealthInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { offlineTextAnalysisTool } from '@/ai/tools/offline-text-analysis-tool';

const HolisticHealthInsightsInputSchema = z.object({
  screenTimeData: z.string().describe("A JSON string representing the user's screen time over the last 7 days, e.g., '[{\"day\": \"Mon\", \"hours\": 8}, ...]'"),
  symptomReports: z.string().describe("A JSON string representing user's self-reported symptoms, e.g., '[{\"day\": \"Mon\", \"symptom\": \"dry eyes\"}, ...]'"),
  userInputText: z.string().describe("Additional user input text for offline analysis.").optional(), // New field for user text
});
export type HolisticHealthInsightsInput = z.infer<typeof HolisticHealthInsightsInputSchema>;

const HolisticHealthInsightsOutputSchema = z.object({
  insight: z.string().describe('A comprehensive insight combining the AI model\'s analysis and offline text analysis, correlating lifestyle data with symptom reports and additional user input.'),
});
export type HolisticHealthInsightsOutput = z.infer<typeof HolisticHealthInsightsOutputSchema>;

export async function holisticHealthInsights(input: HolisticHealthInsightsInput): Promise<HolisticHealthInsightsOutput> {
  return holisticHealthInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'holisticHealthInsightsPrompt',
  input: {schema: HolisticHealthInsightsInputSchema},
  output: {schema: HolisticHealthInsightsOutputSchema},
  tools: [offlineTextAnalysisTool],
  prompt: `You are a holistic health analyst for the Visionary eye care app. Your job is to find meaningful correlations between a user's lifestyle habits and their reported eye symptoms.

Analyze the provided screen time data, symptom reports for the past week, and the results from the offline text analysis tool. Generate a single, actionable insight based on your combined analysis.

- Look for patterns: Do symptoms appear more on days with high screen time?
- Correlate with user notes: Does the sentiment from the offline analysis match the data patterns?
- Be specific: Mention the symptom and the habit. Quantify if possible (e.g., "increased by 40%").
- Suggest a solution: Recommend a specific exercise or action from the app to help mitigate the issue.
- If no direct correlation is obvious, provide a general but relevant eye health tip based on all available data.

Screen Time Data (JSON):
{{{screenTimeData}}}

Symptom Reports (JSON):
{{{symptomReports}}}
`,
});

const holisticHealthInsightsFlow = ai.defineFlow(
  {
    name: 'holisticHealthInsightsFlow',
    inputSchema: HolisticHealthInsightsInputSchema,
    outputSchema: HolisticHealthInsightsOutputSchema,
  },
  async input => {
    
    const llmResponse = await prompt(input);
    const toolRequest = llmResponse.toolRequest();

    if (toolRequest && input.userInputText) {
        const toolResponse = await toolRequest.run({text: input.userInputText});
        const finalResponse = await llmResponse.send(toolResponse);
        return finalResponse.output()!;
    }
    
    const {output} = llmResponse;
    
    return output!;
  }
);
