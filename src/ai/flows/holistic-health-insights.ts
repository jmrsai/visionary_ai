'use server';

/**
 * @fileOverview An AI that analyzes lifestyle and health data to generate holistic eye health insights.
 *
 * - holisticHealthInsights - A function that generates insights from screen time and symptom data.
 * - HolisticHealthInsightsInput - The input type for the function.
 * - HolisticHealthInsightsOutput - The return type for the function.
 */

// import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HolisticHealthInsightsInputSchema = z.object({
  screenTimeData: z.string().describe("A JSON string representing the user's screen time over the last 7 days, e.g., '[{\"day\": \"Mon\", \"hours\": 8}, ...]'"),
  symptomReports: z.string().describe("A JSON string representing user's self-reported symptoms, e.g., '[{\"day\": \"Mon\", \"symptom\": \"dry eyes\"}, ...]'"),
});
export type HolisticHealthInsightsInput = z.infer<typeof HolisticHealthInsightsInputSchema>;

const HolisticHealthInsightsOutputSchema = z.object({
  insight: z.string().describe('A concise, actionable insight correlating the screen time data with the symptom reports. For example: "We noticed your reports of \'dry eyes\' increased on days your screen time exceeded 7 hours. Try performing the Palming exercise after long sessions." If no clear correlation is found, provide a general eye health tip.'),
});
export type HolisticHealthInsightsOutput = z.infer<typeof HolisticHealthInsightsOutputSchema>;

// Mock implementation
export async function holisticHealthInsights(input: HolisticHealthInsightsInput): Promise<HolisticHealthInsightsOutput> {
  console.log("Holistic health insights called with:", input);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const screenTime = JSON.parse(input.screenTimeData) as {day: string, hours: number}[];
  const symptoms = JSON.parse(input.symptomReports) as {day: string, symptom: string}[];

  const highScreenTimeDays = screenTime.filter(d => d.hours > 8).map(d => d.day);
  const symptomDays = symptoms.map(s => s.day);

  const correlation = highScreenTimeDays.some(d => symptomDays.includes(d));

  if (correlation) {
      return {
          insight: "We noticed your reports of 'dry eyes' and 'headaches' often occur on days where your screen time exceeds 8 hours. Try to take a 5-minute break every hour and perform the 'Focus Shift' exercise."
      };
  }
  
  return {
    insight: "Staying hydrated is crucial for eye health. Remember to drink plenty of water throughout the day to help prevent dry eyes."
  };
}


/*
const prompt = ai.definePrompt({
  name: 'holisticHealthInsightsPrompt',
  input: {schema: HolisticHealthInsightsInputSchema},
  output: {schema: HolisticHealthInsightsOutputSchema},
  prompt: `You are a holistic health analyst for the Visionary eye care app. Your job is to find meaningful correlations between a user's lifestyle habits and their reported eye symptoms.

Analyze the provided screen time data and symptom reports for the past week. Generate a single, actionable insight based on your analysis.

- Look for patterns: Do symptoms appear more on days with high screen time?
- Be specific: Mention the symptom and the habit. Quantify if possible (e.g., "increased by 40%").
- Suggest a solution: Recommend a specific exercise or action from the app to help mitigate the issue.
- If no direct correlation is obvious, provide a general but relevant eye health tip.

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
    const {output} = await prompt(input);
    return output!;
  }
);
*/
