require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugTrends() {
    console.log('Debugging waste_collections table...');

    const { data, error } = await supabase
        .from('waste_collections')
        .select('*');

    if (error) {
        console.error('❌ Error fetching data:', error.message);
        console.error('   Hint: Check if Row Level Security (RLS) is enabled and if there is a policy allowing SELECT access for public/anon role.');
    } else {
        console.log(`✅ Success! Fetched ${data.length} rows.`);
        if (data.length > 0) {
            console.log('   Sample Row Keys:', Object.keys(data[0]));
            console.log('   Sample Row Data:', data[0]);
        } else {
            console.log('   ⚠️ Table is empty.');
        }
    }
}

debugTrends();
