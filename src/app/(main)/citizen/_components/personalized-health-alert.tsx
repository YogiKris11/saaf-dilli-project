'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartPulse, Loader2, AlertTriangle, ChevronsRight, ShieldCheck, Wind, Home, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getAqiForStation } from '@/services/aqi-service';
import type { AQIData } from '@/lib/types';
import { DELHI_AQI_STATIONS } from '@/lib/constants';
import { getAqiInfo } from '@/app/(main)/dashboard/citizen/_components/aqi-badge';
import { getPersonalizedHealthAdvice } from '@/ai/flows/health-advice-flow';
import { motion, AnimatePresence } from 'framer-motion';

const adviceIcons: { [key: string]: React.ElementType } = {
    indoors: Home,
    mask: ShieldCheck,
    air: Wind,
    default: ChevronsRight,
};

const getIconForAdvice = (advice: string): React.ElementType => {
    const lowerCaseAdvice = advice.toLowerCase();
    if (lowerCaseAdvice.includes('indoors') || lowerCaseAdvice.includes('inside')) return adviceIcons.indoors;
    if (lowerCaseAdvice.includes('mask')) return adviceIcons.mask;
    if (lowerCaseAdvice.includes('purifier') || lowerCaseAdvice.includes('windows')) return adviceIcons.air;
    return adviceIcons.default;
}

export default function PersonalizedHealthAlert() {
  const { user } = useAuth();
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const primaryStation = DELHI_AQI_STATIONS.find(s => s.name === user?.primaryLocation);

  useEffect(() => {
    if (user && primaryStation) {
      setLoading(true);
      setError('');
      const fetchData = async () => {
        const data = await getAqiForStation(primaryStation.uid);
        
        if (data && typeof data.aqi === 'number') {
            setAqiData(data);
          try {
            const adviceResult = await getPersonalizedHealthAdvice({
              name: user.name,
              age: user.age,
              healthConditions: user.healthConditions,
              aqi: data.aqi,
              location: primaryStation.name
            });
            setAdvice(adviceResult.advice);
          } catch (e) {
            console.error("Failed to get personalized advice", e);
            setError("Could not load AI-powered health advice. Please try again later.");
          }
        } else if (data) {
            setError(`AQI data for ${primaryStation.name} is not available at the moment.`);
        }
        setLoading(false);
      };
      fetchData();
    } else {
        setLoading(false);
    }
  }, [primaryStation, user]);

  if (!user) {
    return (
        <Card className="glassmorphic-card p-6 shadow-lg">
             <h2 className="text-3xl font-bold tracking-tight text-white">Personalized Health Alert</h2>
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                 <div className="p-4 bg-primary/20 rounded-full">
                    <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-white/70 max-w-xs">Log in to receive health alerts tailored to your profile and location.</p>
                <Button onClick={() => router.push('/login')}>
                    Log In to Get Alerts
                </Button>
            </div>
        </Card>
    )
  }

  if (!user.primaryLocation) {
    return (
        <Card className="glassmorphic-card p-6 shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white">Personalized Health Alert</h2>
            <CardContent>
                <p className="text-sm text-white/70 mt-4 text-center">Please set your primary location in your <Link href="/profile" className="text-primary hover:underline font-semibold">profile</Link> to receive personalized health alerts.</p>
            </CardContent>
        </Card>
    )
  }

  const aqiInfo = getAqiInfo(aqiData?.aqi || 0);

  const getAlertStyling = (level: string) => {
    if (level.includes('Unhealthy') || level.includes('Hazardous')) return {
        variant: "destructive",
        className: "bg-destructive/10 border-destructive/30",
        iconColor: "text-destructive"
    };
    if (level === 'Moderate') return {
        variant: "default",
        className: "bg-yellow-500/10 border-yellow-500/30",
        iconColor: "text-yellow-500"
    };
    return {
        variant: "default",
        className: "bg-green-500/10 border-green-500/30",
        iconColor: "text-green-500"
    };
  }

  const alertStyling = getAlertStyling(aqiInfo.level);

  return (
    <Card className="glassmorphic-card p-6 shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight text-white">Personalized Health Alert</h2>
        <p className="mt-2 text-white/70">AI-powered advice based on your profile & live AQI.</p>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : aqiData && typeof aqiData.aqi === 'number' ? (
          <Alert variant={alertStyling.variant} className={alertStyling.className}>
              <AlertTriangle className={`h-4 w-4 ${alertStyling.iconColor}`} />
              <AlertTitle className="flex items-center justify-between font-bold text-lg">
                <span className={alertStyling.iconColor}>{aqiInfo.level} Air Quality</span>
                <span className={`text-3xl font-bold ${alertStyling.iconColor}`}>{aqiData.aqi} AQI</span>
              </AlertTitle>
              <AlertDescription className="mt-4 text-foreground/90">
                {error ? <p>{error}</p> : (
                    <ul className="space-y-3">
                        {advice.map((point, index) => {
                            const Icon = getIconForAdvice(point);
                            return (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <Icon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                                    <span>{point}</span>
                                </motion.li>
                            )
                        })}
                    </ul>
                )}
              </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-white/70">{error || `Could not load health alert data for ${primaryStation?.name}.`}</p>
        )}
      </CardContent>
    </Card>
  );
}
