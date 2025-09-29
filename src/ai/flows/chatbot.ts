'use server';

/**
 * @fileOverview A friendly AI chatbot for answering eye health questions.
 *
 * - chat - A function that responds to user queries about eye health.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {symptomCheckerTool} from '@/ai/tools/symptom-checker-tool';
import {z} from 'zod';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const ChatInputSchema = z.object({
  message: z.string().describe("The user's message or question."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's message."),
  media: z.string().optional().describe('A data URI of the audio response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: z.object({ message: z.string() })},
  output: {schema: z.object({ response: z.string()})},
  tools: [symptomCheckerTool],
  prompt: `You are a friendly and helpful AI assistant for the Visionary app, specializing in eye health. Your role is to act as a Personal Eye Health Assistant.

  **First Rule: Safety is paramount.**
  You MUST start EVERY conversation with the following disclaimer:
  "Disclaimer: I am an AI assistant and not a medical professional. This information is for educational purposes only. Please consult a qualified healthcare provider for any medical concerns."
  
  **Second Rule: Red Flag Triage**
  If a user mentions any of the following "red flag" symptoms, you MUST STOP all other analysis and ONLY respond with this exact phrase: "This sounds serious. Please contact an eye care professional immediately or go to the nearest emergency room."
  Red flag symptoms include:
  - Sudden vision loss or a sudden blind spot
  - Severe eye pain
  - Flashes of light or a sudden increase in floaters
  - Physical injury or trauma to the eye
  - Chemical splash in the eye
  
  **Your Core Task: Conversational Symptom Triage**
  1.  Listen to the user's message.
  2.  If they describe symptoms, ask clarifying questions to get more detail (e.g., "Is it one eye or both?", "How long have you felt this?").
  3.  Once you have enough detail, use the 'symptomChecker' tool to analyze the symptoms.
  4.  Present the results from the tool to the user in a clear, easy-to-understand way.
  5.  If the user asks a general question (e.g., "What is glaucoma?"), answer it clearly and concisely.
  
  User's message: {{{message}}}
  
  Your response:`,
});

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // If the model doesn't return structured output for some reason, provide a safe default.
    if (!output) {
      return {
        response:
          "I'm sorry, I'm having trouble processing that request. Please try rephrasing your question. Remember, for any urgent medical concerns, please contact a healthcare professional.",
      };
    }
    
    // Generate TTS
    const { media: audioMedia } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: output.response,
      });

    if (!audioMedia?.url) {
        return { response: output.response };
    }

    const audioBuffer = Buffer.from(
        audioMedia.url.substring(audioMedia.url.indexOf(',') + 1),
        'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
        response: output.response,
        media: 'data:audio/wav;base64,' + wavBase64
    };
  }
);
