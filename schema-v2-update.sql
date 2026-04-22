-- ═══════════════════════════════════════════════════════════
--  INJAZ Platform v2 — Schema Updates
--  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Add journey tracking columns to job_seekers
ALTER TABLE job_seekers 
  ADD COLUMN IF NOT EXISTS journey_stage TEXT DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS journey_data JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS journey_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT;

-- Add description to postings if missing
ALTER TABLE postings
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS openings INTEGER DEFAULT 1;

-- Auto-create profile trigger (fixes registration bug)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'seeker' THEN
    INSERT INTO public.job_seekers (user_id, full_name, governorate, sector, nationality, profile_score, journey_stage)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.raw_user_meta_data->>'governorate',
      NEW.raw_user_meta_data->>'sector',
      COALESCE(NEW.raw_user_meta_data->>'nationality', 'Lebanese'),
      20,
      'registered'
    )
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.raw_user_meta_data->>'role' = 'employer' THEN
    INSERT INTO public.employers (user_id, org_name, contact_person, governorate, sector)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'org_name', NEW.raw_user_meta_data->>'full_name', 'My Organization'),
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.raw_user_meta_data->>'governorate',
      NEW.raw_user_meta_data->>'sector'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
