const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body || '{}') });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    console.log('Starting verification...');

    // 1. Register User A
    const ownerEmail = `owner_${Date.now()}@test.com`;
    console.log('Registering Owner:', ownerEmail);
    const regA = await request({
        hostname: 'localhost', port: 5000, path: '/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { name: 'Owner', email: ownerEmail, password: 'password123' });

    if (regA.status !== 200) { console.error('Reg A failed', regA); return; }
    const tokenA = regA.data.token;

    // 2. Register User B
    const collabEmail = `collab_${Date.now()}@test.com`;
    console.log('Registering Collab:', collabEmail);
    const regB = await request({
        hostname: 'localhost', port: 5000, path: '/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { name: 'Collab', email: collabEmail, password: 'password123' });

    if (regB.status !== 200) { console.error('Reg B failed', regB); return; }
    const tokenB = regB.data.token;

    // 3. Create Note (User A)
    console.log('Creating Note...');
    const noteRes = await request({
        hostname: 'localhost', port: 5000, path: '/notes', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` }
    }, { title: 'Shared Note', content: 'Init', isArchived: false, isTrashed: false, color: '#fff' });

    const noteId = noteRes.data.id;
    console.log('Note Created:', noteId);

    // 4. Add Collaborator
    console.log('Adding Collaborator...');
    const addCollabRes = await request({
        hostname: 'localhost', port: 5000, path: `/collaborators/${noteId}`, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` }
    }, { email: collabEmail });

    if (addCollabRes.status !== 200) { console.error('Add Collab failed', addCollabRes); return; }
    console.log('Collaborator Added');

    // 5. Fetch Notes (User B)
    console.log('Fetching Notes as Collab...');
    const notesRes = await request({
        hostname: 'localhost', port: 5000, path: '/notes', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenB}` }
    });

    const sharedNote = notesRes.data.find(n => n.id === noteId);
    if (sharedNote) console.log('PASS: User B sees shared note');
    else console.error('FAIL: User B does not see shared note', notesRes.data);

    // 6. Edit Note (User B)
    console.log('Editing Note as Collab...');
    const editRes = await request({
        hostname: 'localhost', port: 5000, path: `/notes/${noteId}`, method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` }
    }, { title: 'Edited by B', content: 'New Content', isArchived: false, isTrashed: false, color: '#fff' });

    if (editRes.status !== 200) console.error('Edit failed', editRes);
    else console.log('Edit successful');

    // 7. Verify Edit (User A)
    console.log('Verifying Edit as Owner...');
    const verifyRes = await request({
        hostname: 'localhost', port: 5000, path: '/notes', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const finalNote = verifyRes.data.find(n => n.id === noteId);
    if (finalNote.title === 'Edited by B') console.log('PASS: Owner sees edit');
    else console.error('FAIL: Owner verification failed');

}

run();
