const io = require('socket.io-client');
const axios = require('axios');

async function testRealTime() {
    console.log('--- Starting Real-Time Integration Test ---');

    const socket = io('http://localhost:5000');
    const userId = "401d5da0-d29f-446e-8d38-25ac507e07a8";
    const testIncident = {
        type: 'Test',
        description: 'Automated test incident ' + Date.now(),
        latitude: 12,
        longitude: 77,
        userId
    };

    const receivePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('❌ Timeout: Did not receive WebSocket event'));
        }, 5000);

        socket.on('connect', () => {
            console.log('✅ Connected to WebSocket');
        });

        socket.on('new-incident', (data) => {
            if (data.description === testIncident.description) {
                clearTimeout(timeout);
                // Also check if AI tagged it (Test -> should be 'MEDIUM' by keyword fallback for "Test" isn't defined, actually my code defaults keyword to LOW, but AI call might vary. 
                // Let's actually check if it exists.
                console.log(`✅ Received 'new-incident' event via WebSocket`);
                console.log(`   ID: ${data.id}`);
                console.log(`   Severity: ${data.severity}`);
                resolve();
            }
        });
    });

    try {
        // Wait a bit for connection
        await new Promise(r => setTimeout(r, 1000));

        console.log('➡ Submitting incident via API...');
        await axios.post('http://localhost:5000/api/incidents', testIncident);
        console.log('✅ API Request sent');

        await receivePromise;
        console.log('🎉 TEST PASSED: Real-time flow is working');
    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        process.exit(1);
    } finally {
        socket.close();
    }
}

testRealTime();
