import { useEffect, useMemo, useRef, useState } from 'react';
import { T } from '../theme';
import FoodCard from '../components/FoodCard';
import FilterSheet from '../components/FilterSheet';
import { normalizeMenuItem } from '../utils/menuItem';

function normalizeItems(items, categoryId) {
  return items.map(item => normalizeMenuItem(item, categoryId));
}

export default function CategoryPageView({ categories, menuItems, categoryId, cart, cartActions, onBack, onSearchOpen, onItemOpen, onInitialAdd, itemSelections }) {
  const [activeCategoryId, setActiveCategoryId] = useState(categoryId);
  const [activeSort, setActiveSort] = useState(null);
  const [activeSpicy, setActiveSpicy] = useState(false);
  const [vegOn, setVegOn] = useState(false);
  const [nonvegOn, setNonvegOn] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const lastScrollYRef = useRef(0);

  const currentItems = useMemo(() => normalizeItems(menuItems[activeCategoryId] || [], activeCategoryId), [activeCategoryId, menuItems]);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY || 0;
      const goingDown = currentY > lastScrollYRef.current;

      if (goingDown && currentY > 36) {
        setIsHeaderCompact(true);
      }

      if (!goingDown && (lastScrollYRef.current - currentY > 8 || currentY < 28)) {
        setIsHeaderCompact(false);
      }

      lastScrollYRef.current = currentY;
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = useMemo(() => {
    let items = [...currentItems];
    if (activeSpicy) {
      items = items.filter(item => {
        const text = `${item.name} ${item.desc}`.toLowerCase();
        return text.includes('spicy') || text.includes('chilli') || text.includes('chili') || item.name.includes('???');
      });
    }
    if (vegOn) items = items.filter(item => item.isVeg);
    if (nonvegOn) items = items.filter(item => !item.isVeg);
    if (activeSort === 'low-high') items = [...items].sort((a, b) => a.price - b.price);
    if (activeSort === 'high-low') items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [activeSort, activeSpicy, currentItems, nonvegOn, vegOn]);

  const selectedFilterCount = [activeSort, activeSpicy, vegOn, nonvegOn].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f2f2f2', paddingBottom: 100, fontFamily: T.font }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250, 250, 250, 0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 8px 18px rgba(96,72,44,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isHeaderCompact ? '10px 16px 9px' : '14px 16px 10px', transition: 'padding 220ms ease' }}>
          <button onClick={onBack} style={iconBtn} aria-label="Back">
            <span className="material-symbols-outlined" style={{ fontSize: 25, lineHeight: 1 }}>
              arrow_back
            </span>
          </button>

          <span style={{ fontSize: 15, fontWeight: 800, color: '#1e1810' }}>{categories.find(c => c.id === activeCategoryId)?.name || 'Category'}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onSearchOpen} style={searchBtn} aria-label="Open search">
              <span className="material-symbols-outlined" style={{ color: '#2d2926', fontSize: 26, lineHeight: 1 }}>search</span>
            </button>
          </div>
        </div>

        <div
          style={{
            maxHeight: isHeaderCompact ? 0 : 56,
            opacity: isHeaderCompact ? 0 : 1,
            transform: isHeaderCompact ? 'translateY(-8px)' : 'translateY(0)',
            overflow: 'hidden',
            transition: 'max-height 280ms ease, opacity 220ms ease, transform 220ms ease',
          }}
        >
          <div style={{ overflowX: 'auto', display: 'flex', scrollbarWidth: 'none', paddingBottom: 2 }}>
            {categories.map(cat => {
              const selected = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 14px 10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    borderBottom: selected ? `2.5px solid ${T.accent}` : '2.5px solid transparent',
                    fontWeight: selected ? 800 : 500,
                    fontSize: 12,
                    color: selected ? T.accent : T.textMuted,
                    fontFamily: T.font,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            maxHeight: isHeaderCompact ? 0 : 74,
            opacity: isHeaderCompact ? 0 : 1,
            transform: isHeaderCompact ? 'translateY(-8px)' : 'translateY(0)',
            overflow: 'hidden',
            transition: 'max-height 300ms ease, opacity 220ms ease, transform 220ms ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 12px 12px' }}>
            <PillButton onClick={() => setFilterOpen(true)} active={selectedFilterCount > 0}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#242021' }}>filter_list</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#000' }}>{selectedFilterCount > 0 ? `Filter (${selectedFilterCount})` : 'Filter'}</span>
            </PillButton>

            <PillButton>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: 55, height: 24, cursor: 'pointer', padding: '5px 10px' }}>
                <input
                  type="checkbox"
                  className="veg-checkbox"
                  checked={vegOn}
                  onChange={e => {
                    const checked = e.target.checked;
                    setVegOn(checked);
                    if (checked) setNonvegOn(false);
                  }}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="veg-slider" />
              </label>
            </PillButton>

            <PillButton>
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: 55, height: 24, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="nonveg-checkbox"
                  checked={nonvegOn}
                  onChange={e => {
                    const checked = e.target.checked;
                    setNonvegOn(checked);
                    if (checked) setVegOn(false);
                  }}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="nonveg-slider" />
              </label>
            </PillButton>

            <PillButton active={activeSpicy} onClick={() => setActiveSpicy(prev => !prev)}>
              <span style={{ fontWeight: 700, fontSize: 13, color: activeSpicy ? '#111111' : '#000' }}>??? Spicy</span>
            </PillButton>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 20px 6px' }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#1e1810' }}>{categories.find(c => c.id === activeCategoryId)?.name || 'Items'}</div>
        <div style={{ fontSize: 12, color: '#8a8a8a', marginTop: 3 }}>{filtered.length} items available</div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: '#999' }}>No items found</div>
      ) : (
        filtered.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            qty={cart[item.id] || 0}
            onAdd={() => onInitialAdd(item)}
            onIncrease={() => cartActions.inc(item.id)}
            onDecrease={() => cartActions.dec(item.id)}
            onImageClick={onItemOpen}
            selectedCustomization={itemSelections?.[item.id]}
          />
        ))
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        vegOn={vegOn}
        nonvegOn={nonvegOn}
        activeSort={activeSort}
        activeSpicy={activeSpicy}
        onApply={({ sort, spicy, veg, nonveg }) => {
          setActiveSort(sort);
          setActiveSpicy(spicy);
          setVegOn(veg);
          setNonvegOn(nonveg);
        }}
        onClear={() => {
          setActiveSort(null);
          setActiveSpicy(false);
          setVegOn(false);
          setNonvegOn(false);
        }}
      />

    </div>
  );
}

const iconBtn = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: 'transparent',
  border: '0',
  boxShadow: '0',
  cursor: 'pointer',
};

const searchBtn = {
  width: 58,
  height: 46,
  border: 'none',
  borderRadius: 999,
  background: 'transparent',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.48), 0 6px 16px rgba(0,0,0,0.22)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

function PillButton({ children, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        borderRadius: 999,
        cursor: 'pointer',
        width: 90,
        height: 38,
        padding: 0,
        background: active ? 'rgba(255,60,0,0.12)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: active ? '1.5px solid #111111' : '1px solid rgba(0,0,0,0.12)',
        boxShadow: '0 8px 18px rgba(96,72,44,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
      }}
    >
      {children}
    </button>
  );
}
