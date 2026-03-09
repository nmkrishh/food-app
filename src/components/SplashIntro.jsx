import { useEffect } from 'react';

export default function SplashIntro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(), 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 60%, #ededed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 900, color: '#1e1810', letterSpacing: 2 }}>Hahakla Shahruk</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#7a6a58', letterSpacing: 4 }}>SCAN AND ORDER</div>
      <div style={{ width: 140, height: 6, borderRadius: 99, background: 'rgba(200, 170, 120, 0.3)', overflow: 'hidden' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'left center',
            animation: 'splash-progress 1.7s ease-out forwards',
            background: 'linear-gradient(135deg, #ffbe3a 0%, #f2920a 100%)',
          }}
        />
      </div>
      <style>{`@keyframes splash-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}

