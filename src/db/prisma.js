const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const requiredEnvironmentVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_NAME',
];

const missingVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name],
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing database configuration: ${missingVariables.join(', ')}. ` +
      'Copy .env.example to .env and fill in your MySQL settings.',
  );
}

const port = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT must be a valid port number.');
}

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
