import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getItemPrice } from '../utils/menuItem';

export default function CustomizationSheet({ item, open, currentSelection, onClose, onConfirm }) {
  const [mounted, setMounted] = useState(open);
  const options = item?.customization?.options || [];
  const [selectedId, setSelectedId] = useState(currentSelection?.id || options[0]?.id || null);

  useEffect(() => {
    if (!open) return;
    setSelectedId(currentSelection?.id || options[0]?.id || null);
  }, [open, currentSelection, options]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }

    const timeoutId = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(timeoutId);
  }, [open]);

  const selectedOption = useMemo(
    () => options.find(option => option.id === selectedId) || options[0],
    [options, selectedId]
  );

  if (!mounted || !item) {
    return null;
  }

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 560,
          background: 'rgba(18,13,11,0.52)',
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
          maxHeight: '82vh',
          zIndex: 580,
          transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
          transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
          background: 'rgba(250,247,242,0.97)',
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 12px' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: '#7a7a7a' }}>Customize item</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900, color: '#1e1810' }}>{item.name}</div>
          </div>
          <button type="button" onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.82)', color: '#1e1810', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div style={{ padding: '0 18px 18px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, color: '#666666' }}>{item.customization?.groupLabel}</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {options.map(option => {
              const selected = option.id === selectedId;
              const optionPrice = getItemPrice(item, option);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedId(option.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    width: '100%',
                    padding: '14px 14px',
                    borderRadius: 18,
                    border: selected ? '1.5px solid #1e1810' : '1px solid rgba(210,195,178,0.36)',
                    background: selected ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.72)',
                    boxShadow: selected ? '0 10px 18px rgba(20,16,15,0.08)' : '0 4px 12px rgba(96,72,44,0.05)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1e1810' }}>{option.label}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#7a6a58' }}>{option.note}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1e1810' }}>₹{optionPrice}</div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: selected ? '6px solid #1e1810' : '2px solid rgba(125,108,92,0.46)', background: '#fff' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid rgba(210,195,178,0.3)', background: 'rgba(250,247,242,0.94)' }}>
          <button
            type="button"
            onClick={() => selectedOption && onConfirm(selectedOption)}
            disabled={!selectedOption}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 18,
              border: 'none',
              background: 'linear-gradient(135deg, #111111 0%, #111111 100%)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 0.2,
              cursor: selectedOption ? 'pointer' : 'not-allowed',
              boxShadow: '0 12px 24px rgba(0,0,0,0.18)',
              opacity: selectedOption ? 1 : 0.6,
            }}
          >
            Add for ₹{selectedOption ? getItemPrice(item, selectedOption) : item.price}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
