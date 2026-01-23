-- 0. Ensure Unique Constraint on Date (Required for ON CONFLICT)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'waste_collections_date_key'
    ) THEN
        ALTER TABLE waste_collections ADD CONSTRAINT waste_collections_date_key UNIQUE (date);
    END IF;
END $$;

-- 1. Create the sync function
CREATE OR REPLACE FUNCTION sync_r3bin_logs_to_collections()
RETURNS TRIGGER AS $$
DECLARE
    log_date DATE;
    normalized_type TEXT;
BEGIN
    -- Extract date from updated_at
    -- Fix: Handle custom format "26-01-17_16-15-29" (YY-MM-DD_HH-MM-SS)
    -- We use TO_TIMESTAMP to parse the specific format
    BEGIN
        IF NEW.updated_at IS NULL THEN
            log_date := CURRENT_DATE;
        ELSE
            -- Try parsing custom format
            log_date := DATE(TO_TIMESTAMP(NEW.updated_at, 'YY-MM-DD_HH24-MI-SS'));
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Fallback to today if parsing fails
        log_date := CURRENT_DATE;
    END;
    
    -- Normalize waste type to lowercase to match our columns
    normalized_type := LOWER(NEW.waste_type);
    
    -- Only proceed if it's one of our known types
    IF normalized_type IN ('metal', 'plastic', 'paper', 'mixed', 'mixed waste') THEN
        
        -- Handle 'mixed' variation
        IF normalized_type = 'mixed' THEN
            normalized_type := 'mixed_waste';
        END IF;

        -- Upsert into waste_collections
        -- This tries to insert a new row for the date, or updates the existing one if it exists
        EXECUTE format('
            INSERT INTO waste_collections (date, %I) 
            VALUES ($1, 1)
            ON CONFLICT (date) DO UPDATE 
            SET %I = waste_collections.%I + 1
        ', normalized_type, normalized_type, normalized_type) USING log_date;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the Trigger
-- This ensures the function runs every time a new row is added to r3bin_waste_logs
DROP TRIGGER IF EXISTS trigger_sync_r3bin_logs ON r3bin_waste_logs;

CREATE TRIGGER trigger_sync_r3bin_logs
AFTER INSERT ON r3bin_waste_logs
FOR EACH ROW
EXECUTE FUNCTION sync_r3bin_logs_to_collections();


-- 3. Backfill historic data (Optional - Run once)
-- This takes all existing data in r3bin_waste_logs and populates waste_collections
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Clear existing data if you want to rebuild completely (be careful!)
    DELETE FROM waste_collections; 
    
    FOR r IN SELECT * FROM r3bin_waste_logs LOOP
        -- reusing the logic logic by "faking" an insert logic is hard in a do block, 
        -- so we just run the update logic directly here for backfill
        DECLARE
            b_date DATE;
            b_type TEXT;
        BEGIN
            -- Fix parsing for backfill loop too
            BEGIN
                IF r.updated_at IS NULL THEN
                    b_date := CURRENT_DATE;
                ELSE
                    b_date := DATE(TO_TIMESTAMP(r.updated_at, 'YY-MM-DD_HH24-MI-SS'));
                END IF;
            EXCEPTION WHEN OTHERS THEN
                b_date := CURRENT_DATE;
            END;

            b_type := LOWER(r.waste_type);
            
            IF b_type = 'mixed' THEN b_type := 'mixed_waste'; END IF;
            
            IF b_type IN ('metal', 'plastic', 'paper', 'mixed_waste') THEN
                EXECUTE format('
                    INSERT INTO waste_collections (date, %I) 
                    VALUES ($1, 1)
                    ON CONFLICT (date) DO UPDATE 
                    SET %I = waste_collections.%I + 1
                ', b_type, b_type, b_type) USING b_date;
            END IF;
        END;
    END LOOP;
END $$;
