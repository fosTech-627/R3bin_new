-- SQL Migration: Add User Access Control
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'r3bin_registry' AND column_name = 'access_code') THEN
        ALTER TABLE r3bin_registry ADD COLUMN access_code text;
        ALTER TABLE r3bin_registry ADD CONSTRAINT unique_access_code UNIQUE (access_code);
    END IF;
END $$;

-- 2. Create 'bin_access' table (User <-> Bin Link)
-- This remembers which user has unlocked which bin.
CREATE TABLE IF NOT EXISTS bin_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  bin_id text REFERENCES r3bin_registry(bin_id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, bin_id) -- Prevent duplicate links
);

-- 3. Enable RLS
ALTER TABLE bin_access ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can see their own access rights
CREATE POLICY "Users can view own access" ON bin_access
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 5. Secure Function to Claim a Code
-- This runs on server-side authority to check the code safely.
CREATE OR REPLACE FUNCTION claim_product_code(input_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_bin_id text;
  current_user_id uuid;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify Code directly against Registry
  SELECT bin_id INTO target_bin_id
  FROM r3bin_registry
  WHERE access_code = input_code;

  IF target_bin_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid product code');
  END IF;

  -- Grant Access (Link User to Bin)
  INSERT INTO bin_access (user_id, bin_id)
  VALUES (current_user_id, target_bin_id)
  ON CONFLICT (user_id, bin_id) DO NOTHING;

  RETURN json_build_object('success', true, 'bin_id', target_bin_id);
END;
$$;

-- 6. Update Log Access Policies to respect 'bin_access'
-- (This effectively "Turns On" the security feature)

-- Drop the old "allow authenticated" policy if it's too broad, 
-- OR strictly enforce this new one. 
-- For now, let's create a *new* restrictive policy.
-- NOTE: You might need to disable the previous "Allow authenticated read access" 
-- if you strictly want isolation.

CREATE POLICY "Access logs via bin_access"
ON r3bin_waste_logs
FOR SELECT
TO authenticated
USING (
  bin_id IN (
    SELECT bin_id FROM bin_access WHERE user_id = auth.uid()
  )
);

-- Same for Registry
CREATE POLICY "Access registry via bin_access"
ON r3bin_registry
FOR SELECT
TO authenticated
USING (
  bin_id IN (
    SELECT bin_id FROM bin_access WHERE user_id = auth.uid()
  )
);
