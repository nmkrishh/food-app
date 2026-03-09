import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FilterSheet({
  open,
  onClose,
  vegOn,
  nonvegOn,
  activeSort,
  activeSpicy,
  onApply,
  onClear,
}) {
  const [draftSort, setDraftSort] = useState(activeSort);
  const [draftSpicy, setDraftSpicy] = useState(activeSpicy);
  const [draftVeg, setDraftVeg] = useState(vegOn);
  const [draftNonveg, setDraftNonveg] = useState(nonvegOn);
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (!open) return;
    setDraftSort(activeSort);
    setDraftSpicy(activeSpicy);
    setDraftVeg(vegOn);
    setDraftNonveg(nonvegOn);
  }, [activeSort, activeSpicy, nonvegOn, open, vegOn]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }

    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [open]);

  const selectedCount = [draftSort, draftSpicy, draftVeg, draftNonveg].filter(Boolean).length;

  function handleClear() {
    setDraftSort(null);
    setDraftSpicy(false);
    setDraftVeg(false);
    setDraftNonveg(false);
  }

  function handleApply() {
    onApply({ sort: draftSort, spicy: draftSpicy, veg: draftVeg, nonveg: draftNonveg });
    onClose();
  }

  function handleResetAndApply() {
    setDraftSort(null);
    setDraftSpicy(false);
    setDraftVeg(false);
    setDraftNonveg(false);
    onClear();
    onClose();
  }

  function toggleSort(value) {
    setDraftSort(prev => (prev === value ? null : value));
  }

  function toggleDiet(type) {
    if (type === 'veg') {
      const next = !draftVeg;
      setDraftVeg(next);
      if (next) setDraftNonveg(false);
      return;
    }

    const next = !draftNonveg;
    setDraftNonveg(next);
    if (next) setDraftVeg(false);
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 420,
          transition: 'opacity 0.3s',
          background: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      <div
        onClick={event => event.stopPropagation()}
        style={{
          position: 'fixed',
          left: '50%',
          transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          zIndex: 450,
          display: 'flex',
          flexDirection: 'column',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transition: 'transform 350ms',
          maxHeight: '85vh',
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 -12px 36px rgba(0,0,0,0.14)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.3px', margin: 0 }}>Filters and Sorting</h2>
          <button type="button" onClick={onClose} style={{ cursor: 'pointer', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 22, border: 'none', background: 'transparent', color: '#1a1a1a', padding: 0 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
          <FilterSection title="Sort by">
            <FilterChip label="Price - low to high" selected={draftSort === 'low-high'} onClick={() => toggleSort('low-high')} />
            <FilterChip label="Price - high to low" selected={draftSort === 'high-low'} onClick={() => toggleSort('high-low')} />
          </FilterSection>

          <FilterSection title="Veg/Non-veg preference">
            <FilterChip selected={draftVeg} onClick={() => toggleDiet('veg')}>
              <span className="chip-icon veg-icon-box" /> Veg
            </FilterChip>
            <FilterChip selected={draftNonveg} onClick={() => toggleDiet('nonveg')}>
              <span className="chip-icon nonveg-icon-box" /> Non-veg
            </FilterChip>
          </FilterSection>

          <FilterSection title="Dietary preference">
            <FilterChip label="🌶️ Spicy" selected={draftSpicy} onClick={() => setDraftSpicy(prev => !prev)} />
          </FilterSection>

          <FilterSection title="Offers">
            <FilterChip>
              <span className="material-symbols-outlined" style={{ color: '#555', fontSize: 15 }}>local_offer</span> Items @ 50% OFF
            </FilterChip>
          </FilterSection>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
            borderTop: '1px solid rgba(224,224,224,0.6)',
            background: 'rgba(240,242,245,0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <button onClick={selectedCount > 0 ? handleClear : handleResetAndApply} style={{ background: 'transparent', border: 'none', fontSize: 14, fontWeight: 600, color: '#333', cursor: 'pointer', letterSpacing: '0.2px' }}>
            {selectedCount > 0 ? 'Clear Draft' : 'Reset All'}
          </button>
          <button onClick={handleApply} style={{ border: 'none', borderRadius: 12, padding: '12px 44px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', background: selectedCount > 0 ? '#333' : '#777', letterSpacing: '0.3px' }}>
            {selectedCount > 0 ? `Apply (${selectedCount})` : 'Apply'}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

function FilterSection({ title, children }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
}

function FilterChip({ label, children, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 14px',
        borderRadius: 999,
        fontSize: 13,
        color: '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: selected ? '1.5px solid #333' : '1.5px solid rgba(220,220,220,0.7)',
        background: selected ? 'rgba(240,240,240,0.8)' : 'rgba(255,255,255,0.6)',
        fontWeight: selected ? 600 : 500,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {children || label}
    </button>
  );
}

