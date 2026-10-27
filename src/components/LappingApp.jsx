import React, { useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Copy } from 'lucide-react';

// ─── Presets ─────────────────────────────────────────
const PRESETS = {
  'Tricot (Closed)': {
    bars: 1,
    data: [{ notation: [1, 0, 1, 2], color: '#39FF14' }]
  },
  'Tricot (Open)': {
    bars: 1,
    data: [{ notation: [1, 0, 2, 3], color: '#39FF14' }]
  },
  'Atlas': {
    bars: 1,
    data: [{ notation: [1, 0, 1, 2, 2, 3, 2, 1], color: '#39FF14' }]
  },
  'Locknit': {
    bars: 2,
    data: [
      { notation: [1, 0, 1, 2], color: '#39FF14' },
      { notation: [2, 3, 2, 1], color: '#00FFFF' }
    ]
  },
  'Sharkskin': {
    bars: 2,
    data: [
      { notation: [1, 0, 2, 3], color: '#39FF14' },
      { notation: [2, 3, 1, 0], color: '#00FFFF' }
    ]
  },
  'Charmeuse': {
    bars: 2,
    data: [
      { notation: [1, 0, 1, 2], color: '#39FF14' },
      { notation: [1, 2, 1, 0], color: '#00FFFF' }
    ]
  }
};

const BAR_COLORS = ['#39FF14', '#00FFFF', '#FF1493', '#FFD700'];

