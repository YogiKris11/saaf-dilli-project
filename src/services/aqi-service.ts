'use server';
import type { AQIData, MapAqiData } from '@/lib/types';
import { WAQI_API_TOKEN, DELHI_AQI_STATIONS } from '@/lib/constants';

const API_BASE_URL = 'https://api.waqi.info';

export async function getAqiForStation(stationUid: number): Promise<AQIData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/feed/@${stationUid}/?token=${WAQI_API_TOKEN}`, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.error(`Failed to fetch AQI data for station ${stationUid}: ${response.statusText}`);
      return null;
    }

    const json = await response.json();

    if (json.status !== 'ok') {
      console.error(`API error for station ${stationUid}: ${json.data}`);
      return null;
    }

    const data: AQIData = json.data;
    return data;
  } catch (error) {
    console.error(`Error fetching AQI data for station ${stationUid}:`, error);
    return null;
  }
}

export async function getAqiForMapBounds(): Promise<MapAqiData[] | null> {
  try {
    const latlng = '28.4042,76.8370,28.8835,77.3336';
    const response = await fetch(`${API_BASE_URL}/map/bounds/?latlng=${latlng}&token=${WAQI_API_TOKEN}`, { next: { revalidate: 60 } });
    
    if (!response.ok) {
      console.error(`Failed to fetch map bounds AQI data: ${response.statusText}`);
      return null;
    }

    const json = await response.json();

    if (json.status !== 'ok') {
      console.error(`API error for map bounds: ${json.data}`);
      return null;
    }

    const data: MapAqiData[] = json.data;
    return data;

  } catch (error) {
    console.error('Error fetching map bounds AQI data:', error);
    return null;
  }
}
