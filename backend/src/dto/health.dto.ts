export interface SleepLogDTO {
  date: string;
  duration: number;
  quality?: number;
  deepSleep?: number;
  remSleep?: number;
  lightSleep?: number;
  awakeTime?: number;
  source?: string;
}

export interface HRVLogDTO {
  date: string;
  hrv: number;
  rmssd?: number;
  sdnn?: number;
  source?: string;
}

export interface MoodLogDTO {
  date: string;
  mood: number;
  energy?: number;
  stress?: number;
  note?: string;
}
