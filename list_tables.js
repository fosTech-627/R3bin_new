require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
    console.log('Listing all tables...');

    // This query works if we have access to information_schema (often restricted for anon)
    // Alternative: Try to select from likely names again with better error logging

    const potentialNames = [
        '3bin_waste_logs',
        'r3bin_waste_logs',
        'waste_logs',
        'logs'
    ];

    for (const name of potentialNames) {
        const { data, error } = await supabase.from(name).select('*').limit(1);
        if (!error) {
            console.log(`✅ Found table: "${name}"`);
            console.log('   Keys:', data.length > 0 ? Object.keys(data[0]) : 'No rows to infer keys');
        } else {
            // console.log(`❌ ${name}: ${error.message}`);
        }
    }
}

listTables();
