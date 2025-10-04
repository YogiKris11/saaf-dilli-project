'use server';
/**
 * @fileOverview AI-Powered Safe Route Finder flow.
 *
 * This file defines a Genkit flow that finds the safest commute route between two locations based on air pollution data.
 * It uses an AI model to analyze potential routes and identify the one with the least pollution exposure.
 *
 * - findSafeRoute - A function that takes start and end locations as input and returns the safest route.
 * - SafeRouteInput - The input type for the findSafeRoute function.
 * - SafeRouteOutput - The return type for the findSafeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafeRouteInputSchema = z.object({
  start: z.string().describe('The starting location for the route.'),
  end: z.string().describe('The destination location for the route.'),
});
export type SafeRouteInput = z.infer<typeof SafeRouteInputSchema>;

const RouteDetailSchema = z.object({
    route: z.string().describe("A summary of the route path."),
    details: z.string().describe("Details about the route including distance, estimated time, and key landmarks."),
    safetyIndex: z.string().describe("An AQI-based safety index or rating for this route."),
});

const SafeRouteOutputSchema = z.object({
  recommendedRoutes: z.array(RouteDetailSchema).describe('The top two recommended routes with the least air pollution exposure.'),
  routeToAvoid: RouteDetailSchema.describe('A route that should be avoided due to high pollution levels.'),
});
export type SafeRouteOutput = z.infer<typeof SafeRouteOutputSchema>;

export async function findSafeRoute(input: SafeRouteInput): Promise<SafeRouteOutput> {
  return findSafeRouteFlow(input);
}

const safeRoutePrompt = ai.definePrompt({
  name: 'safeRoutePrompt',
  input: {schema: SafeRouteInputSchema},
  output: {schema: SafeRouteOutputSchema},
  prompt: `You are an AI assistant for Saaf-Dilli, providing real-time, intelligent safe-route analysis. Your tone is confident and expert.

  Your task is to analyze the commute from {{{start}}} to {{{end}}} and present the best and worst routes based on current air quality and traffic data.

  Instructions:
  1.  Use the present tense. State facts clearly (e.g., "This route has lower pollution," not "This route may have...").
  2.  Synthesize data to give actionable intelligence. Instead of just listing data, explain *why* a route is better (e.g., "This route avoids the congested industrial sector, leading to a lower AQI.").
  3.  Be definitive. Avoid words like "may," "might," "could," or "suggests."
  4.  Provide two recommended routes and one route to avoid. For each, give:
      - A clear route description.
      - Key details (distance, current travel time, landmarks).
      - A definitive safety index based on live AQI.

  Example Output Style:
  - Recommended Route 1: "Via Barapullah Flyover. This route has the lowest pollution exposure right now due to favorable winds moving industrial pollutants away from this corridor."
  - Route to Avoid: "Outer Ring Road. Currently experiencing heavy traffic and high PM2.5 levels from vehicle emissions."

  Generate the analysis for the user's request now.
  `,
});

const findSafeRouteFlow = ai.defineFlow(
  {
    name: 'findSafeRouteFlow',
    inputSchema: SafeRouteInputSchema,
    outputSchema: SafeRouteOutputSchema,
  },
  async input => {
    const {output} = await safeRoutePrompt(input);
    return output!;
  }
);
