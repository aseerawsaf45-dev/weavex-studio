import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scissors, 
  Grid3X3, 
  Layers, 
  FileText, 
  Calculator, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle2,
  HardDrive,
  Copy,
  Activity,
  Layers2,
  Compass,
  Play,
  RotateCcw,
  Palette,
  BarChart3,
  BookmarkCheck
} from 'lucide-react';
import { getProjects, deleteProject, saveProject } from './utils/projectStore';
import Calculations from './components/Calculations';
import './Dashboard.css';

// 4 Curated Industrial Blueprints for empty state & preview
const CURATED_BLUEPRINTS = [
  {
    id: 'bp_twill_2_2',
    name: '2/2 Right-Hand Twill',
    type: 'woven',
    badge: 'Dobby Woven',
    accent: '#10b981',
    desc: 'Standard 4-shaft balanced diagonal twill repeat with uniform 2-float interlacements.',
    grid: [
      [1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
    ]
  },
  {
    id: 'bp_plain_1_1',
    name: 'Plain 1/1 Balanced Weave',
    type: 'woven',
    badge: 'Dobby Woven',
    accent: '#34d399',
    desc: 'Maximum interlacement density for crisp poplin, fine shirting, and canvas fabrics.',
    grid: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
    ]
  },
  {
    id: 'bp_jersey_feeder',
    name: 'Single Jersey Feeder Stripe',
    type: 'knit',
    badge: 'Circular Knit',
    accent: '#38bdf8',
    desc: 'Knit & tuck synchronized feeder colorway matrix with needle cycle coordination.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 1, 2, 1, 2, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 2, 1, 2, 1, 2],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 1, 2, 1, 2, 1, 2, 1],
    ]
  },
  {
    id: 'bp_rib_1_1',
    name: '1×1 Rib Double Jersey',
    type: 'doublejersey',
    badge: 'Dial & Cylinder',
    accent: '#f43f5e',
    desc: 'Dual-bed needle gaiting sync with balanced face/back wale tension for collar ribs.',
    grid: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
    ]
  }
];

// Presets for the Interactive Loom Simulator
const SIMULATOR_PRESETS = {
  twill: [
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
  ],
  plain: [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
  ],
  satin: [
    [1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0],
  ],
  basket: [
    [1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1],
  ]
};

const COLOR_PALETTES = [
  { name: 'Emerald', warp: '#10b981', weft: '#064e3b' },
  { name: 'Azure', warp: '#38bdf8', weft: '#0c4a6e' },
  { name: 'Amber', warp: '#fbbf24', weft: '#78350f' },
  { name: 'Crimson', warp: '#f43f5e', weft: '#881337' },
  { name: 'Pearl', warp: '#f8fafc', weft: '#334155' }
];

const INDUSTRIAL_FABRIC_SPECS = [
  { name: 'Classic Denim 3/1 Z-Twill', discipline: 'Woven Dobby', epi: '64', ppi: '44', warpCount: '7s Ne Indigo', weftCount: '8s Ne Ecru', gsm: '445 g/m²', shafts: '4 Shafts' },
  { name: 'Executive Shirting Poplin 1/1', discipline: 'Woven Plain', epi: '133', ppi: '72', warpCount: '40s Ne Combed', weftCount: '40s Ne Combed', gsm: '124 g/m²', shafts: '2-4 Shafts' },
  { name: 'Royal Oxford 2×1 Basket', discipline: 'Woven Fancy', epi: '96', ppi: '56', warpCount: '30s/2 Ne', weftCount: '30s/2 Ne', gsm: '148 g/m²', shafts: '4 Shafts' },
  { name: 'Combed Cotton Single Jersey', discipline: 'Circular Knit', epi: '28 Gauge', ppi: '40 Courses/in', warpCount: '30s Ne Ring Spun', weftCount: 'Feeder Sync', gsm: '165 g/m²', shafts: 'Single Bed' },
  { name: '1×1 Rib Structural Collar Trim', discipline: 'Double Jersey', epi: '18 Gauge', ppi: '32 Courses/in', warpCount: '24s Ne Cotton', weftCount: 'Dial & Cylinder', gsm: '225 g/m²', shafts: 'Dual Bed' },
  { name: 'Locknit 2-Bar Tricot Fabric', discipline: 'Warp Knit', epi: '32 Gauge', ppi: '60 Courses/in', warpCount: '40 Denier Nylon', weftCount: 'Chain Notation', gsm: '95 g/m²', shafts: '2 Guide Bars' }
];

