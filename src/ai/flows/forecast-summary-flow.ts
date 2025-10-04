'use server';

/**
 * @fileOverview AI-powered forecast summary flow.
 *
 * - getForecastSummary - A function that generates a forecast summary.
 * - GetForecastSummaryInput - The input type for the getForecastSummary function.
 * - GetForecastSummaryOutput - The return type for the getForecastSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetForecastSummaryInputSchema = z.object({
  stationName: z.string().describe('The name of the monitoring station.'),
  forecastData: z.string().describe('The 72-hour AQI forecast data as a JSON string.'),
});
export type GetForecastSummaryInput = z.infer<typeof GetForecastSummaryInputSchema>;

const GetForecastSummaryOutputSchema = z.object({
  trend: z.string().describe('A single keyword for the overall 72-hour trend (e.g., "Worsening", "Improving", "Variable").'),
  peakTime: z.string().describe('A short phrase for when pollution will be highest (e.g., "Mornings & Evenings", "Afternoons").'),
  insight: z.string().describe('A single, crisp, actionable sentence for users.'),
});
export type GetForecastSummaryOutput = z.infer<typeof GetForecastSummaryOutputSchema>;

export async function getForecastSummary(input: GetForecastSummaryInput): Promise<GetForecastSummaryOutput> {
  return forecastSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastSummaryPrompt',
  input: {schema: GetForecastSummaryInputSchema},
  output: {schema: GetForecastSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in air quality analysis. You will be provided with 72-hour AQI forecast data for a specific monitoring station.

Your task is to generate a structured, concise, and professional summary.

Analyze the data and provide:
1.  **trend**: A single keyword for the overall trend over 72 hours (e.g., "Worsening", "Improving", "Variable").
2.  **peakTime**: A short phrase identifying when pollution is generally highest (e.g., "Mornings & Evenings", "Afternoons", "Night").
3.  **insight**: A single, crisp, actionable sentence for users.

Station Name: {{{stationName}}}
Forecast Data: {{{forecastData}}}
`,
});

const forecastSummaryFlow = ai.defineFlow(
  {
    name: 'forecastSummaryFlow',
    inputSchema: GetForecastSummaryInputSchema,
    outputSchema: GetForecastSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
