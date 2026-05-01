import React from 'react';
import { CELL_STATE } from './utils/weaveMath';

const WovenIntelligence = ({
  structureName,
  confidence,
  classification,
  repeatUnit,
  maxWarpFloat,
  maxWeftFloat,
  shaftEfficiency,
  drawdown
}) => {

  const renderMiniPreview = () => {
    if (!repeatUnit || repeatUnit.width === 0 || !repeatUnit.unit) return null;
    
    const w = repeatUnit.width;
    const h = repeatUnit.height;
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${w}, 12px)`,
        gridTemplateRows: `repeat(${h}, 12px)`,
        gap: '1px',
        backgroundColor: 'var(--border)',
        border: '1px solid var(--border)',
        padding: '1px',
        margin: '0 auto'
      }}>
        {Array.from({ length: h }).map((_, r) => (
          Array.from({ length: w }).map((_, c) => {
            const cellType = repeatUnit.unit[r] ? repeatUnit.unit[r][c] : CELL_STATE.WEFT_UP;
            return (
              <div key={`mini-${r}-${c}`} style={{
                backgroundColor: 'var(--bg-grid)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cellType === CELL_STATE.WARP_UP ? 
                  <div style={{ width: '100%', height: '100%', background: 'var(--warp-up)' }}></div> : 
                  <div style={{ width: '100%', height: '100%', background: 'var(--weft-up)' }}></div>
                }
              </div>
            )
          })
        ))}
      </div>
    );
  };

  // Calculate warp vs weft ratio for the entire drawdown
  let warpCount = 0;
  let totalCells = 0;
  if (drawdown && drawdown.length > 0) {
    drawdown.forEach(row => {
      row.forEach(cell => {
        if (cell === CELL_STATE.WARP_UP) warpCount++;
        totalCells++;
      });
    });
  }
  const warpPct = totalCells > 0 ? Math.round((warpCount / totalCells) * 100) : 0;
  const weftPct = 100 - warpPct;

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '300px', fontFamily: 'var(--font-woven-body)' }}>
      
      <div className="slide-fade-in" key={structureName}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Structure</h3>
        <div style={{ fontFamily: 'var(--font-woven-display)', fontSize: '22px', color: 'var(--accent-primary)', lineHeight: '1.2' }}>
          {structureName}
        </div>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confidence}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
          </div>
          <span className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-woven-mono)' }}>{confidence}% match</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
            {classification}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Repeat</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {repeatUnit.width} ends × {repeatUnit.height} picks
        </div>
        <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '4px', display: 'flex', justifyContent: 'center' }}>
          {renderMiniPreview()}
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Float Analysis</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Max warp float:</span>
            <span style={{ color: maxWarpFloat > 4 ? 'var(--danger)' : 'var(--text-primary)' }}>{maxWarpFloat}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Max weft float:</span>
            <span style={{ color: maxWeftFloat > 4 ? 'var(--danger)' : 'var(--text-primary)' }}>{maxWeftFloat}</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: (maxWarpFloat > 4 || maxWeftFloat > 4) ? 'var(--danger)' : 'var(--success)' }}>
            {(maxWarpFloat > 4 || maxWeftFloat > 4) ? '⚠ Floats > 4 may snag' : '✓ Good for wear'}
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Warp / Weft Ratio</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${warpPct}%`, background: 'var(--warp-up)' }}></div>
            <div style={{ height: '100%', width: `${weftPct}%`, background: 'var(--weft-up)' }}></div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{warpPct}% / {weftPct}%</span>
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Shaft Requirement</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{shaftEfficiency}</p>
      </div>

    </div>
  );
};

export default WovenIntelligence;
