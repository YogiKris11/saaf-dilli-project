import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { level: 'Good', color: 'bg-green-500',textColor: 'text-white' , ringColor: 'ring-green-500/30' };
  if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-black', ringColor: 'ring-yellow-500/30' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'bg-orange-500', textColor: 'text-white', ringColor: 'ring-orange-500/30' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-white', ringColor: 'ring-red-500/30' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-600', textColor: 'text-white', ringColor: 'ring-purple-600/30' };
  return { level: 'Hazardous', color: 'bg-rose-900', textColor: 'text-white', ringColor: 'ring-rose-900/30' };
};

interface AqiBadgeProps {
  aqi: number;
}

export function AqiBadge({ aqi }: AqiBadgeProps) {
  const { level, color, textColor, ringColor } = getAqiInfo(aqi);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className={cn(
            "relative w-40 h-40 rounded-full flex items-center justify-center ring-8",
            color,
            ringColor
            )}
        >
            <span className={cn("text-6xl font-bold", textColor)}>{aqi}</span>
        </motion.div>
        <Badge className={cn('text-lg px-4 py-1', color, textColor)}>{level}</Badge>
    </div>
  );
}

export function AqiDot({ aqi }: { aqi: number }) {
  const { color } = getAqiInfo(aqi);
  return <div className={cn('h-3 w-3 rounded-full', color)} />;
}
