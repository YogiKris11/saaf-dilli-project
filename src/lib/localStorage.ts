// In a real app, this would be a proper database.
// For this demo, we use localStorage to persist data across browser sessions.

import type { User, PollutionReport, PolicyFeedback, CommunityDiscussion, CommunityTip } from './types';

// --- Hashing Utility (for demonstration only) ---
// In a real app, use a robust library like bcrypt.
const simpleHash = (s: string): string => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

// --- Generic localStorage Functions ---
const getItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const setItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

// --- Initial Data ---
const getInitialUsers = (): User[] => [
  {
    id: 'user-1',
    name: 'Citizen Test',
    email: 'citizen@test.com',
    passwordHash: simpleHash('password'),
    role: 'citizen',
    age: 34,
    primaryLocation: 'Anand Vihar, Delhi',
    healthConditions: ['Asthma'],
  },
  {
    id: 'user-2',
    name: 'Policy Maker',
    email: 'policy@test.com',
    passwordHash: simpleHash('password'),
    role: 'policy',
    secretKey: 'SECRET123',
  },
];

const getInitialReports = (): PollutionReport[] => [
    {
        id: 'report-1',
        userId: 'user-1',
        userName: 'Citizen Test',
        location: 'Near Anand Vihar',
        description: 'Large pile of garbage being burned in the open, causing thick black smoke.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    }
]

const getInitialFeedback = (): PolicyFeedback[] => [
    {
        id: 'feedback-1',
        userId: 'user-1',
        userName: 'Citizen Test',
        policyArea: 'Public Transportation',
        feedback: 'The frequency of electric buses on my route has decreased. This forces more people to use private vehicles, increasing pollution. Please restore the previous schedule.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
]

const getInitialDiscussions = (): CommunityDiscussion[] => [
    {
        id: 'discussion-1',
        authorId: 'user-1',
        authorName: 'Citizen Test',
        title: 'Best Air Purifiers for Small Apartments?',
        content: 'I live in a 1BHK and the pollution has been really bad. Looking for recommendations for an effective but not too expensive air purifier. What has worked for you all?',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
            {
                id: 'reply-1-1',
                authorId: 'user-sim-1',
                authorName: 'Aisha K.',
                content: 'I have a Coway Airmega and it works wonders! A bit pricey but worth it for the peace of mind.',
                timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            }
        ]
    }
]

const getInitialTips = (): CommunityTip[] => [
    {
        id: 'tip-1',
        authorName: 'Rohan S.',
        tip: 'Check your window seals! I found a lot of outside air was getting in. Sealing them properly made a huge difference in my indoor AQI.',
        timestamp: new Date().toISOString(),
    }
]


// --- Database Initialization ---
export const initializeDb = (): void => {
  if (getItem('users') === null) {
    setItem('users', getInitialUsers());
  }
  if (getItem('reports') === null) {
    setItem('reports', getInitialReports());
  }
  if (getItem('policyFeedback') === null) {
    setItem('policyFeedback', getInitialFeedback());
  }
  if (getItem('discussions') === null) {
    setItem('discussions', getInitialDiscussions());
  }
  if (getItem('communityTips') === null) {
    setItem('communityTips', getInitialTips());
  }
};

// --- Data Accessors ---
export const db = {
  users: {
    get: () => getItem<User[]>('users') || [],
    set: (data: User[]) => setItem('users', data),
  },
  currentUser: {
    get: () => getItem<User>('currentUser'),
    set: (data: User) => setItem('currentUser', data),
    clear: () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('currentUser');
      }
    },
  },
  reports: {
    get: () => getItem<PollutionReport[]>('reports') || [],
    set: (data: PollutionReport[]) => setItem('reports', data),
  },
  policyFeedback: {
    get: () => getItem<PolicyFeedback[]>('policyFeedback') || [],
    set: (data: PolicyFeedback[]) => setItem('policyFeedback', data),
  },
  discussions: {
    get: () => getItem<CommunityDiscussion[]>('discussions') || [],
    set: (data: CommunityDiscussion[]) => setItem('discussions', data),
  },
  communityTips: {
    get: () => getItem<CommunityTip[]>('communityTips') || [],
    set: (data: CommunityTip[]) => setItem('communityTips', data),
  },
  utils: {
    simpleHash,
  }
};
