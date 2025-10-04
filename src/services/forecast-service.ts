import type { ForecastData, WeeklyForecastDataPoint } from '@/lib/types';

// This is a mock service. In a real application, this would fetch data from a weather/pollution forecast API.

const getSeason = (date: Date): 'Winter' | 'Summer' | 'Monsoon' | 'Autumn' => {
    const month = date.getMonth(); // 0-11
    if (month >= 2 && month <= 5) return 'Summer'; // Mar - Jun
    if (month >= 6 && month <= 8) return 'Monsoon'; // Jul - Sep
    if (month === 9) return 'Autumn'; // Oct
    return 'Winter'; // Nov, Dec, Jan, Feb
};

const isWeekendOrHoliday = (date: Date): boolean => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) return true;

    const month = date.getMonth(); // 0-11
    const dateOfMonth = date.getDate();

    // Jan 26 - Republic Day
    if (month === 0 && dateOfMonth === 26) return true;
    // Aug 15 - Independence Day
    if (month === 7 && dateOfMonth === 15) return true;
    // Approx Diwali - Nov 1
    if (month === 10 && dateOfMonth === 1) return true;

    return false;
};

const getDailyPatternModifier = (pollutant: 'pm25' | 'pm10' | 'o3', hour: number): number => {
    switch (pollutant) {
        case 'pm25':
        case 'pm10':
            if (hour >= 5 && hour <= 10) return 1.25; // Morning rush
            if (hour >= 11 && hour <= 16) return 0.9;  // Afternoon dispersion
            if (hour >= 17 && hour <= 22) return 1.15; // Evening peak
            return 1.0; // Night
        case 'o3':
            if (hour >= 6 && hour <= 9) return 0.8;   // Morning, NOx scavenging
            if (hour >= 12 && hour <= 17) return 1.35; // Afternoon peak (photochemistry)
            if (hour >= 18) return 0.9; // Evening/Night drop
            return 1.0;
        default:
            return 1.0;
    }
}


const generate72HourForecast = (baseAqi: number, pollutant: 'pm25' | 'pm10' | 'o3'): {avg: number, day: string}[] => {
    const data = [];
    const now = new Date();

    for (let i = 0; i < 72; i++) {
        const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hour = futureDate.getHours();

        let modifiedAqi = baseAqi;

        // 1. Apply daily pattern for the hour
        modifiedAqi *= getDailyPatternModifier(pollutant, hour);

        // 2. Apply Seasonal Modifier for the day
        const season = getSeason(futureDate);
        switch (season) {
            case 'Winter': modifiedAqi *= 1.15; break;
            case 'Summer': modifiedAqi *= 0.90; break;
            case 'Monsoon': modifiedAqi *= 0.80; break;
            case 'Autumn': modifiedAqi *= 1.0; break;
        }

        // 3. Apply Weekend/Holiday Modifier for the day
        if (isWeekendOrHoliday(futureDate)) {
            modifiedAqi *= 0.90;
        }

        // 4. Apply Synthetic Weather Modifier (changes every 6 hours)
        if (Math.floor(i / 6) % 2 === 0) { // Windy/Cloudy
            modifiedAqi *= 0.95;
        } else { // Stable/No Wind
            modifiedAqi *= 1.05;
        }

        // 5. Apply Natural Fluctuation
        const fluctuation = 0.98 + Math.random() * 0.04; // +/- 2%
        modifiedAqi *= fluctuation;

        const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(futureDate);
        const hourLabel = `${dayFormat} ${futureDate.getHours()}:00`;
        
        data.push({
            day: hourLabel,
            avg: Math.max(0, Math.round(modifiedAqi)),
        });
    }
    return data;
};


export const getForecastForStation = async (stationName: string): Promise<ForecastData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Create slightly different forecasts based on station name hash to show variation
  let hash = 0;
  for (let i = 0; i < stationName.length; i++) {
    hash = (hash << 5) - hash + stationName.charCodeAt(i);
    hash |= 0;
  }
  
  const basePm25 = 100 + (hash % 50);
  const basePm10 = 80 + (hash % 40);
  const baseO3 = 50 + (hash % 30);

  return {
    pm25: generate72HourForecast(basePm25, 'pm25'),
    pm10: generate72HourForecast(basePm10, 'pm10'),
    o3: generate72HourForecast(baseO3, 'o3'),
  };
};

export const getWeeklyForecastForStation = async(stationName: string): Promise<WeeklyForecastDataPoint[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create slightly different forecasts based on station name hash to show variation
    let hash = 0;
    for (let i = 0; i < stationName.length; i++) {
        hash = (hash << 5) - hash + stationName.charCodeAt(i);
        hash |= 0;
    }

    const data: WeeklyForecastDataPoint[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const futureDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        let baseAqi = 120 + (hash % 50);

        // Seasonal modifier
        const season = getSeason(futureDate);
        switch (season) {
            case 'Winter': baseAqi *= 1.2; break;
            case 'Summer': baseAqi *= 0.85; break;
            case 'Monsoon': baseAqi *= 0.75; break;
            case 'Autumn': baseAqi *= 1.05; break;
        }

        // Weekend modifier
        if (isWeekendOrHoliday(futureDate)) {
            baseAqi *= 0.9;
        }

        // Day-of-the-week trend
        baseAqi *= (1 + Math.sin(i) * 0.1); // Add a slight sinusoidal trend over the week

        // Natural fluctuation
        const fluctuation = 0.95 + Math.random() * 0.1; // +/- 5%
        baseAqi *= fluctuation;
        
        const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(futureDate);
        
        data.push({
            name: dayFormat,
            aqi: Math.max(0, Math.round(baseAqi)),
        });
    }

    return data;
}
