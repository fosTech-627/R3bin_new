require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function probe() {
    const tables = ['bins', 'alerts', 'waste_collections', 'waste_composition', 'hourly_activity', 'stats', 'collection_trends'];

    console.log('Probing tables...');

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);

        if (error) {
            //   console.log(`Table '${table}' error:`, error.message);
        } else {
            console.log(`\nTable found: '${table}'`);
            console.log('Sample data:', data);
        }
    }
}

probe();
