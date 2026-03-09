import { useEffect, useRef, useState } from 'react';
import { getItemPrice } from '../utils/menuItem';

export default function ConfirmOverlay({ open, onClose, cart, foodItems, onCartChange, onSlideComplete, itemSelections, onAddItem }) {
  const slideTrackRef = useRef(null);
  const slideThumbRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const thumbStartLeft = useRef(4);
  const [thumbLeft, setThumbLeft] = useState(4);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const cartItems = foodItems.filter(item => cart[item.id] > 0);
  const alsoLike = foodItems.filter(item => !cart[item.id]).slice(0, 8);

  useEffect(() => {
    if (open) setThumbLeft(4);
  }, [open]);

  function startDrag(e) {
    isDragging.current = true;
    setIsDraggingState(true);
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    thumbStartLeft.current = thumbLeft;
  }

  function onDrag(e) {
    if (!isDragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = clientX - dragStartX.current;
    const track = slideTrackRef.current;
    const thumb = slideThumbRef.current;
    if (!track || !thumb) return;

    const maxLeft = track.offsetWidth - thumb.offsetWidth - 4;
    const newLeft = Math.min(Math.max(4, thumbStartLeft.current + dx), maxLeft);
    setThumbLeft(newLeft);

    if (newLeft >= maxLeft - 4) finishSlide(maxLeft);
  }

  function cancelDrag() {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    setThumbLeft(4);
  }

  function finishSlide(maxLeft) {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    setThumbLeft(maxLeft);

    setTimeout(() => {
      if (onSlideComplete) onSlideComplete();
      else {
        onCartChange({});
        onClose();
      }
      setThumbLeft(4);
    }, 300);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0 auto 0 50%',
        width: '100%',
        maxWidth: 480,
        transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(245,245,245,0.88)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: open ? 'auto' : 'none',
        boxShadow: '0 0 40px rgba(20,16,15,0.2)',
      }}
      onMouseMove={onDrag}
      onTouchMove={onDrag}
      onMouseUp={cancelDrag}
      onTouchEnd={cancelDrag}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '13px 16px',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(232,232,232,0.6)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}
      >
        <span style={{ fontSize: 17, cursor: 'pointer', color: '#333', lineHeight: 1 }} onClick={onClose}>✕</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Confirm your order</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            marginBottom: 8,
            fontSize: 13,
            fontWeight: 500,
            color: '#1a1a1a',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <span>📱</span>
          <span>7705061575</span>
        </div>

        <div
          style={{
            marginBottom: 8,
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {cartItems.map(item => (
            <ConfirmItem
              key={item.id}
              item={item}
              qty={cart[item.id]}
              selectedCustomization={itemSelections?.[item.id]}
              onIncrease={() => onCartChange({ ...cart, [item.id]: cart[item.id] + 1 })}
              onDecrease={() => {
                const newQty = cart[item.id] - 1;
                const nextCart = { ...cart };
                if (newQty <= 0) delete nextCart[item.id];
                else nextCart[item.id] = newQty;
                if (Object.keys(nextCart).length === 0) onClose();
                onCartChange(nextCart);
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '13px 16px',
            marginBottom: 8,
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111111', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>%</div>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#111111' }}>Apply Store offer</span>
          <span style={{ color: '#111111', fontSize: 20, fontWeight: 700 }}>›</span>
        </div>

        {alsoLike.length > 0 && (
          <div
            style={{
              padding: '16px 0 16px 20px',
              marginBottom: 8,
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, paddingRight: 16 }}>▶ Based on your choice you might also like</div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingRight: 20, scrollbarWidth: 'none' }}>
              {alsoLike.map(item => (
                <AlsoLikeCard key={item.id} item={item} onAdd={() => (onAddItem ? onAddItem(item) : onCartChange({ ...cart, [item.id]: 1 }))} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(232,232,232,0.5)',
        }}
      >
        <div
          ref={slideTrackRef}
          style={{
            position: 'relative',
            background: '#1a1a1a',
            borderRadius: 999,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          <div
            ref={slideThumbRef}
            className={`slide-thumb ${isDraggingState ? 'dragging' : ''}`}
            style={{
              position: 'absolute',
              width: 44,
              height: 44,
              background: '#fff',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: '#1a1a1a',
              zIndex: 2,
              left: thumbLeft,
              letterSpacing: '-3px',
              paddingLeft: 3,
              transition: isDraggingState ? 'none' : 'left 0.3s ease',
            }}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
          >
            &gt;&gt;
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: 52, paddingRight: 10, pointerEvents: 'none' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>Slide to place order</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2, textAlign: 'center' }}>Order once placed cannot be cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmItem({ item, qty, onIncrease, onDecrease, selectedCustomization }) {
  const displayPrice = getItemPrice(item, selectedCustomization);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '13px 16px', gap: 10, borderBottom: '1px solid #f2f2f2' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
          <span className={item.isVeg ? 'veg-icon-sm' : 'nonveg-icon-sm'} />
          {item.name}
        </div>
        {selectedCustomization ? <div style={{ fontSize: 11, color: '#7a6a58', paddingLeft: 22, fontWeight: 700 }}>{selectedCustomization.label}</div> : null}
        <div style={{ fontSize: 12, color: '#555', paddingLeft: 22 }}>₹{displayPrice}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#888', fontSize: 11, marginTop: 3, cursor: 'pointer' }}>💬 Add cooking instructions</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, overflow: 'hidden', flexShrink: 0, alignSelf: 'center', border: '1.5px solid #111111' }}>
        <button onClick={onDecrease} style={{ background: '#111111', color: '#fff', width: 27, height: 27, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>−</button>
        <span style={{ width: 24, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#111111' }}>{qty}</span>
        <button onClick={onIncrease} style={{ background: '#111111', color: '#fff', width: 27, height: 27, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>+</button>
      </div>
    </div>
  );
}

function AlsoLikeCard({ item, onAdd }) {
  return (
    <div
      style={{
        minWidth: 118,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
        border: '1px solid rgba(232,232,232,0.6)',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
      }}
    >
      <img src={item.img} alt={item.name} style={{ width: '100%', height: 76, objectFit: 'cover' }} />
      <div style={{ padding: '6px 8px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>
          <span className={item.isVeg ? 'veg-icon-sm' : 'nonveg-icon-sm'} />
          {item.name}
        </div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>₹{item.price}</div>
        <button
          onClick={onAdd}
          style={{
            display: 'block',
            width: '100%',
            padding: '5px 0',
            fontSize: 11,
            fontWeight: 700,
            color: '#111111',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: 5,
            border: '1.5px solid rgba(17,17,17,0.55)',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
}


