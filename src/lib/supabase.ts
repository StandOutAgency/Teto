import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Round {
  id: string;
  game_id: string;
  round_number: number;
  team1_score: number;
  team2_score: number;
  created_at: string;
}
