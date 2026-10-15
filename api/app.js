const express = require('express');

const MENU_SELECT = `
  SELECT menu.menuId, menu.name, menu.price, menu.isBestSeller, menu.typeId, type.name AS typeName
  FROM menu
  JOIN type ON type.typeId = menu.typeId
`;

function sendMenu(res, row, status = 200) {
  if (!row) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  return res.status(status).json({
    ...row,
    isBestSeller: Boolean(row.isBestSeller),
  });
}

function validateMenuFields(body, { partial = false } = {}) {
  const errors = [];

  if (!partial || Object.hasOwn(body, 'name')) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('name must be a non-empty string');
    }
  }
  if (!partial || Object.hasOwn(body, 'price')) {
    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
      errors.push('price must be a non-negative number');
    }
  }
  if (Object.hasOwn(body, 'isBestSeller') && typeof body.isBestSeller !== 'boolean') {
    errors.push('isBestSeller must be a boolean');
  }
  if (!partial || Object.hasOwn(body, 'typeId')) {
    if (!Number.isInteger(body.typeId) || body.typeId < 1) {
      errors.push('typeId must be a positive integer');
    }
  }

  return errors;
}

function validateTypeName(name) {
  return typeof name === 'string' && name.trim() !== '';
}

function getRequestBody(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
}

function isForeignKeyConstraint(error) {
  return error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY'
    || (error.code === 'SQLITE_CONSTRAINT_TRIGGER' && error.message.includes('FOREIGN KEY'));
}

