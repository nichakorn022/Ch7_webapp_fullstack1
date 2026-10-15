const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { createApp } = require('./app');
const { createDatabase } = require('./database');

let db;
let server;
let baseUrl;

before(async () => {
  db = createDatabase(':memory:');
  server = createApp(db).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  db.close();
});

test('GET /api/menu returns menu rows linked to their type', async () => {
  const response = await fetch(`${baseUrl}/api/menu`);
  const menu = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(menu[0], {
    menuId: 1,
    name: 'cake',
    price: 35,
    isBestSeller: true,
    typeId: 1,
    typeName: 'Bakery',
  });
});

test('GET /api/type returns available menu types', async () => {
  const response = await fetch(`${baseUrl}/api/type`);
  const types = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(types, [
    { typeId: 1, name: 'Bakery' },
    { typeId: 2, name: 'Drinks' },
  ]);
});

test('POST /api/menu validates its type and creates a menu item', async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'tea', price: 20, isBestSeller: false, typeId: 99 }),
  });
  assert.equal(invalidResponse.status, 400);

  const response = await fetch(`${baseUrl}/api/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'tea', price: 20, isBestSeller: false, typeId: 2 }),
  });
  const menuItem = await response.json();

  assert.equal(response.status, 201);
  assert.equal(menuItem.typeName, 'Drinks');
});

test('PATCH and DELETE /api/menu update and remove a menu item', async () => {
  const patchResponse = await fetch(`${baseUrl}/api/menu/1`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 40 }),
  });
  const updatedMenuItem = await patchResponse.json();

  assert.equal(patchResponse.status, 200);
  assert.equal(updatedMenuItem.price, 40);
  assert.equal(updatedMenuItem.name, 'cake');

  const deleteResponse = await fetch(`${baseUrl}/api/menu/1`, { method: 'DELETE' });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await fetch(`${baseUrl}/api/menu/1`);
  assert.equal(missingResponse.status, 404);
});

test('POST, PATCH, and DELETE /api/type manage menu types', async () => {
  const createResponse = await fetch(`${baseUrl}/api/type`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Seasonal' }),
  });
  const createdType = await createResponse.json();
  assert.equal(createResponse.status, 201);

  const patchResponse = await fetch(`${baseUrl}/api/type/${createdType.typeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Specials' }),
  });
  assert.equal(patchResponse.status, 200);
  assert.equal((await patchResponse.json()).name, 'Specials');

  const deleteResponse = await fetch(`${baseUrl}/api/type/${createdType.typeId}`, {
    method: 'DELETE',
  });
  assert.equal(deleteResponse.status, 204);
});

test('DELETE /api/type prevents deleting a type used by menu items', async () => {
  const response = await fetch(`${baseUrl}/api/type/1`, { method: 'DELETE' });

  assert.equal(response.status, 409);
});
