import React from 'react';

const Home = ({ onSelectMode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--text-primary)', marginBottom: '16px' }}>WeaveX</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '48px' }}>Select a textile design environment to begin.</p>
      
      <div style={{ display: 'flex', gap: '32px' }}>
        {/* KnitCAD Card */}
        <div 
          onClick={() => onSelectMode('knit')}
          className="card" 
          style={{ 
            width: '320px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(78, 255, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px', color: 'var(--accent-primary)' }}>●</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>KnitCAD Pro</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px', lineHeight: '1.5' }}>
            Weft-knitted fabric structure design. Design plain jersey, ribs, purls, and jacquards with Knit, Tuck, and Miss loops.
          </p>
        </div>

        {/* WeaveDraft Card */}
        <div 
          onClick={() => onSelectMode('woven')}
          className="card" 
          style={{ 
            width: '320px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: 'var(--bg-grid)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(91, 141, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 8px)', gap: '2px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--warp-up)' }}></div>
              <div style={{ width: '8px', height: '8px', border: '1px solid var(--weft-up)' }}></div>
              <div style={{ width: '8px', height: '8px', background: 'var(--warp-up)' }}></div>
              <div style={{ width: '8px', height: '8px', border: '1px solid var(--weft-up)' }}></div>
              <div style={{ width: '8px', height: '8px', background: 'var(--warp-up)' }}></div>
              <div style={{ width: '8px', height: '8px', border: '1px solid var(--weft-up)' }}></div>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-woven-display)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>WeaveDraft</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px', lineHeight: '1.5', fontFamily: 'var(--font-woven-body)' }}>
            Professional woven fabric drafting. Interactive threading, tie-up, treadling, and automatic drawdown computation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        © {new Date().getFullYear()} WeaveX. All rights reserved to Aseer Awsaf.
      </div>
    </div>
  );
};

export default Home;
