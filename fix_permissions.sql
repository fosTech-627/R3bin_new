-- Enable Row Level Security (just in case)
ALTER TABLE r3bin_waste_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow ONLY Authenticated users to READ logs
CREATE POLICY "Allow authenticated read access"
ON r3bin_waste_logs
FOR SELECT
TO authenticated
USING (true);

-- Ensure Bins table is also readable by Authenticated users
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access bins"
ON bins
FOR SELECT
TO authenticated
USING (true);

-- Ensure Hourly Activity table is also readable by Authenticated users
ALTER TABLE hourly_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access hourly"
ON hourly_activity
FOR SELECT
TO authenticated
USING (true);
