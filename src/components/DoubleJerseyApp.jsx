import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Layers, RotateCcw, Grid3X3 } from 'lucide-react';

// ─── Stitch Types ────────────────────────────────────
const STITCH = { KNIT: 'K', TUCK: 'T', MISS: 'M', EMPTY: '-' };

const STITCH_COLORS = {
  [STITCH.KNIT]: 'var(--accent-primary)',
  [STITCH.TUCK]: 'var(--accent-secondary)',
  [STITCH.MISS]: 'var(--miss-color)',
  [STITCH.EMPTY]: 'transparent'
};

const STITCH_LABELS = {
  [STITCH.KNIT]: 'K',
  [STITCH.TUCK]: 'T',
  [STITCH.MISS]: 'M',
  [STITCH.EMPTY]: '-'
};

// ─── Templates ───────────────────────────────────────
const TEMPLATES = {
  '1x1 Rib': {
    courses: 2, wales: 4,
    front: [
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
    ],
    back: [
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
    ]
  },
  '2x2 Rib': {
    courses: 2, wales: 8,
    front: [
      [STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY],
      [STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY],
    ],
    back: [
      [STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT],
      [STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT, STITCH.EMPTY, STITCH.EMPTY, STITCH.KNIT, STITCH.KNIT],
    ]
  },
  'Interlock': {
    courses: 2, wales: 4,
    front: [
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
    ],
    back: [
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
    ]
  },
  'Half Cardigan': {
    courses: 2, wales: 4,
    front: [
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
    ],
    back: [
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.EMPTY, STITCH.TUCK, STITCH.EMPTY, STITCH.TUCK],
    ]
  },
  'Full Cardigan': {
    courses: 2, wales: 4,
    front: [
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.TUCK, STITCH.EMPTY, STITCH.TUCK, STITCH.EMPTY],
    ],
    back: [
      [STITCH.EMPTY, STITCH.TUCK, STITCH.EMPTY, STITCH.TUCK],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
    ]
  },
  'Punto di Roma': {
    courses: 4, wales: 4,
    front: [
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
    ],
    back: [
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
      [STITCH.KNIT, STITCH.EMPTY, STITCH.KNIT, STITCH.EMPTY],
    ]
  }
};

const createEmptyGrid = (rows, cols) => Array.from({ length: rows }, () => Array(cols).fill(STITCH.EMPTY));

