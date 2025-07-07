export interface Recipe {
  id: string; // UUID
  user_id: string; // UUID
  title: string;
  description: string;
  ingredients?: string;
  instructions?: string;
  cooking_time?: number;
  created_at: string;
  category: string;
}
