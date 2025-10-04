'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, BarChart3, BrainCircuit, Loader2, TrendingUp, TrendingDown, Clock, Lightbulb, Thermometer, Wind, Droplets, CalendarDays } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

import { DELHI_AQI_STATIONS } from '@/lib/constants';
import type { ForecastData, AQIData, WeeklyForecastDataPoint } from '@/lib/types';
import { getForecastForStation, getWeeklyForecastForStation } from '@/services/forecast-service';
import { getAqiForStation } from '@/services/aqi-service';
import { getForecastSummary, GetForecastSummaryOutput } from '@/ai/flows/forecast-summary-flow';

import ForecastChart from './_components/forecast-chart';
import WeeklyForecastChart from './_components/weekly-forecast-chart';
import { motion } from 'framer-motion';

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend.toLowerCase().includes('worsening')) return <TrendingDown className="h-6 w-6 text-destructive" />;
  if (trend.toLowerCase().includes('improving')) return <TrendingUp className="h-6 w-6 text-green-500" />;
  return <BarChart3 className="h-6 w-6 text-yellow-500" />;
}

const WeatherMetric = ({ icon: Icon, label, value, unit }: { icon: React.ElementType, label: string, value: React.ReactNode, unit?: string }) => (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
        <Icon className="h-6 w-6 text-primary" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-bold">{value} {unit}</p>
        </div>
    </div>
);

export default function ForecastPage() {
  const [selectedStation, setSelectedStation] = useState(DELHI_AQI_STATIONS[0].name);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [weeklyForecastData, setWeeklyForecastData] = useState<WeeklyForecastDataPoint[] | null>(null);
  const [currentAqiData, setCurrentAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<GetForecastSummaryOutput | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const stationUid = DELHI_AQI_STATIONS.find(s => s.name === selectedStation)?.uid;

  const handleGenerateAnalysis = useCallback(async (data: ForecastData) => {
    if (!data) return;
    setAiLoading(true);
    try {
        const input = {
            stationName: selectedStation,
            forecastData: JSON.stringify(data)
        }
      const result = await getForecastSummary(input);
      setAiSummary(result);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not generate AI analysis. Please try again later.',
      });
    } finally {
      setAiLoading(false);
    }
  }, [selectedStation, toast]);


  useEffect(() => {
    const fetchData = async () => {
      if (!stationUid) return;

      setLoading(true);
      setAiSummary(null);

      // Fetch all data in parallel
      const [forecast, weeklyForecast, currentAqi] = await Promise.all([
        getForecastForStation(selectedStation),
        getWeeklyForecastForStation(selectedStation),
        getAqiForStation(stationUid)
      ]);

      setForecastData(forecast);
      setWeeklyForecastData(weeklyForecast);
      setCurrentAqiData(currentAqi);
      setLoading(false);
      
      if (forecast) {
        handleGenerateAnalysis(forecast);
      }
    };

    fetchData();
  }, [selectedStation, stationUid, handleGenerateAnalysis]);


  return (
    <div className="container py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">AQI Forecast Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <p className="text-lg text-muted-foreground flex-shrink-0">Select a station to view its forecast.</p>
            <Select
                value={selectedStation}
                onValueChange={setSelectedStation}
            >
                <SelectTrigger className="w-full sm:w-[320px]">
                    <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                    {DELHI_AQI_STATIONS.map((station) => (
                    <SelectItem key={station.uid} value={station.name}>
                        {station.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="grid gap-8 mb-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
             <CardHeader>
                <CardTitle className="flex items-center gap-3">
                   <Clock className="h-6 w-6 text-primary" />
                    <span>Current Conditions</span>
                </CardTitle>
                <CardDescription>Live data from {selectedStation}</CardDescription>
            </CardHeader>
            <CardContent>
                 {loading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                 ) : currentAqiData?.iaqi ? (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="grid grid-cols-2 gap-3">
                        <WeatherMetric icon={Thermometer} label="Temperature" value={currentAqiData.iaqi.t?.v ?? 'N/A'} unit="°C" />
                        <WeatherMetric icon={Droplets} label="Humidity" value={currentAqiData.iaqi.h?.v ?? 'N/A'} unit="%" />
                        <WeatherMetric icon={Wind} label="Wind" value={currentAqiData.iaqi.w?.v ?? 'N/A'} unit="km/h" />
                        <WeatherMetric icon={BarChart3} label="Dominant" value={currentAqiData.dominentpol?.toUpperCase() ?? 'N/A'} />
                    </motion.div>
                 ) : (
                    <p className="text-center text-muted-foreground">Current conditions data not available.</p>
                 )}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span>AI Analysis</span>
                </CardTitle>
                <CardDescription>A professional summary of the 72-hour forecast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {(loading || aiLoading) ? (
                    <div className="grid md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    </div>
                )
                : aiSummary ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <Card className="bg-card-depth">
                            <CardContent className="p-4 flex items-center gap-4">
                                <TrendIcon trend={aiSummary.trend} />
                                <div>
                                <p className="text-sm text-muted-foreground">Overall Trend</p>
                                <p className="text-xl font-bold">{aiSummary.trend}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card-depth">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Clock className="h-6 w-6 text-primary" />
                                <div>
                                <p className="text-sm text-muted-foreground">Peak Pollution</p>
                                <p className="text-xl font-bold">{aiSummary.peakTime}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card-depth">
                            <CardContent className="p-4 flex items-start gap-4">
                                <Lightbulb className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                <p className="text-sm text-muted-foreground">Key Insight</p>
                                <p className="font-semibold leading-snug">{aiSummary.insight}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : <p className="text-center text-muted-foreground">AI analysis not available.</p>}
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <LineChart className="h-6 w-6 text-primary" />
                        72-Hour Detailed Forecast
                    </CardTitle>
                    <CardDescription>Predicted hourly AQI values for PM2.5, PM10, and Ozone.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-[350px] w-full" />
                    ) : (
                        <ForecastChart data={forecastData} />
                    )}
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <CalendarDays className="h-6 w-6 text-primary" />
                        7-Day Weekly Outlook
                    </CardTitle>
                    <CardDescription>Predicted daily average AQI for the week ahead.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-[350px] w-full" />
                    ) : (
                        <WeeklyForecastChart data={weeklyForecastData} />
                    )}
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
