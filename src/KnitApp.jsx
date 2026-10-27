import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import GridEditor from './components/GridEditor';
import Toolbar from './components/Toolbar';
import IntelligencePanel from './components/IntelligencePanel';
import { LOOP_TYPES, detectRepeatSize, detectStructureName, extractRepeatUnit } from './utils/fabricDetection';
import { exportToPNG, exportToJSON, exportToCSV } from './utils/exportUtils';
import { Download, Copy, Save, Grid, Sliders, Sparkles } from 'lucide-react';
import { saveProject } from './utils/projectStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function KnitApp({ onNavigateHome, activeProject }) {
  const [wales, setWales] = useState(activeProject?.data?.cols || 8);
  const [courses, setCourses] = useState(activeProject?.data?.rows || 8);
  const [projectName, setProjectName] = useState(activeProject?.name || 'Untitled Fabric');
  const [projectId, setProjectId] = useState(activeProject?.id || null);
  
  const createEmptyGrid = (w, c) => Array.from({ length: c }, () => Array(w).fill(LOOP_TYPES.KNIT));
  
  const [grid, setGrid] = useState(activeProject?.data?.grid || createEmptyGrid(wales, courses));
  
  // Tools and Selection
  const [currentTool, setCurrentTool] = useState('brush'); // brush, eraser
  const [currentLoopType, setCurrentLoopType] = useState(LOOP_TYPES.KNIT);
  const [showHelp, setShowHelp] = useState(false);
  const [mobileTab, setMobileTab] = useState('grid'); // 'grid', 'tools', 'intelligence'
  const [cellSize, setCellSize] = useState(() => {
    if (typeof window === 'undefined') return 48;
    if (window.innerWidth >= 1024) return 85;
    if (window.innerWidth < 640) return 32;
    return 48;
  });
  
  // History
  const [history, setHistory] = useState([activeProject?.data?.grid || createEmptyGrid(wales, courses)]);
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

  const handleSaveProject = async () => {
    let thumbnail = '';
    const container = document.getElementById('grid-export-container');
    if (container) {
      const canvas = await html2canvas(container, { backgroundColor: '#10131E' });
      thumbnail = canvas.toDataURL('image/jpeg', 0.5);
    }
    
    const saved = saveProject({
      id: projectId,
      name: projectName,
      type: 'knit',
      thumbnail,
      data: {
        cols: wales, rows: courses, grid
      }
    });
    setProjectId(saved.id);
    alert('Project saved!');
  };

  const exportPDF = async () => {
    const element = document.getElementById('grid-export-container');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#10131E', scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFontSize(20);
      pdf.text(`Tech Pack: ${projectName}`, 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Structure: ${structureName} | Confidence: ${confidence}%`, 14, 28);
      pdf.text(`Stats: ${stats.knitPct}% Knit | ${stats.tuckPct}% Tuck | ${stats.missPct}% Miss`, 14, 34);

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 28;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 14, 45, imgWidth, imgHeight);
      pdf.save(`KnitPack_${projectName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF', err);
    }
  };

  // Run intelligence algorithms on grid change
  useEffect(() => {
    // 1. Calculate Stats
    const allCells = grid.flat();
    const total = allCells.length;
    const k = allCells.filter(c => c === LOOP_TYPES.KNIT).length;
    const t = allCells.filter(c => c === LOOP_TYPES.TUCK).length;
    const m = allCells.filter(c => c === LOOP_TYPES.MISS).length;
    const p = allCells.filter(c => c === LOOP_TYPES.PURL).length;
    const x = allCells.filter(c => c === LOOP_TYPES.TRANSFER).length;
    
    setStats({
      knit: k, knitPct: total > 0 ? Math.round((k/total)*100) : 0,
      tuck: t, tuckPct: total > 0 ? Math.round((t/total)*100) : 0,
      miss: m, missPct: total > 0 ? Math.round((m/total)*100) : 0,
      purl: p, purlPct: total > 0 ? Math.round((p/total)*100) : 0,
      transfer: x, transferPct: total > 0 ? Math.round((x/total)*100) : 0,
    });

    // 2. Detect Repeat Size
    const repeat = detectRepeatSize(grid);
    const unitData = extractRepeatUnit(grid, repeat.width, repeat.height);
    setRepeatUnit({ ...repeat, data: unitData });

    // 3. Detect Structure Name
    const detection = detectStructureName(grid, repeat.width, repeat.height);
    setStructureName(detection.name);
    setConfidence(detection.confidence);
  }, [grid]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      
      switch (e.key.toLowerCase()) {
        case 'k': setCurrentLoopType(LOOP_TYPES.KNIT); break;
        case 't': setCurrentLoopType(LOOP_TYPES.TUCK); break;
        case 'm': setCurrentLoopType(LOOP_TYPES.MISS); break;
        case 'p': setCurrentLoopType(LOOP_TYPES.PURL); break;
        case 'x': setCurrentLoopType(LOOP_TYPES.TRANSFER); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onNavigateHome && (
            <button className="btn-secondary" onClick={onNavigateHome} style={{ marginRight: '16px', padding: '4px 8px' }}>
              ← Home
            </button>
          )}
          <input 
            type="text" 
            value={projectName} 
            onChange={e => setProjectName(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '20px', fontWeight: 'bold', outline: 'none', width: '200px' }} 
            placeholder="Project Name..."
          />
        </div>
        <div className="header-actions">
          <div className="zoom-control-bar" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Zoom:</span>
            <button 
              onClick={() => setCellSize(prev => Math.max(24, prev - 4))} 
              className="btn-secondary" 
              style={{ padding: '2px 8px', fontSize: '13px', lineHeight: 1 }}
              title="Zoom Out"
            >-</button>
            <span style={{ fontSize: '11px', minWidth: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: '600', color: cellSize === 85 ? 'var(--accent-primary)' : 'inherit' }}>
              {cellSize === 85 ? 178 : Math.round((cellSize / 48) * 100)}%
            </span>
            <button 
              onClick={() => setCellSize(prev => Math.min(108, prev + 4))} 
              className="btn-secondary" 
              style={{ padding: '2px 8px', fontSize: '13px', lineHeight: 1 }}
              title="Zoom In"
            >+</button>
            <button 
              onClick={() => setCellSize(32)} 
              className="btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '10px', fontWeight: cellSize === 32 ? 'bold' : 'normal', color: cellSize === 32 ? 'var(--accent-primary)' : 'inherit', background: cellSize === 32 ? 'rgba(78, 255, 197, 0.12)' : undefined }}
              title="Fit to Mobile Screen (32px)"
            >Fit</button>
            <button 
              onClick={() => setCellSize(48)} 
              className="btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '10px', opacity: 0.8 }}
              title="Reset to 100% (48px)"
            >100%</button>
            <button 
              onClick={() => setCellSize(85)} 
              className="btn-secondary" 
              style={{ padding: '2px 7px', fontSize: '10px', fontWeight: cellSize === 85 ? 'bold' : 'normal', color: cellSize === 85 ? 'var(--accent-primary)' : 'inherit', background: cellSize === 85 ? 'rgba(78, 255, 197, 0.12)' : undefined }}
              title="Preset Zoom 178% (Optimized for Larger Screens)"
            >178%</button>
          </div>
          <button className="btn-secondary" onClick={handleSaveProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Save size={14} /> Save
          </button>
          <button className="btn-secondary" onClick={() => exportToCSV(grid)} title="Export CSV" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> CSV
          </button>
          <button className="btn-secondary" onClick={() => exportToJSON(grid, { name: structureName, repeatUnit })} title="Export JSON" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> JSON
          </button>
          <button className="btn-secondary" onClick={() => exportToPNG('grid-export-container')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> PNG
          </button>
          <button className="btn-primary" onClick={exportPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> Tech Pack
          </button>
        </div>
      </header>

      {/* Mobile Screen Tab Navigation */}
      <div className="woven-mobile-tabs">
        <button 
          onClick={() => setMobileTab('grid')} 
          className={`woven-mob-tab ${mobileTab === 'grid' ? 'active' : ''}`}
        >
          <Grid size={15} />
          <span>Knit Grid</span>
        </button>
        <button 
          onClick={() => setMobileTab('tools')} 
          className={`woven-mob-tab ${mobileTab === 'tools' ? 'active' : ''}`}
        >
          <Sliders size={15} />
          <span>Needle Tools</span>
        </button>
        <button 
          onClick={() => setMobileTab('intelligence')} 
          className={`woven-mob-tab ${mobileTab === 'intelligence' ? 'active' : ''}`}
        >
          <Sparkles size={15} />
          <span>Analysis & Yield</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="workspace-container knit-app">
        
        {/* Left Sidebar */}
        <div className={`sidebar-left ${mobileTab !== 'tools' ? 'woven-mob-hidden' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
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
            © Developed by Aseer Awsaf
          </div>
        </div>

        {/* Center Canvas */}
        <div className={`center-canvas ${mobileTab !== 'grid' ? 'woven-mob-hidden' : ''}`} style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
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
            cellSize={cellSize}
          />
        </div>

        {/* Right Sidebar */}
        <div className={`sidebar-right ${mobileTab !== 'intelligence' ? 'woven-mob-hidden' : ''}`} style={{ padding: '24px' }}>
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
