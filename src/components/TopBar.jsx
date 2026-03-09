import { createPortal } from 'react-dom';

export default function TopBar({ onSearchOpen }) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 100,
        height: 'calc(92px + env(safe-area-inset-top, 0px))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        
        
        background: 'transparent',
        
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 12,
          borderRadius: 999,
          width: 'calc(100% - 30px)',
          maxWidth: 400,
          height: 66,
          background: '#242021',
          boxShadow: '0 12px 28px rgba(20,16,15,0.22), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/logo.jpg"
          alt="Store"
          style={{
            width: 90,
            height: 60,
            objectFit: 'cover',
            display: 'block',
          }}
        />

        <button
          type="button"
          onClick={onSearchOpen}
          aria-label="Open search"
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 58,
            height: 46,
            border: 'none',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.85)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.48), 0 6px 16px rgba(0,0,0,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: '#2d2926', fontSize: 26, lineHeight: 1 }}
          >
            search
          </span>
        </button>
      </div>
    </div>,
    document.body
  );
}
