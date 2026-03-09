import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getItemPrice } from '../utils/menuItem';

export default function ItemDetailSheet({ item, open, qty, onClose, onAdd, onIncrease, onDecrease, selectedCustomization }) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }

    const timeoutId = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!mounted || !item) {
    return null;
  }

  const displayPrice = getItemPrice(item, selectedCustomization);

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 520,
          background: 'rgba(18, 13, 11, 0.54)',
          opacity: open ? 1 : 0,
          transition: 'opacity 280ms ease',
        }}
      />

      <div
        onClick={event => event.stopPropagation()}
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          maxHeight: '88vh',
          zIndex: 540,
          transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
          transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          background: 'rgba(250,247,242,0.96)',
          backdropFilter: 'blur(28px) saturate(170%)',
          WebkitBackdropFilter: 'blur(28px) saturate(170%)',
          boxShadow: '0 -18px 44px rgba(18,13,11,0.26)',
          border: '1px solid rgba(255,255,255,0.56)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 5, borderRadius: 999, background: 'rgba(114, 95, 80, 0.28)' }} />
        </div>

        <div style={{ position: 'relative', padding: 16, paddingBottom: 0 }}>
          <img
            src={item.img}
            alt={item.name}
            style={{ width: '100%', height: 248, borderRadius: 24, objectFit: 'cover', display: 'block', background: '#e9e3db' }}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close item details"
            style={{
              position: 'absolute',
              top: 28,
              right: 28,
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.86)',
              color: '#1e1810',
              boxShadow: '0 6px 14px rgba(18,13,11,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        </div>

        <div style={{ padding: '18px 18px 0', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className={`food-type-icon ${item.isVeg ? 'veg' : 'nonveg'}`} />
                {item.tag ? <span style={{ fontSize: 12, fontWeight: 700, color: '#7a6a58' }}>{item.tag}</span> : null}
              </div>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, fontWeight: 900, color: '#1e1810', margin: 0 }}>{item.name}</h2>
            </div>

            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1e1810' }}>₹{displayPrice}</div>
              {item.oldPrice ? <div style={{ marginTop: 4, fontSize: 13, color: '#a59585', textDecoration: 'line-through' }}>₹{item.oldPrice}</div> : null}
            </div>
          </div>

          {selectedCustomization ? (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(210,195,178,0.34)', fontSize: 12, fontWeight: 700, color: '#666666' }}>
              Selected: {selectedCustomization.label}
            </div>
          ) : null}

          <div style={{ marginTop: 18, borderRadius: 20, padding: '16px 16px 18px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(210,195,178,0.34)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: '#7a7a7a', marginBottom: 10 }}>About this item</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: '#4d4137' }}>{item.desc}</p>
          </div>

          <div style={{ marginTop: 16, marginBottom: 20, borderRadius: 20, padding: '16px 16px 18px', background: 'linear-gradient(135deg, rgba(255,190,58,0.12) 0%, rgba(255,255,255,0.58) 100%)', border: '1px solid rgba(230,190,107,0.26)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1e1810', marginBottom: 6 }}>Why you might like it</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: '#666666' }}>
              Rich flavor, full description, and the same quick add controls right inside the detail view.
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid rgba(210,195,178,0.3)', background: 'rgba(250,247,242,0.94)' }}>
          {qty > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', borderRadius: 14, border: '1.5px solid rgba(17,17,17,0.55)', background: 'rgba(255,255,255,0.9)' }}>
                <button type="button" onClick={onDecrease} style={qtyButtonStyle}>−</button>
                <div style={{ minWidth: 56, textAlign: 'center', fontSize: 15, fontWeight: 800, color: '#111111' }}>{qty}</div>
                <button type="button" onClick={onIncrease} style={qtyButtonStyle}>+</button>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, height: 48, borderRadius: 16, border: 'none', background: '#1e1810', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}
              >
                Added to cart
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              style={{ width: '100%', height: 52, borderRadius: 18, border: 'none', background: 'linear-gradient(135deg, #111111 0%, #111111 100%)', color: '#fff', fontSize: 15, fontWeight: 900, letterSpacing: 0.2, cursor: 'pointer', boxShadow: '0 12px 24px rgba(0,0,0,0.18)' }}
            >
              {item.customizable ? 'Choose options to add' : `Add item for ₹${displayPrice}`}
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

const qtyButtonStyle = {
  width: 42,
  height: 44,
  border: 'none',
  background: '#111111',
  color: '#fff',
  fontSize: 22,
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

