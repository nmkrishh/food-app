const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const PORT = process.env.PORT || 3001;
const ADMIN_TOKEN_TTL_MS = 1000 * 60 * 60 * 8;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || process.env.ADMIN_USER || 'owner';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-owner-password';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-admin-secret';

function parsePrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCustomizationOption(option, index) {
  if (!option || typeof option !== 'object') return null;

  const label = String(option.label || '').trim();
  if (!label) return null;

  const id = String(option.id || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `option-${index + 1}`);
  const note = String(option.note || '').trim();
  const priceDelta = parsePrice(option.priceDelta);

  return {
    id,
    label,
    note,
    priceDelta: priceDelta || 0,
  };
}

function normalizeCustomization(value) {
  if (!value || typeof value !== 'object') return null;

  const groupLabel = String(value.groupLabel || 'Choose an option').trim() || 'Choose an option';
  const options = Array.isArray(value.options)
    ? value.options
        .map(normalizeCustomizationOption)
        .filter(Boolean)
    : [];

  if (!options.length) return null;

  return {
    groupLabel,
    options,
  };
}

function createAdminToken(userId) {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + ADMIN_TOKEN_TTL_MS })).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded?.exp || decoded.exp < Date.now()) return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const session = verifyAdminToken(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  req.admin = session;
  next();
}

function mapMenuItem(row) {
  return {
    id: row.id,
    name: row.name,
    price: parsePrice(row.price),
    oldPrice: parsePrice(row.old_price),
    desc: row.description,
    img: row.image,
    veg: row.veg,
    customizable: row.customizable,
    customization: normalizeCustomization(row.customization),
    tag: row.tag,
  };
}

function mapAdminItem(row) {
  return {
    ...row,
    price: parsePrice(row.price),
    old_price: parsePrice(row.old_price),
    customization: normalizeCustomization(row.customization),
  };
}

async function ensureMenuSchema() {
  await pool.query('ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS old_price NUMERIC(10,2)');
  await pool.query('ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS customization JSONB');
}

app.post('/api/admin/login', (req, res) => {
  const { userId, password } = req.body || {};

  if (userId !== ADMIN_USER_ID || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin user ID or password' });
  }

  return res.json({
    token: createAdminToken(userId),
    admin: { userId },
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'QRMenu Backend is running!' });
});

// GET all menu data
app.get('/api/menu', async (req, res) => {
  try {
    // Get all categories
    const categoriesResult = await pool.query(
      'SELECT * FROM categories ORDER BY display_order'
    );

    // Get all menu items
    const itemsResult = await pool.query(
      'SELECT * FROM menu_items WHERE available = true'
    );

    // Group items by category
    const menuItems = {};
    itemsResult.rows.forEach(item => {
      if (!menuItems[item.category_id]) {
        menuItems[item.category_id] = [];
      }
      menuItems[item.category_id].push(mapMenuItem(item));
    });

    res.json({
      categories: categoriesResult.rows.map(cat => ({
        id: cat.id,
        name: cat.name,
        image: cat.image
      })),
      menuItems
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

app.use('/api/admin', requireAdminAuth);

// GET all items for admin
app.get('/api/admin/items', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM menu_items ORDER BY category_id, id'
      );
      res.json(result.rows.map(mapAdminItem));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // ADD new item
  app.post('/api/admin/items', async (req, res) => {
    const { id, name, price, old_price, description, image, category_id, veg, customizable, customization } = req.body;
    const normalizedCustomization = customizable ? normalizeCustomization(customization) : null;
    try {
      const result = await pool.query(
        `INSERT INTO menu_items (id, name, price, old_price, description, image, category_id, veg, customizable, customization)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [id, name, price, old_price, description, image, category_id, veg, customizable, normalizedCustomization]
      );
      res.json(mapAdminItem(result.rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // EDIT item
  app.put('/api/admin/items/:id', async (req, res) => {
    const { name, price, old_price, description, image, category_id, veg, customizable, customization } = req.body;
    const normalizedCustomization = customizable ? normalizeCustomization(customization) : null;
    try {
      const result = await pool.query(
        `UPDATE menu_items SET name=$1, price=$2, old_price=$3, description=$4, image=$5,
         category_id=$6, veg=$7, customizable=$8, customization=$9 WHERE id=$10 RETURNING *`,
        [name, price, old_price, description, image, category_id, veg, customizable, normalizedCustomization, req.params.id]
      );
      res.json(mapAdminItem(result.rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // TOGGLE available
  app.put('/api/admin/items/:id/toggle', async (req, res) => {
    const { available } = req.body;
    try {
      const result = await pool.query(
        'UPDATE menu_items SET available=$1 WHERE id=$2 RETURNING *',
        [available, req.params.id]
      );
      res.json(mapAdminItem(result.rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // DELETE item
  app.delete('/api/admin/items/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM menu_items WHERE id=$1', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


ensureMenuSchema()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to prepare backend schema:', error);
    process.exit(1);
  });