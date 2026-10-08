/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen, TransitionType, UserHealthState } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SleepScreen } from './components/SleepScreen';
import { ActivityScreen } from './components/ActivityScreen';
import { ProfileScreen } from './components/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');

  // Unified global bio-telemetry state
  const [health, setHealth] = useState<UserHealthState>({
    steps: 8420,
    stepGoal: 10000,
    calories: 624,
    calorieGoal: 750,
    distanceKm: 6.32,
    activeMinutes: 48,
    floorsClimbed: 14,
    heartRate: 72,
    hrv: 65,
    vo2Max: 51.4,
    waterMl: 1750,
    waterGoalMl: 2500,
    sleepHours: 7,
    sleepMinutes: 42,
    sleepGoalHours: 8,
    sleepScore: 88,
    sleepEfficiency: 94,
    userName: '김사이버 (Cyber Athlete)',
    userRank: 'Tier 4 Bio-Optimizer / VO2 Max 상위 8%',
    weightKg: 68.5,
    heightCm: 178,
    bmrKcal: 1680,
  });

  const handleNavigate = (targetScreen: Screen, transition: TransitionType = 'none') => {
    setTransitionType(transition);
    setCurrentScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: transition === 'push' ? 'smooth' : 'auto' });
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return '홈 대시보드';
      case 'sleep':
        return '수면 분석';
      case 'activity':
        return '활동 분석';
      case 'profile':
        return '내 프로필';
    }
  };

  const pushVariants = {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
    exit: { x: -30, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  const noneVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 1, transition: { duration: 0 } },
  };

  return (
    <div className="min-h-screen bg-[#10141a] text-[#dfe2eb] cyber-grid flex flex-col items-center justify-start antialiased selection:bg-[#00e676]/30 selection:text-[#75ff9e]">
      {/* Phone/Tablet Container wrapper */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[#10141a] shadow-2xl border-x border-white/5">
        {/* Top Header with live status and profile avatar */}
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          title={getScreenTitle()}
        />

        {/* Content area with push or none transition */}
        <main className="flex-1 px-4 pt-3 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              variants={transitionType === 'push' ? pushVariants : noneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {currentScreen === 'home' && (
                <HomeScreen
                  health={health}
                  onUpdateHealth={setHealth}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'sleep' && (
                <SleepScreen
                  health={health}
                  onUpdateHealth={setHealth}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'activity' && (
                <ActivityScreen
                  health={health}
                  onUpdateHealth={setHealth}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  health={health}
                  onUpdateHealth={setHealth}
                  onNavigate={handleNavigate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation matching xpath //nav//a[@data-path='...'] */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
