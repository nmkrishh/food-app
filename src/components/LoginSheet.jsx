import { useEffect, useRef, useState } from 'react';
import { T } from '../theme';

const SAMPLE_OTP = '123456';

export default function LoginSheet({ open, onSuccess, onClose }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mounted, setMounted] = useState(false);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      const t = setTimeout(() => {
        setMounted(false);
        setStep('phone');
        setPhone('');
        setOtp(['', '', '', '', '', '']);
        setError('');
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [resendTimer]);

  const isValidPhone = phone.replace(/\D/g, '').length === 10;

  function sendOtp() {
    setError('');
    if (!isValidPhone) {
      setError('Enter a valid 10-digit WhatsApp number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }, 700);
  }

  function onOtpChange(value, idx) {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = clean;
    setOtp(next);
    setError('');
    if (clean && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function onOtpKeyDown(e, idx) {
    if (e.key !== 'Backspace') return;
    if (otp[idx]) {
      const next = [...otp];
      next[idx] = '';
      setOtp(next);
    } else if (idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }

  function verifyOtp() {
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (entered === SAMPLE_OTP) {
        onSuccess({ phone: phone.replace(/\D/g, '') });
      } else {
        setError('Incorrect OTP. Use 123456 for demo.');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
      }
    }, 600);
  }

  function resendOtp() {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
  }

  if (!mounted) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 600,
          background: 'rgba(20,14,8,0.55)',
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
          bottom: 0,
          transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
          width: '100%',
          maxWidth: 480,
          zIndex: 610,
          borderRadius: '28px 28px 0 0',
          background: 'rgba(252,249,245,0.99)',
          backdropFilter: T.blurXl,
          WebkitBackdropFilter: T.blurXl,
          border: T.border,
          boxShadow: '0 -20px 60px rgba(100,70,40,0.18)',
          transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
          paddingBottom: '40px',
          pointerEvents: open ? 'auto' : 'none',
          fontFamily: T.font,
        }}
      >
        <div style={{ width: 42, height: 4, borderRadius: 3, background: 'rgba(180,165,148,0.5)', margin: '14px auto 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', padding: '18px 22px 0', gap: 12 }}>
          {step === 'otp' && (
            <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }} style={btnCircle}>
              {'<'}
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>
              {step === 'phone' ? 'Almost there! 🛎️' : 'Enter OTP'}
            </div>
            <div style={{ fontSize: 13, color: T.textSub, marginTop: 3 }}>
              {step === 'phone' ? 'Verify your WhatsApp number to place order' : `Sent to +91 ${phone} via SMS`}
            </div>
          </div>
          <button onClick={onClose} style={btnCircle}>X</button>
        </div>

        <div style={{ padding: '24px 22px 0' }}>
          {step === 'phone' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>📱</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.textSub }}>WhatsApp Number</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', borderRadius: T.radiusSm, background: T.glassStrong, border: error ? '1.5px solid #E53935' : T.borderWarm, boxShadow: T.shadowSm, overflow: 'hidden' }}>
                <div style={{ padding: '14px 14px', borderRight: T.borderWarm, fontSize: 14, fontWeight: 700, color: T.textSub, background: 'rgba(210,195,178,0.18)', flexShrink: 0 }}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter' && isValidPhone) sendOtp(); }}
                  placeholder="98765 43210"
                  style={{ flex: 1, padding: '14px 14px', border: 'none', outline: 'none', background: 'transparent', fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: 1, fontFamily: T.font }}
                />
              </div>

              {error && <div style={{ fontSize: 12, color: '#E53935', marginTop: 8 }}>{error}</div>}

              <button onClick={sendOtp} disabled={loading || !isValidPhone} style={{ width: '100%', marginTop: 20, padding: '16px', borderRadius: T.radiusPill, border: 'none', background: isValidPhone ? T.accentGrad : 'rgba(180,165,148,0.4)', color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: 0.5, cursor: isValidPhone ? 'pointer' : 'not-allowed', boxShadow: isValidPhone ? T.accentShadow : 'none' }}>
                {loading ? 'Sending...' : 'Send OTP for Confirmation'}
              </button>

              <div style={{ fontSize: 11, color: T.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                You'll receive a one-time password on your number
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => onOtpChange(e.target.value, i)}
                    onKeyDown={e => onOtpKeyDown(e, i)}
                    style={{ width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 900, color: T.text, borderRadius: T.radiusSm, background: digit ? T.accentLight : T.glassStrong, border: error ? '1.5px solid #E53935' : digit ? `1.5px solid ${T.accent}55` : T.borderWarm, outline: 'none', boxShadow: digit ? T.accentShadow : T.shadowSm, transition: 'all 0.15s' }}
                  />
                ))}
              </div>

              {error && <div style={{ fontSize: 12, color: '#E53935', marginTop: 6, textAlign: 'center' }}>{error}</div>}

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                {resendTimer > 0 ? (
                  <span style={{ fontSize: 12, color: T.textMuted }}>Resend in <b style={{ color: T.accent }}>{resendTimer}s</b></span>
                ) : (
                  <span onClick={resendOtp} style={{ fontSize: 13, fontWeight: 700, color: T.accent, cursor: 'pointer' }}>Resend OTP</span>
                )}
              </div>

              <button onClick={verifyOtp} disabled={loading || otp.join('').length < 6} style={{ width: '100%', marginTop: 22, padding: '16px', borderRadius: T.radiusPill, border: 'none', background: otp.join('').length === 6 ? T.accentGrad : 'rgba(180,165,148,0.4)', color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: 0.5, cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed', boxShadow: otp.join('').length === 6 ? T.accentShadow : 'none' }}>
                {loading ? 'Verifying...' : 'Verify & Place Order'}
              </button>

              <div style={{ fontSize: 11, color: T.textMuted, textAlign: 'center', marginTop: 12 }}>
                Demo OTP: <b style={{ color: T.accent, letterSpacing: 2 }}>123456</b>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const btnCircle = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  background: 'rgba(30,25,20,0.06)',
  border: 'none',
  fontSize: 15,
  cursor: 'pointer',
  color: '#666666',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

