const path = require('node:path');
const { createApp } = require('./app');
const { createDatabase } = require('./database');

const databasePath = path.join(__dirname, 'data', 'menu.db');
require('node:fs').mkdirSync(path.dirname(databasePath), { recursive: true });

const db = createDatabase(databasePath);
const port = Number(process.env.PORT) || 5000;
const server = createApp(db).listen(port, () => {
  console.log(`Menu API listening on http://localhost:${port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
