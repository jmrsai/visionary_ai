'use server';

/**
 * @fileOverview AI-powered module for providing real-time feedback on eye exercise form.
 *
 * - aiFormFeedback - A function that provides feedback on eye exercise form.
 * - AiFormFeedbackInput - The input type for the aiFormFeedback function.
 * - AiFormFeedbackOutput - The return type for the aiFormFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiFormFeedbackInputSchema = z.object({
  exerciseType: z
    .string()
    .describe('The type of eye exercise being performed (e.g., Saccades, Smooth Pursuits, Focus Shifting).'),
  cameraFeedDataUri: z
    .string()
    .describe(
      "The current frame from the camera feed as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userInstructions: z.string().describe('The instructions that the user is following.'),
});
export type AiFormFeedbackInput = z.infer<typeof AiFormFeedbackInputSchema>;

const AiFormFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Real-time feedback on the user\'s form and technique. Be concise and actionable (max 1-2 sentences). Focus on head position and eye movement relative to the instructions. If the user is doing well, provide encouragement.'
    ),
});
export type AiFormFeedbackOutput = z.infer<typeof AiFormFeedbackOutputSchema>;

export async function aiFormFeedback(input: AiFormFeedbackInput): Promise<AiFormFeedbackOutput> {
  return aiFormFeedbackFlow(input);
}

const aiFormFeedbackPrompt = ai.definePrompt({
  name: 'aiFormFeedbackPrompt',
  input: {schema: AiFormFeedbackInputSchema},
  output: {schema: AiFormFeedbackOutputSchema},
  prompt: `You are an AI-powered form coach for an eye exercise app. Analyze the user's head and eye position from a camera feed to provide real-time, concise, and encouraging feedback.

Your feedback should be 1-2 sentences max.

- If head is tilted/not straight, gently correct them (e.g., "Try to keep your head level.").
- If head is moving instead of eyes, remind them (e.g., "Remember to only move your eyes, not your head.").
- If form looks good, give positive reinforcement (e.g., "Great job keeping your head still!", "Excellent focus.").
- Tailor feedback to the specific instruction. For example, if the instruction is "Focus on a distant object" and eyes appear to be looking down, say "Try looking straight ahead at a distant point."

Exercise Type: {{{exerciseType}}}
User Instructions: {{{userInstructions}}}
Camera Feed: {{media url=cameraFeedDataUri}}

Analyze the camera feed and provide your feedback.`,
});


const aiFormFeedbackFlow = ai.defineFlow(
    {
      name: 'aiFormFeedbackFlow',
      inputSchema: AiFormFeedbackInputSchema,
      outputSchema: AiFormFeedbackOutputSchema,
    },
    async (input) => {
      const { output } = await aiFormFeedbackPrompt(input);
      return output!;
    }
);
