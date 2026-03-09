const NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'fastfood', icon: 'fastfood', label: 'Menu' },
  { id: 'person', icon: 'person', label: 'Profile' },
];

export default function GlassBottomNav({ activeTab, onTabChange, orderBarVisible = false }) {
  const activeIndex = Math.max(0, NAV_ITEMS.findIndex(item => item.id === activeTab));
  const segment = 100 / NAV_ITEMS.length;

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: `calc(${orderBarVisible ? 80 : 10}px + env(safe-area-inset-bottom, 0px))`,
        width: 'calc(100% - 28px)',
        maxWidth: 430,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.65)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px) saturate(155%)',
        WebkitBackdropFilter: 'blur(20px) saturate(155%)',
        padding: 5,
        zIndex: 260,
        transition: 'bottom 220ms ease',
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 64 }}>
        <div
          style={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: `calc(${activeIndex * segment}% + 2px)`,
            width: `calc(${segment}% - 4px)`,
            borderRadius: 999,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(240,240,240,0.65) 100%)',
            border: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            transition: 'left 280ms cubic-bezier(0.2, 0.9, 0.2, 1)',
          }}
        />

        {NAV_ITEMS.map(item => {
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => onTabChange(item.id)}
              style={{
                position: 'relative',
                zIndex: 2,
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 34,
                  lineHeight: 1,
                  color: active ? '#1e56d8' : '#111111',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  transition: 'color 220ms ease, transform 220ms ease',
                  transform: active ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


