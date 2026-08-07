import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { wovenTemplates, getTemplateCategories } from './utils/wovenTemplatesData';

const WovenToolbar = ({
  mode, setMode,
  warpEnds, setWarpEnds,
  weftPicks, setWeftPicks,
  numShafts, setNumShafts,
  numTreadles, setNumTreadles,
  resizeDraft, clearDraft,
  colorSim, setColorSim,
  loadTemplate,
  warpColors, setWarpColors,
  weftColors, setWeftColors,
  selectedColor, setSelectedColor
}) => {
  const categories = getTemplateCategories();
  const [openCategory, setOpenCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const PALETTE = ['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const filteredTemplates = wovenTemplates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', fontFamily: 'var(--font-woven-body)' }}>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Grid Size</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Warp Ends</label>
            <input 
              type="number" value={warpEnds} onChange={(e) => setWarpEnds(Math.min(64, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="64" style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Weft Picks</label>
            <input 
              type="number" value={weftPicks} onChange={(e) => setWeftPicks(Math.min(64, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="64" style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Shafts</label>
            <input 
              type="number" value={numShafts} onChange={(e) => setNumShafts(Math.min(16, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="16" style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Treadles</label>
            <input 
              type="number" value={numTreadles} onChange={(e) => setNumTreadles(Math.min(16, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="16" style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={resizeDraft}>
          Resize Draft
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Simulation</h3>
        <button 
          className="btn-secondary" 
          style={{ 
            width: '100%', 
            borderColor: colorSim ? 'var(--accent-primary)' : 'var(--border)',
            color: colorSim ? 'var(--accent-primary)' : 'var(--text-primary)',
            marginBottom: colorSim ? '16px' : '0'
          }} 
          onClick={() => setColorSim(!colorSim)}
        >
          {colorSim ? 'Disable Color Sim' : 'Enable Color Sim'}
        </button>

        {colorSim && (
          <div className="slide-fade-in" style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Select Yarn Color</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {PALETTE.map(color => (
                <div 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    height: '24px',
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
              Click directly on the cells in the Drawdown grid, or on the column/row headers, to paint the warp and weft yarns.
            </p>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Templates</h3>
        <input 
          type="text" 
          placeholder="Search weaves..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '12px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {searchQuery ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredTemplates.length > 0 ? filteredTemplates.map(t => (
                <button 
                  key={t.name}
                  className="btn-secondary"
                  onClick={() => loadTemplate(t)}
                  style={{ textAlign: 'left', fontSize: '11px', padding: '6px 8px', background: 'var(--bg-elevated)' }}
                >
                  • {t.name}
                </button>
              )) : (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '8px' }}>No matches</div>
              )}
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat}>
                <button 
                  style={{ 
                    width: '100%', textAlign: 'left', padding: '8px', background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                  onClick={() => setOpenCategory(openCategory === cat ? null : cat)}
                >
                  {cat} {openCategory === cat ? '▼' : '▶'}
                </button>
                {openCategory === cat && (
                  <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {wovenTemplates.filter(t => t.category === cat).map(t => (
                      <button 
                        key={t.name}
                        className="btn-secondary"
                        onClick={() => loadTemplate(t)}
                        style={{ textAlign: 'left', fontSize: '11px', padding: '6px 8px', border: 'none', background: 'transparent' }}
                      >
                        • {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button className="btn-secondary" style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={clearDraft}>
          Clear All
        </button>
      </div>

    </div>
  );
};

export default WovenToolbar;
