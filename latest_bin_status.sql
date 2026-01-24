-- Function to get the latest bin status, bypassing RLS
CREATE OR REPLACE FUNCTION get_latest_bin_status()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  latest_record record;
BEGIN
  -- Select the single latest record
  SELECT * INTO latest_record
  FROM public.r3bin_records
  ORDER BY id DESC
  LIMIT 1;

  -- Return as JSON, or null if no record found
  IF latest_record IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN row_to_json(latest_record);
  END IF;
END;
$$;

-- Grant permissions (Crucial for anon access)
GRANT EXECUTE ON FUNCTION get_latest_bin_status() TO anon;
GRANT EXECUTE ON FUNCTION get_latest_bin_status() TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_bin_status() TO service_role;
