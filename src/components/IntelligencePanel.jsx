import React from 'react';
import { LOOP_TYPES } from '../utils/fabricDetection';

const IntelligencePanel = ({
  structureName,
  confidence,
  repeatUnit,
  stats
}) => {

  const renderMiniGrid = () => {
    if (!repeatUnit || repeatUnit.width === 0 || repeatUnit.height === 0 || !repeatUnit.data) return null;
    
    const w = repeatUnit.width;
    const h = repeatUnit.height;
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${w}, 16px)`,
        gridTemplateRows: `repeat(${h}, 16px)`,
        gap: '1px',
        backgroundColor: 'var(--border)',
        border: '1px solid var(--border)',
        padding: '1px',
        margin: '0 auto'
      }}>
        {Array.from({ length: h }).map((_, r) => (
          Array.from({ length: w }).map((_, c) => {
            const cellType = repeatUnit.data[r] ? repeatUnit.data[r][c] : LOOP_TYPES.EMPTY;
            return (
              <div key={`mini-${r}-${c}`} style={{
                backgroundColor: 'var(--bg-base)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px'
              }}>
                {cellType === LOOP_TYPES.KNIT && <span style={{ color: 'var(--knit-color)' }}>●</span>}
                {cellType === LOOP_TYPES.TUCK && <span style={{ color: 'var(--tuck-color)' }}>∩</span>}
                {cellType === LOOP_TYPES.MISS && <span style={{ color: 'var(--miss-color)' }}>─</span>}
              </div>
            )
          })
        ))}
      </div>
    );
  };

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      
      <div className="slide-fade-in" key={structureName}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Detected Structure</h3>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--accent-primary)', lineHeight: '1.2' }}>
          {structureName}
        </div>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confidence}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
          </div>
          <span className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{confidence}%</span>
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Repeat Size</h3>
        <div className="mono" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {repeatUnit.width}W × {repeatUnit.height}C
        </div>
        <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '4px', display: 'flex', justifyContent: 'center' }}>
          {renderMiniGrid()}
        </div>
      </div>

      <div>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Loop Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--knit-color)' }}>●</span> Knit
            </span>
            <span className="mono" style={{ fontSize: '14px' }}>{stats.knit} <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({stats.knitPct}%)</span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--tuck-color)', fontWeight: 'bold' }}>∩</span> Tuck
            </span>
            <span className="mono" style={{ fontSize: '14px' }}>{stats.tuck} <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({stats.tuckPct}%)</span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--miss-color)', fontWeight: 'bold' }}>─</span> Miss
            </span>
            <span className="mono" style={{ fontSize: '14px' }}>{stats.miss} <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({stats.missPct}%)</span></span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default IntelligencePanel;
