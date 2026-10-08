import React, { useState, useEffect } from 'react';
import { Screen, TransitionType, UserHealthState, WorkoutSession } from '../types';
import { 
  Flame, 
  Footprints, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Zap, 
  Timer, 
  Heart, 
  TrendingUp, 
  ChevronLeft, 
  Dumbbell, 
  Bike, 
  Plus
} from 'lucide-react';

interface ActivityScreenProps {
  health: UserHealthState;
  onUpdateHealth: (updater: (prev: UserHealthState) => UserHealthState) => void;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  health,
  onUpdateHealth,
  onNavigate,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<'달리기' | '사이클링' | '웨이트' | 'HIIT'>('달리기');
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutCalories, setWorkoutCalories] = useState(0);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([
    {
      id: 'w1',
      type: '달리기',
      durationSeconds: 1800,
      caloriesBurned: 245,
      avgHeartRate: 148,
      timestamp: '오늘 오전 07:30',
    },
    {
      id: 'w2',
      type: 'HIIT',
      durationSeconds: 1200,
      caloriesBurned: 180,
      avgHeartRate: 162,
      timestamp: '어제 오후 18:40',
    },
  ]);

  // Workout timer
  useEffect(() => {
    let interval: any = null;
    if (isWorkingOut) {
      interval = setInterval(() => {
        setWorkoutSeconds((sec) => sec + 1);
        setWorkoutCalories((cal) => cal + (selectedWorkout === 'HIIT' ? 0.22 : 0.15));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkingOut, selectedWorkout]);

  const handleToggleWorkout = () => {
    if (!isWorkingOut) {
      setIsWorkingOut(true);
    } else {
      setIsWorkingOut(false);
    }
  };

  const handleFinishWorkout = () => {
    if (workoutSeconds > 5) {
      const burned = Math.round(workoutCalories);
      const addedSteps = selectedWorkout === '달리기' ? Math.round(workoutSeconds * 2.5) : 0;
      
      const newSession: WorkoutSession = {
        id: `w-${Date.now()}`,
        type: selectedWorkout,
        durationSeconds: workoutSeconds,
        caloriesBurned: burned,
        avgHeartRate: 152,
        timestamp: '방금 완료',
      };
      setRecentWorkouts([newSession, ...recentWorkouts]);

      onUpdateHealth((prev) => {
        const newSteps = prev.steps + addedSteps;
        return {
          ...prev,
          steps: newSteps,
          distanceKm: +(newSteps * 0.00075).toFixed(2),
          calories: prev.calories + burned,
          activeMinutes: prev.activeMinutes + Math.round(workoutSeconds / 60),
        };
      });
    }
    setIsWorkingOut(false);
    setWorkoutSeconds(0);
    setWorkoutCalories(0);
  };

  const addQuickSteps = (count: number) => {
    onUpdateHealth((prev) => {
      const newSteps = prev.steps + count;
      return {
        ...prev,
        steps: newSteps,
        distanceKm: +(newSteps * 0.00075).toFixed(2),
        calories: prev.calories + Math.round(count * 0.04),
        activeMinutes: prev.activeMinutes + Math.round(count / 100),
      };
    });
  };

  const stepPercentage = Math.min(100, Math.round((health.steps / health.stepGoal) * 100));

  const hourlySteps = [
    { time: '08시', steps: 1200 },
    { time: '10시', steps: 1850 },
    { time: '12시', steps: 2400 },
    { time: '14시', steps: 1100 },
    { time: '16시', steps: 950 },
    { time: '18시', steps: 1920, current: true },
    { time: '20시', steps: 400 },
  ];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home', 'none')}
          className="flex items-center gap-1.5 text-xs text-[#bacbb9] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </button>
        <span className="text-xs font-mono text-[#00f1fd] bg-[#00f1fd]/10 px-2 py-0.5 rounded border border-[#00f1fd]/30">
          CYAN VELOCITY HUD
        </span>
      </div>

      {/* Main Steps & Kinematics Hero Card */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-white/10 hud-glow-cyan backdrop-blur-md relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#00f1fd]/15 text-[#00f1fd]">
                <Footprints className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-[#00f1fd]">KINEMATIC TELEMETRY</span>
            </div>
            <h2 className="text-xl font-bold font-hud text-white mt-1">
              실시간 활동 & 걸음 분석
            </h2>
            <p className="text-xs text-[#bacbb9] mt-0.5">
              일일 목표 {health.stepGoal.toLocaleString()} 보 달성 중
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-hud font-bold text-[#00f1fd] tnum">
              {stepPercentage}%
            </span>
            <span className="text-[11px] text-[#859585]">목표 달성률</span>
          </div>
        </div>

        {/* Big Step Counter */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-baseline justify-between">
          <div>
            <span className="text-4xl font-hud font-bold text-white tnum tracking-tight">
              {health.steps.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-[#bacbb9] ml-1.5">걸음</span>
          </div>

          {/* Quick Step Increment Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => addQuickSteps(500)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#1c2026] text-[#00f1fd] border border-[#00f1fd]/30 hover:bg-[#00f1fd]/20 transition-all cursor-pointer font-medium"
            >
              +500
            </button>
            <button
              type="button"
              onClick={() => addQuickSteps(1000)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#1c2026] text-[#00f1fd] border border-[#00f1fd]/30 hover:bg-[#00f1fd]/20 transition-all cursor-pointer font-medium"
            >
              +1,000
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1c2026] h-2 rounded-full mt-3 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-[#00dce6] to-[#00f1fd] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,242,254,0.6)]"
            style={{ width: `${stepPercentage}%` }}
          />
        </div>

        {/* Triple sub-metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5">
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] text-[#859585] block">이동 거리</span>
            <span className="text-base font-hud font-bold text-white tnum mt-0.5 block">
              {health.distanceKm} <span className="text-xs font-normal text-[#bacbb9]">km</span>
            </span>
          </div>
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] text-[#859585] block">활동 소모</span>
            <span className="text-base font-hud font-bold text-[#00e676] tnum mt-0.5 block">
              {health.calories} <span className="text-xs font-normal text-[#bacbb9]">kcal</span>
            </span>
          </div>
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5">
            <span className="text-[10px] text-[#859585] block">고강도 시간</span>
            <span className="text-base font-hud font-bold text-white tnum mt-0.5 block">
              {health.activeMinutes} <span className="text-xs font-normal text-[#bacbb9]">분</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Workout Tracker (빠른 운동 세션 모드) */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00e676]" />
            <span className="text-sm font-semibold text-white">실시간 운동 세션 트래커</span>
          </div>
          {isWorkingOut && (
            <span className="flex items-center gap-1.5 text-xs text-[#00e676] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#00e676]" />
              RECORDING
            </span>
          )}
        </div>

        {/* Workout Mode Selector */}
        {!isWorkingOut && (
          <div className="grid grid-cols-4 gap-1.5 bg-[#1c2026] p-1 rounded-lg border border-white/5">
            {[
              { id: '달리기', label: '러닝', icon: Footprints },
              { id: '사이클링', label: '사이클', icon: Bike },
              { id: '웨이트', label: '웨이트', icon: Dumbbell },
              { id: 'HIIT', label: 'HIIT', icon: Flame },
            ].map((item) => {
              const Icon = item.icon;
              const isSel = selectedWorkout === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedWorkout(item.id as any)}
                  className={`flex flex-col items-center py-2 px-1 rounded-md transition-all cursor-pointer ${
                    isSel
                      ? 'bg-[#00e676] text-[#0d1117] font-bold shadow-[0_0_10px_rgba(0,230,118,0.3)]'
                      : 'text-[#bacbb9] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Stopwatch Display */}
        <div className="bg-[#1c2026] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
          <div className="text-[11px] font-mono text-[#859585] uppercase tracking-wider mb-1">
            {selectedWorkout} 세션 타이머
          </div>
          <div className="text-4xl font-hud font-bold text-white tnum tracking-widest my-1">
            {formatTimer(workoutSeconds)}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#bacbb9] mt-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#00e676]" />
              {Math.round(workoutCalories)} kcal
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#ff4b72]" />
              {isWorkingOut ? '146 BPM' : `${health.heartRate} BPM`}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleToggleWorkout}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-hud font-bold text-xs transition-all cursor-pointer ${
                isWorkingOut
                  ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40 hover:bg-[#ffb4ab]/30'
                  : 'bg-[#00e676] text-[#0d1117] hover:bg-[#75ff9e] shadow-[0_0_14px_rgba(0,230,118,0.3)]'
              }`}
            >
              {isWorkingOut ? (
                <>
                  <Pause className="w-4 h-4" /> 일시정지
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> {workoutSeconds > 0 ? '다시 시작' : '운동 시작'}
                </>
              )}
            </button>

            {workoutSeconds > 0 && (
              <button
                type="button"
                onClick={handleFinishWorkout}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#262a31] text-[#75ff9e] border border-[#00e676]/30 hover:bg-[#31353c] text-xs font-hud font-bold transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" /> 운동 완료 & 저장
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hourly Cadence Chart */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00f1fd]" />
            <span className="text-sm font-semibold text-white">시간대별 걸음 분포</span>
          </div>
          <span className="text-xs text-[#859585] font-mono">피크 12시 (2,400보)</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-24 pt-2 pb-1">
          {hourlySteps.map((h, idx) => {
            const heightPct = Math.round((h.steps / 2600) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[20px] bg-[#1c2026] rounded-t-sm h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      h.current
                        ? 'bg-[#00f1fd] shadow-[0_0_8px_rgba(0,242,254,0.5)]'
                        : 'bg-[#00f1fd]/40 hover:bg-[#00f1fd]/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-[#859585]">{h.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Workout History */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10 flex flex-col gap-2.5">
        <span className="text-sm font-semibold text-white">최근 운동 기록</span>
        {recentWorkouts.map((w) => (
          <div
            key={w.id}
            className="p-3 rounded-lg bg-[#1c2026] border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#262a31] text-[#00f1fd] flex items-center justify-center font-bold text-xs">
                {w.type === '달리기' ? 'RUN' : w.type === 'HIIT' ? 'HIIT' : 'FIT'}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  {w.type} ({Math.round(w.durationSeconds / 60)}분)
                </span>
                <span className="text-[10px] text-[#859585]">{w.timestamp}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-hud font-bold text-[#00e676] block">
                {w.caloriesBurned} kcal
              </span>
              <span className="text-[10px] text-[#859585] font-mono">평균 {w.avgHeartRate} BPM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
