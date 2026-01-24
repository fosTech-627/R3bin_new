require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debugAggregation() {
    console.log('Fetching raw logs...');
    const { data: rawLogs, error } = await supabase
        .from('r3bin_waste_logs')
        .select('updated_at, waste_type')
        .order('updated_at', { ascending: true })
        .limit(50);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Fetched ${rawLogs.length} logs.`);

    const dailyStats = {};
    const currentYear = new Date().getFullYear();

    rawLogs.forEach((log) => {
        let date = 'Unknown';
        if (log.updated_at) {
            if (log.updated_at.includes('T')) {
                date = log.updated_at.split('T')[0];
            } else {
                const parts = log.updated_at.split('-');
                if (parts.length >= 2) {
                    const month = parts[0];
                    const day = parts[1];
                    date = `${currentYear}-${month}-${day}`;
                }
            }
        }

        const type = (log.waste_type || 'mixed').toLowerCase();

        if (!dailyStats[date]) {
            dailyStats[date] = { date, metal: 0, plastic: 0, paper: 0, mixed_waste: 0 };
        }

        if (type.includes('metal')) dailyStats[date].metal++;
        else if (type.includes('plastic')) dailyStats[date].plastic++;
        else if (type.includes('paper')) dailyStats[date].paper++;
        else dailyStats[date].mixed_waste++;
    });

    const trendsData = Object.values(dailyStats).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    console.log('--- Aggregated Data Preview ---');
    console.log(JSON.stringify(trendsData, null, 2));
}

debugAggregation();
