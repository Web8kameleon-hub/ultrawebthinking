// Web8 Intelligence Platform API Test Suite
// Run with: node test-intelligence-apis.js

const tests = [
    {
        name: "Health Check",
        url: "http://localhost:3000/api/health",
        method: "GET"
    },
    {
        name: "Search API",
        url: "http://localhost:3000/api/search?q=artificial%20intelligence&count=5",
        method: "GET"
    },
    {
        name: "Text Analysis",
        url: "http://localhost:3000/api/analyze",
        method: "POST",
        body: JSON.stringify({
            text: "This is a test document about artificial intelligence and machine learning technologies. AI has revolutionized many industries."
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    },
    {
        name: "Content Ingestion",
        url: "http://localhost:3000/api/ingest?url=https://example.com",
        method: "GET"
    },
    {
        name: "Ingested Data Summary",
        url: "http://localhost:3000/api/ingested",
        method: "GET"
    },
    {
        name: "PDF Report Generation",
        url: "http://localhost:3000/api/report?q=web8%20platform",
        method: "GET"
    }
];

async function runTest(test) {
    try {
        console.log(`\n🧪 Testing: ${test.name}`);
        console.log(`📡 ${test.method} ${test.url}`);

        const options = {
            method: test.method,
            headers: test.headers || {}
        };

        if (test.body) {
            options.body = test.body;
        }

        const response = await fetch(test.url, options);

        console.log(`📊 Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const data = await response.json();
                console.log(`✅ Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
            } else if (contentType?.includes('application/pdf')) {
                console.log(`✅ PDF Response: ${response.headers.get('content-length')} bytes`);
            } else {
                const text = await response.text();
                console.log(`✅ Text Response: ${text.substring(0, 100)}...`);
            }
        } else {
            const error = await response.text();
            console.log(`❌ Error: ${error}`);
        }

        return response.ok;
    } catch (error) {
        console.log(`💥 Exception: ${error.message}`);
        return false;
    }
}

async function runAllTests() {
    console.log('🚀 Web8 Intelligence Platform API Test Suite');
    console.log('=' * 50);

    let passed = 0;
    let total = tests.length;

    for (const test of tests) {
        const success = await runTest(test);
        if (success) passed++;

        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '=' * 50);
    console.log(`📈 Results: ${passed}/${total} tests passed`);

    if (passed === total) {
        console.log('🎉 All tests passed! Web8 Intelligence Platform is fully operational.');
    } else {
        console.log('⚠️  Some tests failed. Check the logs above for details.');
    }
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
    runAllTests();
}

module.exports = { runAllTests, runTest, tests };
