import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserStats {
  xp: number;
  coins: number;
  streak: number;
  level: number;
  solvedIds: number[];
  badges: string[];
  solvedStats: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export type AIModel = 'gpt-5.5' | 'claude-3.7' | 'gemini-2.5' | 'deepseek-r1' | 'llama-3';

export interface AppState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  userStats: UserStats;
  addXp: (amount: number) => { levelUp: boolean; newLevel: number };
  addCoins: (amount: number) => void;
  solveProblem: (problemId: number, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  incrementStreak: () => void;
  unlockBadge: (badge: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      selectedModel: 'gemini-2.5',
      setSelectedModel: (model) => set({ selectedModel: model }),
      userStats: {
        xp: 1250,
        coins: 450,
        streak: 5,
        level: 4,
        solvedIds: [1, 2],
        badges: ['Bug Squasher', 'First Submission', 'Algorithmic Apprentice'],
        solvedStats: {
          easy: 2,
          medium: 0,
          hard: 0,
        },
      },
      addXp: (amount) => {
        let levelUp = false;
        let newLevel = get().userStats.level;
        const currentXp = get().userStats.xp + amount;
        const xpNeeded = newLevel * 500;
        
        if (currentXp >= xpNeeded) {
          levelUp = true;
          newLevel += 1;
        }

        set((state) => ({
          userStats: {
            ...state.userStats,
            xp: currentXp,
            level: newLevel,
          },
        }));

        return { levelUp, newLevel };
      },
      addCoins: (amount) => set((state) => ({
        userStats: {
          ...state.userStats,
          coins: state.userStats.coins + amount,
        },
      })),
      solveProblem: (problemId, difficulty) => set((state) => {
        if (state.userStats.solvedIds.includes(problemId)) return {};
        
        const key = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
        return {
          userStats: {
            ...state.userStats,
            solvedIds: [...state.userStats.solvedIds, problemId],
            solvedStats: {
              ...state.userStats.solvedStats,
              [key]: state.userStats.solvedStats[key] + 1,
            },
          },
        };
      }),
      incrementStreak: () => set((state) => ({
        userStats: {
          ...state.userStats,
          streak: state.userStats.streak + 1,
        },
      })),
      unlockBadge: (badge) => set((state) => {
        if (state.userStats.badges.includes(badge)) return {};
        return {
          userStats: {
            ...state.userStats,
            badges: [...state.userStats.badges, badge],
          },
        };
      }),
    }),
    {
      name: 'codebug-storage',
    }
  )
);
