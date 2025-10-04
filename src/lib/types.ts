export type UserRole = 'citizen' | 'policy';

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, never store passwords directly
  role: UserRole;
  age?: number;
  primaryLocation?: string; // AQI station name
  healthConditions?: string[];
  secretKey?: string; // Only for policymakers
};

export type AQIStation = {
  name: string;
  uid: number;
};

export type AQIData = {
  aqi: number;
  time: {
    s: string;
    tz: string;
  };
  iaqi?: {
    [key: string]: { v: number };
    t?: { v: number };
    h?: { v: number };
    w?: { v: number };
  };
  dominentpol: string;
  city: {
    geo: [number, number];
    name: string;
  };
};

export type MapAqiData = {
  lat: number;
  lon: number;
  uid: number;
  aqi: string;
  station: {
    name: string;
    time: string;
  };
};

export type ForecastDataPoint = {
  avg: number;
  day: string;
  max?: number;
  min?: number;
};

export type ForecastData = {
  o3: ForecastDataPoint[];
  pm10: ForecastDataPoint[];
  pm25: ForecastDataPoint[];
};

export type WeeklyForecastDataPoint = {
  name: string;
  aqi: number;
}

export type PollutionReportStatus = 'Pending' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Reviewed';

export type PollutionReport = {
  id: string;
  userId: string;
  userName: string;
  location: string;
  description: string;
  timestamp: string;
  status: PollutionReportStatus;
};

export type PolicyFeedback = {
  id: string;
  userId: string;
  userName: string;
  policyArea: string;
  feedback: string;
  timestamp: string;
};

export type CommunityDiscussion = {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  timestamp: string;
  replies: CommunityReply[];
};

export type CommunityReply = {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
};

export type CommunityTip = {
  id: string;
  authorName: string;
  tip: string;
  timestamp: string;
};