// ─── Main Component ──────────────────────────────────
function LappingApp({ onNavigateHome }) {
  const [numNeedles, setNumNeedles] = useState(6);
  const [numCourses, setNumCourses] = useState(8);
  const [numBars, setNumBars] = useState(2);
  const [activeBar, setActiveBar] = useState(0);
  const [structureName, setStructureName] = useState('Custom');

  // Each guide bar has a notation array: sequence of needle positions
  const [bars, setBars] = useState([
    { notation: [1, 0, 1, 2], color: BAR_COLORS[0] },
    { notation: [2, 3, 2, 1], color: BAR_COLORS[1] },
  ]);

  const loadPreset = (name) => {
    const p = PRESETS[name];
    if (!p) return;
    setNumBars(p.bars);
    setBars(p.data.map((b, i) => ({ ...b, color: BAR_COLORS[i] || BAR_COLORS[0] })));
    setStructureName(name);
  };

  const updateNotation = (barIdx, text) => {
    const nums = text.split(/[\s,\-\/]+/).map(Number).filter(n => !isNaN(n));
    const newBars = [...bars];
    newBars[barIdx] = { ...newBars[barIdx], notation: nums };
    setBars(newBars);
    setStructureName('Custom');
  };

  const addBar = () => {
    if (numBars >= 4) return;
    setNumBars(numBars + 1);
    setBars([...bars, { notation: [0, 1], color: BAR_COLORS[bars.length] || '#ffffff' }]);
  };

  const removeBar = (idx) => {
    if (numBars <= 1) return;
    setNumBars(numBars - 1);
    const newBars = bars.filter((_, i) => i !== idx);
    setBars(newBars);
    if (activeBar >= newBars.length) setActiveBar(newBars.length - 1);
  };

  const clearAll = () => {
    setBars(bars.map(b => ({ ...b, notation: [] })));
    setStructureName('Custom');
  };

  // Generate formatted notation string
  const getNotationString = (notation) => {
    if (!notation || notation.length === 0) return '—';
    const pairs = [];
    for (let i = 0; i < notation.length; i += 2) {
      if (i + 1 < notation.length) {
        pairs.push(`${notation[i]}-${notation[i + 1]}`);
      } else {
        pairs.push(`${notation[i]}`);
      }
    }
    return pairs.join(' / ');
  };

  // Render the lapping diagram
  const renderDiagram = () => {
    const cellW = 40;
    const cellH = 40;
    const leftPad = 50;
    const topPad = 30;
    const svgW = leftPad + numNeedles * cellW + 20;
    const svgH = topPad + numCourses * cellH + 20;

    return (
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {/* Needle headers */}
        {Array.from({ length: numNeedles }).map((_, n) => (
          <text key={`nh-${n}`} x={leftPad + n * cellW + cellW / 2} y={topPad - 10} textAnchor="middle" fontSize="11" fill="var(--text-secondary)" fontFamily="var(--font-mono)">{n}</text>
        ))}

        {/* Course labels */}
        {Array.from({ length: numCourses }).map((_, c) => (
          <text key={`cl-${c}`} x={leftPad - 10} y={topPad + c * cellH + cellH / 2 + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)" fontFamily="var(--font-mono)">C{c + 1}</text>
        ))}

        {/* Grid lines */}
        {Array.from({ length: numCourses + 1 }).map((_, r) => (
          <line key={`hr-${r}`} x1={leftPad} y1={topPad + r * cellH} x2={leftPad + numNeedles * cellW} y2={topPad + r * cellH} stroke="var(--border)" strokeWidth="1" />
        ))}
        {Array.from({ length: numNeedles + 1 }).map((_, c) => (
          <line key={`vr-${c}`} x1={leftPad + c * cellW} y1={topPad} x2={leftPad + c * cellW} y2={topPad + numCourses * cellH} stroke="var(--border)" strokeWidth="1" />
        ))}

        {/* Needle dots */}
        {Array.from({ length: numNeedles }).map((_, n) =>
          Array.from({ length: numCourses }).map((_, c) => (
            <circle key={`dot-${n}-${c}`} cx={leftPad + n * cellW + cellW / 2} cy={topPad + c * cellH + cellH / 2} r="3" fill="var(--border-strong)" />
          ))
        )}

        {/* Lapping paths for each bar */}
        {bars.map((bar, barIdx) => {
          if (!bar.notation || bar.notation.length < 2) return null;
          const points = [];
          const notation = bar.notation;
          for (let course = 0; course < numCourses; course++) {
            const notIdx = course % notation.length;
            const needlePos = notation[notIdx];
            if (needlePos >= 0 && needlePos < numNeedles) {
              points.push({
                x: leftPad + needlePos * cellW + cellW / 2,
                y: topPad + course * cellH + cellH / 2
              });
            }
          }

          if (points.length < 2) return null;

          const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

          return (
            <g key={`bar-${barIdx}`}>
              <path d={pathData} stroke={bar.color} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={barIdx === activeBar ? 1 : 0.4} />
              {points.map((p, i) => (
                <circle key={`bp-${barIdx}-${i}`} cx={p.x} cy={p.y} r="5" fill={bar.color} opacity={barIdx === activeBar ? 1 : 0.4} />
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ padding: '4px 12px' }}>← Home</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>
            Lapping Diagram Editor
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="glass-panel" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }}>
            {structureName}
          </span>
        </div>
      </header>

      <div className="workspace-container">

        {/* Left Sidebar */}
        <div className="sidebar-left" style={{ width: '280px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>

          {/* Grid Settings */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Grid Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Needles</label>
                <input type="number" value={numNeedles} onChange={e => setNumNeedles(Math.max(2, Math.min(20, Number(e.target.value))))} style={{ width: '100%', padding: '6px 8px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Courses</label>
                <input type="number" value={numCourses} onChange={e => setNumCourses(Math.max(2, Math.min(24, Number(e.target.value))))} style={{ width: '100%', padding: '6px 8px', fontSize: '13px' }} />
              </div>
            </div>
            <button className="btn-secondary" onClick={clearAll} style={{ width: '100%', marginTop: '8px', fontSize: '11px', padding: '6px' }}>
              <RotateCcw size={12} /> Clear All
            </button>
          </div>

          {/* Guide Bars */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Guide Bars</h3>
              {numBars < 4 && (
                <button onClick={addBar} style={{ fontSize: '11px', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
              )}
            </div>

            {bars.map((bar, idx) => (
              <div key={idx} className="glass-panel" style={{
                padding: '12px', borderRadius: '10px', marginBottom: '8px',
                border: activeBar === idx ? `1px solid ${bar.color}` : '1px solid var(--border)',
                cursor: 'pointer'
              }} onClick={() => setActiveBar(idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: bar.color }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: bar.color }}>GB{idx + 1}</span>
                  </div>
                  {numBars > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeBar(idx); }} style={{ fontSize: '10px', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Notation (comma/space separated):</div>
                <input
                  type="text"
                  value={bar.notation.join(', ')}
                  onChange={e => updateNotation(idx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                  placeholder="e.g. 1, 0, 1, 2"
                />
                <div style={{ marginTop: '6px', fontSize: '11px', color: bar.color, fontFamily: 'var(--font-mono)' }}>
                  {getNotationString(bar.notation)}
                </div>
              </div>
            ))}
          </div>

          {/* Presets */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Presets</h3>
            {Object.keys(PRESETS).map(name => (
              <button key={name} onClick={() => loadPreset(name)} className="btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '12px', marginBottom: '4px', textAlign: 'left' }}>
                {name}
              </button>
            ))}
          </div>

          {/* Notation Summary */}
          <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Notation Summary</h3>
            {bars.map((bar, idx) => (
              <div key={idx} style={{ fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: bar.color }}>GB{idx + 1}:</span>{' '}
                <span style={{ color: 'var(--text-primary)' }}>{getNotationString(bar.notation)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="center-canvas" style={{ padding: '16px', display: 'block', overflowX: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--bg-grid)' }}>
          <div style={{ minWidth: 'min-content', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'inline-block' }}>
              {renderDiagram()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LappingApp;
