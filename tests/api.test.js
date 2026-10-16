const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'test';
process.env.DB_NAME = 'test';
process.env.DATABASE_URL = 'mysql://test:@localhost:3306/test';

const app = require('../app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

test('GET /api/menu/:id rejects an invalid ID', async () => {
  const response = await fetch(`${baseUrl}/api/menu/not-an-id`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Menu ID must be a positive integer',
  });
});

test('POST /api/menu rejects invalid menu data', async () => {
  const response = await fetch(`${baseUrl}/api/menu`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: '', price: -1, typeId: 0 }),
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Invalid menu data' });
});

test('POST /api/type requires a name', async () => {
  const response = await fetch(`${baseUrl}/api/type`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: ' ' }),
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'Name is required' });
});

test('unknown API paths return 404', async () => {
  const response = await fetch(`${baseUrl}/missing`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'API endpoint not found' });
});
