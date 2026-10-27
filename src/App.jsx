import React, { useState } from 'react';
import KnitApp from './KnitApp';
import WovenApp from './woven/WovenApp';
import Dashboard from './Dashboard';
import DoubleJerseyApp from './components/DoubleJerseyApp';
import LappingApp from './components/LappingApp';
import YarnDyeApp from './components/YarnDyeApp';
import LandingPage from './LandingPage';
import { Lock } from 'lucide-react';

function App() {
  // Password check disabled for now
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [appMode, setAppMode] = useState('landing'); // 'landing', 'dashboard', 'home', 'knit', 'woven', 'doublejersey', 'lapping', 'yarndye', 'calculations'
  const [activeProject, setActiveProject] = useState(null);

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
          <img src="/logo.png" alt="WeaveX Logo" style={{ width: '120px', height: 'auto', maxHeight: '120px', objectFit: 'contain', marginBottom: '24px' }} />
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

  if (appMode === 'landing') {
    return (
      <LandingPage 
        onLaunchStudio={() => setAppMode('dashboard')} 
        onSelectTool={(tool) => {
          if (tool === 'calculations') {
            setAppMode('calculations');
          } else {
            setAppMode(tool);
          }
        }} 
      />
    );
  }

  if (appMode === 'knit') {
    return <KnitApp activeProject={activeProject} onNavigateHome={() => setAppMode('dashboard')} />;
  }

  if (appMode === 'woven') {
    return <WovenApp activeProject={activeProject} onNavigateHome={() => setAppMode('dashboard')} />;
  }

  if (appMode === 'doublejersey') {
    return <DoubleJerseyApp onNavigateHome={() => setAppMode('dashboard')} />;
  }

  if (appMode === 'lapping') {
    return <LappingApp onNavigateHome={() => setAppMode('dashboard')} />;
  }

  if (appMode === 'yarndye') {
    return <YarnDyeApp onNavigateHome={() => setAppMode('dashboard')} />;
  }

  return (
    <Dashboard 
      initialTab={appMode === 'calculations' ? 'calculations' : 'dashboard'}
      onSelectMode={setAppMode} 
      onOpenProject={(p) => {
        setActiveProject(p);
        setAppMode(p.type);
      }} 
    />
  );
}

export default App;
