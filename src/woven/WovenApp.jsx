import React, { useState, useEffect } from 'react';
import WovenToolbar from './WovenToolbar';
import WovenIntelligence from './WovenIntelligence';
import { CELL_STATE, computeDrawdown, createEmptyGrid } from './utils/weaveMath';
import { detectRepeatSize, analyzeFloats, detectWeaveStructure } from './utils/weaveDetection';
import { exportWIF } from './utils/weaveExport';
import { wovenTemplates } from './utils/wovenTemplatesData';
import { saveProject } from '../utils/projectStore';
import { Download, Image as ImageIcon, Save, Grid, Sliders, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DraftingGrid, TieupGrid, TreadlingGrid, WeavingGrid } from './WovenGrids';

// ─── Main WovenApp ────────────────────────────────────────────────────────────
function WovenApp({ onNavigateHome, activeProject }) {
  const initialTemplate = activeProject?.data?.template || wovenTemplates[0];

  const [projectId, setProjectId] = useState(activeProject?.id || null);
  const [projectName, setProjectName] = useState(activeProject?.name || 'Untitled Draft');

  const [warpEnds, setWarpEnds] = useState(initialTemplate.warpEnds);
  const [weftPicks, setWeftPicks] = useState(initialTemplate.weftPicks);
  const [numShafts, setNumShafts] = useState(initialTemplate.numShafts);
  const [numTreadles, setNumTreadles] = useState(initialTemplate.numTreadles);
  const [showHelp, setShowHelp] = useState(false);
  const [colorSim, setColorSim] = useState(false);
  const [mobileTab, setMobileTab] = useState('grid'); // 'grid', 'controls', 'intelligence'
  const [cellSize, setCellSize] = useState(() => {
    if (typeof window === 'undefined') return 36;
    if (window.innerWidth >= 1024) return 64; // 178% for large screen
    if (window.innerWidth < 640) return 26;   // Mobile fit
    return 36;
  });

  // Standard 4-part editable grids
  const [threading, setThreading] = useState(activeProject?.data?.threading || createEmptyGrid(initialTemplate.numShafts, initialTemplate.warpEnds));
  const [tieup, setTieup] = useState(activeProject?.data?.tieup || createEmptyGrid(initialTemplate.numShafts, initialTemplate.numTreadles));
  const [treadling, setTreadling] = useState(activeProject?.data?.treadling || createEmptyGrid(initialTemplate.weftPicks, initialTemplate.numTreadles));
  const [drawdown, setDrawdown] = useState(activeProject?.data?.drawdown || computeDrawdown(initialTemplate.threading, initialTemplate.tieup, initialTemplate.treadling));

  // Color Simulation State
  const [warpColors, setWarpColors] = useState(activeProject?.data?.warpColors || (() => Array(initialTemplate.warpEnds).fill('#ffffff')));
  const [weftColors, setWeftColors] = useState(activeProject?.data?.weftColors || (() => Array(initialTemplate.weftPicks).fill('#3b82f6')));
  const [selectedColor, setSelectedColor] = useState('#ffffff');

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
    const preserveColors = (old, length, def) => {
      const next = Array(length).fill(def);
      for (let i = 0; i < Math.min(length, old.length); i++) next[i] = old[i];
      return next;
    };
    setThreading(preserve(threading, numShafts, warpEnds));
    setTieup(preserve(tieup, numShafts, numTreadles));
    setTreadling(preserve(treadling, weftPicks, numTreadles));
    setDrawdown(preserve(drawdown, weftPicks, warpEnds));
    setWarpColors(preserveColors(warpColors, warpEnds, '#ffffff'));
    setWeftColors(preserveColors(weftColors, weftPicks, '#3b82f6'));
  };

  const clearDraft = () => {
    setThreading(createEmptyGrid(numShafts, warpEnds));
    setTieup(createEmptyGrid(numShafts, numTreadles));
    setTreadling(createEmptyGrid(weftPicks, numTreadles));
    setDrawdown(createEmptyGrid(weftPicks, warpEnds));
  };

  const handleExportWIF = () => {
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

  const handleSaveProject = async () => {
    let thumbnail = '';
    const container = document.getElementById('woven-export-area');
    if (container) {
      const canvas = await html2canvas(container, { backgroundColor: '#10131E' });
      thumbnail = canvas.toDataURL('image/jpeg', 0.5);
    }
    
    const saved = saveProject({
      id: projectId,
      name: projectName,
      type: 'woven',
      thumbnail,
      data: {
        template: { warpEnds, weftPicks, numShafts, numTreadles },
        threading, tieup, treadling, drawdown,
        warpColors, weftColors
      }
    });
    setProjectId(saved.id);
    alert('Project saved!');
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('woven-export-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#10131E', scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(20);
      pdf.text(`Tech Pack: ${projectName}`, 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Warp Ends: ${warpEnds} | Weft Picks: ${weftPicks}`, 14, 28);
      pdf.text(`Structure: ${structureName} (${classification})`, 14, 34);
      pdf.text(`Max Warp Float: ${maxWarpFloat} | Max Weft Float: ${maxWeftFloat}`, 14, 40);

      // Add image proportionally
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 28;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 14, 50, imgWidth, imgHeight);
      pdf.save(`TechPack_${projectName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF', err);
    }
  };

  const loadTemplate = (template) => {
    setWarpEnds(template.warpEnds);
    setWeftPicks(template.weftPicks);
    setNumShafts(template.numShafts);
    setNumTreadles(template.numTreadles);
    setThreading(template.threading);
    setTieup(template.tieup);
    setTreadling(template.treadling);
    setDrawdown(computeDrawdown(template.threading, template.tieup, template.treadling));
    setWarpColors(Array(template.warpEnds).fill('#ffffff'));
    setWeftColors(Array(template.weftPicks).fill('#3b82f6'));
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={onNavigateHome} style={{ padding: '4px 12px' }}>← Home</button>
          <input 
            type="text" 
            value={projectName} 
            onChange={e => setProjectName(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '20px', fontFamily: 'var(--font-woven-display)', outline: 'none', width: '200px' }} 
            placeholder="Project Name..."
          />
        </div>
        <div className="header-actions">
          <div className="zoom-control-bar" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Zoom:</span>
            <button 
              onClick={() => setCellSize(prev => Math.max(18, prev - 4))} 
              className="btn-secondary" 
              style={{ padding: '2px 8px', fontSize: '13px', lineHeight: 1 }}
              title="Zoom Out"
            >-</button>
            <span style={{ fontSize: '11px', minWidth: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: '600', color: cellSize === 64 ? 'var(--accent-primary)' : 'inherit' }}>
              {Math.round((cellSize / 36) * 100)}%
            </span>
            <button 
              onClick={() => setCellSize(prev => Math.min(96, prev + 4))} 
              className="btn-secondary" 
              style={{ padding: '2px 8px', fontSize: '13px', lineHeight: 1 }}
              title="Zoom In"
            >+</button>
            <button 
              onClick={() => setCellSize(26)} 
              className="btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '10px', fontWeight: cellSize === 26 ? 'bold' : 'normal', color: cellSize === 26 ? 'var(--accent-primary)' : 'inherit', background: cellSize === 26 ? 'rgba(57, 255, 20, 0.12)' : undefined }}
              title="Fit to Mobile Screen (26px)"
            >Fit</button>
            <button 
              onClick={() => setCellSize(36)} 
              className="btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '10px', opacity: 0.8 }}
              title="Reset to 100% (36px)"
            >100%</button>
            <button 
              onClick={() => setCellSize(64)} 
              className="btn-secondary" 
              style={{ padding: '2px 7px', fontSize: '10px', fontWeight: cellSize === 64 ? 'bold' : 'normal', color: cellSize === 64 ? 'var(--accent-primary)' : 'inherit', background: cellSize === 64 ? 'rgba(57, 255, 20, 0.12)' : undefined }}
              title="Preset Zoom 178% (Optimized for Larger Screens)"
            >178%</button>
          </div>
          <button className="btn-secondary" onClick={handleSaveProject} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Save size={14} /> Save
          </button>
          <button className="btn-secondary" onClick={handleExportPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> Tech Pack
          </button>
          <button className="btn-secondary" onClick={handleExportPNG} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <ImageIcon size={14} /> PNG
          </button>
          <button className="btn-primary" onClick={handleExportWIF} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Download size={14} /> WIF
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
          <span>4-Part Grids</span>
        </button>
        <button 
          onClick={() => setMobileTab('controls')} 
          className={`woven-mob-tab ${mobileTab === 'controls' ? 'active' : ''}`}
        >
          <Sliders size={15} />
          <span>Yarn & Parameters</span>
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
      <div className="workspace-container woven-app">

        {/* Left Sidebar */}
        <div className={`sidebar-left ${mobileTab !== 'controls' ? 'woven-mob-hidden' : ''}`} style={{ width: '260px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              warpColors={warpColors} setWarpColors={setWarpColors}
              weftColors={weftColors} setWeftColors={setWeftColors}
              selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            />
          </div>
          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            © Developed by Aseer Awsaf
          </div>
        </div>

        {/* Center: 3-Panel Editor (L-Shape Layout) */}
        <div id="woven-export-area" className={`center-canvas ${mobileTab !== 'grid' ? 'woven-mob-hidden' : ''}`} style={{ background: 'var(--bg-grid)' }}>
          <div className="mobile-canvas-banner">
            <span>↔ Tap cells to toggle interlacement • Pinch or use Zoom presets (Fit / 100% / 178%)</span>
          </div>

          <div className="woven-grid-layout">
            
            {/* Top Left: Drafting Plan */}
            <div>
              <DraftingGrid
                threading={threading} setThreading={setThreading}
                numShafts={numShafts} warpEnds={warpEnds}
                size={cellSize}
              />
            </div>
            
            {/* Top Right: Tie-up */}
            <div>
              <TieupGrid
                tieup={tieup} setTieup={setTieup}
                numShafts={numShafts} numTreadles={numTreadles}
                size={cellSize}
              />
            </div>

            {/* Bottom Left: Weaving Plan (Drawdown) */}
            <div>
              <WeavingGrid
                drawdown={drawdown} setDrawdown={setDrawdown}
                warpEnds={warpEnds} weftPicks={weftPicks}
                colorSim={colorSim}
                warpColors={warpColors} setWarpColors={setWarpColors}
                weftColors={weftColors} setWeftColors={setWeftColors}
                selectedColor={selectedColor}
                size={cellSize}
              />
            </div>

            {/* Bottom Right: Treadling Plan */}
            <div>
              <TreadlingGrid
                treadling={treadling} setTreadling={setTreadling}
                weftPicks={weftPicks} numTreadles={numTreadles}
                size={cellSize}
              />
            </div>

          </div>
        </div>

        {/* Right Sidebar: Intelligence */}
        <div className={`sidebar-right ${mobileTab !== 'intelligence' ? 'woven-mob-hidden' : ''}`} style={{ width: '240px', padding: '16px' }}>
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
