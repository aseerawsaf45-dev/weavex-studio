import React, { useState, useEffect, useRef } from 'react';
import { LOOP_TYPES } from '../utils/fabricDetection';

const GridEditor = ({
  grid,
  setGrid,
  currentTool,
  currentLoopType,
  wales,
  courses,
  repeatUnit,
  onHistoryChange
}) => {
  const containerRef = useRef(null);
  const lastActionRef = useRef({ r: -1, c: -1, time: 0 });

  const handleCellAction = (r, c, overrideType = null) => {
    const now = Date.now();
    // Prevent duplicate updates on the same cell, or instant adjacent phantom updates within 30ms (hardware bounce)
    if (
      (lastActionRef.current.r === r && lastActionRef.current.c === c && now - lastActionRef.current.time < 100) ||
      (now - lastActionRef.current.time < 30) // Anti-phantom-click for adjacent cells
    ) {
      return; 
    }
    lastActionRef.current = { r, c, time: now };

    const newGrid = grid.map(row => [...row]);
    
    if (overrideType !== null) {
      newGrid[r][c] = overrideType;
    } else if (currentTool === 'brush') {
      newGrid[r][c] = currentLoopType;
    } else if (currentTool === 'eraser') {
      newGrid[r][c] = LOOP_TYPES.EMPTY;
    } else if (currentTool === 'fill') {
      newGrid[r][c] = currentLoopType;
    }

    setGrid(newGrid);
    onHistoryChange(newGrid);
  };

  const onMouseDown = (e, r, c) => {
    e.preventDefault(); // Prevent text selection
    if (e.button === 2) {
      handleCellAction(r, c, LOOP_TYPES.EMPTY);
    } else {
      handleCellAction(r, c);
    }
  };

  const onMouseEnter = (e, r, c) => {
    if (e.buttons === 1) { // Left click is held down
      handleCellAction(r, c);
    } else if (e.buttons === 2) { // Right click is held down
      handleCellAction(r, c, LOOP_TYPES.EMPTY);
    }
  };

  const onContextMenu = (e) => {
    e.preventDefault();
  };

  const renderCellContent = (type) => {
    const contentClass = type !== LOOP_TYPES.EMPTY ? 'pulse-cell' : '';
    switch (type) {
      case LOOP_TYPES.KNIT:
        return <div className={contentClass} style={{ color: 'var(--knit-color)', fontSize: '20px' }}>●</div>;
      case LOOP_TYPES.TUCK:
        return <div className={contentClass} style={{ color: 'var(--tuck-color)', fontSize: '20px', fontWeight: 'bold' }}>∩</div>;
      case LOOP_TYPES.MISS:
        return <div className={contentClass} style={{ color: 'var(--miss-color)', fontSize: '20px', fontWeight: 'bold' }}>─</div>;
      default:
        return null;
    }
  };

  // Calculate if cell is part of the repeat border
  const getCellBorderStyles = (r, c) => {
    let styles = {};
    if (!repeatUnit || repeatUnit.width === 0 || repeatUnit.height === 0) return styles;
    
    // Bottom-left corner block
    const isRepeatCol = c < repeatUnit.width;
    const isRepeatRow = r >= courses - repeatUnit.height;

    if (isRepeatCol && isRepeatRow) {
      // It's inside the repeat unit
      if (c === repeatUnit.width - 1) styles.borderRight = '2px dashed var(--accent-primary)';
      if (r === courses - repeatUnit.height) styles.borderTop = '2px dashed var(--accent-primary)';
      if (c === 0) styles.borderLeft = '2px dashed var(--accent-primary)';
      if (r === courses - 1) styles.borderBottom = '2px dashed var(--accent-primary)';
    }

    return styles;
  };

  return (
    <div 
      className="card" 
      style={{ padding: '24px', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div 
        id="grid-export-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${wales}, 40px)`,
          gridTemplateRows: `40px repeat(${courses}, 40px)`,
          gap: '1px',
          backgroundColor: 'var(--border)', // Creates grid lines
          border: '1px solid var(--border)',
          padding: '1px',
        }}
        onContextMenu={onContextMenu}
        ref={containerRef}
      >
        {/* Top Header Row (Wales) */}
        <div style={{ backgroundColor: 'var(--bg-surface)' }}></div>
        {Array.from({ length: wales }).map((_, c) => (
          <div key={`header-col-${c}`} className="mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {c + 1}
          </div>
        ))}

        {/* Rows */}
        {Array.from({ length: courses }).map((_, r) => (
          <React.Fragment key={`row-${r}`}>
            {/* Left Header Col (Courses) */}
            <div className="mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface)', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {courses - r}
            </div>
            
            {/* Grid Cells */}
            {Array.from({ length: wales }).map((_, c) => {
              const cellType = grid[r] && grid[r][c] ? grid[r][c] : LOOP_TYPES.EMPTY;
              return (
                <div
                  key={`cell-${r}-${c}`}
                  style={{
                    backgroundColor: 'var(--bg-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: currentTool === 'eraser' ? 'cell' : 'pointer',
                    userSelect: 'none',
                    touchAction: 'none',
                    position: 'relative',
                    transition: 'background 0.1s, transform 0.05s',
                    ...getCellBorderStyles(r, c)
                  }}
                  onMouseDown={(e) => onMouseDown(e, r, c)}
                  onMouseEnter={(e) => onMouseEnter(e, r, c)}
                  className="grid-cell"
                >
                  {renderCellContent(cellType)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GridEditor;
