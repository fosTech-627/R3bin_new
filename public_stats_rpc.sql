-- CLEANUP: Drop both possible signatures to avoid overloading confusion
DROP FUNCTION IF EXISTS get_public_impact_stats(); 
DROP FUNCTION IF EXISTS get_public_impact_stats(text);

-- CREATE ROBUST FUNCTION
-- Uses 'SET search_path' to ensure it finds tables in public even if invoked by anon
CREATE OR REPLACE FUNCTION get_public_impact_stats(time_filter text DEFAULT 'live')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_plastic bigint;
  total_metal bigint;
  total_paper bigint;
  total_mixed bigint;
  total_bins bigint;
  start_date timestamp with time zone;
BEGIN
  -- 1. Active Bins (Always All Time)
  SELECT COUNT(*) INTO total_bins FROM public.r3bin_registry;

  -- 2. Waste Counts
  IF time_filter = 'live' THEN
    -- LIVE: ABSOLUTELY NO DATE FILTERS. 
    -- This guarantees that if ANY data exists in the table, it will be counted.
    SELECT COUNT(*) INTO total_plastic FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%plastic%';
    SELECT COUNT(*) INTO total_metal FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%metal%';
    SELECT COUNT(*) INTO total_paper FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%paper%';
    SELECT COUNT(*) INTO total_mixed FROM public.r3bin_waste_logs 
    WHERE waste_type NOT ILIKE '%plastic%' AND waste_type NOT ILIKE '%metal%' AND waste_type NOT ILIKE '%paper%';
    
  ELSE
    -- FILTERED (Daily/Weekly)
    IF time_filter = 'daily' THEN
      start_date := now() - interval '24 hours';
    ELSIF time_filter = 'weekly' THEN
      start_date := now() - interval '7 days';
    ELSE
       -- Fallback
       start_date := '2000-01-01'::timestamp;
    END IF;

    -- Use ::timestamp cast to handle potentially messy text dates
    SELECT COUNT(*) INTO total_plastic FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%plastic%' AND updated_at::timestamp >= start_date;
    SELECT COUNT(*) INTO total_metal FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%metal%' AND updated_at::timestamp >= start_date;
    SELECT COUNT(*) INTO total_paper FROM public.r3bin_waste_logs WHERE waste_type ILIKE '%paper%' AND updated_at::timestamp >= start_date;
    SELECT COUNT(*) INTO total_mixed FROM public.r3bin_waste_logs 
    WHERE waste_type NOT ILIKE '%plastic%' AND waste_type NOT ILIKE '%metal%' AND waste_type NOT ILIKE '%paper%'
      AND updated_at::timestamp >= start_date;
  END IF;

  RETURN json_build_object(
    'plastic', total_plastic,
    'metal', total_metal,
    'paper', total_paper,
    'mixed', total_mixed,
    'active_bins', total_bins
  );
END;
$$;

-- GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION get_public_impact_stats(text) TO anon, authenticated, service_role;

-- Grant access to public (anon) and logged in users
GRANT EXECUTE ON FUNCTION get_public_impact_stats() TO anon, authenticated, service_role;
