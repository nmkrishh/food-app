export default function CafeFrontSections({ categories, activeCategory, onCategorySelect, showAllRecommended, onToggleRecommended }) {
  return (
    <div style={{ background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 60%, #ededed 100%)', paddingBottom: 14 }}>
      <div style={{ padding: '12px 20px 18px' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#1e1810', lineHeight: 1.2, fontFamily: "'Mukta', sans-serif" }}>
          What would you like
          <br />
          for today?
        </div>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', gap: 10, padding: '0 20px 20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                overflow: 'hidden',
                border: activeCategory === cat.id ? '3px solid #f2a20a' : '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 8px 22px rgba(100,70,40,0.12)',
              }}
            >
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#666666', textAlign: 'center', maxWidth: 62, lineHeight: 1.3 }}>
              {cat.name.split(' ').slice(0, 2).join(' ')}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 6px' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#1e1810', fontFamily: "'Mukta', sans-serif" }}>All Categories</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {categories.slice(0, 8).map(cat => (
            <div
              key={`grid-${cat.id}`}
              onClick={() => onCategorySelect(cat.id)}
              style={{
                position: 'relative',
                height: 120,
                borderRadius: 22,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(100,70,40,0.12)',
              }}
            >
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 12px 10px', background: 'linear-gradient(to top, rgba(20,12,4,0.65) 0%, transparent 100%)' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 12, lineHeight: 1.3 }}>{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={() => onCategorySelect('all')}
          style={{ textAlign: 'center', marginTop: 12, padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#f2a20a', cursor: 'pointer' }}
        >
          View all categories ›
        </div>
      </div>

      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: '#1e1810', fontFamily: "'Mukta', sans-serif" }}>Recommended</div>
        <span onClick={onToggleRecommended} style={{ fontSize: 13, fontWeight: 700, color: '#f2a20a', cursor: 'pointer' }}>{showAllRecommended ? 'View less' : 'View all'}</span>
      </div>
    </div>
  );
}




