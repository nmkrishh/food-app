import { useEffect, useState } from 'react';

const CATEGORIES = [
  { id: 'favourites', name: 'Mini Roastery Favourites' },
  { id: 'dessert', name: 'Dessert' },
  { id: 'cascara', name: 'Cascara' },
  { id: 'coldbrew', name: 'Cold Brew' },
  { id: 'hotmilk', name: 'Hot Milk Coffee' },
  { id: 'icecream', name: 'Ice-cream Blend Cold Coffee' },
  { id: 'icedcold', name: 'Iced Cold Coffee' },
  { id: 'others', name: 'Others Beverage' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'smoothie', name: 'Smoothie Bowl' },
  { id: 'salads', name: 'Salads' },
  { id: 'appetizer', name: 'Appetizer' },
  { id: 'breads', name: 'Breads And Bruschetta' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'handmade', name: 'Hand-Made Pasta' },
  { id: 'lasagne', name: 'Lasagne' },
  { id: 'equipment', name: 'Coffee Equipment' },
  { id: 'topups', name: 'Food Enhancer Top Ups' },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function createEmptyOption() {
  return { id: '', label: '', priceDelta: '', note: '' };
}

function createEmptyForm() {
  return {
    id: '',
    name: '',
    price: '',
    old_price: '',
    description: '',
    image: '',
    category_id: 'dessert',
    veg: true,
    customizable: false,
    customizationGroupLabel: 'Choose an option',
    customizationOptions: [createEmptyOption()],
  };
}

function toOptionId(label, fallbackIndex) {
  const normalized = String(label || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return normalized || `option-${fallbackIndex + 1}`;
}

export default function AdminPage({ adminToken, onBack, onLogout, onMenuRefresh }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(createEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, [adminToken]);

  async function adminFetch(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (response.status === 401) {
      onLogout?.();
      throw new Error('UNAUTHORIZED');
    }

    return response;
  }

  async function fetchItems() {
    setLoading(true);

    try {
      const res = await adminFetch('/api/admin/items');
      const data = await res.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        console.error(err);
        showMessage('❌ Failed to load items');
      }
      setLoading(false);
    }
  }

  function showMessage(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.id) {
      showMessage('❌ Please fill in ID, name and price');
      return;
    }

    const parsedPrice = Number(form.price);
    const parsedOldPrice = form.old_price === '' ? null : Number(form.old_price);

    if (!Number.isFinite(parsedPrice)) {
      showMessage('❌ Enter a valid current price');
      return;
    }

    if (parsedOldPrice !== null && !Number.isFinite(parsedOldPrice)) {
      showMessage('❌ Enter a valid old price');
      return;
    }

    const customizationOptions = form.customizable
      ? form.customizationOptions
          .map((option, index) => {
            const label = option.label.trim();
            if (!label) return null;

            const parsedDelta = option.priceDelta === '' ? 0 : Number(option.priceDelta);
            if (!Number.isFinite(parsedDelta)) return { invalid: true };

            return {
              id: option.id.trim() || toOptionId(label, index),
              label,
              note: option.note.trim(),
              priceDelta: parsedDelta,
            };
          })
          .filter(Boolean)
      : [];

    if (customizationOptions.some(option => option.invalid)) {
      showMessage('❌ Enter valid customization price changes');
      return;
    }

    if (form.customizable && customizationOptions.length === 0) {
      showMessage('❌ Add at least one customization option');
      return;
    }

    const payload = {
      ...form,
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: parsedPrice,
      old_price: parsedOldPrice,
      customization: form.customizable
        ? {
            groupLabel: form.customizationGroupLabel.trim() || 'Choose an option',
            options: customizationOptions,
          }
        : null,
    };

    const url = editingId
      ? `/api/admin/items/${editingId}`
      : '/api/admin/items';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        showMessage('❌ ' + data.error);
        return;
      }
      showMessage(editingId ? '✅ Item updated!' : '✅ Item added!');
      setForm(createEmptyForm());
      setEditingId(null);
      setShowForm(false);
      await fetchItems();
      onMenuRefresh?.();
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        showMessage('❌ Something went wrong');
      }
    }
  }

  async function handleToggle(id, current) {
    try {
      await adminFetch(`/api/admin/items/${id}/toggle`, {
        method: 'PUT',
        body: JSON.stringify({ available: !current })
      });
      await fetchItems();
      onMenuRefresh?.();
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        showMessage('❌ Failed to update');
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await adminFetch(`/api/admin/items/${id}`, { method: 'DELETE' });
      showMessage('✅ Item deleted!');
      await fetchItems();
      onMenuRefresh?.();
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        showMessage('❌ Failed to delete');
      }
    }
  }

  function handleEdit(item) {
    const customizationOptions = item.customization?.options?.length
      ? item.customization.options.map(option => ({
          id: option.id || '',
          label: option.label || '',
          priceDelta: option.priceDelta ?? 0,
          note: option.note || '',
        }))
      : [createEmptyOption()];

    setForm({
      id: item.id,
      name: item.name,
      price: item.price,
      old_price: item.old_price ?? '',
      description: item.description || '',
      image: item.image || '',
      category_id: item.category_id,
      veg: item.veg,
      customizable: item.customizable,
      customizationGroupLabel: item.customization?.groupLabel || 'Choose an option',
      customizationOptions,
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  function updateOption(index, key, value) {
    setForm(prev => ({
      ...prev,
      customizationOptions: prev.customizationOptions.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [key]: value } : option
      ),
    }));
  }

  function addOption() {
    setForm(prev => ({
      ...prev,
      customizationOptions: [...prev.customizationOptions, createEmptyOption()],
    }));
  }

  function removeOption(index) {
    setForm(prev => ({
      ...prev,
      customizationOptions: prev.customizationOptions.length === 1
        ? [createEmptyOption()]
        : prev.customizationOptions.filter((_, optionIndex) => optionIndex !== index),
    }));
  }

  const filtered = filterCategory === 'all'
    ? items
    : items.filter(i => i.category_id === filterCategory);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#f9f9f9', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: '#fff', padding: '16px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Menu Admin</h1>
            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{items.length} items total</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onBack}
              style={{ background: '#fff', color: '#444', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 13 }}
            >
              Menu
            </button>
            <button
              onClick={onLogout}
              style={{ background: '#f7f7f7', color: '#222', border: '1px solid #d9d9d9', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 13 }}
            >
              Logout
            </button>
            <button
              onClick={() => { setForm(createEmptyForm()); setEditingId(null); setShowForm(!showForm); }}
              style={{ background: '#111111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: 13 }}
            >
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{ background: message.includes('❌') ? '#fef2f2' : '#f0fdf4', color: message.includes('❌') ? '#dc2626' : '#111111', padding: '12px 16px', fontSize: 13, textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: '#fff', margin: 12, borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            {editingId ? 'Edit Item' : 'Add New Item'}
          </h2>

          {[
            { label: 'Item ID (unique, no spaces)', key: 'id', type: 'text', placeholder: 'e.g. d5', disabled: !!editingId },
            { label: 'Item Name', key: 'name', type: 'text', placeholder: 'e.g. Tiramisu' },
            { label: 'Price (₹)', key: 'price', type: 'number', placeholder: 'e.g. 350' },
            { label: 'Old Price (₹)', key: 'old_price', type: 'number', placeholder: 'Optional crossed price' },
            { label: 'Description', key: 'description', type: 'text', placeholder: 'Short description' },
            { label: 'Image URL', key: 'image', type: 'text', placeholder: 'https://...' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                disabled={field.disabled}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, boxSizing: 'border-box', background: field.disabled ? '#f9f9f9' : '#fff' }}
              />
            </div>
          ))}

          {/* Category */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>Category</label>
            <select
              value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, boxSizing: 'border-box' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Veg / Customizable */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input type="checkbox" checked={form.veg} onChange={e => setForm({ ...form, veg: e.target.checked })} />
              Vegetarian
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={form.customizable}
                onChange={e => setForm(prev => ({
                  ...prev,
                  customizable: e.target.checked,
                  customizationOptions: prev.customizationOptions.length ? prev.customizationOptions : [createEmptyOption()],
                }))}
              />
              Customizable
            </label>
          </div>

          {form.customizable ? (
            <div style={{ marginBottom: 16, border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fafaf9' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Customization setup</div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>Option group label</label>
                <input
                  type="text"
                  value={form.customizationGroupLabel}
                  onChange={e => setForm({ ...form, customizationGroupLabel: e.target.value })}
                  placeholder="Choose size"
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              {form.customizationOptions.map((option, index) => (
                <div key={`${index}-${option.id || 'new'}`} style={{ border: '1px solid #ece7df', borderRadius: 10, padding: 10, marginBottom: 10, background: '#fff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      value={option.label}
                      onChange={e => updateOption(index, 'label', e.target.value)}
                      placeholder="Label, e.g. Full"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
                    />
                    <input
                      type="text"
                      value={option.id}
                      onChange={e => updateOption(index, 'id', e.target.value)}
                      placeholder="Option id, e.g. full"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <input
                      type="number"
                      value={option.priceDelta}
                      onChange={e => updateOption(index, 'priceDelta', e.target.value)}
                      placeholder="Price change, e.g. 40"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
                    />
                    <input
                      type="text"
                      value={option.note}
                      onChange={e => updateOption(index, 'note', e.target.value)}
                      placeholder="Short note"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#78716c' }}>Examples: Full/Half, Small/Medium/Large</div>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      style={{ border: 'none', background: 'transparent', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addOption}
                style={{ width: '100%', border: '1px dashed #a8a29e', borderRadius: 10, padding: '10px 12px', background: '#fff', fontSize: 13, fontWeight: 700, color: '#57534e', cursor: 'pointer' }}
              >
                + Add customization option
              </button>
            </div>
          ) : null}

          <button
            onClick={handleSave}
            style={{ width: '100%', background: '#111111', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 14 }}
          >
            {editingId ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      )}

      {/* Filter by Category */}
      <div style={{ padding: '12px 12px 0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {['all', ...CATEGORIES.map(c => c.id)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              display: 'inline-block', marginRight: 8, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: filterCategory === cat ? '#111111' : '#fff',
              color: filterCategory === cat ? '#fff' : '#555',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {cat === 'all' ? 'All' : CATEGORIES.find(c => c.id === cat)?.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div style={{ padding: 12 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Loading...</p>
        ) : filtered.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', opacity: item.available ? 1 : 0.5 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {item.image && (
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, margin: 0, marginBottom: 2 }}>{item.name}</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#111111', flexShrink: 0 }}>₹{item.price}</span>
                      {item.old_price ? <span style={{ fontSize: 11, color: '#a8a29e', textDecoration: 'line-through' }}>₹{item.old_price}</span> : null}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#888', margin: 0, marginBottom: 6 }}>{item.category_id} • {item.veg ? '🟢 Veg' : '🔴 Non-veg'}</p>
                {item.customization?.options?.length ? <p style={{ fontSize: 11, color: '#7a6a58', margin: '0 0 6px' }}>{item.customization.groupLabel} • {item.customization.options.length} options</p> : null}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleEdit(item)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleToggle(item.id, item.available)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: item.available ? '#fff' : '#f5f5f5', cursor: 'pointer' }}>
                    {item.available ? '🔴 Hide' : '🟢 Show'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #d9d9d9', background: '#fff', color: '#222', cursor: 'pointer' }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

