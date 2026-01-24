const sample = "26-01-23_22-03-17";

function parseDate(dateStr) {
    if (!dateStr) return 'Unknown';

    // Logic from dashboard/page.tsx
    let dateKey = 'Unknown';
    try {
        if (dateStr.includes('T')) {
            dateKey = dateStr.split('T')[0];
        } else {
            console.log("Using custom parser...");
            const datePart = dateStr.split(/[_ ]/)[0];
            const parts = datePart.split('-');

            console.log("Parts:", parts);

            if (parts.length >= 3) {
                let year = parseInt(parts[0]);
                let month = parseInt(parts[1]);
                let day = parseInt(parts[2]);

                console.log(`Parsed: Y=${year}, M=${month}, D=${day}`);

                if (year < 100) year += 2000;

                // Date.UTC(year, monthIndex, day)
                const dateObj = new Date(Date.UTC(year, month - 1, day));
                console.log("DateObj:", dateObj.toISOString());
                dateKey = dateObj.toISOString().split('T')[0];
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
    return dateKey;
}

const result = parseDate(sample);
console.log(`\nInput: "${sample}"`);
console.log(`Output: "${result}"`);
