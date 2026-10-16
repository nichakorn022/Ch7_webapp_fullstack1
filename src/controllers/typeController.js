const prisma = require('../db/prisma');

const getTypes = async (req, res) => {
  try {
    const types = await prisma.menuType.findMany();
    res.json(types);
  } catch (err) {
    console.error('Error fetching menu types:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getTypeById = async (req, res) => {
  const typeId = Number(req.params.id);
  if (!Number.isInteger(typeId) || typeId < 1) {
    return res.status(400).json({ error: 'Type ID must be a positive integer' });
  }

  try {
    const type = await prisma.menuType.findUnique({
      where: { typeId },
    });

    if (!type) {
      return res.status(404).json({ error: 'Type not found' });
    }

    res.json(type);
  } catch (err) {
    console.error('Error fetching menu type:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const createType = async (req, res) => {
  const { name } = req.body || {};

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const type = await prisma.menuType.create({
      data: { name: name.trim() },
    });
    res.status(201).json(type);
  } catch (err) {
    console.error('Error creating menu type:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const updateType = async (req, res) => {
  const typeId = Number(req.params.id);
  if (!Number.isInteger(typeId) || typeId < 1) {
    return res.status(400).json({ error: 'Type ID must be a positive integer' });
  }

  const { name } = req.body || {};

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const type = await prisma.menuType.update({
      where: { typeId },
      data: { name: name.trim() },
    });
    res.json(type);
  } catch (err) {
    console.error('Error updating menu type:', err);
    res.status(err.code === 'P2025' ? 404 : 500).json({
      error: err.code === 'P2025' ? 'Type not found' : 'Database error',
    });
  }
};

const deleteType = async (req, res) => {
  const typeId = Number(req.params.id);
  if (!Number.isInteger(typeId) || typeId < 1) {
    return res.status(400).json({ error: 'Type ID must be a positive integer' });
  }

  try {
    await prisma.menuType.delete({
      where: { typeId },
    });
    res.json({ message: 'Type deleted successfully', typeId });
  } catch (err) {
    console.error('Error deleting menu type:', err);
    const isInUse = err.code === 'P2003';
    res.status(isInUse ? 409 : err.code === 'P2025' ? 404 : 500).json({
      error: isInUse
        ? 'Cannot delete a type that is used by menu items'
        : err.code === 'P2025'
          ? 'Type not found'
          : 'Database error',
    });
  }
};

module.exports = {
  getTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
};
