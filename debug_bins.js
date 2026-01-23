require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugBins() {
    console.log('Debugging Bins Data...');

    // Check bins table
    const { data: bins, error: binsError } = await supabase.from('bins').select('*');
    if (binsError) console.error('❌ Error fetching bins:', binsError.message);
    else console.log(`✅ Total 'bins' count: ${bins.length}`);

    // Check logs table
    const { data: logs, error: logsError } = await supabase.from('r3bin_waste_logs').select('bin_id');
    if (logsError) {
        console.error('❌ Error fetching r3bin_waste_logs:', logsError.message);
    } else {
        console.log(`✅ Total logs count: ${logs.length}`);
        const uniqueBins = new Set(logs.map(l => l.bin_id).filter(id => id)); // Filter nulls
        console.log(`✅ Unique active bin_ids found: ${uniqueBins.size}`);
        console.log('   Ids:', [...uniqueBins]);
    }
}

debugBins();