function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get('/api/menu', (req, res, next) => {
    try {
      if (req.query.typeId !== undefined) {
        const typeId = Number(req.query.typeId);
        if (!Number.isInteger(typeId) || typeId < 1) {
          return res.status(400).json({ error: 'typeId must be a positive integer' });
        }

        const rows = db.prepare(`${MENU_SELECT} WHERE menu.typeId = ? ORDER BY menu.menuId`).all(typeId);
        return res.json(rows.map((row) => ({ ...row, isBestSeller: Boolean(row.isBestSeller) })));
      }

      const rows = db.prepare(`${MENU_SELECT} ORDER BY menu.menuId`).all();
      return res.json(rows.map((row) => ({ ...row, isBestSeller: Boolean(row.isBestSeller) })));
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/menu/:menuId', (req, res, next) => {
    try {
      const menuId = Number(req.params.menuId);
      if (!Number.isInteger(menuId) || menuId < 1) {
        return res.status(400).json({ error: 'menuId must be a positive integer' });
      }

      const row = db.prepare(`${MENU_SELECT} WHERE menu.menuId = ?`).get(menuId);
      return sendMenu(res, row);
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/menu', (req, res, next) => {
    try {
      const body = getRequestBody(req);
      const errors = validateMenuFields(body);
      if (errors.length > 0) {
        return res.status(400).json({ error: errors });
      }

      const result = db.prepare(
        'INSERT INTO menu (name, price, isBestSeller, typeId) VALUES (?, ?, ?, ?)'
      ).run(body.name.trim(), body.price, body.isBestSeller ? 1 : 0, body.typeId);
      const row = db.prepare(`${MENU_SELECT} WHERE menu.menuId = ?`).get(Number(result.lastInsertRowid));
      return sendMenu(res, row, 201);
    } catch (error) {
      if (isForeignKeyConstraint(error)) {
        return res.status(400).json({ error: 'typeId does not reference an existing type' });
      }
      return next(error);
    }
  });

  app.patch('/api/menu/:menuId', (req, res, next) => {
    try {
      const menuId = Number(req.params.menuId);
      if (!Number.isInteger(menuId) || menuId < 1) {
        return res.status(400).json({ error: 'menuId must be a positive integer' });
      }

      const current = db.prepare(`${MENU_SELECT} WHERE menu.menuId = ?`).get(menuId);
      if (!current) {
        return sendMenu(res, current);
      }

      const body = getRequestBody(req);
      const errors = validateMenuFields(body, { partial: true });
      if (errors.length > 0) {
        return res.status(400).json({ error: errors });
      }

      const updated = {
        name: Object.hasOwn(body, 'name') ? body.name.trim() : current.name,
        price: Object.hasOwn(body, 'price') ? body.price : current.price,
        isBestSeller: Object.hasOwn(body, 'isBestSeller')
          ? body.isBestSeller
          : Boolean(current.isBestSeller),
        typeId: Object.hasOwn(body, 'typeId') ? body.typeId : current.typeId,
      };
      db.prepare(`
        UPDATE menu
        SET name = ?, price = ?, isBestSeller = ?, typeId = ?
        WHERE menuId = ?
      `).run(updated.name, updated.price, updated.isBestSeller ? 1 : 0, updated.typeId, menuId);

      const row = db.prepare(`${MENU_SELECT} WHERE menu.menuId = ?`).get(menuId);
      return sendMenu(res, row);
    } catch (error) {
      if (isForeignKeyConstraint(error)) {
        return res.status(400).json({ error: 'typeId does not reference an existing type' });
      }
      return next(error);
    }
  });

  app.delete('/api/menu/:menuId', (req, res, next) => {
    try {
      const menuId = Number(req.params.menuId);
      if (!Number.isInteger(menuId) || menuId < 1) {
        return res.status(400).json({ error: 'menuId must be a positive integer' });
      }

      const result = db.prepare('DELETE FROM menu WHERE menuId = ?').run(menuId);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/type', (req, res, next) => {
    try {
      const rows = db.prepare('SELECT typeId, name FROM type ORDER BY typeId').all();
      return res.json(rows);
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/type/:typeId', (req, res, next) => {
    try {
      const typeId = Number(req.params.typeId);
      if (!Number.isInteger(typeId) || typeId < 1) {
        return res.status(400).json({ error: 'typeId must be a positive integer' });
      }

      const row = db.prepare('SELECT typeId, name FROM type WHERE typeId = ?').get(typeId);
      return row ? res.json(row) : res.status(404).json({ error: 'Type not found' });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/type', (req, res, next) => {
    try {
      const body = getRequestBody(req);
      if (!validateTypeName(body.name)) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
      }

      const result = db.prepare('INSERT INTO type (name) VALUES (?)').run(body.name.trim());
      const row = db.prepare('SELECT typeId, name FROM type WHERE typeId = ?')
        .get(Number(result.lastInsertRowid));
      return res.status(201).json(row);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Type name already exists' });
      }
      return next(error);
    }
  });

  app.patch('/api/type/:typeId', (req, res, next) => {
    try {
      const typeId = Number(req.params.typeId);
      if (!Number.isInteger(typeId) || typeId < 1) {
        return res.status(400).json({ error: 'typeId must be a positive integer' });
      }
      const body = getRequestBody(req);
      if (!validateTypeName(body.name)) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
      }

      const result = db.prepare('UPDATE type SET name = ? WHERE typeId = ?')
        .run(body.name.trim(), typeId);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Type not found' });
      }
      return res.json(db.prepare('SELECT typeId, name FROM type WHERE typeId = ?').get(typeId));
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Type name already exists' });
      }
      return next(error);
    }
  });

  app.delete('/api/type/:typeId', (req, res, next) => {
    try {
      const typeId = Number(req.params.typeId);
      if (!Number.isInteger(typeId) || typeId < 1) {
        return res.status(400).json({ error: 'typeId must be a positive integer' });
      }

      const result = db.prepare('DELETE FROM type WHERE typeId = ?').run(typeId);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Type not found' });
      }
      return res.status(204).end();
    } catch (error) {
      if (isForeignKeyConstraint(error)) {
        return res.status(409).json({ error: 'Cannot delete a type that is used by menu items' });
      }
      return next(error);
    }
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

  app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) {
      return next(error);
    }
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
