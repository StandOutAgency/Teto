/*
  # Create Teto Score Rounds Table

  1. New Tables
    - `rounds`
      - `id` (uuid, primary key) - Unique identifier for each round
      - `game_id` (uuid) - Identifier for the game session
      - `round_number` (integer) - Sequential round number
      - `team1_score` (integer) - Score for Team 1 in this round
      - `team2_score` (integer) - Score for Team 2 in this round
      - `created_at` (timestamptz) - Timestamp when round was created

  2. Security
    - Enable RLS on `rounds` table
    - Add policy for anyone to read rounds (public game)
    - Add policy for anyone to insert rounds (public game)
    - Add policy for anyone to delete rounds (to reset game)

  3. Important Notes
    - The game_id allows multiple game sessions to be tracked
    - Round numbers help maintain order
    - Public access is enabled since this is a local scoring app
*/

CREATE TABLE IF NOT EXISTS rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL,
  round_number integer NOT NULL,
  team1_score integer NOT NULL DEFAULT 0,
  team2_score integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rounds"
  ON rounds
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert rounds"
  ON rounds
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete rounds"
  ON rounds
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rounds_game_id ON rounds(game_id);
CREATE INDEX IF NOT EXISTS idx_rounds_created_at ON rounds(created_at DESC);