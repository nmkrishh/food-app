import { useState } from 'react';
import { ALL_CATEGORIES } from '../data/menudata';
import { T } from '../theme';

export default function CategoryTabs() {
  const [activeCat, setActiveCat] = useState('dessert');

  return (
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap');`}</style>

      <div style={{ overflowX:'auto', display:'flex', scrollbarWidth:'none', paddingBottom:2 }}>
        {ALL_CATEGORIES.map((cat) => {
          const isSel = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                flexShrink:0,
                padding:'8px 14px 10px',
                background:'none',
                border:'none',
                cursor:'pointer',
                whiteSpace:'nowrap',
                borderBottom: isSel ? `2.5px solid ${T.accent}` : '2.5px solid transparent',
                fontWeight: isSel ? 800 : 500,
                fontSize:12,
                color: isSel ? T.accent : T.textMuted,
                fontFamily:T.font,
                transition:'all 0.18s',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
