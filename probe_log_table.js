require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function probe() {
    console.log('Probing 3bin_waste_logs...');

    // Get sample data
    const { data, error } = await supabase
        .from('3bin_waste_logs')
        .select('waste_type')
        .limit(20);

    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log('Sample waste_types:', data);

        // Get distinct counts if possible (simulated here)
        const counts = {};
        data.forEach(item => {
            const type = item.waste_type;
            counts[type] = (counts[type] || 0) + 1;
        });
        console.log('\nApparent categories:', Object.keys(counts));
    }
}

probe();
