-- Function to get the latest bin status (V2)
-- Renamed to ensure we are not calling the old stale version
CREATE OR REPLACE FUNCTION get_latest_bin_status_v2()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  latest_record record;
BEGIN
  -- Try to select the latest record using created_at
  -- If this fails, the table might have 'timestamp' or 'date'?
  -- Assuming created_at exists.
  SELECT * INTO latest_record
  FROM public.r3bin_records
  ORDER BY created_at DESC
  LIMIT 1;

  IF latest_record IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN row_to_json(latest_record);
  END IF;
END;
$$;

-- Grant permissions needed for the dashboard to call it
GRANT EXECUTE ON FUNCTION get_latest_bin_status_v2() TO anon;
GRANT EXECUTE ON FUNCTION get_latest_bin_status_v2() TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_bin_status_v2() TO service_role;
