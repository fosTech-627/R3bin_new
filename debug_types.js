require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugWasteTypes() {
    console.log('Fetching logs for analysis...');
    const { data: rawLogs, error } = await supabase
        .from('r3bin_waste_logs')
        .select('waste_type, updated_at')
        .limit(100);

    if (error) {
        console.error('Error:', error);
        return;
    }

    // 1. Analyze Waste Types
    const types = new Set();
    rawLogs.forEach(l => {
        types.add(`'${l.waste_type}'`); // Wrap in quotes to see whitespace
    });
    console.log('Unique Waste Types found:', [...types]);

    // 2. Analyze Date Formats
    const dateSamples = new Set();
    rawLogs.slice(0, 20).forEach(l => {
        if (l.updated_at) dateSamples.add(l.updated_at);
    });
    console.log('Sample updated_at values:', [...dateSamples]);
}

debugWasteTypes();
