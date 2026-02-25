const pool = require('./db');

async function listUsers() {
    try {
        const res = await pool.query('SELECT id, name, email FROM users');
        console.log('--- Registered Users ---');
        res.rows.forEach(user => {
            console.log(`ID: ${user.id} | Name: ${user.name} | Email: ${user.email}`);
        });
        console.log('------------------------');
    } catch (err) {
        console.error('Error listing users:', err);
    } finally {
        // Close pool to allow script to exit
        // pool.end() might be needed depending on implementation, 
        // but 'db.js' usually exports a pool. 
        // If it hangs, we'll force exit.
        process.exit(0);
    }
}

listUsers();
