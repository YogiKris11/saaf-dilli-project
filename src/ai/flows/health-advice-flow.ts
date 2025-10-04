'use server';
/**
 * @fileOverview AI-powered health advice flow.
 *
 * This file defines a Genkit flow that generates personalized health advice
 * based on user profile and live air quality data.
 *
 * - getPersonalizedHealthAdvice - A function that takes user data and AQI, and returns advice.
 * - HealthAdviceInput - The input type for the function.
 * - HealthAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthAdviceInputSchema = z.object({
  name: z.string().describe("The user's name."),
  age: z.number().optional().describe("The user's age."),
  healthConditions: z.array(z.string()).optional().describe("A list of the user's pre-existing health conditions."),
  aqi: z.number().describe('The current AQI value.'),
  location: z.string().describe('The location for which the AQI is relevant.'),
});
export type HealthAdviceInput = z.infer<typeof HealthAdviceInputSchema>;

const HealthAdviceOutputSchema = z.object({
  advice: z.array(z.string()).describe('A short, bulleted list of personalized, actionable health advice for the user. It should be empathetic and easy to understand.'),
});
export type HealthAdviceOutput = z.infer<typeof HealthAdviceOutputSchema>;

export async function getPersonalizedHealthAdvice(input: HealthAdviceInput): Promise<HealthAdviceOutput> {
  return healthAdviceFlow(input);
}

const healthAdvicePrompt = ai.definePrompt({
  name: 'healthAdvicePrompt',
  input: {schema: HealthAdviceInputSchema},
  output: {schema: HealthAdviceOutputSchema},
  prompt: `You are an AI health assistant for air quality. Provide personalized, actionable advice for a user based on their profile and the current Air Quality Index (AQI). Your tone should be that of a caring, proactive assistant.

  User Profile:
  - Name: {{{name}}}
  {{#if age}}- Age: {{{age}}}{{/if}}
  {{#if healthConditions}}
  - Pre-existing Conditions:
    {{#each healthConditions}}
    - {{{this}}}
    {{/each}}
  {{/if}}

  Live Data:
  - Location: {{{location}}}
  - Current AQI: {{{aqi}}}

  Instructions:
  1.  Provide 2-3 short, empathetic, and highly personalized bullet points.
  2.  Be proactive. Instead of just stating facts, give time-sensitive warnings (e.g., "This afternoon, try to...", "It's especially important today to...").
  3.  Crucially, tailor the advice based on their specific age and health conditions. For example, advice for a user with 'Asthma' should be more cautious and specific.
  4.  Keep the tone reassuring but clear about risks.
  5.  The output MUST be a JSON object with an "advice" field containing an array of strings. Do not write a long narrative.

  Example for high AQI and a user with Asthma:
  {
    "advice": [
      "Hi {{{name}}}, with your asthma, it's very important to stay indoors today in {{{location}}} as much as possible.",
      "If you need to go out this afternoon, please be sure to wear an N95 mask.",
      "Keep your reliever inhaler with you at all times as a precaution."
    ]
  }
  `,
});

const healthAdviceFlow = ai.defineFlow(
  {
    name: 'healthAdviceFlow',
    inputSchema: HealthAdviceInputSchema,
    outputSchema: HealthAdviceOutputSchema,
  },
  async input => {
    const {output} = await healthAdvicePrompt(input);
    return output!;
  }
);
