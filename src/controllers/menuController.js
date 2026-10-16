const prisma = require('../db/prisma');

const getMenus = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      include: { type: true },
    });
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getMenuById = async (req, res) => {
  const menuId = Number(req.params.id);
  if (!Number.isInteger(menuId) || menuId < 1) {
    return res.status(400).json({ error: 'Menu ID must be a positive integer' });
  }

  try {
    const menu = await prisma.menu.findUnique({
      where: { menuId },
      include: { type: true },
    });

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json(menu);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const createMenu = async (req, res) => {
  const { name, price, isBestSeller, typeId } = req.body || {};
  const numericPrice = Number(price);
  const numericTypeId = Number(typeId);

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    price === undefined ||
    price === null ||
    (typeof price === 'string' && !price.trim()) ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0 ||
    typeId === null ||
    (typeof typeId === 'string' && !typeId.trim()) ||
    !Number.isInteger(numericTypeId) ||
    numericTypeId < 1 ||
    (isBestSeller !== undefined && typeof isBestSeller !== 'boolean')
  ) {
    return res.status(400).json({ error: 'Invalid menu data' });
  }

  try {
    const menu = await prisma.menu.create({
      data: {
        name: name.trim(),
        price: numericPrice,
        isBestSeller: isBestSeller ?? false,
        typeId: numericTypeId,
      },
      include: { type: true },
    });
    res.status(201).json(menu);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(err.code === 'P2003' ? 400 : 500).json({
      error: err.code === 'P2003' ? 'Type not found' : 'Database error',
    });
  }
};

const updateMenu = async (req, res) => {
  const menuId = Number(req.params.id);
  if (!Number.isInteger(menuId) || menuId < 1) {
    return res.status(400).json({ error: 'Menu ID must be a positive integer' });
  }

  const { name, price, isBestSeller, typeId } = req.body || {};
  const data = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    data.name = name.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (
      price === null ||
      (typeof price === 'string' && !price.trim()) ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }
    data.price = numericPrice;
  }

  if (isBestSeller !== undefined) {
    if (typeof isBestSeller !== 'boolean') {
      return res.status(400).json({ error: 'isBestSeller must be a boolean' });
    }
    data.isBestSeller = isBestSeller;
  }

  if (typeId !== undefined) {
    const numericTypeId = Number(typeId);
    if (
      typeId === null ||
      (typeof typeId === 'string' && !typeId.trim()) ||
      !Number.isInteger(numericTypeId) ||
      numericTypeId < 1
    ) {
      return res.status(400).json({ error: 'typeId must be a positive integer' });
    }
    data.typeId = numericTypeId;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Provide at least one menu field to update' });
  }

  try {
    const menu = await prisma.menu.update({
      where: { menuId },
      data,
      include: { type: true },
    });
    res.json(menu);
  } catch (err) {
    console.error('Error updating menu item:', err);
    const status = err.code === 'P2025' ? 404 : err.code === 'P2003' ? 400 : 500;
    res.status(status).json({
      error:
        err.code === 'P2025'
          ? 'Menu not found'
          : err.code === 'P2003'
            ? 'Type not found'
            : 'Database error',
    });
  }
};

const deleteMenu = async (req, res) => {
  const menuId = Number(req.params.id);
  if (!Number.isInteger(menuId) || menuId < 1) {
    return res.status(400).json({ error: 'Menu ID must be a positive integer' });
  }

  try {
    await prisma.menu.delete({
      where: { menuId },
    });
    res.json({ message: 'Menu deleted successfully', menuId });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(err.code === 'P2025' ? 404 : 500).json({
      error: err.code === 'P2025' ? 'Menu not found' : 'Database error',
    });
  }
};

module.exports = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
