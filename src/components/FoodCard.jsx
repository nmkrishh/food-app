import { useState } from 'react';
import { getItemPrice } from '../utils/menuItem';

export default function FoodCard({ item, qty, onAdd, onIncrease, onDecrease, onImageClick, selectedCustomization }) {
  const [expanded, setExpanded] = useState(false);
  const isOverflow = item.desc.length > 55; // rough threshold
  const displayPrice = getItemPrice(item, selectedCustomization);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px 14px',
        borderBottom: '1px solid rgba(204,204,204,0.45)',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Left */}
      <div style={{ flex: 1, paddingRight: 12, display: 'flex', flexDirection: 'column' }}>
        <span className={`food-type-icon ${item.isVeg ? 'veg' : 'nonveg'}`} style={{ marginBottom: 6 }} />

        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', margin: '0 0 5px' }}>{item.name}</h3>

        {item.tag && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span style={{ width: 22, height: 6, borderRadius: 4, background: '#111111' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#666' }}>{item.tag}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>₹{displayPrice}</span>
          {item.oldPrice && (
            <span style={{ fontSize: 12, fontWeight: 500, color: '#999', textDecoration: 'line-through' }}>₹{item.oldPrice}</span>
          )}
        </div>

        {selectedCustomization ? (
          <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, color: '#7a6a58' }}>{selectedCustomization.label}</div>
        ) : null}

        <p className={`food-desc-clamp ${expanded ? 'expanded' : ''}`} style={{ fontSize: 12, color: '#555', lineHeight: 1.4, margin: '0 0 4px' }}>
          {item.desc}
        </p>
        {isOverflow && (
          <span
            style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer', marginBottom: 8, display: 'inline-block' }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'less' : 'more'}
          </span>
        )}
      </div>

      {/* Right */}
      <div style={{ width: 118, minWidth: 118, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 118, height: 142, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => onImageClick?.(item)}
            aria-label={`Open details for ${item.name}`}
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', borderRadius: 12 }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{ width: 118, height: 118, borderRadius: 12, objectFit: 'cover', background: '#e8e8e8', display: 'block' }}
            />
          </button>

          {qty === 0 ? (
            <button
              onClick={event => {
                event.stopPropagation();
                onAdd();
              }}
              style={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 13,
                fontWeight: 700,
                color: '#111111',
                borderRadius: 8,
                padding: '6px 20px',
                whiteSpace: 'nowrap',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(17,17,17,0.55)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            >
              ADD <span style={{ fontSize: 12, fontWeight: 700, color: '#111111' }}>+</span>
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                minWidth: 94,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(17,17,17,0.55)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              }}
            >
              <button
                onClick={event => {
                  event.stopPropagation();
                  onDecrease();
                }}
                style={{ background: '#111111', color: '#fff', width: 30, height: 30, fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none' }}
              >−</button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#111111', padding: '0 4px' }}>{qty}</span>
              <button
                onClick={event => {
                  event.stopPropagation();
                  onIncrease();
                }}
                style={{ background: '#111111', color: '#fff', width: 30, height: 30, fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none' }}
              >+</button>
            </div>
          )}
        </div>

        <span style={{ fontSize: 11, fontWeight: 500, color: '#888', marginTop: 2, textAlign: 'center' }}>{item.customizable ? 'customisable' : '\u00a0'}</span>
      </div>
    </div>
  );
}

