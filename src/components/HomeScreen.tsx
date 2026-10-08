import React from 'react';
import { Screen, TransitionType, UserHealthState } from '../types';
import { 
  Flame, 
  Moon, 
  Footprints, 
  Heart, 
  Play, 
  Droplet, 
  ChevronRight, 
  TrendingUp, 
  BatteryCharging, 
  Plus, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface HomeScreenProps {
  health: UserHealthState;
  onUpdateHealth: (updater: (prev: UserHealthState) => UserHealthState) => void;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  health,
  onUpdateHealth,
  onNavigate,
}) => {
  const stepPercentage = Math.min(100, Math.round((health.steps / health.stepGoal) * 100));
  const caloriePercentage = Math.min(100, Math.round((health.calories / health.calorieGoal) * 100));
  const sleepPercentage = Math.min(100, Math.round(((health.sleepHours * 60 + health.sleepMinutes) / (health.sleepGoalHours * 60)) * 100));

  const addSteps = (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdateHealth((prev) => {
      const newSteps = prev.steps + amount;
      const newCal = prev.calories + Math.round(amount * 0.04);
      return {
        ...prev,
        steps: newSteps,
        distanceKm: +(newSteps * 0.00075).toFixed(2),
        calories: newCal,
      };
    });
  };

  const addWater = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdateHealth((prev) => ({
      ...prev,
      waterMl: Math.min(prev.waterGoalMl + 1000, prev.waterMl + 250),
    }));
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Bio-Readiness Status HUD Banner */}
      <div className="p-4 rounded-xl bg-[#161b22]/90 border border-white/10 relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#00e676]/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-hud uppercase tracking-wider text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded border border-[#00e676]/20">
              BIO-STATUS
            </span>
            <span className="text-xs text-[#bacbb9]">생체 회복 지수</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#00e676]">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>최적 상태 (92%)</span>
          </div>
        </div>

        {/* Concentric Tri-Metric Telemetry */}
        <div className="grid grid-cols-3 gap-2.5 my-1">
          {/* Steps summary */}
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5 flex flex-col">
            <span className="text-[11px] text-[#00f1fd] font-hud flex items-center gap-1">
              <Footprints className="w-3 h-3" /> 걸음
            </span>
            <span className="text-lg font-bold font-hud tnum text-[#dfe2eb] mt-1">
              {health.steps.toLocaleString()}
            </span>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#00f1fd] h-full transition-all duration-500" 
                style={{ width: `${stepPercentage}%` }} 
              />
            </div>
            <span className="text-[10px] text-[#859585] mt-1 text-right">{stepPercentage}%</span>
          </div>

          {/* Calorie summary */}
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5 flex flex-col">
            <span className="text-[11px] text-[#00e676] font-hud flex items-center gap-1">
              <Flame className="w-3 h-3" /> 칼로리
            </span>
            <span className="text-lg font-bold font-hud tnum text-[#dfe2eb] mt-1">
              {health.calories} <span className="text-xs font-normal text-[#859585]">kcal</span>
            </span>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#00e676] h-full transition-all duration-500" 
                style={{ width: `${caloriePercentage}%` }} 
              />
            </div>
            <span className="text-[10px] text-[#859585] mt-1 text-right">{caloriePercentage}%</span>
          </div>

          {/* Sleep summary */}
          <div className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5 flex flex-col">
            <span className="text-[11px] text-[#cfbfff] font-hud flex items-center gap-1">
              <Moon className="w-3 h-3" /> 수면
            </span>
            <span className="text-lg font-bold font-hud tnum text-[#dfe2eb] mt-1">
              {health.sleepHours}h {health.sleepMinutes}m
            </span>
            <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#cfbfff] h-full transition-all duration-500" 
                style={{ width: `${sleepPercentage}%` }} 
              />
            </div>
            <span className="text-[10px] text-[#859585] mt-1 text-right">{health.sleepScore}점</span>
          </div>
        </div>

        {/* Quick Workout Button matching xpath: //button[contains(., '빠른 운동')] */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-[#bacbb9]">
            오늘 추천: <span className="text-white font-medium">Zone 2 유산소 30분</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('activity', 'push')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00e676] text-[#0d1117] font-hud font-bold text-xs hover:bg-[#75ff9e] transition-all shadow-[0_0_14px_rgba(0,230,118,0.35)] active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#0d1117]" />
            <span>빠른 운동</span>
          </button>
        </div>
      </div>

      {/* Target Section matching XPath: //section[contains(@class, 'flex flex-col gap-space-md')] */}
      <section className="flex flex-col gap-space-md w-full">
        {/* Card 1: 오늘 걸음수 (matches //section[contains(@class, 'flex flex-col gap-space-md')]//div[contains(., '오늘 걸음수') and contains(@class, 'backdrop-blur-xl')]) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('activity', 'push')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('activity', 'push');
          }}
          className="relative p-4 rounded-xl bg-[#161b22]/75 backdrop-blur-xl border border-white/10 hover:border-[#00f2fe]/40 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] hud-glow-cyan group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f1fd]">
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#dfe2eb] block">오늘 걸음수</span>
                <span className="text-[11px] text-[#859585]">목표 {health.stepGoal.toLocaleString()} 보</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#00f1fd] group-hover:translate-x-0.5 transition-transform">
              <span className="text-[11px] font-mono">상세 분석</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-3xl font-hud font-bold text-white tnum tracking-tight">
                {health.steps.toLocaleString()}
              </span>
              <span className="text-xs text-[#bacbb9] ml-1.5 font-medium">걸음</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-hud font-semibold text-[#00f1fd]">
                {health.distanceKm} km
              </span>
              <span className="text-[11px] text-[#859585] block">
                {health.activeMinutes}분 활동
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#1c2026] h-2 rounded-full mt-3 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#00dce6] to-[#00f1fd] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,242,254,0.5)]"
              style={{ width: `${stepPercentage}%` }}
            />
          </div>

          {/* Quick step log control (stops propagation so navigation is kept separate) */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
            <span className="text-[11px] text-[#bacbb9]">걸음 빠른 기록:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => addSteps(500, e)}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#1c2026] text-[#00f1fd] border border-[#00f1fd]/25 hover:bg-[#00f1fd]/20 transition-all cursor-pointer"
              >
                +500
              </button>
              <button
                type="button"
                onClick={(e) => addSteps(1000, e)}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#1c2026] text-[#00f1fd] border border-[#00f1fd]/25 hover:bg-[#00f1fd]/20 transition-all cursor-pointer"
              >
                +1,000
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: 수면 분석 (matches //section[contains(@class, 'flex flex-col gap-space-md')]//div[contains(., '수면 분석') and contains(@class, 'backdrop-blur-xl')]) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('sleep', 'push')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('sleep', 'push');
          }}
          className="relative p-4 rounded-xl bg-[#161b22]/75 backdrop-blur-xl border border-white/10 hover:border-[#cfbfff]/40 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] hud-glow-violet group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#7c4dff]/15 border border-[#7c4dff]/30 flex items-center justify-center text-[#cfbfff]">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#dfe2eb] block">수면 분석</span>
                <span className="text-[11px] text-[#859585]">지난 밤 서캐디언 주기</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#cfbfff] group-hover:translate-x-0.5 transition-transform">
              <span className="text-[11px] font-mono">수면 리포트</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-3xl font-hud font-bold text-white tnum tracking-tight">
                {health.sleepHours}
              </span>
              <span className="text-xs text-[#bacbb9] mx-1">시간</span>
              <span className="text-3xl font-hud font-bold text-white tnum tracking-tight">
                {health.sleepMinutes}
              </span>
              <span className="text-xs text-[#bacbb9] ml-1">분</span>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#7c4dff]/20 border border-[#7c4dff]/30 text-[#cfbfff] text-xs font-hud font-bold">
                <Sparkles className="w-3 h-3" />
                <span>점수 {health.sleepScore}점</span>
              </div>
              <span className="text-[10px] text-[#859585] block mt-0.5">
                효율 {health.sleepEfficiency}% (우수)
              </span>
            </div>
          </div>

          {/* Mini Hypnogram bar */}
          <div className="w-full mt-3 flex items-center gap-1 h-2 rounded-full overflow-hidden bg-[#1c2026] p-0.5 border border-white/5">
            <div className="bg-[#370096] h-full rounded-l" style={{ width: '23%' }} title="깊은 수면 23%" />
            <div className="bg-[#7c4dff] h-full" style={{ width: '29%' }} title="REM 수면 29%" />
            <div className="bg-[#cfbfff] h-full" style={{ width: '43%' }} title="얕은 수면 43%" />
            <div className="bg-[#ffb4ab] h-full rounded-r" style={{ width: '5%' }} title="각성 5%" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#859585] mt-1.5 px-0.5">
            <span>깊은 수면 1h 48m</span>
            <span>REM 2h 12m</span>
            <span>얕은 수면 3h 18m</span>
          </div>
        </div>
      </section>

      {/* Auxiliary Telemetry Cards: Calorie Burn, Heart Rate & Hydration */}
      <div className="grid grid-cols-2 gap-3">
        {/* Calorie Card */}
        <div 
          onClick={() => onNavigate('activity', 'push')}
          className="p-3.5 rounded-xl bg-[#161b22] border border-white/10 hover:border-[#00e676]/40 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#bacbb9] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#00e676]" /> 칼로리 소모
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#859585]" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-hud font-bold text-white tnum">
              {health.calories}
            </span>
            <span className="text-xs text-[#859585] ml-1">/ {health.calorieGoal} kcal</span>
          </div>
          <div className="w-full bg-[#1c2026] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#00e676] h-full rounded-full" 
              style={{ width: `${caloriePercentage}%` }} 
            />
          </div>
        </div>

        {/* Real-time Heart Rate Card */}
        <div className="p-3.5 rounded-xl bg-[#161b22] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#bacbb9] flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#ff4b72] animate-pulse" /> 실시간 심박
            </span>
            <span className="text-[10px] font-mono text-[#00e676]">안정</span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl font-hud font-bold text-white tnum">
              {health.heartRate}
            </span>
            <span className="text-xs text-[#859585]">BPM</span>
          </div>
          <div className="text-[11px] text-[#859585] flex items-center justify-between">
            <span>HRV: {health.hrv}ms</span>
            <span className="text-[#00f1fd]">VO2 {health.vo2Max}</span>
          </div>
        </div>
      </div>

      {/* Hydration & Daily Habit Widget */}
      <div className="p-3.5 rounded-xl bg-[#161b22] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00f1fd]/10 border border-[#00f1fd]/20 flex items-center justify-center text-[#00f1fd]">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-white block">수분 섭취량</span>
            <span className="text-xs text-[#859585] font-mono">
              {health.waterMl} / {health.waterGoalMl} ml
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={addWater}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1c2026] hover:bg-[#00f1fd]/20 text-[#00f1fd] border border-[#00f1fd]/30 text-xs font-mono transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>250ml 추가</span>
        </button>
      </div>
    </div>
  );
};
