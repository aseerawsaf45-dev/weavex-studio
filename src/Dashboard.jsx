import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, HardDrive, ExternalLink, Settings, Home, FolderOpen, PieChart, Scissors, Trash2, Calculator, Layers, Grid3X3, Palette } from 'lucide-react';
import { getProjects, deleteProject } from './utils/projectStore';
import Calculations from './components/Calculations';

const Dashboard = ({ onSelectMode, onOpenProject }) => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if(confirm('Delete this project?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  return (
    <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-woven-body)' }}>
      
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ width: '280px', borderRight: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
          <img src="/logo.png" alt="WeaveX Logo" style={{ width: '52px', height: 'auto', maxHeight: '52px', objectFit: 'contain' }} />
          <h1 style={{ fontFamily: 'var(--font-woven-display)', fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>WeaveX</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: activeTab === 'dashboard' ? 'rgba(57, 255, 20, 0.1)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <Home size={18} />
            <span style={{ fontWeight: '500' }}>Dashboard</span>
          </button>

          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '16px 12px 6px', opacity: 0.6 }}>Design Tools</div>

          <button onClick={() => onSelectMode('woven')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <Scissors size={18} />
            <span style={{ fontWeight: '500' }}>Weave Design</span>
          </button>
          <button onClick={() => onSelectMode('knit')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <Grid3X3 size={18} />
            <span style={{ fontWeight: '500' }}>Knit Design</span>
          </button>
          <button onClick={() => onSelectMode('doublejersey')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <Layers size={18} />
            <span style={{ fontWeight: '500' }}>Double Jersey</span>
          </button>
          <button onClick={() => onSelectMode('lapping')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <FileText size={18} />
            <span style={{ fontWeight: '500' }}>Lapping Diagram</span>
          </button>

          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '16px 12px 6px', opacity: 0.6 }}>Utilities</div>

          <button onClick={() => setActiveTab('calculations')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: activeTab === 'calculations' ? 'rgba(57, 255, 20, 0.1)' : 'transparent', color: activeTab === 'calculations' ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'background 0.2s', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} className="hover-nav">
            <Calculator size={18} />
            <span style={{ fontWeight: '500' }}>Calculations</span>
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>Aseer Awsaf</div>
            <div style={{ color: 'var(--accent-primary)', fontSize: '12px' }}>Pro Plan</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main" style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Welcome back,</p>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'var(--font-display)', background: 'linear-gradient(to right, #ffffff, #39FF14)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aseer
            </h2>
          </div>
        </header>


        {/* Start New Grid */}
        {activeTab === 'dashboard' && (<section style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Create New</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div onClick={() => onSelectMode('woven')} className="glass-panel hover-card" style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(57, 255, 20, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>New WeaveDraft</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Start a 4-part woven structure</div>
              </div>
            </div>
            
            <div onClick={() => onSelectMode('knit')} className="glass-panel hover-card" style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(78, 255, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={24} color="var(--accent-treadle)" />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>New KnitCAD</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Start a grid-based knit pattern</div>
              </div>
            </div>

            <div onClick={() => onSelectMode('doublejersey')} className="glass-panel hover-card" style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 20, 147, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={24} color="#FF1493" />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Double Jersey</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Rib, Interlock & Cardigan structures</div>
              </div>
            </div>

            <div onClick={() => onSelectMode('lapping')} className="glass-panel hover-card" style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 215, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid3X3 size={24} color="#FFD700" />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Lapping Diagram</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Warp knitting guide bar lapping</div>
              </div>
            </div>
          </div>
        </section>)}

        {/* Recent Projects */}
        {activeTab === 'dashboard' && (<section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Projects</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {projects.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '24px' }}>No recent projects.</div>
            ) : projects.map(p => (
              <div key={p.id} onClick={() => onOpenProject(p)} className="glass-panel hover-card" style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: '160px', background: p.thumbnail ? `url(${p.thumbnail}) center/cover` : 'var(--bg-grid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!p.thumbnail && <Scissors size={32} color="var(--border)" />}
                </div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{p.name || 'Untitled'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{p.type === 'woven' ? 'WeaveDraft' : 'KnitCAD Pro'} • {new Date(p.lastEdited).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={(e) => handleDelete(e, p.id)} className="icon-btn hover-danger" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                    <button className="icon-btn" style={{ background: 'rgba(57, 255, 20, 0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', cursor: 'pointer' }}>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>)}

        {/* Calculations */}
        {activeTab === 'calculations' && (
          <section>
            <Calculations />
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
