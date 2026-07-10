export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  safetyNotes?: string;
  coachTips?: string;
  image?: string;
  gif?: string;
  videoUrl?: string;
  searchTags: string[];
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'power';
}