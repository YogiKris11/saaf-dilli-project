'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import LocationAqiSearch from '../_components/location-aqi-search';
import SafeRouteFinder from '../_components/safe-route-finder';
import CitizenReporting from '../_components/citizen-reporting';
import PolicyEngagement from '../_components/policy-engagement';
import EducationalContent from '../_components/educational-content';
import PersonalizedHealthAlert from '../_components/personalized-health-alert';


const LiveAqiMap = dynamic(() => import('../_components/live-aqi-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[550px] w-full" />,
});


export default function CitizenDashboardPage() {
  return (
    <>
      <div className="container py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                  <PersonalizedHealthAlert />
                  <LiveAqiMap />
              </div>

              <div className="lg:col-span-1 space-y-8">
                  <LocationAqiSearch />
                  <SafeRouteFinder />
              </div>
          </div>
          
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CitizenReporting />
                <PolicyEngagement />
            </div>
            <EducationalContent />
          </div>
      </div>
    </>
  );
}
