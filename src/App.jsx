import React, { useState } from 'react';
import KnitApp from './KnitApp';
import WovenApp from './woven/WovenApp';
import Home from './Home';
import { Lock } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [appMode, setAppMode] = useState('home'); // 'home', 'knit', 'woven'

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'FSD@2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-base)' }}>
        <div className="card" style={{ padding: '48px', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(91, 141, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <Lock size={32} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>Restricted Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>Please enter the password to access the WeaveX studio.</p>
          
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', fontSize: '16px', borderRadius: '8px', border: error ? '1px solid #ef4444' : '1px solid var(--border)', background: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none' }}
                autoFocus
              />
              {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{error}</p>}
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '16px', width: '100%', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
              Unlock Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (appMode === 'knit') {
    return <KnitApp onNavigateHome={() => setAppMode('home')} />;
  }

  if (appMode === 'woven') {
    return <WovenApp onNavigateHome={() => setAppMode('home')} />;
  }

  return <Home onSelectMode={setAppMode} />;
}

export default App;
