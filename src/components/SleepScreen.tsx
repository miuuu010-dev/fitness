import React, { useState } from 'react';
import { Screen, TransitionType, UserHealthState } from '../types';
import { 
  Moon, 
  Sparkles, 
  Clock, 
  Heart, 
  Wind, 
  Calendar, 
  ChevronLeft, 
  TrendingUp, 
  CheckCircle2, 
  Bed, 
  Sliders,
  Sun
} from 'lucide-react';

interface SleepScreenProps {
  health: UserHealthState;
  onUpdateHealth: (updater: (prev: UserHealthState) => UserHealthState) => void;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({
  health,
  onUpdateHealth,
  onNavigate,
}) => {
  const [bedtime, setBedtime] = useState('23:18');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [isEditing, setIsEditing] = useState(false);

  const stages = [
    { name: '깊은 수면 (Deep)', time: '1시간 48분', pct: 23, color: '#370096', desc: '신체 조직 재생 및 면역 강화' },
    { name: '렘 수면 (REM)', time: '2시간 12분', pct: 29, color: '#7c4dff', desc: '인지 기억 정합 및 신경 회복' },
    { name: '얕은 수면 (Light)', time: '3시간 18분', pct: 43, color: '#cfbfff', desc: '기초 근육 이완 및 피로 해소' },
    { name: '각성 시간 (Awake)', time: '24분', pct: 5, color: '#ffb4ab', desc: '수면 중 미세 각성' },
  ];

  const weeklySleep = [
    { day: '월', hours: 7.2, score: 82 },
    { day: '화', hours: 7.8, score: 86 },
    { day: '수', hours: 8.1, score: 91 },
    { day: '목', hours: 6.9, score: 79 },
    { day: '금', hours: 7.5, score: 84 },
    { day: '토', hours: 8.4, score: 94 },
    { day: '오늘', hours: +(health.sleepHours + health.sleepMinutes / 60).toFixed(1), score: health.sleepScore, active: true },
  ];

  const handleAdjustSleep = (deltaHours: number) => {
    onUpdateHealth((prev) => {
      const totalMinutes = Math.max(180, Math.min(600, prev.sleepHours * 60 + prev.sleepMinutes + deltaHours * 30));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const score = Math.min(100, Math.max(60, Math.round(70 + (totalMinutes / 480) * 20)));
      return {
        ...prev,
        sleepHours: hours,
        sleepMinutes: minutes,
        sleepScore: score,
      };
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Top Breadcrumb navigation back to home if desired */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home', 'none')}
          className="flex items-center gap-1.5 text-xs text-[#bacbb9] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </button>
        <span className="text-xs font-mono text-[#cfbfff] bg-[#7c4dff]/20 px-2 py-0.5 rounded border border-[#7c4dff]/30">
          SURFACE VIOLET HUD
        </span>
      </div>

      {/* Main Sleep Score Hero */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-white/10 hud-glow-violet relative overflow-hidden backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#7c4dff]/20 text-[#cfbfff]">
                <Moon className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono text-[#cfbfff]">CIRCADIAN RECOVERY</span>
            </div>
            <h2 className="text-xl font-bold font-hud text-white mt-1">
              수면 아키텍처 분석
            </h2>
            <p className="text-xs text-[#bacbb9] mt-0.5">
              취침 {bedtime} · 기상 {wakeTime} (수면 효율 {health.sleepEfficiency}%)
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-3xl font-hud font-bold text-[#cfbfff] tnum flex items-baseline">
              {health.sleepScore}
              <span className="text-sm font-normal text-[#859585] ml-1">/ 100</span>
            </div>
            <span className="text-[11px] font-hud text-[#00e676] bg-[#00e676]/10 px-1.5 py-0.5 rounded border border-[#00e676]/20 mt-1">
              최적 회복 상태
            </span>
          </div>
        </div>

        {/* Big time display & quick adjustment */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#859585] block">총 수면 시간</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-hud font-bold text-white tnum">
                {health.sleepHours}
              </span>
              <span className="text-sm text-[#bacbb9]">시간</span>
              <span className="text-3xl font-hud font-bold text-white tnum ml-1">
                {health.sleepMinutes}
              </span>
              <span className="text-sm text-[#bacbb9]">분</span>
            </div>
          </div>

          {/* Quick interactive sleep log adjusters */}
          <div className="flex items-center gap-1.5 bg-[#1c2026] p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => handleAdjustSleep(-1)}
              className="px-2 py-1 text-xs font-mono rounded bg-[#262a31] text-[#dfe2eb] hover:bg-[#31353c] transition-colors cursor-pointer"
              title="30분 감소"
            >
              -30m
            </button>
            <button
              type="button"
              onClick={() => handleAdjustSleep(1)}
              className="px-2 py-1 text-xs font-mono rounded bg-[#7c4dff]/30 text-[#cfbfff] hover:bg-[#7c4dff]/50 transition-colors cursor-pointer font-semibold"
              title="30분 증가"
            >
              +30m
            </button>
          </div>
        </div>

        {/* Hypnogram Stage Visualizer */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[#bacbb9] mb-1.5">
            <span className="font-mono text-[11px]">수면 단계 분할 (HYPNOGRAM)</span>
            <span className="text-[11px] text-[#859585]">총 462분 기록됨</span>
          </div>
          <div className="w-full flex items-center h-3 rounded-lg overflow-hidden bg-[#10141a] border border-white/10 p-0.5">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="h-full transition-all"
                style={{ width: `${stage.pct}%`, backgroundColor: stage.color }}
                title={`${stage.name}: ${stage.time} (${stage.pct}%)`}
              />
            ))}
          </div>
        </div>

        {/* Stage details list */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {stages.map((stage, idx) => (
            <div key={idx} className="bg-[#1c2026] p-2.5 rounded-lg border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-[11px] font-medium text-[#dfe2eb] truncate">{stage.name}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-bold font-hud tnum text-white">{stage.time}</span>
                <span className="text-[11px] font-mono text-[#859585]">{stage.pct}%</span>
              </div>
              <p className="text-[10px] text-[#859585] mt-0.5 leading-tight">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Biometric Night Telemetry */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-[#161b22] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#ff4b72]" />
            <span className="text-xs text-[#bacbb9]">수면 중 평균 심박수</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-hud font-bold text-white tnum">52</span>
            <span className="text-xs text-[#859585] ml-1">BPM</span>
          </div>
          <span className="text-[11px] text-[#00e676]">안정적인 심박 강하율 (-18%)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161b22] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#00f1fd]" />
            <span className="text-xs text-[#bacbb9]">호흡 변동성</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-hud font-bold text-white tnum">14.2</span>
            <span className="text-xs text-[#859585] ml-1">회/분</span>
          </div>
          <span className="text-[11px] text-[#00e676]">호흡 안정성 정상 범위</span>
        </div>
      </div>

      {/* Weekly Sleep Trend Chart */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#cfbfff]" />
            <span className="text-sm font-semibold text-white">주간 수면 패턴</span>
          </div>
          <span className="text-xs text-[#859585] font-mono">평균 7.6시간</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1 px-1">
          {weeklySleep.map((item, idx) => {
            const heightPct = Math.round((item.hours / 10) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-[#859585]">{item.hours}h</span>
                <div className="w-full max-w-[28px] bg-[#1c2026] rounded-t-sm h-full flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      item.active
                        ? 'bg-[#cfbfff] shadow-[0_0_10px_rgba(207,191,255,0.5)]'
                        : 'bg-[#7c4dff]/40 hover:bg-[#7c4dff]/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-mono ${
                    item.active ? 'text-[#cfbfff] font-bold' : 'text-[#859585]'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circadian Bedtime Target Scheduler */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-[#cfbfff]" />
            <span className="text-sm font-semibold text-white">서캐디언 취침 스케줄러</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-[#00f1fd] hover:underline font-mono cursor-pointer"
          >
            {isEditing ? '저장 완료' : '목표 수정'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1c2026] p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-[#859585]">
              <Moon className="w-3.5 h-3.5" /> 취침 목표 시간
            </div>
            {isEditing ? (
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="mt-1 bg-[#262a31] text-white px-2 py-1 rounded text-sm font-mono border border-white/10 w-full"
              />
            ) : (
              <span className="text-lg font-hud font-bold text-white mt-1 block">{bedtime}</span>
            )}
          </div>

          <div className="bg-[#1c2026] p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-[#859585]">
              <Sun className="w-3.5 h-3.5 text-[#ffca28]" /> 기상 알람 시간
            </div>
            {isEditing ? (
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="mt-1 bg-[#262a31] text-white px-2 py-1 rounded text-sm font-mono border border-white/10 w-full"
              />
            ) : (
              <span className="text-lg font-hud font-bold text-white mt-1 block">{wakeTime}</span>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded bg-[#1c2026]/70 border border-[#7c4dff]/20 text-xs text-[#bacbb9] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
          <span>규칙적인 취침 루틴으로 깊은 수면 단계가 평균보다 18분 길어졌습니다.</span>
        </div>
      </div>
    </div>
  );
};
