async function testAI() {
    const userId = "401d5da0-d29f-446e-8d38-25ac507e07a8";

    const scenarios = [
        { type: 'Fire', description: 'Huge fire explosion in the building', expected: 'CRITICAL' },
        { type: 'Accident', description: 'Car accident with injury', expected: 'HIGH' },
        { type: 'Theft', description: 'Street fight and theft', expected: 'MEDIUM' },
        { type: 'Other', description: 'Just a random event', expected: 'LOW' }
    ];

    console.log('--- Starting AI Severity Verification ---');

    for (const s of scenarios) {
        try {
            const res = await fetch('http://localhost:5000/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: s.type,
                    description: s.description,
                    latitude: 0,
                    longitude: 0,
                    userId
                })
            });

            const data = await res.json();
            const actual = data.severity;
            const status = actual === s.expected ? '✅ PASS' : `❌ FAIL (Expected ${s.expected}, got ${actual})`;
            console.log(`[${s.type}] "${s.description}" -> ${actual} ${status}`);
        } catch (e) {
            console.error(`Error testing ${s.type}:`, e.message);
        }
    }
}

testAI();
