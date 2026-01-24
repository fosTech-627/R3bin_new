-- Function to get the latest bin status (V3)
-- Updated to sort by 'updated_at' as confirmed by error hint
CREATE OR REPLACE FUNCTION get_latest_bin_status_v3()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  latest_record record;
BEGIN
  -- Sorts by updated_at (as suggested by the error message)
  SELECT * INTO latest_record
  FROM public.r3bin_records
  ORDER BY updated_at DESC
  LIMIT 1;

  IF latest_record IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN row_to_json(latest_record);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION get_latest_bin_status_v3() TO anon;
GRANT EXECUTE ON FUNCTION get_latest_bin_status_v3() TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_bin_status_v3() TO service_role;
