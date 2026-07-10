export interface SleepData {
  id: string;
  userId: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: 'poor' | 'fair' | 'good' | 'great' | 'excellent';
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awakeTime: number;
  interruptions: number;
  notes?: string;
  source?: string;
}

export interface HRVData {
  id: string;
  userId: string;
  timestamp: string;
  rmssd: number;
  sdnn: number;
  heartRate: number;
  status: 'low' | 'normal' | 'high';
  notes?: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  timestamp: string;
  mood: number;
  energy: number;
  stress: number;
  tags: string[];
  note?: string;
}

export interface RecoveryMetrics {
  userId: string;
  date: string;
  readiness: number;
  recovery: number;
  sleep: number;
  hrv: number;
  activity: number;
  status: 'low' | 'moderate' | 'high';
  recommendation: string;
}
