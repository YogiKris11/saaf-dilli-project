'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Map } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { getAqiInfo } from '@/app/(main)/dashboard/citizen/_components/aqi-badge';
import { useEffect, useState, useRef } from 'react';
import { getAqiForMapBounds } from '@/services/aqi-service';
import type { MapAqiData } from '@/lib/types';
import L from 'leaflet';
import { Skeleton } from '@/components/ui/skeleton';

// Fix for default icon not showing in Next.js
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

const LiveAqiMap = () => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [stationData, setStationData] = useState<MapAqiData[]>([]);
    const [mapReady, setMapReady] = useState(false);
    
    useEffect(() => {
        const fetchMapData = async () => {
            const data = await getAqiForMapBounds();
            if (data) {
                setStationData(data);
            }
        };
        fetchMapData();
    }, []);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([28.6139, 77.2090], 10);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapRef.current);
            L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
            setMapReady(true);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); 

    useEffect(() => {
        if (mapReady && mapRef.current && stationData.length > 0) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapRef.current?.removeLayer(layer);
                }
            });

            stationData.forEach(data => {
                if (isNaN(Number(data.aqi))) return;

                const { color } = getAqiInfo(Number(data.aqi));
                const aqiValue = Number(data.aqi);
                const size = aqiValue > 200 ? 40 : aqiValue > 100 ? 35 : 30;

                const icon = L.divIcon({
                    html: `<div class="aqi-marker-pin" style="background-color: ${color.replace('bg-','').replace('-500','').replace('-600','').replace('-900','')}; width: ${size}px; height: ${size}px;">${data.aqi}</div>`,
                    className: 'aqi-marker',
                    iconSize: [size, size],
                    iconAnchor: [size/2, size/2]
                });
                
                L.marker([data.lat, data.lon], { icon })
                .addTo(mapRef.current as L.Map)
                .bindPopup(`
                    <div class="font-sans p-1">
                        <h3 class="font-bold text-base mb-1">${data.station.name}</h3>
                        <p class="text-sm">Live AQI: <span class="font-bold text-lg">${data.aqi}</span></p>
                        <p class="text-xs text-muted-foreground mt-2">Last updated: ${new Date(data.station.time).toLocaleString()}</p>
                    </div>
                `, {
                    closeButton: false,
                    className: 'aqi-popup'
                });
            });
        }
    }, [stationData, mapReady]);

  return (
    <Card className="glassmorphic-card h-[500px] p-6 shadow-lg flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight text-white">Live AQI Map</h2>
      <p className="mt-2 text-white/70 mb-4">Explore a dynamic, adaptive atmospheric map of Delhi.</p>
      <div className="flex-grow w-full rounded-lg relative overflow-hidden group">
        <div className="h-full w-full rounded-lg overflow-hidden z-0 border border-primary/20" ref={mapContainerRef}>
            {!mapReady && <Skeleton className="h-full w-full" />}
        </div>
      </div>
    </Card>
  );
};

export default LiveAqiMap;
