import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  BookmarkCheck,
  Eye,
  Download,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
  Sliders,
  Scale,
  Zap,
  Check
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
  ],
  herringbone: [
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 1],
  ],
  diamond: [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
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
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');

  // Interactive Live Loom Simulator State
  const [simGrid, setSimGrid] = useState(SIMULATOR_PRESETS.twill);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activePreset, setActivePreset] = useState('twill');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'cloth'

  // Yarn Converter State
  const [inputCount, setInputCount] = useState('30');
  const [inputSystem, setInputSystem] = useState('ne');
  const [copiedKey, setCopiedKey] = useState(null);

  // Quick GSM Estimator State
  const [gsmInputs, setGsmInputs] = useState({
    warpNe: 30,
    weftNe: 30,
    epi: 80,
    ppi: 70,
    crimp: 6
  });

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

  // Matrix Transformation Functions
  const handleInvertMatrix = () => {
    setSimGrid(prev => prev.map(row => row.map(cell => cell === 1 ? 0 : 1)));
    setActivePreset('');
  };

  const handleShiftWarp = () => {
    setSimGrid(prev => {
      const lastRow = prev[prev.length - 1];
      return [lastRow, ...prev.slice(0, prev.length - 1)];
    });
    setActivePreset('');
  };

  const handleShiftWeft = () => {
    setSimGrid(prev => prev.map(row => {
      const lastCell = row[row.length - 1];
      return [lastCell, ...row.slice(0, row.length - 1)];
    }));
    setActivePreset('');
  };

  const handleMirrorH = () => {
    setSimGrid(prev => prev.map(row => [...row].reverse()));
    setActivePreset('');
  };

  const handleMirrorV = () => {
    setSimGrid(prev => [...prev].reverse());
    setActivePreset('');
  };

  const handleResetSim = () => {
    handleApplyPreset('twill');
  };

  // Real-time Telemetry Calculations from simGrid
  const telemetry = useMemo(() => {
    let totalCells = 0;
    let warpUp = 0;
    let interlacements = 0;
    const rows = simGrid.length;
    const cols = simGrid[0]?.length || 8;

    const uniqueRows = new Set();

    for (let r = 0; r < rows; r++) {
      let rowSig = '';
      for (let c = 0; c < cols; c++) {
        totalCells++;
        if (simGrid[r][c] === 1) warpUp++;
        rowSig += simGrid[r][c];

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

  // Download Canvas Swatch
  const handleDownloadSwatch = () => {
    const canvas = document.createElement('canvas');
    const scale = 32;
    const rows = simGrid.length;
    const cols = simGrid[0].length;
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    const ctx = canvas.getContext('2d');

    const pal = COLOR_PALETTES[selectedColorIdx];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isWarp = simGrid[r][c] === 1;
        ctx.fillStyle = isWarp ? pal.warp : pal.weft;
        ctx.fillRect(c * scale, r * scale, scale, scale);

        // Grid line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * scale, r * scale, scale, scale);
      }
    }

    const link = document.createElement('a');
    link.download = `weavex-structure-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Yarn Numbering Conversions
  const convertedCounts = useMemo(() => {
    const val = parseFloat(inputCount);
    if (!val || val <= 0) return { ne: '-', nm: '-', tex: '-', denier: '-', dtex: '-' };

    let tex = 0;
    if (inputSystem === 'ne') tex = 590.54 / val;
    else if (inputSystem === 'nm') tex = 1000 / val;
    else if (inputSystem === 'tex') tex = val;
    else if (inputSystem === 'denier') tex = val / 9;
    else if (inputSystem === 'dtex') tex = val / 10;

    return {
      ne: (590.54 / tex).toFixed(2),
      nm: (1000 / tex).toFixed(2),
      tex: tex.toFixed(2),
      denier: (tex * 9).toFixed(1),
      dtex: (tex * 10).toFixed(1)
    };
  }, [inputCount, inputSystem]);

  const copyToClipboard = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // Quick GSM Calculation
  const quickGsm = useMemo(() => {
    const { warpNe, weftNe, epi, ppi, crimp } = gsmInputs;
    if (!warpNe || !weftNe || !epi || !ppi) return { gsm: 0, oz: 0, classification: 'N/A' };

    const crimpMultiplier = 1 + (crimp / 100);
    // Standard industry formula: GSM = (EPI / Warp_Ne + PPI / Weft_Ne) * 23.25 * crimpFactor (or 25.6 standard)
    const warpWeightGsm = (epi / warpNe) * 24.6 * crimpMultiplier;
    const weftWeightGsm = (ppi / weftNe) * 24.6 * crimpMultiplier;
    const totalGsm = Math.round(warpWeightGsm + weftWeightGsm);
    const ozPerYd2 = (totalGsm / 33.906).toFixed(1);

    let classification = 'Medium Weight';
    if (totalGsm < 110) classification = 'Lightweight / Shirting / Voile';
    else if (totalGsm < 190) classification = 'Medium Shirting / Poplin';
    else if (totalGsm < 300) classification = 'Bottom-weight / Chino Twill';
    else classification = 'Heavy Denim / Canvas / Upholstery';

    return {
      totalGsm,
      ozPerYd2,
      warpWeightGsm: Math.round(warpWeightGsm),
      weftWeightGsm: Math.round(weftWeightGsm),
      classification
    };
  }, [gsmInputs]);

  // Project filtering
  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.name || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDisc = selectedDiscipline === 'all' || p.type === selectedDiscipline;
    return matchesSearch && matchesDisc;
  });

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Discipline filter chips */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['all', 'woven', 'knit', 'doublejersey'].map(disc => (
                          <button
                            key={disc}
                            onClick={() => setSelectedDiscipline(disc)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontFamily: 'JetBrains Mono, monospace',
                              background: selectedDiscipline === disc ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                              border: selectedDiscipline === disc ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                              color: selectedDiscipline === disc ? '#38bdf8' : '#94a3b8',
                              cursor: 'pointer',
                              textTransform: 'capitalize'
                            }}
                          >
                            {disc}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Search vault..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '11.5px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          width: '140px'
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
                            {p.type === 'woven' ? 'WeaveDraft' : (p.type === 'knit' ? 'KnitStudio' : 'Double Jersey')}
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
                        Click any card to load into the Live Simulator or launch into production editor.
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

              {/* RIGHT COLUMN: Interactive Live Loom Simulator 2.0 */}
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
                      8×8 Synchronized Interlacement Engine • Live Render
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '7px', padding: '2px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <button
                        onClick={() => setViewMode('grid')}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: 'none',
                          background: viewMode === 'grid' ? '#10b981' : 'transparent',
                          color: viewMode === 'grid' ? '#000000' : '#94a3b8',
                          fontSize: '10.5px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('cloth')}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: 'none',
                          background: viewMode === 'cloth' ? '#10b981' : 'transparent',
                          color: viewMode === 'cloth' ? '#000000' : '#94a3b8',
                          fontSize: '10.5px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        3D Woven
                      </button>
                    </div>

                    <button
                      onClick={handleDownloadSwatch}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Download PNG Swatch"
                    >
                      <Download size={13} />
                    </button>

                    <button
                      onClick={handleExportSimToWeaveDraft}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
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
                </div>

                {/* Pattern Presets & Colorways */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', textTransform: 'uppercase' }}>
                      Presets:
                    </span>
                    {Object.keys(SIMULATOR_PRESETS).map(key => (
                      <button
                        key={key}
                        onClick={() => handleApplyPreset(key)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: activePreset === key ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: activePreset === key ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: activePreset === key ? '#10b981' : '#94a3b8',
                          fontSize: '10px',
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
                    <Palette size={12} style={{ color: '#64748b' }} />
                    {COLOR_PALETTES.map((pal, idx) => (
                      <div
                        key={pal.name}
                        onClick={() => setSelectedColorIdx(idx)}
                        style={{
                          width: '14px',
                          height: '14px',
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

                {/* Matrix Transforms Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
                    Transforms:
                  </span>
                  
                  <button onClick={handleInvertMatrix} className="dash-sim-tool-btn" title="Invert Face / Back">
                    <RefreshCw size={11} />
                    <span>Invert</span>
                  </button>

                  <button onClick={handleShiftWarp} className="dash-sim-tool-btn" title="Shift Warp Down +1">
                    <ArrowRight size={11} style={{ transform: 'rotate(90deg)' }} />
                    <span>Shift Warp</span>
                  </button>

                  <button onClick={handleShiftWeft} className="dash-sim-tool-btn" title="Shift Weft Right +1">
                    <ArrowRight size={11} />
                    <span>Shift Weft</span>
                  </button>

                  <button onClick={handleMirrorH} className="dash-sim-tool-btn" title="Mirror Horizontal">
                    <FlipHorizontal size={11} />
                    <span>Mirror H</span>
                  </button>

                  <button onClick={handleMirrorV} className="dash-sim-tool-btn" title="Mirror Vertical">
                    <FlipVertical size={11} />
                    <span>Mirror V</span>
                  </button>

                  <button onClick={handleResetSim} className="dash-sim-tool-btn" title="Reset to standard 2/2 Twill" style={{ marginLeft: 'auto', color: '#f43f5e' }}>
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* The Interactive Weave Grid Box */}
                <div className="dash-sim-grid-wrap">
                  {viewMode === 'grid' ? (
                    /* Standard Drafting Grid */
                    <div 
                      className="dash-sim-interactive-grid" 
                      style={{ gridTemplateColumns: `repeat(${simGrid[0]?.length || 8}, 24px)` }}
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
                              border: '1px solid rgba(255, 255, 255, 0.08)'
                            }}
                            title={`Row ${rIdx + 1}, Col ${cIdx + 1}: Click to flip lift state`}
                          >
                            <span style={{ fontSize: '9px', color: cell === 1 ? '#000000' : '#94a3b8', fontWeight: 'bold' }}>
                              {cell === 1 ? '↑' : '·'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    /* Realistic 3D Simulated Woven Fabric Texture */
                    <div 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${simGrid[0]?.length || 8}, 24px)`,
                        gap: '0px',
                        background: '#020305',
                        padding: '12px',
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      {simGrid.map((row, rIdx) => 
                        row.map((cell, cIdx) => {
                          const isWarp = cell === 1;
                          return (
                            <div
                              key={`cloth-${rIdx}-${cIdx}`}
                              onClick={() => toggleSimCell(rIdx, cIdx)}
                              style={{
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                position: 'relative',
                                background: isWarp 
                                  ? `linear-gradient(90deg, rgba(0,0,0,0.4) 0%, ${activePalette.warp} 50%, rgba(0,0,0,0.4) 100%)`
                                  : `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, ${activePalette.weft} 50%, rgba(0,0,0,0.5) 100%)`,
                                boxShadow: isWarp 
                                  ? '0 2px 5px rgba(0,0,0,0.6)' 
                                  : 'inset 0 2px 4px rgba(0,0,0,0.7)',
                                borderRadius: '2px',
                                transition: 'all 0.15s ease'
                              }}
                              title={`Thread ${rIdx + 1}×${cIdx + 1}: ${isWarp ? 'Warp Floating' : 'Weft Floating'}`}
                            />
                          );
                        })
                      )}
                    </div>
                  )}
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: '10px' }}>
                    {viewMode === 'grid' 
                      ? '↑ Warp Over (Face) • · Weft Over (Back) • Click any cell to toggle'
                      : 'Photorealistic 3D Cylindrical Yarn Interlacement Simulation'}
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

            {/* TWO POWERFUL NEW ENGINEERING UTILITIES SIDE-BY-SIDE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
              
              {/* Utility 1: Universal Yarn Count Numbering Converter */}
              <div style={{ 
                background: 'rgba(13, 16, 23, 0.7)', 
                border: '1px solid rgba(255, 255, 255, 0.07)', 
                borderRadius: '16px', 
                padding: '22px 24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={16} style={{ color: '#38bdf8' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Universal Yarn Count Converter
                    </h3>
                  </div>
                  <span style={{ fontSize: '10.5px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>
                    Direct &amp; Indirect Systems
                  </span>
                </div>

                {/* Input row */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="number"
                    step="any"
                    value={inputCount}
                    onChange={(e) => setInputCount(e.target.value)}
                    placeholder="Enter yarn count..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                  <select
                    value={inputSystem}
                    onChange={(e) => setInputSystem(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ne">Cotton Count (Ne)</option>
                    <option value="nm">Metric Count (Nm)</option>
                    <option value="tex">Linear Density (Tex)</option>
                    <option value="denier">Filament (Denier)</option>
                    <option value="dtex">Decitex (dtex)</option>
                  </select>
                </div>

                {/* Real-time Equivalents Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {[
                    { key: 'ne', label: 'Cotton Ne', val: convertedCounts.ne },
                    { key: 'nm', label: 'Metric Nm', val: convertedCounts.nm },
                    { key: 'tex', label: 'Tex', val: convertedCounts.tex },
                    { key: 'denier', label: 'Denier', val: convertedCounts.denier },
                    { key: 'dtex', label: 'Dtex', val: convertedCounts.dtex }
                  ].map(item => (
                    <div 
                      key={item.key}
                      onClick={() => copyToClipboard(item.key, item.val)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
                      title="Click to copy value"
                    >
                      <div style={{ fontSize: '9.5px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', marginBottom: '3px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '13.5px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: copiedKey === item.key ? '#38bdf8' : '#ffffff' }}>
                        {copiedKey === item.key ? 'COPIED' : item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utility 2: Rapid GSM & Fabric Weight Estimator */}
              <div style={{ 
                background: 'rgba(13, 16, 23, 0.7)', 
                border: '1px solid rgba(255, 255, 255, 0.07)', 
                borderRadius: '16px', 
                padding: '22px 24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={16} style={{ color: '#fbbf24' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Rapid Fabric GSM Estimator
                    </h3>
                  </div>
                  <span style={{ 
                    fontSize: '10.5px', 
                    fontFamily: 'JetBrains Mono, monospace', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    background: 'rgba(251, 191, 36, 0.12)', 
                    color: '#fbbf24' 
                  }}>
                    {quickGsm.classification}
                  </span>
                </div>

                {/* 4 Mini Slider/Input Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Warp Ne: {gsmInputs.warpNe}
                    </label>
                    <input
                      type="number"
                      value={gsmInputs.warpNe}
                      onChange={(e) => setGsmInputs({ ...gsmInputs, warpNe: parseFloat(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      Weft Ne: {gsmInputs.weftNe}
                    </label>
                    <input
                      type="number"
                      value={gsmInputs.weftNe}
                      onChange={(e) => setGsmInputs({ ...gsmInputs, weftNe: parseFloat(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      EPI: {gsmInputs.epi}
                    </label>
                    <input
                      type="number"
                      value={gsmInputs.epi}
                      onChange={(e) => setGsmInputs({ ...gsmInputs, epi: parseFloat(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      PPI: {gsmInputs.ppi}
                    </label>
                    <input
                      type="number"
                      value={gsmInputs.ppi}
                      onChange={(e) => setGsmInputs({ ...gsmInputs, ppi: parseFloat(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                    />
                  </div>
                </div>

                {/* Computed Results Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '6px' }}>Predicted GSM:</span>
                    <strong style={{ fontSize: '17px', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>
                      {quickGsm.totalGsm} g/m²
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({quickGsm.ozPerYd2} oz/yd²)</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('calculations')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#34d399',
                      fontSize: '11.5px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Full Yield Engine</span>
                    <ArrowRight size={12} />
                  </button>
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
