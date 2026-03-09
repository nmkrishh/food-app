import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminLoginPage({ onSuccess, onBack }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!userId.trim() || !password) {
      setError('Enter your admin user ID and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      onSuccess(data);
    } catch (requestError) {
      setError('Unable to reach admin server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'linear-gradient(180deg, #f6efe7 0%, #efe3d5 100%)' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.92)', borderRadius: 28, padding: 24, boxShadow: '0 22px 60px rgba(75,49,26,0.18)', border: '1px solid rgba(143,95,53,0.12)' }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: '#666666', marginBottom: 10 }}>Owner Access</div>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, color: '#1f160f' }}>Admin login</h1>
        <p style={{ margin: '10px 0 22px', fontSize: 14, lineHeight: 1.6, color: '#6b5847' }}>This page is only for the owner. Customers can no longer open the admin panel from the home screen.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: '#5c4938' }}>Admin user ID</label>
            <input
              type="text"
              value={userId}
              onChange={event => setUserId(event.target.value)}
              placeholder="Owner user ID"
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: '#5c4938' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Owner password"
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error ? <div style={{ marginBottom: 12, fontSize: 12, color: '#c73c2f', fontWeight: 700 }}>{error}</div> : null}

          <button type="submit" disabled={loading} style={{ width: '100%', border: 'none', borderRadius: 16, padding: '14px 16px', fontSize: 15, fontWeight: 800, color: '#fff', background: loading ? '#6a6a6a' : 'linear-gradient(135deg, #2a2a2a 0%, #111111 100%)', cursor: loading ? 'wait' : 'pointer', boxShadow: '0 16px 28px rgba(0,0,0,0.2)' }}>
            {loading ? 'Checking access...' : 'Open admin panel'}
          </button>
        </form>

        <button type="button" onClick={onBack} style={{ marginTop: 14, width: '100%', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(125,67,33,0.16)', background: '#fff', color: '#5c4938', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Back to menu
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 14,
  border: '1px solid rgba(117,82,55,0.16)',
  padding: '13px 14px',
  fontSize: 14,
  background: '#fffdf9',
  outline: 'none',
};
