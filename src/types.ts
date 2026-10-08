export type Screen = 'home' | 'sleep' | 'activity' | 'profile';

export type TransitionType = 'none' | 'push';

export interface UserHealthState {
  steps: number;
  stepGoal: number;
  calories: number;
  calorieGoal: number;
  distanceKm: number;
  activeMinutes: number;
  floorsClimbed: number;
  heartRate: number;
  hrv: number;
  vo2Max: number;
  waterMl: number;
  waterGoalMl: number;
  sleepHours: number;
  sleepMinutes: number;
  sleepGoalHours: number;
  sleepScore: number;
  sleepEfficiency: number;
  userName: string;
  userRank: string;
  weightKg: number;
  heightCm: number;
  bmrKcal: number;
}

export interface WorkoutSession {
  id: string;
  type: '달리기' | '사이클링' | '웨이트' | 'HIIT';
  durationSeconds: number;
  caloriesBurned: number;
  avgHeartRate: number;
  timestamp: string;
}
