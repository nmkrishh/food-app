import { useEffect, useMemo, useRef, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { normalizeMenuItem } from '../utils/menuItem';

function normalizeItems(menuItems) {
  return Object.entries(menuItems).flatMap(([categoryId, items]) =>
    items.map(item => normalizeMenuItem(item, categoryId))
  );
}

export default function SearchPageView({ menuItems, categories, cart, cartActions, onBack, onCategoryClick, onItemOpen, onInitialAdd, itemSelections }) {
  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const recognitionRef = useRef(null);

  const allItems = useMemo(() => normalizeItems(menuItems), [menuItems]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMessage('Listening...');
    };

    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0]?.transcript || '')
        .join(' ')
        .trim();

      if (transcript) {
        setQuery(transcript);
        setVoiceMessage(event.results[event.results.length - 1]?.isFinal ? 'Voice search added' : 'Hearing you...');
      }
    };

    recognition.onerror = event => {
      setIsListening(false);
      setVoiceMessage(event.error === 'not-allowed' ? 'Microphone permission blocked' : 'Voice search unavailable right now');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  function handleVoiceSearch() {
    if (!voiceSupported || !recognitionRef.current) {
      setVoiceMessage('Voice search is not supported on this device');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    setVoiceMessage('');
    recognitionRef.current.start();
  }

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter(item => {
      const matches = item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      return matches && (vegOnly ? item.isVeg : true);
    });
  }, [allItems, query, vegOnly]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 60%, #ededed 100%)', maxWidth: 480, margin: '0 auto', fontFamily: "'Mukta', sans-serif", paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '14px 16px 12px', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={iconBtn} aria-label="Back">
            <span className="material-symbols-outlined" style={{ fontSize: 25, lineHeight: 1 }}>
              arrow_back
            </span>
          </button>
          <div style={{ flex: 1, position: 'relative', height: 66, borderRadius: 999, background: '#242021', boxShadow: '0 12px 28px rgba(20,16,15,0.22), inset 0 1px 0 rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(28px) saturate(160%)', WebkitBackdropFilter: 'blur(28px) saturate(160%)' }}>
            <div style={{ position: 'absolute', left: 18, right: 78, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: 'rgba(255,245,235,0.72)', fontSize: 20, lineHeight: 1 }}>search</span>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dishes, drinks..." style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#f6f3ef' }} />
            </div>
            <button
              type="button"
              onClick={handleVoiceSearch}
              aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
              style={{
                position: 'absolute',
                right: query ? 58 : 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                background: isListening ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.14)',
                color: isListening ? '#111111' : '#f6f3ef',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 0 0 4px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, lineHeight: 1 }}>mic</span>
            </button>
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 36,
                  height: 36,
                  border: 'none',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.14)',
                  color: '#f6f3ef',
                  cursor: 'pointer',
                  fontSize: 15,
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button onClick={() => setVegOnly(v => !v)} style={{ ...iconBtn, fontSize: 14, width: 40, border: '1px solid rgba(98, 98, 98, 0.12)', boxShadow: 'rgba(255, 255, 255, 0.48) 0px 1px 0px inset, rgba(0, 0, 0, 0.27) 0px 6px 16px', borderRadius: '30%', backgroundColor: 'rgb(239 239 239)',  color: vegOnly ? '#1E832A' : '#393939' }}>VEG</button>
        </div>
        {voiceMessage ? (
          <div style={{ marginTop: 8, paddingLeft: 48, fontSize: 12, fontWeight: 600, color: isListening ? '#333333' : '#8a7868' }}>{voiceMessage}</div>
        ) : null}
      </div>

      {!query.trim() && (
        <div style={{ padding: '22px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#8a8a8a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Browse Categories</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {categories.slice(0, 6).map(cat => (
              <div key={cat.id} onClick={() => onCategoryClick(cat.id)} style={{ position: 'relative', height: 90, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 8px 20px rgba(100,70,40,0.12)' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,10,4,0.60) 0%, rgba(0,0,0,0.05) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, color: '#fff', fontWeight: 800, fontSize: 12, lineHeight: 1.3 }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '70px 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#666666', marginBottom: 8 }}>No results for "{query}"</div>
          <div style={{ fontSize: 13, color: '#8a8a8a' }}>Try a different keyword</div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ paddingTop: 6 }}>
          <div style={{ padding: '12px 20px 6px', fontSize: 12, color: '#8a8a8a', fontWeight: 600 }}>
            {results.length} results for <strong style={{ color: '#1e1810' }}>&quot;{query}&quot;</strong>
          </div>
          {results.map(item => (
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
      )}
    </div>
  );
}

const iconBtn = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: 'transparent',
  border: '0',
  boxShadow: '0',
  cursor: 'pointer',
};



