import React, { useState } from 'react';
import { LOOP_TYPES } from '../utils/fabricDetection';
import { templates } from '../utils/templatesData';

const Toolbar = ({
  currentTool,
  setCurrentTool,
  currentLoopType,
  setCurrentLoopType,
  wales,
  setWales,
  courses,
  setCourses,
  resizeGrid,
  clearGrid,
  undo,
  redo,
  canUndo,
  canRedo,
  loadTemplate
}) => {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const visibleTemplates = searchQuery ? filteredTemplates : (showAllTemplates ? templates : templates.slice(0, 4));

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', fontFamily: 'var(--font-body)' }}>
      
      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tools</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button 
            className={`btn-secondary ${currentTool === 'brush' ? 'active' : ''}`}
            onClick={() => setCurrentTool('brush')}
            style={{ borderColor: currentTool === 'brush' ? 'var(--accent-primary)' : 'var(--border)' }}
          >
            Brush
          </button>
          <button 
            className={`btn-secondary ${currentTool === 'eraser' ? 'active' : ''}`}
            onClick={() => setCurrentTool('eraser')}
            style={{ borderColor: currentTool === 'eraser' ? 'var(--accent-primary)' : 'var(--border)' }}
          >
            Eraser
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loop Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className="btn-secondary"
            style={{ 
              borderColor: currentLoopType === LOOP_TYPES.KNIT ? 'var(--accent-primary)' : 'var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            onClick={() => setCurrentLoopType(LOOP_TYPES.KNIT)}
          >
            <span>Knit <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>(K)</span></span>
            <span style={{ color: 'var(--knit-color)' }}>●</span>
          </button>
          <button 
            className="btn-secondary"
            style={{ 
              borderColor: currentLoopType === LOOP_TYPES.TUCK ? 'var(--accent-primary)' : 'var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            onClick={() => setCurrentLoopType(LOOP_TYPES.TUCK)}
          >
            <span>Tuck <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>(T)</span></span>
            <span style={{ color: 'var(--tuck-color)', fontWeight: 'bold' }}>∩</span>
          </button>
          <button 
            className="btn-secondary"
            style={{ 
              borderColor: currentLoopType === LOOP_TYPES.MISS ? 'var(--accent-primary)' : 'var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            onClick={() => setCurrentLoopType(LOOP_TYPES.MISS)}
          >
            <span>Miss <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>(M)</span></span>
            <span style={{ color: 'var(--miss-color)', fontWeight: 'bold' }}>─</span>
          </button>
          <button 
            className="btn-secondary"
            style={{ 
              borderColor: currentLoopType === LOOP_TYPES.PURL ? 'var(--accent-primary)' : 'var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            onClick={() => setCurrentLoopType(LOOP_TYPES.PURL)}
          >
            <span>Purl <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>(P)</span></span>
            <span style={{ color: 'var(--purl-color, #f59e0b)', fontWeight: 'bold' }}>≈</span>
          </button>
          <button 
            className="btn-secondary"
            style={{ 
              borderColor: currentLoopType === LOOP_TYPES.TRANSFER ? 'var(--accent-primary)' : 'var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
            onClick={() => setCurrentLoopType(LOOP_TYPES.TRANSFER)}
          >
            <span>Transfer <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>(X)</span></span>
            <span style={{ color: 'var(--transfer-color, #ec4899)', fontWeight: 'bold' }}>➚</span>
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Grid Size</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Wales (W)</label>
            <input 
              type="number" 
              value={wales} 
              onChange={(e) => setWales(Math.min(32, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="32"
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Courses (C)</label>
            <input 
              type="number" 
              value={courses} 
              onChange={(e) => setCourses(Math.min(32, Math.max(2, parseInt(e.target.value) || 2)))}
              min="2" max="32"
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={resizeGrid}>
          Resize Grid
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>History</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <button className="btn-secondary" onClick={undo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.5 }}>Undo</button>
          <button className="btn-secondary" onClick={redo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.5 }}>Redo</button>
        </div>
        <button className="btn-secondary" style={{ width: '100%', color: 'var(--miss-color)', borderColor: 'var(--miss-color)' }} onClick={clearGrid}>
          Clear All
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Templates</h3>
        <input 
          type="text" 
          placeholder="Search templates..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', padding: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '4px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleTemplates.map(t => (
            <button 
              key={t.name}
              className="btn-secondary"
              onClick={() => loadTemplate(t)}
              style={{ textAlign: 'left', fontSize: '14px' }}
            >
              {t.name}
            </button>
          ))}
          {!searchQuery && (
            <button 
              className="btn-secondary"
              onClick={() => setShowAllTemplates(!showAllTemplates)}
              style={{ 
                textAlign: 'center', 
                fontSize: '12px', 
                color: 'var(--accent-primary)', 
                borderColor: 'var(--border)',
                marginTop: '8px'
              }}
            >
              {showAllTemplates ? 'View Less' : `View More (${templates.length - 4})`}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Toolbar;
