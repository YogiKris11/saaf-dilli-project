'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { DELHI_AQI_STATIONS } from '@/lib/constants';
import { getAqiForStation } from '@/services/aqi-service';
import type { AQIData } from '@/lib/types';
import { AqiBadge } from '../citizen/_components/aqi-badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const PollutantDisplay = ({ name, value, icon: Icon }: { name: string; value: number, icon: React.ElementType }) => (
  <div className="flex justify-between items-center text-sm p-2 rounded-md transition-colors hover:bg-muted/50">
    <p className="flex items-center gap-2 text-muted-foreground"><Icon className="w-4 h-4" /> {name}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default function LocationAqiSearch() {
  const [selectedStation, setSelectedStation] = useState(DELHI_AQI_STATIONS[0].uid);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedStationName = useMemo(() => {
    return DELHI_AQI_STATIONS.find(s => s.uid === selectedStation)?.name || 'Unknown Station';
  }, [selectedStation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAqiForStation(selectedStation);
      setAqiData(data);
      setLoading(false);
    };

    fetchData();
  }, [selectedStation]);

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
                <MapPin className="h-5 w-5 text-primary" />
            </div>
            <span>Location AQI Details</span>
        </CardTitle>
        <div className="pt-2">
            <Select
                value={selectedStation.toString()}
                onValueChange={(value) => setSelectedStation(Number(value))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a monitoring station" />
                </SelectTrigger>
                <SelectContent>
                    {DELHI_AQI_STATIONS.map((station) => (
                    <SelectItem key={station.uid} value={station.uid.toString()}>
                        {station.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div key="loader" exit={{ opacity: 0 }} className="space-y-4 flex flex-col items-center justify-center h-80">
                    <Skeleton className="h-40 w-40 rounded-full" />
                    <Skeleton className="h-24 w-full" />
                </motion.div>
            ) : aqiData ? (
                <motion.div 
                    key="data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <AqiBadge aqi={aqiData.aqi} />
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 text-center text-md">Live Pollutant Levels (AQI)</h4>
                      {aqiData.iaqi ? (
                        <div className="space-y-1">
                          {aqiData.iaqi.pm25 && <PollutantDisplay name="PM2.5" value={aqiData.iaqi.pm25.v} icon={Wind} />}
                          {aqiData.iaqi.pm10 && <PollutantDisplay name="PM10" value={aqiData.iaqi.pm10.v} icon={Wind} />}
                          {aqiData.iaqi.o3 && <PollutantDisplay name="Ozone (O₃)" value={aqiData.iaqi.o3.v} icon={Thermometer} />}
                          {aqiData.iaqi.no2 && <PollutantDisplay name="Nitrogen Dioxide (NO₂)" value={aqiData.iaqi.no2.v} icon={Droplets} />}
                          {aqiData.iaqi.so2 && <PollutantDisplay name="Sulphur Dioxide (SO₂)" value={aqiData.iaqi.so2.v} icon={Droplets} />}
                          {aqiData.iaqi.co && <PollutantDisplay name="Carbon Monoxide (CO)" value={aqiData.iaqi.co.v} icon={Droplets} />}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">Detailed pollutant data not available.</p>
                      )}
                    </div>
                     <p className="text-xs text-muted-foreground text-center pt-2">
                      Live AQI values are based on the US EPA standard.
                    </p>
                </motion.div>
            ) : (
            <p className="text-muted-foreground text-center">Could not load AQI data for {selectedStationName}.</p>
            )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
