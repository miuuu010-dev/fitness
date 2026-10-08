import React from 'react';
import { Screen, TransitionType } from '../types';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  title,
  subtitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#10141a]/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-white/10 flex items-center justify-center text-[#00e676] shadow-[0_0_12px_rgba(0,230,118,0.25)]">
            <Zap className="w-4 h-4 fill-[#00e676]/30" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-hud text-xs tracking-wider font-bold text-[#00e676] uppercase">
                BIO-HUD
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
              <span className="text-[10px] text-[#859585] font-mono">100Hz LIVE</span>
            </div>
            <h1 className="text-sm font-semibold text-[#dfe2eb] leading-tight">
              {title || (currentScreen === 'home' ? '홈 대시보드' : currentScreen === 'sleep' ? '수면 분석' : currentScreen === 'activity' ? '활동 분석' : '내 프로필')}
            </h1>
          </div>
        </div>

        {/* Right: Telemetry status & Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181c22] border border-white/5 text-[11px] text-[#bacbb9]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00f1fd]" />
            <span className="font-mono">SYNCED</span>
          </div>

          {/* Profile Trigger button matching XPath: //header//div[contains(@class, 'rounded-full') and contains(@class, 'bg-surface-container-high')] */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('profile', 'push')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate('profile', 'push');
              }
            }}
            aria-label="내 프로필 열기"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center cursor-pointer border border-white/10 hover:border-[#00e676] transition-all hover:scale-105 active:scale-95 shadow-sm group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#262a31] text-[#75ff9e] font-hud text-xs font-bold border border-white/5">
              <span>CYBER</span>
            </div>
          </div>
        </div>
      </div>
      {subtitle && (
        <div className="max-w-md mx-auto mt-1 px-1">
          <p className="text-xs text-[#bacbb9]">{subtitle}</p>
        </div>
      )}
    </header>
  );
};
