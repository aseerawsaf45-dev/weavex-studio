import React, { useState, useEffect } from 'react';
import WovenToolbar from './WovenToolbar';
import WovenIntelligence from './WovenIntelligence';
import { CELL_STATE, computeLiftDrawdown, convertToLiftPlan, createEmptyGrid } from './utils/weaveMath';
import { detectRepeatSize, analyzeFloats, detectWeaveStructure } from './utils/weaveDetection';
import { exportWIF } from './utils/weaveExport';
import { wovenTemplates } from './utils/wovenTemplatesData';
import { Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

const Cell = ({ filled, onClick, size = 28 }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size,
        background: 'var(--bg-grid)',
        border: '1px solid var(--border-strong)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)',
        fontSize: size * 0.6 + 'px',
        fontWeight: 'bold',
        userSelect: 'none'
      }}
    >
      {filled ? 'X' : ''}
    </div>
  );
};

// ─── Drafting Grid (Threading: shafts × warp ends) ───────────────────────────
const DraftingGrid = ({ threading, setThreading, numShafts, warpEnds }) => {
  const toggle = (s, c) => {
    const next = threading[s][c] === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
    const newTh = threading.map(row => [...row]);
    // Each warp end can only be on ONE shaft
    for (let i = 0; i < numShafts; i++) newTh[i][c] = CELL_STATE.EMPTY;
    newTh[s][c] = next;
    setThreading(newTh);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-shaft)', marginBottom: '8px' }}>
        2 · Drafting Plan
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
        Shafts × Warp Ends — which shaft each warp thread passes through
      </div>
      {/* Column headers */}
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: '32px' }}>
        {Array.from({ length: warpEnds }, (_, c) => (
          <div key={c} style={{ width: 28, textAlign: 'center', fontSize: '9px', color: 'var(--text-secondary)' }}>{c + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {threading.map((row, s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: 28, fontSize: '9px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>S{numShafts - s}</div>
            {row.map((cell, c) => (
              <Cell
                key={c}
                filled={cell === CELL_STATE.MARKED}
                onClick={() => toggle(s, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Lifting Plan Grid (Peg Plan: weft picks × shafts) ───────────────────────
const LiftingGrid = ({ liftPlan, setLiftPlan, numShafts, weftPicks }) => {
  const toggle = (p, s) => {
    const next = liftPlan[p][s] === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
    const newLp = liftPlan.map(row => [...row]);
    newLp[p][s] = next;
    setLiftPlan(newLp);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-treadle)', marginBottom: '8px' }}>
        3 · Lifting Plan (Peg Plan)
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
        Weft Picks × Shafts — which shafts are raised on each pick
      </div>
      {/* Column headers (Shafts) */}
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: '32px' }}>
        {Array.from({ length: numShafts }, (_, s) => (
          <div key={s} style={{ width: 28, textAlign: 'center', fontSize: '9px', color: 'var(--text-secondary)' }}>S{s + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {liftPlan.map((row, p) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: 28, fontSize: '9px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>P{weftPicks - p}</div>
            {row.map((cell, s) => (
              <Cell
                key={s}
                filled={cell === CELL_STATE.MARKED}
                onClick={() => toggle(p, s)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Weaving Plan Grid (Drawdown: weft picks × warp ends) ────────────────────
const WeavingGrid = ({ drawdown, setDrawdown, warpEnds, weftPicks }) => {
  const toggle = (r, c) => {
    const next = drawdown[r][c] === CELL_STATE.WARP_UP ? CELL_STATE.WEFT_UP : CELL_STATE.WARP_UP;
    const newDd = drawdown.map(row => [...row]);
    newDd[r][c] = next;
    setDrawdown(newDd);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--warp-up)', marginBottom: '8px' }}>
        1 · Weaving Plan
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
        Weft Picks × Warp Ends — manually draw your final interlacement here
      </div>
      {/* Column headers */}
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: '32px' }}>
        {Array.from({ length: warpEnds }, (_, c) => (
          <div key={c} style={{ width: 32, textAlign: 'center', fontSize: '9px', color: 'var(--text-secondary)' }}>{c + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {drawdown.map((row, r) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: 28, fontSize: '9px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>P{weftPicks - r}</div>
            {row.map((cell, c) => (
              <div
                key={c}
                onClick={() => toggle(r, c)}
                style={{
                  width: 32, height: 32,
                  background: 'var(--bg-grid)',
                  border: '1px solid var(--border-strong)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              >
                {cell === CELL_STATE.WARP_UP ? 'X' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main WovenApp ────────────────────────────────────────────────────────────
function WovenApp({ onNavigateHome }) {
  const initialTemplate = wovenTemplates[0];

  const [warpEnds, setWarpEnds] = useState(initialTemplate.warpEnds);
  const [weftPicks, setWeftPicks] = useState(initialTemplate.weftPicks);
  const [numShafts, setNumShafts] = useState(initialTemplate.numShafts);
  const [numTreadles, setNumTreadles] = useState(initialTemplate.numTreadles);
  const [showHelp, setShowHelp] = useState(false);
  const [colorSim, setColorSim] = useState(false);

  // Three entirely independent editable grids!
  const [threading, setThreading] = useState(() => createEmptyGrid(initialTemplate.numShafts, initialTemplate.warpEnds));
  const [liftPlan, setLiftPlan] = useState(() => createEmptyGrid(initialTemplate.weftPicks, initialTemplate.numShafts));
  const [drawdown, setDrawdown] = useState(() => createEmptyGrid(initialTemplate.weftPicks, initialTemplate.warpEnds));

  // Intelligence State
  const [structureName, setStructureName] = useState('');
  const [confidence, setConfidence] = useState(100);
  const [classification, setClassification] = useState('Balanced');
  const [repeatUnit, setRepeatUnit] = useState({ width: 0, height: 0, unit: null });
  const [maxWarpFloat, setMaxWarpFloat] = useState(0);
  const [maxWeftFloat, setMaxWeftFloat] = useState(0);

  // Detect weave structure from drawdown
  useEffect(() => {
    if (drawdown && drawdown.length > 0 && drawdown[0].length > 0) {
      const repeat = detectRepeatSize(drawdown);
      setRepeatUnit(repeat);
      const detection = detectWeaveStructure(drawdown, repeat.width, repeat.height);
      setStructureName(detection.name);
      setConfidence(detection.confidence);
      setClassification(detection.classification);
      const floats = analyzeFloats(drawdown);
      setMaxWarpFloat(floats.maxWarpFloat);
      setMaxWeftFloat(floats.maxWeftFloat);
    }
  }, [drawdown]);

  const resizeDraft = () => {
    const preserve = (old, rows, cols) => {
      const next = createEmptyGrid(rows, cols);
      for (let r = 0; r < Math.min(rows, old.length); r++)
        for (let c = 0; c < Math.min(cols, old[0]?.length ?? 0); c++)
          next[r][c] = old[r][c];
      return next;
    };
    setThreading(preserve(threading, numShafts, warpEnds));
    setLiftPlan(preserve(liftPlan, weftPicks, numShafts));
    setDrawdown(preserve(drawdown, weftPicks, warpEnds));
  };

  const clearDraft = () => {
    setThreading(createEmptyGrid(numShafts, warpEnds));
    setLiftPlan(createEmptyGrid(weftPicks, numShafts));
    setDrawdown(createEmptyGrid(weftPicks, warpEnds));
  };

  const handleExportWIF = () => {
    // Basic export assumes classic 4-part structure, we fallback tieup to an empty one or adapt exportWIF later.
    const tieup = createEmptyGrid(numShafts, numTreadles);
    const treadling = createEmptyGrid(weftPicks, numTreadles);
    exportWIF({ threading, tieup, treadling, drawdown, warpEnds, weftPicks, numShafts, numTreadles, sett: 20, ppi: 20 });
  };

  const handleExportPNG = async () => {
    const element = document.getElementById('woven-export-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#10131E', // Match --bg-grid
        scale: 2 // High resolution
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `weave-draft-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG', err);
    }
  };

  const loadTemplate = (template) => {
    setWarpEnds(template.warpEnds);
    setWeftPicks(template.weftPicks);
    setNumShafts(template.numShafts);
    setNumTreadles(template.numTreadles);
    setThreading(template.threading);
    
    // Convert template tieup/treadling into Peg Plan
    const newLiftPlan = convertToLiftPlan(template.tieup, template.treadling);
    setLiftPlan(newLiftPlan);
    
    // Auto-populate the initial Drawdown from the template math
    const newDrawdown = computeLiftDrawdown(template.threading, newLiftPlan);
    setDrawdown(newDrawdown);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ padding: '4px 12px' }}>← Home</button>
          <h1 style={{ fontFamily: 'var(--font-woven-display)', color: 'var(--accent-primary)', fontSize: '22px', margin: 0 }}>WeaveDraft</h1>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Professional Drafting Studio</span>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={handleExportPNG} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <ImageIcon size={14} /> Export PNG
          </button>
          <button className="btn-primary" onClick={handleExportWIF} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> Export WIF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="workspace-container woven-app">

        {/* Left Sidebar */}
        <div className="sidebar-left" style={{ width: '260px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <WovenToolbar
              mode="direct"
              warpEnds={warpEnds} setWarpEnds={setWarpEnds}
              weftPicks={weftPicks} setWeftPicks={setWeftPicks}
              numShafts={numShafts} setNumShafts={setNumShafts}
              numTreadles={numTreadles} setNumTreadles={setNumTreadles}
              resizeDraft={resizeDraft} clearDraft={clearDraft}
              colorSim={colorSim} setColorSim={setColorSim}
              loadTemplate={loadTemplate}
            />
          </div>
          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            © 2026 WeaveX Platform
          </div>
        </div>

        {/* Center: 3-Panel Editor (L-Shape Layout) */}
        <div id="woven-export-area" className="center-canvas" style={{
          padding: '32px',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          background: 'var(--bg-grid)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', gap: '32px' }}>
            
            {/* Top Left: Drafting Plan */}
            <div>
              <DraftingGrid
                threading={threading} setThreading={setThreading}
                numShafts={numShafts} warpEnds={warpEnds}
              />
            </div>
            
            {/* Top Right: Empty Space */}
            <div></div>

            {/* Bottom Left: Weaving Plan (Woven Structure) */}
            <div>
              <WeavingGrid
                drawdown={drawdown} setDrawdown={setDrawdown}
                warpEnds={warpEnds} weftPicks={weftPicks}
              />
            </div>

            {/* Bottom Right: Lifting Plan */}
            <div>
              <LiftingGrid
                liftPlan={liftPlan} setLiftPlan={setLiftPlan}
                numShafts={numShafts} weftPicks={weftPicks}
              />
            </div>

          </div>
        </div>

        {/* Right Sidebar: Intelligence */}
        <div className="sidebar-right" style={{ width: '240px', padding: '16px' }}>
          <WovenIntelligence
            structureName={structureName}
            confidence={confidence}
            classification={classification}
            repeatUnit={repeatUnit}
            maxWarpFloat={maxWarpFloat}
            maxWeftFloat={maxWeftFloat}
            shaftEfficiency={`${numShafts} shafts · ${numTreadles} treadles`}
            drawdown={drawdown}
          />
        </div>

      </div>

    </div>
  );
}

export default WovenApp;
