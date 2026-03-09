import { useMemo, useState } from 'react';
import CafeFrontSections from '../components/CafeFrontSections';
import TopBar from '../components/TopBar';
import FilterSheet from '../components/FilterSheet';
import FoodCard from '../components/FoodCard';
import { normalizeMenuItem } from '../utils/menuItem';

function normalizeItems(items, categoryId) {
  return items.map(item => normalizeMenuItem(item, categoryId));
}

export default function HomePage({ categories, menuItems, popularItems, cart, cartActions, onCategoryClick, onSearchOpen, onItemOpen, onInitialAdd, itemSelections }) {
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [activeSort, setActiveSort] = useState(null);
  const [activeSpicy, setActiveSpicy] = useState(false);
  const [vegOn, setVegOn] = useState(false);
  const [nonvegOn, setNonvegOn] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const allItems = useMemo(() => Object.entries(menuItems).flatMap(([categoryId, items]) => normalizeItems(items, categoryId)), [menuItems]);
  const popularIds = useMemo(() => new Set(popularItems.map(item => String(item.id))), [popularItems]);

  const visibleItems = useMemo(() => {
    let items = showAllRecommended ? [...allItems] : allItems.filter(item => popularIds.has(String(item.id)));

    if (activeSpicy) {
      items = items.filter(item => {
        const text = `${item.name} ${item.desc}`.toLowerCase();
        return text.includes('spicy') || text.includes('chilli') || text.includes('chili') || item.name.includes('🌶️');
      });
    }
    if (vegOn) items = items.filter(item => item.isVeg);
    if (nonvegOn) items = items.filter(item => !item.isVeg);

    if (activeSort === 'low-high') items = [...items].sort((a, b) => a.price - b.price);
    if (activeSort === 'high-low') items = [...items].sort((a, b) => b.price - a.price);

    return items;
  }, [activeSort, activeSpicy, allItems, nonvegOn, popularIds, showAllRecommended, vegOn]);

  return (
    <div className="mobile-content" style={{ paddingTop: 'calc(102px + env(safe-area-inset-top, 0px))', paddingBottom: 100 }}>
      <TopBar onSearchOpen={onSearchOpen} />

      <CafeFrontSections
        categories={categories}
        activeCategory={'all'}
        onCategorySelect={id => onCategoryClick(id)}
        showAllRecommended={showAllRecommended}
        onToggleRecommended={() => setShowAllRecommended(v => !v)}
      />

      <div>
        {visibleItems.map(item => (
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
        ))}
      </div>

      <div style={{ margin: '12px 16px 0', padding: '20px', borderRadius: '22px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e1810', marginBottom: '8px', fontFamily: "'Mukta', sans-serif" }}>Hahakla Bhojnalaya</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <div style={{ fontSize: '12px', color: '#7a6a58', lineHeight: 1.65, fontFamily: "'Mukta', sans-serif" }}>1, 158, Hakla Rd, Hahakla Nagar, Lucknow</div>
        </div>
      </div>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        vegOn={vegOn}
        nonvegOn={nonvegOn}
        onVegChange={setVegOn}
        onNonvegChange={setNonvegOn}
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


