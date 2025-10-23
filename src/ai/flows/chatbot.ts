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
import {getMedicationRemindersTool} from '@/ai/tools/medication-tool';
import {z} from 'zod';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';
import { MOCK_VISION_SCORE_HISTORY } from '@/lib/data';


const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({text: z.string()})),
});

const ChatInputSchema = z.object({
  message: z.string().describe("The user's message or question."),
  history: z.array(MessageSchema).optional().describe("The history of the conversation."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChartDataSchema = z.object({
    chartType: z.enum(['line', 'bar']).describe('The type of chart to display.'),
    dataPoints: z.array(z.object({
        x: z.string().describe("The label for the x-axis (e.g., a date)."),
        y: z.number().describe("The value for the y-axis."),
    })).describe('The data points for the chart.'),
    summaryText: z.string().describe("A spoken summary of the chart's data."),
});

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's text response to the user's message."),
  media: z.string().optional().describe('A data URI of the audio response.'),
  chartData: ChartDataSchema.optional().describe('Structured data for rendering a chart in the UI, if the user requested one.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: z.object({ message: z.string(), history: z.any().optional(), visionScoreHistory: z.string() })},
  output: {schema: ChatOutputSchema},
  tools: [symptomCheckerTool, getMedicationRemindersTool],
  prompt: `You are a friendly and helpful AI assistant for the Visionary app, specializing in eye health. Your role is to act as a Personal Eye Health Assistant.

  **First Rule: Safety is paramount.**
  If this is the first message in the conversation, you MUST start with the following disclaimer:
  "Disclaimer: I am an AI assistant and not a medical professional. This information is for educational purposes only. Please consult a qualified healthcare provider for any medical concerns."
  
  **Second Rule: Red Flag Triage**
  If a user mentions any of the following "red flag" symptoms, you MUST STOP all other analysis and ONLY respond with this exact phrase: "This sounds serious. Please contact an eye care professional immediately or go to the nearest emergency room."
  Red flag symptoms include:
  - Sudden vision loss or a sudden blind spot
  - Severe eye pain
  - Flashes of light or a sudden increase in floaters
  - Physical injury or trauma to the eye
  - Chemical splash in the eye
  
  **Your Core Tasks:**
  1.  **Conversational Symptom Triage:**
      - Listen to the user's message.
      - If they describe symptoms, ask clarifying questions to get more detail (e.g., "Is it one eye or both?", "How long have you felt this?").
      - Once you have enough detail, use the 'symptomChecker' tool to analyze the symptoms.
      - Present the results from the tool to the user in a clear, easy-to-understand way.
      - **When presenting home care advice, you MUST format each piece of advice as a clear instruction followed by its YouTube link on a new line. For example: "For your dry eyes, you can try applying a warm compress. You can watch a video on how to do that here: [YouTube Link]"**
  2.  **Medication Assistant:**
      - If the user asks about their medications (e.g., "When is my next dose?", "What medications am I taking?"), use the 'getMedicationReminders' tool to fetch their medication schedule.
      - Answer their question based on the data returned by the tool. Be specific (e.g., "Your next dose of Latanoprost is at 9:00 PM.").
  3.  **Voice Chart Bot:**
      - If the user asks for a chart or a graph of their progress (e.g., "Show me my vision score history"), you MUST respond with a chart object.
      - Use the provided data to populate the 'dataPoints' field.
      - Generate a 'summaryText' that both describes the data and is spoken aloud.
      - Set the 'response' field to a brief confirmation message (e.g., "Here is your vision score history.").
      - **Example Data:** Vision Score History: {{{visionScoreHistory}}}
  4.  **General Questions:**
      - If the user asks a general question (e.g., "What is glaucoma?"), answer it clearly and concisely.

  Analyze the conversation history to understand the context.
  Conversation History:
  {{#if history}}
    {{#each history}}
      {{#if (eq role 'user')}}
        User: {{#each content}}{{text}}{{/each}}
      {{else}}
        AI: {{#each content}}{{text}}{{/each}}
      {{/if}}
    {{/each}}
  {{/if}}
  
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
    // Map the mock data to the format expected by the prompt
    const visionScoreHistory = MOCK_VISION_SCORE_HISTORY.map(item => ({ x: item.date, y: item.score }));
    
    const {output} = await prompt({
        ...input,
        visionScoreHistory: JSON.stringify(visionScoreHistory, null, 2)
    });

    // If the model doesn't return structured output for some reason, provide a safe default.
    if (!output) {
      return {
        response:
          "I'm sorry, I'm having trouble processing that request. Please try rephrasing your question. Remember, for any urgent medical concerns, please contact a healthcare professional.",
      };
    }
    
    const responseText = output.chartData ? output.chartData.summaryText : output.response;
    
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
        prompt: responseText,
      });

    if (!audioMedia?.url) {
        return { ...output };
    }

    const audioBuffer = Buffer.from(
        audioMedia.url.substring(audioMedia.url.indexOf(',') + 1),
        'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
        ...output,
        media: 'data:audio/wav;base64,' + wavBase64
    };
  }
);
