require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugTrends() {
    console.log('Debugging Collection Trends Data...');

    const { data: rawLogs, error: logsError } = await supabase
        .from('r3bin_waste_logs')
        .select('updated_at, waste_type')
        .order('updated_at', { ascending: true })
        .limit(10); // Check first 10

    if (logsError) {
        console.error('❌ Error fetching logs:', logsError.message);
        return;
    }

    console.log(`✅ Fetched ${rawLogs.length} logs.`);
    if (rawLogs.length > 0) {
        console.log('Sample Data:', rawLogs);
        console.log('First Date parsed:', rawLogs[0].updated_at ? rawLogs[0].updated_at.split('T')[0] : 'N/A');
    } else {
        console.log('⚠️ No logs found in r3bin_waste_logs.');
    }
}

debugTrends();
