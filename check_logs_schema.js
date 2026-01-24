require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkLogsSchema() {
    console.log('Checking r3bin_waste_logs columns...');
    const { data, error } = await supabase.from('r3bin_waste_logs').select('*').limit(1);

    if (error) {
        console.error('Error fetching logs:', error.message);
    } else if (data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
        console.log('Sample Row:', data[0]);
    } else {
        console.log('Table exists but is empty.');
    }
}

checkLogsSchema();
