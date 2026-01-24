-- Secure Function to Get Aggregate Impact Stats for Public Display
-- Returns a breakdown of item counts by waste type (Plastic, Metal, Paper, Mixed)
-- Runs as SECURITY DEFINER to bypass RLS (since users are not logged in on the landing page)

CREATE OR REPLACE FUNCTION get_public_impact_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_plastic bigint;
  total_metal bigint;
  total_paper bigint;
  total_mixed bigint;
  total_bins bigint;
BEGIN
  -- Count Plastic
  SELECT COUNT(*) INTO total_plastic FROM r3bin_waste_logs 
  WHERE waste_type ILIKE '%plastic%';

  -- Count Metal
  SELECT COUNT(*) INTO total_metal FROM r3bin_waste_logs 
  WHERE waste_type ILIKE '%metal%';

  -- Count Paper
  SELECT COUNT(*) INTO total_paper FROM r3bin_waste_logs 
  WHERE waste_type ILIKE '%paper%';

  -- Count Mixed/General (everything else)
  SELECT COUNT(*) INTO total_mixed FROM r3bin_waste_logs 
  WHERE waste_type NOT ILIKE '%plastic%' 
    AND waste_type NOT ILIKE '%metal%' 
    AND waste_type NOT ILIKE '%paper%';

  -- Count Active Bins
  SELECT COUNT(*) INTO total_bins FROM r3bin_registry;

  -- Return JSON Object
  RETURN json_build_object(
    'plastic', total_plastic,
    'metal', total_metal,
    'paper', total_paper,
    'mixed', total_mixed,
    'active_bins', total_bins
  );
END;
$$;

-- Grant access to public (anon) and logged in users
GRANT EXECUTE ON FUNCTION get_public_impact_stats() TO anon, authenticated, service_role;
