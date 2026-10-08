import React, { useState } from 'react';
import { Screen, TransitionType, UserHealthState } from '../types';
import { 
  User, 
  Footprints, 
  Moon, 
  Flame, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  Watch, 
  Activity, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';

interface ProfileScreenProps {
  health: UserHealthState;
  onUpdateHealth: (updater: (prev: UserHealthState) => UserHealthState) => void;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  health,
  onUpdateHealth,
  onNavigate,
}) => {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [stepGoalInput, setStepGoalInput] = useState(health.stepGoal.toString());
  const [sleepGoalInput, setSleepGoalInput] = useState(health.sleepGoalHours.toString());
  const [calGoalInput, setCalGoalInput] = useState(health.calorieGoal.toString());

  const handleSaveGoals = () => {
    onUpdateHealth((prev) => ({
      ...prev,
      stepGoal: parseInt(stepGoalInput, 10) || prev.stepGoal,
      sleepGoalHours: parseFloat(sleepGoalInput) || prev.sleepGoalHours,
      calorieGoal: parseInt(calGoalInput, 10) || prev.calorieGoal,
    }));
    setIsEditingGoals(false);
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
        <span className="text-xs font-mono text-[#75ff9e] bg-[#75ff9e]/10 px-2 py-0.5 rounded border border-[#75ff9e]/30">
          ATHLETE IDENTITY HUD
        </span>
      </div>

      {/* Profile ID Card */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-[#00e676] flex items-center justify-center text-[#00e676] font-hud text-lg font-bold shadow-[0_0_16px_rgba(0,230,118,0.25)]">
            CYBER
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-hud text-white">{health.userName}</h2>
              <span className="text-[10px] font-mono text-[#00f1fd] bg-[#00f1fd]/15 px-1.5 py-0.5 rounded border border-[#00f1fd]/30">
                PRO VERIFIED
              </span>
            </div>
            <p className="text-xs text-[#bacbb9] mt-0.5">{health.userRank}</p>
            <div className="flex items-center gap-3 text-xs text-[#859585] mt-1.5 font-mono">
              <span>{health.heightCm} cm</span>
              <span>·</span>
              <span>{health.weightKg} kg</span>
              <span>·</span>
              <span className="text-[#00e676]">BMR {health.bmrKcal} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Biometric Goals Section - Contains the three required Xpath cards */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#bacbb9] font-hud">
            생체 목표 & 바로가기 분석
          </span>
          <button
            type="button"
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="text-xs text-[#00f1fd] hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{isEditingGoals ? '취소' : '목표 변경'}</span>
          </button>
        </div>

        {/* Goal Edit Mode Form */}
        {isEditingGoals && (
          <div className="p-4 rounded-xl bg-[#1c2026] border border-[#00f1fd]/30 flex flex-col gap-3">
            <span className="text-xs font-medium text-white">일일 건강 목표 수정</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#859585] block">걸음수 목표</label>
                <input
                  type="number"
                  value={stepGoalInput}
                  onChange={(e) => setStepGoalInput(e.target.value)}
                  className="mt-1 w-full bg-[#262a31] text-white px-2 py-1 rounded text-xs font-mono border border-white/10"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#859585] block">수면 시간 (h)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepGoalInput}
                  onChange={(e) => setSleepGoalInput(e.target.value)}
                  className="mt-1 w-full bg-[#262a31] text-white px-2 py-1 rounded text-xs font-mono border border-white/10"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#859585] block">칼로리 (kcal)</label>
                <input
                  type="number"
                  value={calGoalInput}
                  onChange={(e) => setCalGoalInput(e.target.value)}
                  className="mt-1 w-full bg-[#262a31] text-white px-2 py-1 rounded text-xs font-mono border border-white/10"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveGoals}
              className="mt-1 py-1.5 rounded-lg bg-[#00e676] text-[#0d1117] font-bold text-xs hover:bg-[#75ff9e] transition-colors cursor-pointer"
            >
              목표 설정 저장
            </button>
          </div>
        )}

        {/* CARD 1: Matches XPath //div[contains(., '일일 걸음수') and contains(@class, 'bg-surface-container')] -> 활동 분석 (push) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('activity', 'push')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('activity', 'push');
          }}
          className="p-4 rounded-xl bg-surface-container border border-white/10 hover:border-[#00f1fd]/50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00f1fd]/15 border border-[#00f1fd]/30 flex items-center justify-center text-[#00f1fd]">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">일일 걸음수</span>
                <span className="text-xs text-[#bacbb9]">
                  현재 {health.steps.toLocaleString()} / 목표 {health.stepGoal.toLocaleString()} 보
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-hud font-bold text-[#00f1fd]">
                {Math.min(100, Math.round((health.steps / health.stepGoal) * 100))}%
              </span>
              <ChevronRight className="w-4 h-4 text-[#859585] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* CARD 2: Matches XPath //div[contains(., '일일 수면') and contains(@class, 'bg-surface-container')] -> 수면 분석 (push) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('sleep', 'push')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('sleep', 'push');
          }}
          className="p-4 rounded-xl bg-surface-container border border-white/10 hover:border-[#cfbfff]/50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#7c4dff]/20 border border-[#7c4dff]/30 flex items-center justify-center text-[#cfbfff]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">일일 수면</span>
                <span className="text-xs text-[#bacbb9]">
                  기록 {health.sleepHours}시간 {health.sleepMinutes}분 / 목표 {health.sleepGoalHours}시간
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-hud font-bold text-[#cfbfff]">
                {health.sleepScore}점
              </span>
              <ChevronRight className="w-4 h-4 text-[#859585] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* CARD 3: Matches XPath //div[contains(., '주간 고강도 운동') and contains(@class, 'bg-surface-container')] -> 활동 분석 (push) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('activity', 'push')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('activity', 'push');
          }}
          className="p-4 rounded-xl bg-surface-container border border-white/10 hover:border-[#00e676]/50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00e676]/15 border border-[#00e676]/30 flex items-center justify-center text-[#00e676]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">주간 고강도 운동</span>
                <span className="text-xs text-[#bacbb9]">
                  달성 168분 / 주간 권장치 150분 돌파 (Zone 4/5)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-hud font-bold text-[#00e676]">
                112%
              </span>
              <ChevronRight className="w-4 h-4 text-[#859585] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Connected Cyber Telemetry Devices */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#bacbb9] font-hud">
          연동된 하드웨어 센서
        </span>

        <div className="p-3 rounded-lg bg-[#1c2026] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Watch className="w-5 h-5 text-[#00f1fd]" />
            <div>
              <span className="text-xs font-semibold text-white block">Bio-Band Gen 4 PRO</span>
              <span className="text-[10px] text-[#859585]">블루투스 5.4 LE 연결됨</span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#00e676]">배터리 94%</span>
        </div>

        <div className="p-3 rounded-lg bg-[#1c2026] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#cfbfff]" />
            <div>
              <span className="text-xs font-semibold text-white block">Cyber Scale Matrix</span>
              <span className="text-[10px] text-[#859585]">체성분 8채널 임피던스 동기화 완료</span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#00f1fd]">오늘 측정</span>
        </div>
      </div>
    </div>
  );
};
