import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Trash2, RotateCcw, Palette } from 'lucide-react';

// ─── Main Component ──────────────────────────────────
function YarnDyeApp({ onNavigateHome }) {
  const previewSize = 16; // px per cell in preview

  // Warp stripes: array of { color, count }
  const [warpStripes, setWarpStripes] = useState([
    { color: '#ffffff', count: 4 },
    { color: '#FF1493', count: 2 },
    { color: '#ffffff', count: 4 },
    { color: '#39FF14', count: 2 },
  ]);

  // Weft stripes: array of { color, count }
  const [weftStripes, setWeftStripes] = useState([
    { color: '#ffffff', count: 4 },
    { color: '#FF1493', count: 2 },
    { color: '#ffffff', count: 4 },
    { color: '#39FF14', count: 2 },
  ]);

  const [repeatCount, setRepeatCount] = useState(2);

  // Expand stripes to individual yarn arrays
  const expandStripes = (stripes) => {
    const result = [];
    stripes.forEach(s => {
      for (let i = 0; i < s.count; i++) result.push(s.color);
    });
    return result;
  };

  const warpYarns = useMemo(() => expandStripes(warpStripes), [warpStripes]);
  const weftYarns = useMemo(() => expandStripes(weftStripes), [weftStripes]);

  const totalEnds = warpYarns.length;
  const totalPicks = weftYarns.length;

  // Repeated yarns for preview
  const fullWarp = useMemo(() => {
    const r = [];
    for (let i = 0; i < repeatCount; i++) r.push(...warpYarns);
    return r;
  }, [warpYarns, repeatCount]);

  const fullWeft = useMemo(() => {
    const r = [];
    for (let i = 0; i < repeatCount; i++) r.push(...weftYarns);
    return r;
  }, [weftYarns, repeatCount]);

  // Stripe editor helpers
  const addStripe = (setter, stripes) => {
    setter([...stripes, { color: '#ffffff', count: 2 }]);
  };

  const removeStripe = (setter, stripes, idx) => {
    if (stripes.length <= 1) return;
    setter(stripes.filter((_, i) => i !== idx));
  };

  const updateStripe = (setter, stripes, idx, field, value) => {
    const newStripes = stripes.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setter(newStripes);
  };

  const renderStripeEditor = (label, stripes, setter) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</h3>
        <button onClick={() => addStripe(setter, stripes)} style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={12} /> Add
        </button>
      </div>
      {stripes.map((s, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <input
            type="color"
            value={s.color}
            onChange={e => updateStripe(setter, stripes, idx, 'color', e.target.value)}
            style={{ width: 32, height: 32, padding: 0, border: '2px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
          />
          <input
            type="number"
            value={s.count}
            onChange={e => updateStripe(setter, stripes, idx, 'count', Math.max(1, Number(e.target.value)))}
            style={{ width: '60px', padding: '6px 8px', fontSize: '12px' }}
            min="1"
          />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', flex: 1 }}>yarns</span>
          {stripes.length > 1 && (
            <button onClick={() => removeStripe(setter, stripes, idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        Total: {expandStripes(stripes).length} yarns in repeat
      </div>
    </div>
  );

  // Presets
  const loadPreset = (name) => {
    switch (name) {
      case 'Gingham':
        setWarpStripes([{ color: '#ffffff', count: 4 }, { color: '#3b82f6', count: 4 }]);
        setWeftStripes([{ color: '#ffffff', count: 4 }, { color: '#3b82f6', count: 4 }]);
        break;
      case 'Tartan':
        setWarpStripes([
          { color: '#1a1a8b', count: 6 }, { color: '#39FF14', count: 2 },
          { color: '#1a1a8b', count: 6 }, { color: '#FF1493', count: 2 },
        ]);
        setWeftStripes([
          { color: '#1a1a8b', count: 6 }, { color: '#39FF14', count: 2 },
          { color: '#1a1a8b', count: 6 }, { color: '#FF1493', count: 2 },
        ]);
        break;
      case 'Pinstripe':
        setWarpStripes([{ color: '#1a1a2e', count: 8 }, { color: '#ffffff', count: 1 }]);
        setWeftStripes([{ color: '#1a1a2e', count: 1 }]);
        break;
      case 'Madras':
        setWarpStripes([
          { color: '#FFD700', count: 4 }, { color: '#FF4500', count: 2 },
          { color: '#ffffff', count: 4 }, { color: '#228B22', count: 2 },
        ]);
        setWeftStripes([
          { color: '#FFD700', count: 4 }, { color: '#FF4500', count: 2 },
          { color: '#ffffff', count: 4 }, { color: '#228B22', count: 2 },
        ]);
        break;
      case 'Bengal Stripe':
        setWarpStripes([{ color: '#ffffff', count: 6 }, { color: '#00008B', count: 6 }]);
        setWeftStripes([{ color: '#ffffff', count: 1 }]);
        break;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ padding: '4px 12px' }}>← Home</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>
            <Palette size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Yarn Dye Pattern Designer
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Repeat: {totalEnds} ends × {totalPicks} picks</span>
        </div>
      </header>

      <div className="workspace-container">

        {/* Left Sidebar */}
        <div className="sidebar-left" style={{ width: '280px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>

          {/* Presets */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Presets</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Gingham', 'Tartan', 'Pinstripe', 'Madras', 'Bengal Stripe'].map(name => (
                <button key={name} onClick={() => loadPreset(name)} className="btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Warp Editor */}
          {renderStripeEditor('Warp Stripes (Vertical)', warpStripes, setWarpStripes)}

          {/* Weft Editor */}
          {renderStripeEditor('Weft Stripes (Horizontal)', weftStripes, setWeftStripes)}

          {/* Repeat Count */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Preview Repeats</h3>
            <input type="number" value={repeatCount} onChange={e => setRepeatCount(Math.max(1, Math.min(5, Number(e.target.value))))} style={{ width: '100%', padding: '6px 8px', fontSize: '13px' }} min="1" max="5" />
          </div>

          {/* Summary */}
          <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Repeat Summary</h3>
            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Ends in Repeat:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{totalEnds}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Picks in Repeat:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{totalPicks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Preview Size:</span>
                <span>{fullWarp.length} × {fullWeft.length}</span>
              </div>
            </div>
          </div>

          {/* Warp Color Bar Preview */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Warp Color Sequence</h3>
            <div style={{ display: 'flex', gap: '1px', flexWrap: 'wrap' }}>
              {warpYarns.map((c, i) => (
                <div key={i} style={{ width: 16, height: 16, background: c, borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="center-canvas" style={{ padding: '16px', display: 'block', overflowX: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--bg-grid)' }}>
          <div style={{ minWidth: 'min-content', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'inline-block', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            {fullWeft.map((weftColor, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {fullWarp.map((warpColor, c) => {
                  // Simple plain weave: alternate warp/weft visibility
                  const isWarpUp = (r + c) % 2 === 0;
                  const cellColor = isWarpUp ? warpColor : weftColor;
                  return (
                    <div
                      key={c}
                      style={{
                        width: previewSize,
                        height: previewSize,
                        background: cellColor,
                        borderRight: (c + 1) % totalEnds === 0 ? '1px solid rgba(57,255,20,0.3)' : 'none',
                        borderBottom: (r + 1) % totalPicks === 0 ? '1px solid rgba(57,255,20,0.3)' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default YarnDyeApp;