const Dashboard = ({ onSelectMode, onOpenProject, initialTab = 'dashboard' }) => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Loom Simulator State
  const [simGrid, setSimGrid] = useState(SIMULATOR_PRESETS.twill);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activePreset, setActivePreset] = useState('twill');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this project from your local storage vault?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const handleLaunchBlueprint = (bp) => {
    const newProject = saveProject({
      name: bp.name,
      type: bp.type,
      data: { grid: bp.grid },
      lastEdited: new Date().toISOString()
    });
    setProjects(getProjects());
    if (bp.type === 'doublejersey') {
      onSelectMode('doublejersey');
    } else {
      onOpenProject(newProject);
    }
  };

  const handleSelectBlueprintToSim = (bp) => {
    if (bp.grid) {
      // Map any knit 2 values to 0 for binary simulator
      const binaryGrid = bp.grid.map(row => row.map(val => val === 1 ? 1 : 0));
      setSimGrid(binaryGrid);
      setActivePreset('');
    }
  };

  const toggleSimCell = (rIdx, cIdx) => {
    setSimGrid(prev => {
      const next = prev.map((row, r) => 
        row.map((cell, c) => (r === rIdx && c === cIdx ? (cell === 1 ? 0 : 1) : cell))
      );
      return next;
    });
    setActivePreset('');
  };

  const handleApplyPreset = (key) => {
    setActivePreset(key);
    setSimGrid(SIMULATOR_PRESETS[key]);
  };

  // Real-time Telemetry Calculations from simGrid
  const telemetry = useMemo(() => {
    let totalCells = 0;
    let warpUp = 0;
    let interlacements = 0;
    const rows = simGrid.length;
    const cols = simGrid[0]?.length || 8;

    // Distinct shafts needed (unique rows)
    const uniqueRows = new Set();

    for (let r = 0; r < rows; r++) {
      let rowSig = '';
      for (let c = 0; c < cols; c++) {
        totalCells++;
        if (simGrid[r][c] === 1) warpUp++;
        rowSig += simGrid[r][c];

        // Check horizontal transition
        const nextC = (c + 1) % cols;
        if (simGrid[r][c] !== simGrid[r][nextC]) {
          interlacements++;
        }
      }
      uniqueRows.add(rowSig);
    }

    const densityPct = Math.round((interlacements / (rows * cols)) * 100);
    const warpCoverPct = Math.round((warpUp / totalCells) * 100);
    const requiredShafts = Math.max(2, uniqueRows.size);
    const tightnessScore = ((densityPct * 0.7) + (warpCoverPct * 0.3)).toFixed(1);

    return {
      densityPct,
      warpCoverPct,
      requiredShafts,
      tightnessScore
    };
  }, [simGrid]);

  const handleExportSimToWeaveDraft = () => {
    const newProj = saveProject({
      name: `Custom Structure (${activePreset ? activePreset.toUpperCase() : 'STUDIO'})`,
      type: 'woven',
      data: { grid: simGrid },
      lastEdited: new Date().toISOString()
    });
    setProjects(getProjects());
    onOpenProject(newProj);
  };

  const filteredProjects = projects.filter(p => 
    (p.name || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePalette = COLOR_PALETTES[selectedColorIdx];

  return (
    <div className="dash-layout">
      
      {/* Subtle Ambient Background Glow */}
      <div className="dash-ambient-glow" />

      {/* Desktop Sidebar */}
      <aside className="dash-sidebar">
        
        {/* Brand Group */}
        <div className="dash-brand-block">
          <img src="/logo.png" alt="WeaveX" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div>
            <h1 className="dash-brand-title">WeaveX</h1>
            <div className="dash-version-badge">v2.6 STUDIO</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflowY: 'auto' }}>
          
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <div className="nav-left">
              <Compass size={17} />
              <span>Workspace Dashboard</span>
            </div>
          </button>

          <div className="dash-nav-section-title">Design Suites</div>

          <button 
            onClick={() => onSelectMode('woven')} 
            className="dash-nav-item"
          >
            <div className="nav-left">
              <Scissors size={17} style={{ color: '#10b981' }} />
              <span>WeaveDraft 4-Part</span>
            </div>
            <ArrowRight size={13} style={{ opacity: 0.4 }} />
          </button>

          <button 
            onClick={() => onSelectMode('knit')} 
            className="dash-nav-item"
          >
            <div className="nav-left">
              <Grid3X3 size={17} style={{ color: '#38bdf8' }} />
              <span>KnitStudio Matrix</span>
            </div>
            <ArrowRight size={13} style={{ opacity: 0.4 }} />
          </button>

          <button 
            onClick={() => onSelectMode('doublejersey')} 
            className="dash-nav-item"
          >
            <div className="nav-left">
              <Layers size={17} style={{ color: '#f43f5e' }} />
              <span>Double Jersey Bed</span>
            </div>
            <ArrowRight size={13} style={{ opacity: 0.4 }} />
          </button>

          <button 
            onClick={() => onSelectMode('lapping')} 
            className="dash-nav-item"
          >
            <div className="nav-left">
              <FileText size={17} style={{ color: '#fbbf24' }} />
              <span>Lapping Diagram</span>
            </div>
            <ArrowRight size={13} style={{ opacity: 0.4 }} />
          </button>

          <div className="dash-nav-section-title">Utilities &amp; Math</div>

          <button 
            onClick={() => setActiveTab('calculations')} 
            className={`dash-nav-item ${activeTab === 'calculations' ? 'active' : ''}`}
          >
            <div className="nav-left">
              <Calculator size={17} style={{ color: '#34d399' }} />
              <span>Yield Engine &amp; GSM</span>
            </div>
          </button>

        </nav>

        {/* Back to Showcase Link */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button 
            onClick={() => onSelectMode('landing')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%', 
              padding: '11px 14px', 
              borderRadius: '10px', 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: '600',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
              e.currentTarget.style.color = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={14} />
              <span>Landing Showcase</span>
            </span>
            <ArrowRight size={13} />
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="dash-main">
        
        {/* Workspace Header */}
        <header className="dash-header-row">
          <div>
            <div className="dash-breadcrumb-tag">
              <Sparkles size={12} />
              <span>WeaveX Architecture • Studio Core</span>
            </div>
            <h2 className="dash-title">
              {activeTab === 'calculations' ? 'Textile Yield & Mathematical Engine' : 'Textile Structure Workspace'}
            </h2>
            <p className="dash-subtitle">
              {activeTab === 'calculations' 
                ? 'Precision yarn count conversions, take-up crimp calculation, fabric GSM prediction, and manufacturing cost formula.' 
                : 'Select an industrial drafting discipline, simulate structure matrices in real-time, or deploy curated archetypes.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => onSelectMode('landing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                color: '#ffffff',
                fontSize: '12.5px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <ExternalLink size={14} />
              <span>Landing Showcase</span>
            </button>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Executive Studio KPI Strip */}
            <div className="dash-kpi-strip">
              
              <div className="dash-kpi-card">
                <div className="dash-kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                  <Layers2 size={20} />
                </div>
                <div>
                  <div className="dash-kpi-label">Active Modules</div>
                  <div className="dash-kpi-val">5 Synchronized</div>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon-box" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="dash-kpi-label">Harness Shafts</div>
                  <div className="dash-kpi-val">32-Dobby Depth</div>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon-box" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <div className="dash-kpi-label">Precision Yield</div>
                  <div className="dash-kpi-val">0.01g Density GSM</div>
                </div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-icon-box" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
                  <Database size={20} />
                </div>
                <div>
                  <div className="dash-kpi-label">Local Vault</div>
                  <div className="dash-kpi-val">{projects.length} Saved Structure{projects.length !== 1 ? 's' : ''}</div>
                </div>
              </div>

            </div>

            {/* CREATE NEW SECTION */}
            <section style={{ marginBottom: '32px' }}>
              <div className="dash-section-header">
                <div className="dash-section-title">
                  <Plus size={14} style={{ color: '#10b981' }} />
                  <span>Create New Structure</span>
                </div>
              </div>

              <div className="dash-create-grid">
                
                {/* 1. WeaveDraft 4-Part Studio */}
                <div 
                  onClick={() => onSelectMode('woven')} 
                  className="dash-create-card"
                  style={{ '--card-accent': '#10b981' }}
                >
                  <div className="dash-card-icon-frame" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <Scissors size={22} />
                  </div>
                  <span className="dash-card-tag" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    4-Part Matrix
                  </span>
                  <h3 className="dash-card-title">New WeaveDraft</h3>
                  <p className="dash-card-desc">
                    Synchronized Weave Plan, Draft Shafts, Lifting/Peg plan, and Denting matrices.
                  </p>
                  <div className="dash-card-cta">
                    <span>Open WeaveDraft</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* 2. KnitStudio Matrix */}
                <div 
                  onClick={() => onSelectMode('knit')} 
                  className="dash-create-card"
                  style={{ '--card-accent': '#38bdf8' }}
                >
                  <div className="dash-card-icon-frame" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <Grid3X3 size={22} />
                  </div>
                  <span className="dash-card-tag" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    Cam Matrix
                  </span>
                  <h3 className="dash-card-title">New KnitStudio</h3>
                  <p className="dash-card-desc">
                    Single jersey circular &amp; flatbed cam matrix with multi-feeder colorway coordination.
                  </p>
                  <div className="dash-card-cta">
                    <span>Open KnitStudio</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* 3. Double Jersey Bed */}
                <div 
                  onClick={() => onSelectMode('doublejersey')} 
                  className="dash-create-card"
                  style={{ '--card-accent': '#f43f5e' }}
                >
                  <div className="dash-card-icon-frame" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
                    <Layers size={22} />
                  </div>
                  <span className="dash-card-tag" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
                    Dual-Bed Gaiting
                  </span>
                  <h3 className="dash-card-title">Double Jersey</h3>
                  <p className="dash-card-desc">
                    Dial and cylinder needle synchronization for 1×1 Rib, 2×2 Rib, and Interlock structures.
                  </p>
                  <div className="dash-card-cta">
                    <span>Open Double Jersey</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* 4. Lapping Diagram */}
                <div 
                  onClick={() => onSelectMode('lapping')} 
                  className="dash-create-card"
                  style={{ '--card-accent': '#fbbf24' }}
                >
                  <div className="dash-card-icon-frame" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                    <FileText size={22} />
                  </div>
                  <span className="dash-card-tag" style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
                    Warp Knitting
                  </span>
                  <h3 className="dash-card-title">Lapping Diagram</h3>
                  <p className="dash-card-desc">
                    Visual guide bar displacement curves for Tricot and Raschel with chain notation extraction.
                  </p>
                  <div className="dash-card-cta">
                    <span>Open Lapping</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* 5. Yield Engine */}
                <div 
                  onClick={() => setActiveTab('calculations')} 
                  className="dash-create-card"
                  style={{ '--card-accent': '#34d399' }}
                >
                  <div className="dash-card-icon-frame" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34d399' }}>
                    <Calculator size={22} />
                  </div>
                  <span className="dash-card-tag" style={{ background: 'rgba(52, 211, 153, 0.12)', color: '#34d399' }}>
                    Mathematical Core
                  </span>
                  <h3 className="dash-card-title">Yield Engine</h3>
                  <p className="dash-card-desc">
                    Yarn count conversions, take-up crimp, fabric GSM prediction, and manufacturing cost formula.
                  </p>
                  <div className="dash-card-cta">
                    <span>Launch Engine</span>
                    <ArrowRight size={13} />
                  </div>
                </div>

              </div>
            </section>

            {/* TWO-COLUMN EXECUTIVE WORKSPACE SPLIT (Fills Desktop & Large Screens) */}
            <div className="dash-workspace-split">
              
              {/* LEFT COLUMN: Curated Industrial Blueprints & Saved Vault */}
              <div>
                
                <div className="dash-section-header">
                  <div className="dash-section-title">
                    <Database size={14} style={{ color: '#38bdf8' }} />
                    <span>{projects.length > 0 ? 'Saved Project Vault' : 'Curated Industrial Blueprints'}</span>
                  </div>
                  
                  {projects.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Search saved structures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          width: '180px'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* State A: User has saved projects */}
                {projects.length > 0 ? (
                  <div className="dash-projects-grid">
                    {filteredProjects.map((p) => (
                      <div 
                        key={p.id} 
                        onClick={() => onOpenProject(p)} 
                        className="dash-project-card"
                      >
                        <div className="dash-project-thumb">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                              <Scissors size={26} />
                              <span style={{ fontSize: '10.5px', fontFamily: 'JetBrains Mono, monospace' }}>{p.type?.toUpperCase()}</span>
                            </div>
                          )}
                          <span 
                            style={{ 
                              position: 'absolute', 
                              top: '10px', 
                              right: '10px', 
                              fontSize: '9.5px', 
                              fontFamily: 'JetBrains Mono, monospace', 
                              padding: '2px 7px', 
                              borderRadius: '4px', 
                              background: 'rgba(0, 0, 0, 0.75)', 
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: p.type === 'woven' ? '#10b981' : '#38bdf8' 
                            }}
                          >
                            {p.type === 'woven' ? 'WeaveDraft' : 'KnitStudio'}
                          </span>
                        </div>

                        <div className="dash-project-info">
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14.5px', color: '#ffffff', marginBottom: '4px' }}>
                              {p.name || 'Untitled Structure'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                              <Clock size={11} />
                              <span>{new Date(p.lastEdited).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={(e) => handleDelete(e, p.id)} 
                              style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: '#64748b', 
                                cursor: 'pointer', 
                                padding: '6px', 
                                borderRadius: '6px',
                                transition: 'color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                              title="Delete Project"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* State B: Empty State with Curated Industrial Blueprints */
                  <div>
                    <div style={{ 
                      padding: '14px 18px', 
                      borderRadius: '12px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.06)', 
                      marginBottom: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                        <strong style={{ color: '#ffffff', marginRight: '6px' }}>Instant Blueprints:</strong>
                        Click any card to load its matrix into the Live Simulator or launch into production editor.
                      </div>
                    </div>

                    <div className="dash-projects-grid">
                      {CURATED_BLUEPRINTS.map((bp) => (
                        <div 
                          key={bp.id} 
                          onClick={() => {
                            handleSelectBlueprintToSim(bp);
                          }} 
                          className="dash-blueprint-card"
                          title="Click to preview in Live Simulator"
                        >
                          {/* Mini Matrix Visual Loom Swatch */}
                          <div className="dash-blueprint-preview-box">
                            <div className="dash-mini-loom-preview">
                              {bp.grid.map((row, rIdx) => 
                                row.map((cell, cIdx) => (
                                  <div 
                                    key={`${rIdx}-${cIdx}`} 
                                    className="dash-mini-cell"
                                    style={{
                                      backgroundColor: cell === 1 ? bp.accent : (cell === 2 ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)'),
                                      boxShadow: cell === 1 ? `0 0 4px ${bp.accent}80` : 'none'
                                    }}
                                  />
                                ))
                              )}
                            </div>
                            <span 
                              style={{ 
                                position: 'absolute', 
                                top: '8px', 
                                right: '8px', 
                                fontSize: '9px', 
                                fontFamily: 'JetBrains Mono, monospace', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                background: 'rgba(0, 0, 0, 0.7)', 
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: bp.accent 
                              }}
                            >
                              {bp.badge}
                            </span>
                          </div>

                          <div>
                            <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>
                              {bp.name}
                            </h4>
                            <p style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.45', margin: '0 0 12px 0', minHeight: '34px' }}>
                              {bp.desc}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLaunchBlueprint(bp);
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  color: bp.accent,
                                  fontSize: '11px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'pointer'
                                }}
                              >
                                <span>Launch Blueprint</span>
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Interactive Live Loom Simulator & Real-time Telemetry */}
              <div className="dash-simulator-console">
                
                <div className="dash-simulator-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} style={{ color: '#10b981' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                        Live Loom Matrix Simulator
                      </h3>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#64748b', margin: '3px 0 0 0', fontFamily: 'JetBrains Mono, monospace' }}>
                      Interactive Interlacement Testing • 8×8 Synchronized Repeat
                    </p>
                  </div>

                  <button
                    onClick={handleExportSimToWeaveDraft}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#10b981',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
                    title="Transfer this matrix to WeaveDraft 4-Part Studio"
                  >
                    <span>Clone to Studio</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Preset Switcher Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', textTransform: 'uppercase' }}>
                      Patterns:
                    </span>
                    {Object.keys(SIMULATOR_PRESETS).map(key => (
                      <button
                        key={key}
                        onClick={() => handleApplyPreset(key)}
                        style={{
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: activePreset === key ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: activePreset === key ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: activePreset === key ? '#10b981' : '#94a3b8',
                          fontSize: '10.5px',
                          fontFamily: 'JetBrains Mono, monospace',
                          textTransform: 'capitalize',
                          cursor: 'pointer'
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {/* Palette Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Palette size={13} style={{ color: '#64748b' }} />
                    {COLOR_PALETTES.map((pal, idx) => (
                      <div
                        key={pal.name}
                        onClick={() => setSelectedColorIdx(idx)}
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '50%',
                          backgroundColor: pal.warp,
                          cursor: 'pointer',
                          outline: selectedColorIdx === idx ? '2px solid #ffffff' : 'none',
                          outlineOffset: '2px',
                          transition: 'transform 0.15s ease'
                        }}
                        title={pal.name}
                      />
                    ))}
                  </div>
                </div>

                {/* The Interactive Weave Grid Box */}
                <div className="dash-sim-grid-wrap">
                  <div 
                    className="dash-sim-interactive-grid" 
                    style={{ gridTemplateColumns: `repeat(${simGrid[0]?.length || 8}, 22px)` }}
                  >
                    {simGrid.map((row, rIdx) => 
                      row.map((cell, cIdx) => (
                        <div
                          key={`sim-${rIdx}-${cIdx}`}
                          className="dash-sim-cell"
                          onClick={() => toggleSimCell(rIdx, cIdx)}
                          style={{
                            backgroundColor: cell === 1 ? activePalette.warp : activePalette.weft,
                            boxShadow: cell === 1 ? `0 0 6px ${activePalette.warp}80` : 'none',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                          title={`Row ${rIdx + 1}, Col ${cIdx + 1}: Click to flip lift state`}
                        >
                          <span style={{ fontSize: '8px', color: cell === 1 ? '#000000' : '#64748b', fontWeight: 'bold' }}>
                            {cell === 1 ? '↑' : '·'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: '10px' }}>
                    ↑ Warp Over (Face) • · Weft Over (Back) • Click any cell to toggle
                  </div>
                </div>

                {/* Real-time Mathematical Telemetry Chips */}
                <div className="dash-telemetry-metrics-grid">
                  <div className="dash-metric-chip">
                    <div className="dash-metric-chip-label">Interlacement</div>
                    <div className="dash-metric-chip-val" style={{ color: '#10b981' }}>
                      {telemetry.densityPct}%
                    </div>
                  </div>

                  <div className="dash-metric-chip">
                    <div className="dash-metric-chip-label">Warp Cover</div>
                    <div className="dash-metric-chip-val" style={{ color: '#38bdf8' }}>
                      {telemetry.warpCoverPct}%
                    </div>
                  </div>

                  <div className="dash-metric-chip">
                    <div className="dash-metric-chip-label">Harness Shafts</div>
                    <div className="dash-metric-chip-val" style={{ color: '#fbbf24' }}>
                      {telemetry.requiredShafts} Min
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: '10px 14px', 
                  borderRadius: '10px', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#94a3b8'
                }}>
                  <span>Fabric Tightness Rating:</span>
                  <span style={{ color: '#ffffff', fontWeight: '700' }}>{telemetry.tightnessScore} / 100 Index</span>
                </div>

              </div>

            </div>

            {/* INDUSTRIAL TEXTILE SPECIFICATIONS & REFERENCE MATRIX */}
            <section className="dash-specs-section">
              <div className="dash-section-header" style={{ marginBottom: '14px' }}>
                <div className="dash-section-title">
                  <BookmarkCheck size={14} style={{ color: '#fbbf24' }} />
                  <span>Commercial Fabric Construction Standards &amp; Engineering Matrix</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  ISO / ASTM / Textile Industry Standard Baselines
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="dash-specs-table">
                  <thead>
                    <tr>
                      <th>Archetype Name</th>
                      <th>Discipline</th>
                      <th>EPI / Gauge</th>
                      <th>PPI / Courses</th>
                      <th>Warp Yarn Count</th>
                      <th>Weft Yarn Count</th>
                      <th>Target GSM</th>
                      <th>Dobby Linkage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDUSTRIAL_FABRIC_SPECS.map((spec, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '600', color: '#ffffff' }}>{spec.name}</td>
                        <td>
                          <span style={{ 
                            fontSize: '10px', 
                            padding: '2px 7px', 
                            borderRadius: '4px', 
                            background: spec.discipline.includes('Woven') ? 'rgba(16, 185, 129, 0.12)' : (spec.discipline.includes('Double') ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.12)'),
                            color: spec.discipline.includes('Woven') ? '#10b981' : (spec.discipline.includes('Double') ? '#f43f5e' : '#38bdf8'),
                            fontFamily: 'JetBrains Mono, monospace'
                          }}>
                            {spec.discipline}
                          </span>
                        </td>
                        <td className="mono">{spec.epi}</td>
                        <td className="mono">{spec.ppi}</td>
                        <td className="mono">{spec.warpCount}</td>
                        <td className="mono">{spec.weftCount}</td>
                        <td className="mono" style={{ color: '#fbbf24', fontWeight: '600' }}>{spec.gsm}</td>
                        <td className="mono" style={{ color: '#94a3b8' }}>{spec.shafts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Studio Executive Footer */}
            <footer className="dash-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>© Developed by Aseer Awsaf</span>
                <span>•</span>
                <span style={{ color: '#94a3b8' }}>Digitalization of Fabric Structures Design</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>Real-Time Engine: ACTIVE (60 FPS)</span>
                <span>•</span>
                <span>Storage: Local Vault</span>
              </div>
            </footer>

          </>
        )}

        {/* Calculations Tab Content */}
        {activeTab === 'calculations' && (
          <section>
            <Calculations />
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