// ─── Main Component ──────────────────────────────────
function DoubleJerseyApp({ onNavigateHome }) {
  const [wales, setWales] = useState(8);
  const [courses, setCourses] = useState(4);
  const [currentStitch, setCurrentStitch] = useState(STITCH.KNIT);
  const [activeBed, setActiveBed] = useState('front'); // which bed clicks go to
  const [frontBed, setFrontBed] = useState(createEmptyGrid(4, 8));
  const [backBed, setBackBed] = useState(createEmptyGrid(4, 8));
  const [structureName, setStructureName] = useState('Custom');

  const toggleCell = (bed, r, c) => {
    const setBed = bed === 'front' ? setFrontBed : setBackBed;
    const grid = bed === 'front' ? frontBed : backBed;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === currentStitch ? STITCH.EMPTY : currentStitch;
    setBed(newGrid);
    setStructureName('Custom');
  };

  const loadTemplate = (name) => {
    const t = TEMPLATES[name];
    if (!t) return;
    setWales(t.wales);
    setCourses(t.courses);
    setFrontBed(t.front.map(r => [...r]));
    setBackBed(t.back.map(r => [...r]));
    setStructureName(name);
  };

  const clearAll = () => {
    setFrontBed(createEmptyGrid(courses, wales));
    setBackBed(createEmptyGrid(courses, wales));
    setStructureName('Custom');
  };

  const resizeGrids = () => {
    const resize = (old) => {
      const g = createEmptyGrid(courses, wales);
      for (let r = 0; r < Math.min(courses, old.length); r++)
        for (let c = 0; c < Math.min(wales, old[0]?.length || 0); c++)
          g[r][c] = old[r][c];
      return g;
    };
    setFrontBed(resize(frontBed));
    setBackBed(resize(backBed));
  };

  // Stats
  const allFront = frontBed.flat();
  const allBack = backBed.flat();
  const totalCells = allFront.length + allBack.length;
  const knitCount = allFront.filter(c => c === STITCH.KNIT).length + allBack.filter(c => c === STITCH.KNIT).length;
  const tuckCount = allFront.filter(c => c === STITCH.TUCK).length + allBack.filter(c => c === STITCH.TUCK).length;
  const missCount = allFront.filter(c => c === STITCH.MISS).length + allBack.filter(c => c === STITCH.MISS).length;

  const renderGrid = (grid, bedName) => (
    <div>
      <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center' }}>
        {bedName === 'front' ? '🔵 Front Bed (Cylinder)' : '🟠 Back Bed (Dial)'}
      </h4>
      {/* Column headers */}
      <div style={{ display: 'flex', gap: '1px', marginBottom: '2px', paddingLeft: '28px' }}>
        {Array.from({ length: wales }).map((_, c) => (
          <div key={c} style={{ width: 36, textAlign: 'center', fontSize: '9px', color: 'var(--text-secondary)', flexShrink: 0 }}>{c + 1}</div>
        ))}
      </div>
      {grid.map((row, r) => (
        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '1px', marginBottom: '1px' }}>
          <div style={{ width: 26, fontSize: '9px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>C{courses - r}</div>
          {row.map((cell, c) => (
            <div
              key={c}
              onClick={() => toggleCell(bedName, r, c)}
              role="button"
              tabIndex={0}
              style={{
                width: 36, height: 36,
                border: `1px solid ${cell !== STITCH.EMPTY ? STITCH_COLORS[cell] : 'var(--border-strong)'}`,
                background: cell !== STITCH.EMPTY ? `${STITCH_COLORS[cell]}22` : 'var(--bg-grid)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-mono)',
                color: cell !== STITCH.EMPTY ? STITCH_COLORS[cell] : 'var(--border)',
                transition: 'all 0.15s ease',
                borderRadius: '4px',
                flexShrink: 0,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {STITCH_LABELS[cell]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="app-container">

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ padding: '4px 12px' }}>← Home</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>
            <Layers size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Double Jersey Designer
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
        <div className="sidebar-left" style={{ width: '240px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Dimensions */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Dimensions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Wales</label>
                <input type="number" value={wales} onChange={e => setWales(Math.max(2, Number(e.target.value)))} style={{ width: '100%', padding: '6px 8px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Courses</label>
                <input type="number" value={courses} onChange={e => setCourses(Math.max(1, Number(e.target.value)))} style={{ width: '100%', padding: '6px 8px', fontSize: '13px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={resizeGrids} style={{ flex: 1, fontSize: '11px', padding: '6px' }}>Apply</button>
              <button className="btn-secondary" onClick={clearAll} style={{ flex: 1, fontSize: '11px', padding: '6px' }}><RotateCcw size={12} /> Clear</button>
            </div>
          </div>

          {/* Stitch Selector */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Stitch Type</h3>
            {[STITCH.KNIT, STITCH.TUCK, STITCH.MISS].map(s => (
              <button
                key={s}
                onClick={() => setCurrentStitch(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                  padding: '8px 12px', marginBottom: '4px', borderRadius: '8px',
                  border: currentStitch === s ? `1px solid ${STITCH_COLORS[s]}` : '1px solid var(--border)',
                  background: currentStitch === s ? `${STITCH_COLORS[s]}15` : 'transparent',
                  color: currentStitch === s ? STITCH_COLORS[s] : 'var(--text-primary)',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ width: 20, height: 20, borderRadius: '4px', background: `${STITCH_COLORS[s]}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: STITCH_COLORS[s] }}>{s}</span>
                {s === STITCH.KNIT ? 'Knit' : s === STITCH.TUCK ? 'Tuck' : 'Miss'}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Templates</h3>
            {Object.keys(TEMPLATES).map(name => (
              <button
                key={name}
                onClick={() => loadTemplate(name)}
                className="btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '12px', marginBottom: '4px', textAlign: 'left' }}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Statistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: STITCH_COLORS[STITCH.KNIT] }}>Knit</span>
                <span>{knitCount} ({totalCells > 0 ? Math.round(knitCount/totalCells*100) : 0}%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: STITCH_COLORS[STITCH.TUCK] }}>Tuck</span>
                <span>{tuckCount} ({totalCells > 0 ? Math.round(tuckCount/totalCells*100) : 0}%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: STITCH_COLORS[STITCH.MISS] }}>Miss</span>
                <span>{missCount} ({totalCells > 0 ? Math.round(missCount/totalCells*100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="center-canvas double-jersey-canvas" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', background: 'var(--bg-grid)' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}>
            {renderGrid(frontBed, 'front')}
          </div>
          <div className="dj-divider" style={{ width: '2px', background: 'var(--border)', alignSelf: 'stretch', borderRadius: '1px' }} />
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}>
            {renderGrid(backBed, 'back')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoubleJerseyApp;
