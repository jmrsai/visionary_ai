
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDiagnosticsInputSchema = z.object({
    imageDataUri: z.string().describe("A data URI of an OCT or Fundus photograph."),
    previousResults: z.string().optional().describe("Previous analysis summaries for trend tracking."),
});
export type AnalyzeDiagnosticsInput = z.infer<typeof AnalyzeDiagnosticsInputSchema>;

const AnalyzeDiagnosticsOutputSchema = z.object({
    category: z.enum(['Stable', 'Changing', 'Requiring Attention']).describe("The status of the diagnostic image compared to baseline."),
    summary: z.string().describe("A detailed professional summary of the findings."),
    drift: z.number().describe("A calculated drift score from 0-100 indicating how much change has occurred since last scan."),
    recommendation: z.string().describe("Next steps for the user (e.g., 'Schedule follow-up', 'Continue monitoring')."),
});
export type AnalyzeDiagnosticsOutput = z.infer<typeof AnalyzeDiagnosticsOutputSchema>;

export async function analyzeDiagnostics(input: AnalyzeDiagnosticsInput): Promise<AnalyzeDiagnosticsOutput> {
    return analyzeDiagnosticsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'analyzeDiagnosticsPrompt',
    input: { schema: AnalyzeDiagnosticsInputSchema },
    output: { schema: AnalyzeDiagnosticsOutputSchema },
    prompt: `You are an AI ophthalmology specialist assistant. Analyze the provided image (OCT or Fundus photo) and compare it against the provided previous results, if any.
  
  Tasks:
  1. Identify the anatomical health of the retina/optic nerve in the image.
  2. Determine if there is any visible 'drift' or change from the previous baseline.
  3. Categorize the findings as Stable, Changing, or Requiring Attention.
  4. Provide a professional, supportive summary and recommended next steps.
  
  Image: {{media url=imageDataUri}}
  {{#if previousResults}}
  Previous Context: {{previousResults}}
  {{/if}}`,
});

const analyzeDiagnosticsFlow = ai.defineFlow(
    {
        name: 'analyzeDiagnosticsFlow',
        inputSchema: AnalyzeDiagnosticsInputSchema,
        outputSchema: AnalyzeDiagnosticsOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
