import React from 'react';
import { Screen, TransitionType } from '../types';
import { Home, Flame, Moon, User } from 'lucide-react';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: TransitionType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      id: 'home' as Screen,
      dataPath: '홈',
      label: '홈',
      icon: Home,
      color: '#00e676',
    },
    {
      id: 'activity' as Screen,
      dataPath: '활동',
      label: '활동',
      icon: Flame,
      color: '#00f1fd',
    },
    {
      id: 'sleep' as Screen,
      dataPath: '수면',
      label: '수면',
      icon: Moon,
      color: '#cfbfff',
    },
    {
      id: 'profile' as Screen,
      dataPath: '프로필',
      label: '프로필',
      icon: User,
      color: '#75ff9e',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#10141a]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-path={item.dataPath}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id, 'none');
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group ${
                isActive ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-90'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-[#1c2026] border border-white/15' : 'hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 12px ${item.color}30`,
                        borderColor: `${item.color}60`,
                      }
                    : undefined
                }
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isActive ? item.color : '#bacbb9',
                  }}
                />
                {isActive && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>
              <span
                className={`text-[11px] font-medium mt-0.5 tracking-tight ${
                  isActive ? 'font-semibold' : 'text-[#859585]'
                }`}
                style={{
                  color: isActive ? item.color : undefined,
                }}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
