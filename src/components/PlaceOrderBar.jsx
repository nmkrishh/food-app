export default function PlaceOrderBar({ totalQty, onClick }) {
  const visible = totalQty > 0;
  const label = totalQty === 1 ? 'Item' : 'Items';

  return (
    <div
      onClick={visible ? onClick : undefined}
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(110%)',
        width: '100%',
        maxWidth: 480,
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.5px',
        zIndex: 300,
        userSelect: 'none',
        transition: 'transform 0.3s',
        padding: '15px 20px',
        paddingBottom: 'calc(15px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(135deg, rgba(31,28,29,0.94) 0%, rgba(20,18,18,0.94) 100%)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -10px 28px rgba(20,16,15,0.28)',
        cursor: visible ? 'pointer' : 'default',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      PLACE ORDER ({totalQty} {label})
    </div>
  );
}
