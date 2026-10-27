import React from 'react';
import { CELL_STATE } from './utils/weaveMath';

const Cell = ({ filled, onClick, size = 36, bgColor = 'var(--bg-grid)' }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        width: size, height: size,
        background: bgColor,
        border: '1px solid var(--border-strong)',
        cursor: 'pointer',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)',
        fontSize: Math.max(9, Math.round(size * 0.52)) + 'px',
        fontWeight: 'bold',
        userSelect: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        flexShrink: 0
      }}
    >
      {filled ? 'X' : ''}
    </div>
  );
};

export const DraftingGrid = ({ threading, setThreading, numShafts, warpEnds, size = 36 }) => {
  const toggle = (s, c) => {
    const next = threading[s][c] === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
    const newTh = threading.map(row => [...row]);
    for (let i = 0; i < numShafts; i++) newTh[i][c] = CELL_STATE.EMPTY;
    newTh[s][c] = next;
    setThreading(newTh);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-shaft)', marginBottom: '8px' }}>
        Threading Plan
      </div>
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: size + 'px' }}>
        {Array.from({ length: warpEnds }, (_, c) => (
          <div key={c} style={{ width: size, textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', flexShrink: 0 }}>{c + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {threading.map((row, s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: size, fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>S{numShafts - s}</div>
            {row.map((cell, c) => (
              <Cell key={c} size={size} filled={cell === CELL_STATE.MARKED} onClick={() => toggle(s, c)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TieupGrid = ({ tieup, setTieup, numShafts, numTreadles, size = 36 }) => {
  const toggle = (s, t) => {
    const next = tieup[s][t] === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
    const newTu = tieup.map(row => [...row]);
    newTu[s][t] = next;
    setTieup(newTu);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '8px' }}>
        Tie-Up
      </div>
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: size + 'px' }}>
        {Array.from({ length: numTreadles }, (_, t) => (
          <div key={t} style={{ width: size, textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', flexShrink: 0 }}>T{t + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {tieup.map((row, s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: size, fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>S{numShafts - s}</div>
            {row.map((cell, t) => (
              <Cell key={t} size={size} filled={cell === CELL_STATE.MARKED} onClick={() => toggle(s, t)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TreadlingGrid = ({ treadling, setTreadling, weftPicks, numTreadles, size = 36 }) => {
  const toggle = (p, t) => {
    const next = treadling[p][t] === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
    const newTr = treadling.map(row => [...row]);
    // Usually only one treadle per pick, but we allow multiple for advanced drafts.
    newTr[p][t] = next;
    setTreadling(newTr);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-treadle)', marginBottom: '8px' }}>
        Treadling Plan
      </div>
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: size + 'px' }}>
        {Array.from({ length: numTreadles }, (_, t) => (
          <div key={t} style={{ width: size, textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', flexShrink: 0 }}>T{t + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {treadling.map((row, p) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div style={{ width: size, fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>P{weftPicks - p}</div>
            {row.map((cell, t) => (
              <Cell key={t} size={size} filled={cell === CELL_STATE.MARKED} onClick={() => toggle(p, t)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const WeavingGrid = ({ drawdown, setDrawdown, warpEnds, weftPicks, colorSim, warpColors, setWarpColors, weftColors, setWeftColors, selectedColor, size = 36 }) => {
  const paintWarp = (c) => {
    if (!colorSim || !setWarpColors || !warpColors) return;
    const newColors = [...warpColors];
    newColors[c] = selectedColor;
    setWarpColors(newColors);
  };

  const paintWeft = (r) => {
    if (!colorSim || !setWeftColors || !weftColors) return;
    const newColors = [...weftColors];
    newColors[r] = selectedColor;
    setWeftColors(newColors);
  };

  const toggle = (r, c) => {
    if (colorSim) {
      if (drawdown[r][c] === CELL_STATE.WARP_UP) {
        paintWarp(c);
      } else {
        paintWeft(r);
      }
      return;
    }
    const next = drawdown[r][c] === CELL_STATE.WARP_UP ? CELL_STATE.WEFT_UP : CELL_STATE.WARP_UP;
    const newDd = drawdown.map(row => [...row]);
    newDd[r][c] = next;
    setDrawdown(newDd);
  };

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--warp-up)', marginBottom: '8px' }}>
        Drawdown
      </div>
      <div style={{ display: 'flex', marginBottom: '2px', marginLeft: size + 'px' }}>
        {Array.from({ length: warpEnds }, (_, c) => (
          <div 
            key={c} 
            onClick={() => paintWarp(c)}
            style={{ 
              width: size, textAlign: 'center', fontSize: '10px', 
              color: 'var(--text-secondary)',
              cursor: colorSim ? 'pointer' : 'default',
              borderBottom: colorSim ? `2px solid ${warpColors[c] || 'var(--border)'}` : 'none',
              paddingBottom: colorSim ? '2px' : '0'
            }}
          >
            {c + 1}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {drawdown.map((row, r) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <div 
              onClick={() => paintWeft(r)}
              style={{ 
                width: size, fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right', paddingRight: '4px', flexShrink: 0,
                cursor: colorSim ? 'pointer' : 'default',
                borderRight: colorSim ? `2px solid ${weftColors[r] || 'var(--border)'}` : 'none'
              }}
            >
              P{weftPicks - r}
            </div>
            {row.map((cell, c) => {
              const isWarpUp = cell === CELL_STATE.WARP_UP;
              let bgColor = 'var(--bg-grid)';
              let content = isWarpUp ? 'X' : '';
              
              if (colorSim) {
                bgColor = isWarpUp ? (warpColors[c] || '#ffffff') : (weftColors[r] || '#cccccc');
                content = ''; // Hide the 'X' when simulating colors
              }
              
              return (
                <div
                  key={c}
                  onClick={() => toggle(r, c)}
                  role="button"
                  tabIndex={0}
                  style={{
                    width: size, height: size,
                    background: bgColor,
                    border: '1px solid var(--border-strong)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    fontSize: Math.max(9, Math.round(size * 0.52)) + 'px',
                    fontWeight: 'bold',
                    transition: 'background 0.15s',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
