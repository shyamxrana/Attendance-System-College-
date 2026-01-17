const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read URI info
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const match = envFile.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : 'mongodb://localhost:27017/attendance_db';

async function resetDb() {
    try {
        console.log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        console.log('✅ Connected.');

        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            console.log(`Deleting collection: ${collection.collectionName}`);
            await collection.deleteMany({}); // Delete documents instead of dropping to keep indexes if needed, or drop
            // await collection.drop(); // Alternative: Drop completely
        }

        console.log('✅ All data deleted successfully.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error resetting database:', err);
        process.exit(1);
    }
}

resetDb();
