const mongoose = require('mongoose');

// Read URI from .env.local manually to avoid dependency
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);

    if (!match) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    const uri = match[1].trim();
    console.log(`Checking connection to: ${uri}`);

    mongoose.connect(uri)
        .then(() => {
            console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
            console.log(`State: ${mongoose.connection.readyState} (1 = connected)`);
            console.log('Host:', mongoose.connection.host);
            console.log('Port:', mongoose.connection.port);
            console.log('Name:', mongoose.connection.name);
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ CONNECTION FAILED');
            console.error(err);
            process.exit(1);
        });

} catch (e) {
    console.error('Error reading .env.local:', e.message);
    // Fallback or exit
    console.log('Attempting default local connection...');
    mongoose.connect('mongodb://localhost:27017/attendance_db')
        .then(() => {
            console.log('✅ DATABASE CONNECTED SUCCESSFULLY (Fallback)!');
            process.exit(0);
        })
        .catch(err => console.error(err));
}
