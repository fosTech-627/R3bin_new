require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugBins() {
    console.log('Debugging Bins Data...');

    const tablesToCheck = ['hourly_activity', 'alerts', 'waste_composition'];

    for (const table of tablesToCheck) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`❌ Table '${table}' Error:`, error.message);
        } else {
            console.log(`✅ Table '${table}' Exists. Rows: ${data.length}`);
        }
    }
}

debugBins();
