import { useEffect, useState } from 'react';
import { T } from '../theme';

export default function OrderSuccessPopup({ open, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const t = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setVisible(false), 350);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 700,
          background: 'rgba(20,14,8,0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) translateY(${open ? '-50%' : '-40%'})`,
          width: 'calc(100% - 48px)',
          maxWidth: 360,
          zIndex: 710,
          borderRadius: 28,
          background: 'rgba(252,249,245,0.99)',
          backdropFilter: T.blurXl,
          WebkitBackdropFilter: T.blurXl,
          border: T.border,
          boxShadow: '0 24px 80px rgba(100,70,40,0.22)',
          padding: '36px 28px 32px',
          textAlign: 'center',
          opacity: open ? 1 : 0,
          transition: 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
          pointerEvents: open ? 'auto' : 'none',
          fontFamily: T.font,
        }}
      >
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #111111 0%, #2E7D32 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(76,175,80,0.35)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div style={{ fontSize: 22, fontWeight: 900, color: T.text, marginBottom: 8 }}>Order Placed! 🎉</div>
        <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6, marginBottom: 6 }}>
          Your order has been sent to the kitchen.
          <br />
          Sit back and relax!
        </div>

        <div style={{ height: 1, background: T.borderWarm, margin: '20px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          <InfoItem icon="🍽️" label="Dine-in" />
          <InfoItem icon="⏱️" label="15-20 min" />
          <InfoItem icon="📋" label="Table Number" />
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '14px',
            borderRadius: T.radiusPill,
            border: 'none',
            background: T.accentGrad,
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: T.accentShadow,
            letterSpacing: 0.4,
          }}
        >
          Awesome, thanks!
        </button>
      </div>
    </>
  );
}

function InfoItem({ icon, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#666666' }}>{label}</span>
    </div>
  );
}

