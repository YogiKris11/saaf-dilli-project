'use client';

import { BarChart as BarChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POLICIES_DATA } from "@/lib/policy-data";
import PolicyComparisonChart from "./_components/policy-comparison-chart";

export default function DataInsightsPage() {
    return (
        <div className="container py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Policy Impact Analysis</h1>
                <p className="text-lg text-muted-foreground">
                    Analyzing the impact of various government action plans on Delhi's air quality.
                </p>
            </div>
            <Tabs defaultValue={POLICIES_DATA[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                    {POLICIES_DATA.map(policy => (
                        <TabsTrigger key={policy.id} value={policy.id}>{policy.title}</TabsTrigger>
                    ))}
                </TabsList>

                {POLICIES_DATA.map(policy => (
                     <TabsContent key={policy.id} value={policy.id}>
                        <Card className="mt-4 transition-all hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <BarChartIcon className="h-5 w-5 text-primary" />
                                    </div>
                                    {policy.chartTitle}
                                </CardTitle>

                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground">{policy.chartDescription}</p>
                                <PolicyComparisonChart data={policy.chartData} yAxisLabel={policy.yAxisLabel}/>
                            </CardContent>
                        </Card>
                     </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
