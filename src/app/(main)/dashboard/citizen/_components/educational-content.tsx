'use client';
import { BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const content = [
    {
        title: "Major Pollution Sources in Delhi",
        body: "Vehicular emissions, industrial pollution, construction dust, and stubble burning in neighboring states are the primary contributors to Delhi's poor air quality, especially during winter months."
    },
    {
        title: "Health Impacts of PM2.5",
        body: "PM2.5 are fine inhalable particles that can penetrate deep into your lungs and enter your bloodstream. Exposure can lead to respiratory issues, heart problems, and other serious health conditions."
    },
    {
        title: "Simple Tips for Better Air",
        body: "Use public transport, invest in a good air purifier for your home, keep plants that purify air, and avoid outdoor exercise on high-pollution days. Wearing an N95 mask can also significantly reduce your exposure."
    },
    {
        title: "Understanding AQI Levels",
        body: "The Air Quality Index (AQI) is a scale from 0 to 500. Higher values indicate greater air pollution and health risk. 0-50 is 'Good', while anything above 300 is considered 'Hazardous'."
    }
]

export default function EducationalContent() {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
                <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span>Learn About Air Quality</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            {content.map((item, index) => (
                 <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-left hover:no-underline">{item.title}</AccordionTrigger>
                    <AccordionContent>{item.body}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
