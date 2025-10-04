import { FileText, BarChart, LineChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PollutionReportsReview from './_components/pollution-reports-review';
import PolicyFeedbackReview from './_components/policy-feedback-review';
import DataInsightsPage from '@/app/(main)/dashboard/datainsights/page';
import ForecastPage from '@/app/(main)/dashboard/forecast/page';

export default function PolicyDashboardPage() {
    return (
        <div className="container py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Policymaker Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Review citizen submissions, analyze policy impact, and view AQI forecasts.
                </p>
            </div>

            <Tabs defaultValue="submissions" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                    <TabsTrigger value="submissions">
                        <FileText className="mr-2" />
                        Citizen Submissions
                    </TabsTrigger>
                    <TabsTrigger value="impact">
                        <BarChart className="mr-2" />
                        Policy Impact
                    </TabsTrigger>
                    <TabsTrigger value="forecast">
                        <LineChart className="mr-2" />
                        AQI Forecasts
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="submissions" className="mt-6">
                    <div className="space-y-8">
                        <PollutionReportsReview />
                        <PolicyFeedbackReview />
                    </div>
                </TabsContent>

                <TabsContent value="impact" className="mt-6">
                    {/* We embed the page directly, but remove its title/description for a seamless feel */}
                    <div className="[&>div>div:first-child]:hidden">
                      <DataInsightsPage />
                    </div>
                </TabsContent>

                <TabsContent value="forecast" className="mt-6">
                     {/* We embed the page directly to provide full functionality */}
                     <ForecastPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}
