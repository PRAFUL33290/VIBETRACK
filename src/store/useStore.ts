import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mood = {
  id: string;
  date: string;
  emoji: string;
  intensity: number;
  note: string;
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  completedDates: string[]; // ISO date strings
};

type State = {
  moods: Mood[];
  habits: Habit[];
  addMood: (mood: Omit<Mood, 'id'>) => void;
  deleteMood: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      moods: [],
      habits: [
        { id: '1', name: 'Drink Water', icon: '💧', completedDates: [] },
        { id: '2', name: 'Read', icon: '📚', completedDates: [] },
        { id: '3', name: 'Exercise', icon: '💪', completedDates: [] },
      ],
      addMood: (mood) =>
        set((state) => ({
          moods: [
            ...state.moods,
            { ...mood, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      deleteMood: (id) =>
        set((state) => ({
          moods: state.moods.filter((m) => m.id !== id),
        })),
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { ...habit, id: Math.random().toString(36).substr(2, 9), completedDates: [] },
          ],
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === id) {
              const completedDates = h.completedDates.includes(date)
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date];
              return { ...h, completedDates };
            }
            return h;
          }),
        })),
    }),
    {
      name: 'vibetrack-storage',
    }
  )
);
