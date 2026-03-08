-- Blood Pressure Tracker: Initial Schema
-- Measurements table with RLS and storage bucket

-- Create measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  systolic SMALLINT NOT NULL CHECK (systolic BETWEEN 50 AND 300),
  diastolic SMALLINT NOT NULL CHECK (diastolic BETWEEN 20 AND 200),
  pulse SMALLINT NOT NULL CHECK (pulse BETWEEN 20 AND 250),
  activity TEXT DEFAULT '',
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_measurements_user_date
  ON measurements (user_id, measured_at DESC);

CREATE INDEX IF NOT EXISTS idx_measurements_date
  ON measurements (measured_at);

-- Enable RLS
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own rows
CREATE POLICY "Users can view own measurements"
  ON measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements"
  ON measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements"
  ON measurements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements"
  ON measurements FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for measurements
ALTER PUBLICATION supabase_realtime ADD TABLE measurements;

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('bp-photos', 'bp-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bp-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bp-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bp-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view bp-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bp-photos');
