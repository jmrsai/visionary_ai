// This is an AI-powered module for providing real-time feedback on eye exercise form using the device's camera.

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
      'The current frame from the camera feed as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Example: data:image/jpeg;base64,/9j/4AAQSk...
    ),
  userInstructions: z.string().describe('The instructions that the user is following.'),
});
export type AiFormFeedbackInput = z.infer<typeof AiFormFeedbackInputSchema>;

const AiFormFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Real-time feedback on the user\'s form and technique during the eye exercise. Be concise and actionable.'
    ),
  confidenceLevel: z
    .number()
    .describe('A numerical value (0-1) indicating the confidence level of the feedback provided.'),
});
export type AiFormFeedbackOutput = z.infer<typeof AiFormFeedbackOutputSchema>;

export async function aiFormFeedback(input: AiFormFeedbackInput): Promise<AiFormFeedbackOutput> {
  return aiFormFeedbackFlow(input);
}

const aiFormFeedbackPrompt = ai.definePrompt({
  name: 'aiFormFeedbackPrompt',
  input: {schema: AiFormFeedbackInputSchema},
  output: {schema: AiFormFeedbackOutputSchema},
  prompt: `You are an AI-powered form coach providing real-time feedback on eye exercises.

You will receive the type of exercise, a frame from the user's camera, and the instructions they are following.

Based on this information, provide concise and actionable feedback to help the user maintain correct form and technique.

Exercise Type: {{{exerciseType}}}
Camera Feed: {{media url=cameraFeedDataUri}}
User Instructions: {{{userInstructions}}}

Respond with feedback and confidence level, so the user can improve their form. For example, 