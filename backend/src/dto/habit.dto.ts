export interface CreateHabitDTO {
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target?: number;
  unit?: string;
}

export interface UpdateHabitDTO {
  name?: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  target?: number;
  unit?: string;
  active?: boolean;
}

export interface HabitLogDTO {
  date: string;
  value?: number;
  note?: string;
}
