const Database = require('better-sqlite3');

function createDatabase(databasePath) {
  const db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS type (
      typeId INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS menu (
      menuId INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK (price >= 0),
      isBestSeller INTEGER NOT NULL DEFAULT 0 CHECK (isBestSeller IN (0, 1)),
      typeId INTEGER NOT NULL,
      FOREIGN KEY (typeId) REFERENCES type(typeId) ON DELETE RESTRICT
    );
  `);

  const existingTypes = db.prepare('SELECT COUNT(*) AS count FROM type').get().count;
  if (existingTypes === 0) {
    const seed = db.transaction(() => {
      const insertType = db.prepare('INSERT INTO type (name) VALUES (?)');
      const bakeryId = Number(insertType.run('Bakery').lastInsertRowid);
      const drinksId = Number(insertType.run('Drinks').lastInsertRowid);
      const insertMenu = db.prepare(
        'INSERT INTO menu (name, price, isBestSeller, typeId) VALUES (?, ?, ?, ?)'
      );

      insertMenu.run('cake', 35, 1, bakeryId);
      insertMenu.run('bread', 25, 0, bakeryId);
      insertMenu.run('milk', 15, 1, drinksId);
      insertMenu.run('donut', 45, 0, bakeryId);
      insertMenu.run('cookie', 55, 1, bakeryId);
    });
    seed();
  }

  return db;
}

module.exports = { createDatabase };
