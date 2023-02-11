import { Habit, Task } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { api } from '../libs/axios';

type HabitsContextData = {
  habits: HabitFormatted[];
  totalHabits: number;
  createHabit: (data: CreateHabit) => Promise<void>;
};

type HabitsProviderProps = {
  children: ReactNode;
};

export type HabitFormatted = Habit & {
  tasks: Task[];
};

type CreateHabit = {
  tasks: string[];
  weekDays: string[];
  title: string;
};

export const HabitsContext = createContext<HabitsContextData | null>(null);

export function HabitsProvider({ children }: HabitsProviderProps) {
  const { status } = useSession();

  const [habits, setHabits] = useState<HabitFormatted[]>([]);
  const [totalHabits, setTotalHabits] = useState<number>(0);

  useEffect(() => {
    async function loadHabits() {
      const habits = await api.get('/habits');
      setTotalHabits(habits.data.habits.length);
      setHabits(habits.data.habits);
    }

    if (status === 'authenticated') {
      loadHabits();
    }
  }, [status]);

  async function createHabit({ tasks, weekDays, title }: CreateHabit) {
    try {
      const response = await api.post('/habits', {
        tasks,
        weekDays: weekDays.map(Number),
        title,
      });
      setHabits([...habits, response.data.habit]);
      setTotalHabits(totalHabits + 1);
    } catch (error) {
      throw error;
    }
  }

  return (
    <HabitsContext.Provider value={{ habits, totalHabits, createHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}
