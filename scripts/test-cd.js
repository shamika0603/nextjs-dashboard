const postgres = require('postgres');
require('dotenv').config();

async function testConnection() {
    console.log('Testing database connection...');
    console.log('POSTGRES_URL:', !!process.env.POSTGRES_URL);

    try {
        const sql = postgres(process.env.POSTGRES_URL, {
            ssl: { rejectUnauthorized: false },
            connection: {
                timeoutMillis: 5000
            }
        });

        const result = await sql`SELECT NOW()`;
        console.log('✅ Database connected successfully!');
        console.log('Server time:', result[0].now);
        await sql.end();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Error details:', error);
    }
}

testConnection();cd [nextjs-dashboard]
( http://_vscodecontentref_/1 
    scripts/test-cd.js
)
