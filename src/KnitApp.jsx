import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import GridEditor from './components/GridEditor';
import Toolbar from './components/Toolbar';
import IntelligencePanel from './components/IntelligencePanel';
import { LOOP_TYPES, detectRepeatSize, detectStructureName, extractRepeatUnit } from './utils/fabricDetection';
import { exportToPNG, exportToJSON, exportToCSV } from './utils/exportUtils';
import { Download, Copy } from 'lucide-react';

function KnitApp({ onNavigateHome }) {
  const [wales, setWales] = useState(8);
  const [courses, setCourses] = useState(8);
  
  const createEmptyGrid = (w, c) => Array.from({ length: c }, () => Array(w).fill(LOOP_TYPES.EMPTY));
  
  const [grid, setGrid] = useState(createEmptyGrid(wales, courses));
  
  // Tools and Selection
  const [currentTool, setCurrentTool] = useState('brush'); // brush, eraser
  const [currentLoopType, setCurrentLoopType] = useState(LOOP_TYPES.KNIT);
  const [showHelp, setShowHelp] = useState(false);
  
  // History
  const [history, setHistory] = useState([createEmptyGrid(wales, courses)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Intelligence
  const [structureName, setStructureName] = useState('Empty Canvas');
  const [confidence, setConfidence] = useState(100);
  const [repeatUnit, setRepeatUnit] = useState({ width: 0, height: 0, data: null });
  const [stats, setStats] = useState({ knit: 0, knitPct: 0, tuck: 0, tuckPct: 0, miss: 0, missPct: 0 });

  const pushHistory = useCallback((newGrid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newGrid);
    if (newHistory.length > 50) newHistory.shift(); // Max 50 steps
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleGridChange = (newGrid) => {
    pushHistory(newGrid);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGrid(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGrid(history[historyIndex + 1]);
    }
  };

  const resizeGrid = () => {
    const newGrid = createEmptyGrid(wales, courses);
    for (let r = 0; r < Math.min(grid.length, courses); r++) {
      for (let c = 0; c < Math.min(grid[0].length, wales); c++) {
        newGrid[r][c] = grid[r][c];
      }
    }
    setGrid(newGrid);
    pushHistory(newGrid);
  };

  const clearGrid = () => {
    const newGrid = createEmptyGrid(wales, courses);
    setGrid(newGrid);
    pushHistory(newGrid);
  };

  const loadTemplate = (template) => {
    setWales(template.wales);
    setCourses(template.courses);
    setGrid(template.data);
    pushHistory(template.data);
  };

  // Run intelligence algorithms on grid change
  useEffect(() => {
    // 1. Calculate Stats
    const allCells = grid.flat();
    const total = allCells.length;
    const k = allCells.filter(c => c === LOOP_TYPES.KNIT).length;
    const t = allCells.filter(c => c === LOOP_TYPES.TUCK).length;
    const m = allCells.filter(c => c === LOOP_TYPES.MISS).length;
    
    setStats({
      knit: k, knitPct: total > 0 ? Math.round((k/total)*100) : 0,
      tuck: t, tuckPct: total > 0 ? Math.round((t/total)*100) : 0,
      miss: m, missPct: total > 0 ? Math.round((m/total)*100) : 0,
    });

    // 2. Detect Repeat Size
    const repeat = detectRepeatSize(grid);
    const unitData = extractRepeatUnit(grid, repeat.width, repeat.height);
    setRepeatUnit({ ...repeat, data: unitData });

    // 3. Detect Structure Name
    const detection = detectStructureName(grid, repeat.width, repeat.height);
    setStructureName(detection.name);
    setConfidence(detection.confidence);

    // Auto-save to local storage
    localStorage.setItem('knitcad-autosave', JSON.stringify({ wales, courses, grid }));
  }, [grid]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('knitcad-autosave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.grid) {
          setWales(parsed.wales);
          setCourses(parsed.courses);
          setGrid(parsed.grid);
          setHistory([parsed.grid]);
          setHistoryIndex(0);
        }
      } catch (e) {
        console.error('Failed to load auto-save', e);
      }
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      
      switch (e.key.toLowerCase()) {
        case 'k': setCurrentLoopType(LOOP_TYPES.KNIT); break;
        case 't': setCurrentLoopType(LOOP_TYPES.TUCK); break;
        case 'm': setCurrentLoopType(LOOP_TYPES.MISS); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onNavigateHome && (
            <button className="btn-secondary" onClick={onNavigateHome} style={{ marginRight: '16px', padding: '4px 8px' }}>
              ← Home
            </button>
          )}
          <h1 style={{ color: 'var(--accent-primary)', fontSize: '24px', margin: 0 }}>KnitCAD Pro</h1>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Fabric Structure Design</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-secondary" onClick={() => exportToCSV(grid)} title="Export CSV" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> CSV
          </button>
          <button className="btn-secondary" onClick={() => exportToJSON(grid, { name: structureName, repeatUnit })} title="Export JSON" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> JSON
          </button>
          <button className="btn-primary" onClick={() => exportToPNG('grid-export-container')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Image
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
          <div>
            <Toolbar 
              currentTool={currentTool} setCurrentTool={setCurrentTool}
              currentLoopType={currentLoopType} setCurrentLoopType={setCurrentLoopType}
              wales={wales} setWales={setWales}
              courses={courses} setCourses={setCourses}
              resizeGrid={resizeGrid} clearGrid={clearGrid}
              undo={undo} redo={redo} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}
              loadTemplate={loadTemplate}
            />
          </div>
          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            © 2026 KnitCAD Platform
          </div>
        </div>

        {/* Center Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: 'var(--bg-base)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Grid Size: {wales}W × {courses}C
          </div>
          <GridEditor 
            grid={grid} setGrid={setGrid}
            currentTool={currentTool}
            currentLoopType={currentLoopType}
            wales={wales} courses={courses}
            repeatUnit={repeatUnit}
            onHistoryChange={handleGridChange}
          />
        </div>

        {/* Right Sidebar */}
        <div style={{ padding: '24px', overflowY: 'auto', borderLeft: '1px solid var(--border)' }}>
          <IntelligencePanel 
            structureName={structureName}
            confidence={confidence}
            repeatUnit={repeatUnit}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}

export default KnitApp;
