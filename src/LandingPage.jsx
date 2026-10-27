import React, { useEffect, useRef, useState } from 'react';
import { 
  Scissors, 
  Grid3X3, 
  Layers, 
  FileText, 
  Calculator, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Compass, 
  ChevronRight,
  Sliders,
  Maximize2
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import YieldEngineDemo from './components/YieldEngineDemo';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

// 8x8 Presets for the industrial structure loom module
const WEAVE_PRESETS = {
  plain: {
    name: 'Plain 1/1',
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
  twill: {
    name: '2/2 Twill',
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
  satin: {
    name: 'Satin 8/3',
    grid: [
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
    ]
  },
  herringbone: {
    name: 'Herringbone',
    grid: [
      [1, 0, 0, 1, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [0, 1, 1, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 1],
    ]
  }
};

// Interactive Hero Structure Workstation
const InteractiveHeroLoom = () => {
  const [activePreset, setActivePreset] = useState('twill');
  const [grid, setGrid] = useState(WEAVE_PRESETS.twill.grid);

  const applyPreset = (key) => {
    setActivePreset(key);
    setGrid(WEAVE_PRESETS[key].grid);
  };

  const toggleCell = (r, c) => {
    setActivePreset('custom');
    const updated = grid.map((row, rIdx) => 
      row.map((cell, cIdx) => (rIdx === r && cIdx === c ? (cell === 1 ? 0 : 1) : cell))
    );
    setGrid(updated);
  };

  const warpCount = grid.flat().filter(v => v === 1).length;
  const weftCount = 64 - warpCount;
  const warpDensity = Math.round((warpCount / 64) * 100);

  return (
    <div className="lux-workstation">
      <div className="lux-ws-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--lux-emerald)', boxShadow: '0 0 8px var(--lux-emerald)' }} />
          <span className="lux-mono" style={{ fontSize: '11px', fontWeight: '600', color: '#f8fafc', letterSpacing: '0.5px' }}>
            INTERLACE WORKSTATION
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-emerald)', background: 'var(--lux-emerald-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
            8×8 STRUCTURE REPEAT
          </span>
          <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--lux-border)' }}>
            178% PRESET ZOOM
          </span>
        </div>
      </div>

      <div className="lux-ws-chips">
        {Object.entries(WEAVE_PRESETS).map(([key, data]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className={`lux-chip ${activePreset === key ? 'active' : ''}`}
          >
            {data.name}
          </button>
        ))}
      </div>

      <div className="lux-loom-matrix">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => toggleCell(r, c)}
              aria-label={`Toggle pick ${r}, end ${c}`}
              className="lux-loom-cell"
              style={{
                background: val === 1 ? 'var(--lux-emerald)' : '#161a22',
                borderColor: val === 1 ? '#34d399' : 'rgba(255,255,255,0.06)',
                boxShadow: val === 1 ? '0 0 10px rgba(16,185,129,0.35)' : 'none'
              }}
            >
              <span className="lux-mono" style={{ fontSize: '9px', fontWeight: 'bold', color: val === 1 ? '#042217' : '#64748b' }}>
                {val === 1 ? 'W' : 'F'}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="lux-ws-footer lux-mono">
        <div style={{ display: 'flex', gap: '14px' }}>
          <span>Warp Face: <strong style={{ color: 'var(--lux-emerald)' }}>{warpDensity}%</strong></span>
          <span>Weft Face: <strong style={{ color: 'var(--lux-text-secondary)' }}>{100 - warpDensity}%</strong></span>
        </div>
        <span style={{ color: '#64748b' }}>Click node to invert</span>
      </div>
    </div>
  );
};

export default function LandingPage({ onLaunchStudio, onSelectTool }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const scrubTextRef = useRef(null);
  const pinnedSectionRef = useRef(null);

  // Live interactive calculation state for the yield card
  const [yarnCountNe, setYarnCountNe] = useState(30);
  const endsPerInch = 68;
  const picksPerInch = 64;
  // Fabric GSM approximation formula: (EPI/WarpNe + PPI/WeftNe) * 23.25
  const liveGSM = Math.round(((endsPerInch / yarnCountNe) + (picksPerInch / yarnCountNe)) * 23.25);
  const liveTex = (590.5 / yarnCountNe).toFixed(1);

  // Live knit cam state
  const [activeCam, setActiveCam] = useState('knit');

  const scrollToYieldDemo = () => {
    const el = document.getElementById('yield-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
      }

      if (scrubTextRef.current) {
        const words = scrubTextRef.current.querySelectorAll('.lux-scrub-word');
        gsap.fromTo(
          words,
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.04,
            scrollTrigger: {
              trigger: scrubTextRef.current,
              start: 'top 82%',
              end: 'bottom 45%',
              scrub: true,
            }
          }
        );
      }

      if (pinnedSectionRef.current && window.innerWidth > 980) {
        ScrollTrigger.create({
          trigger: pinnedSectionRef.current,
          start: 'top 10%',
          end: 'bottom 85%',
          pin: '.lux-sticky-column',
          pinSpacing: false,
        });
      }

      gsap.utils.toArray('.lux-bento-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const tools = [
    {
      id: 'woven',
      title: 'WeaveDraft 4-Part Studio',
      role: 'Dobby & Jacquard Structure',
      desc: 'Synchronized mathematical linkage between Weave Plan, Draft Shafts, Lifting/Peg plan, and Denting matrices with real-time interlacement rendering.',
      icon: Scissors,
      metric: '32-Shaft Depth',
      accent: '#10b981'
    },
    {
      id: 'knit',
      title: 'Knit Loop Matrix',
      role: 'Needle Cam Simulation',
      desc: 'Single jersey circular and flatbed matrices. Define Knit, Tuck, and Miss actions with automatic feeder colorway cycle coordination.',
      icon: Grid3X3,
      metric: 'Cam Synchronization',
      accent: '#38bdf8'
    },
    {
      id: 'doublejersey',
      title: 'Double Jersey Bed',
      role: 'Dual-Bed Precision Geometry',
      desc: 'Dial and cylinder needle gaiting for Rib (1x1, 2x2), Interlock, and Milano structures with uniform loop tension calculation.',
      icon: Layers,
      metric: 'Dual-Bed Sync',
      accent: '#f43f5e'
    },
    {
      id: 'lapping',
      title: 'Warp Knit Lapping Diagram',
      role: 'Guide Bar Displacement & Notation',
      desc: 'Visual trace for Tricot and Raschel guide bars. Automatic chain notation extraction, underlap tension, and run-in calculations.',
      icon: FileText,
      metric: 'Chain Notation',
      accent: '#fbbf24'
    },
    {
      id: 'calculations',
      title: 'Yield Engine & Mathematical Core',
      role: 'Density & Yield Prediction',
      desc: 'Universal yarn count conversions (Ne, Nm, Denier, Tex), warp & weft take-up crimp, fabric GSM prediction, and linear cost formulas.',
      icon: Calculator,
      metric: '0.01g Accuracy',
      accent: '#34d399'
    }
  ];

  return (
    <div ref={containerRef} className="lux-container">
      
      {/* Background Canvas Ambiance */}
      <div className="lux-canvas-bg">
        <div className="lux-canvas-grid" />
        <div className="lux-canvas-glow" />
        <div className="lux-canvas-glow-secondary" />
      </div>

      {/* Built-in Quiet Header */}
      <header className="lux-top-header">
        <div className="lux-logo-group">
          <img src="/logo.png" alt="WeaveX" className="lux-logo-img" />
          <span className="lux-brand-name">WeaveX</span>
          <span className="lux-version-tag lux-mono">v2.6 STUDIO</span>
        </div>

        <nav className="lux-nav-links">
          <a href="#suite" className="lux-nav-link">Design Suite</a>
          <a href="#architecture" className="lux-nav-link">Core Architecture</a>
        </nav>

        <div>
          <button onClick={onLaunchStudio} className="lux-btn-launch-header">
            <span>Launch Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="lux-hero">
        <div className="lux-hero-grid">
          
          {/* Left Column: Direct, Powerful Headline */}
          <div>
            <h1 className="lux-hero-h1">
              Digitalization of{' '}
              <span className="lux-gradient-text">Fabric Structures Design.</span>
            </h1>

            <div className="lux-mono" style={{ fontSize: '13px', color: 'var(--lux-emerald)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '20px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '6px', background: 'var(--lux-emerald-subtle)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lux-emerald)', boxShadow: '0 0 6px var(--lux-emerald)' }}></span>
              <span>Universal Structure Engineering System</span>
            </div>

            <p className="lux-hero-lead">
              A high-precision studio environment unifying 4-part weave structure drafting, needle cam matrices, double-jersey dial coordination, and warp knit lapping into one synchronized system.
            </p>

            <div className="lux-hero-btn-row">
              <button onClick={onLaunchStudio} className="lux-btn-primary">
                <span>Enter Studio Workspace</span>
                <ArrowRight size={16} />
              </button>

              <a href="#suite" className="lux-btn-secondary">
                <span>Explore Design Modules</span>
                <ChevronRight size={15} />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Workstation */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <InteractiveHeroLoom />
          </div>

        </div>
      </section>

      {/* METRIC STRIP / MARQUEE */}
      <section className="lux-marquee-strip">
        <div className="lux-marquee-track">
          {[...Array(2)].map((_, listIdx) => (
            <div key={listIdx} className="lux-marquee-content">
              <span><span style={{ color: 'var(--lux-emerald)', marginRight: '6px' }}>/</span> 4-PART WEAVEDRAFT STUDIO</span>
              <span><span style={{ color: '#38bdf8', marginRight: '6px' }}>/</span> NEEDLE CAM SYNCHRONIZATION</span>
              <span><span style={{ color: '#f43f5e', marginRight: '6px' }}>/</span> DIAL & CYLINDER GAITING</span>
              <span><span style={{ color: '#fbbf24', marginRight: '6px' }}>/</span> WARP KNIT CHAIN NOTATIONS</span>
              <span><span style={{ color: 'var(--lux-emerald)', marginRight: '6px' }}>/</span> UNIVERSAL COUNT CONVERSION</span>
              <span><span style={{ color: '#38bdf8', marginRight: '6px' }}>/</span> 0.01 GSM PRECISION YIELD</span>
            </div>
          ))}
        </div>
      </section>

      {/* NARRATIVE PHILOSOPHY */}
      <section className="lux-narrative">
        <span className="lux-narrative-label">STRUCTURAL COMPUTATION</span>
        
        <p ref={scrubTextRef} className="lux-narrative-quote">
          {"Textile engineering is not merely aesthetic illustration. Every yarn carries tensile tension, fiber count, crimp percentage, and mathematical interlacement rules that govern physical reality.".split(" ").map((word, i) => (
            <span key={i} className="lux-scrub-word">
              {word}
            </span>
          ))}
        </p>
      </section>

      {/* BENTO 2.0 ARCHITECTURAL SUITE */}
      <section id="suite" className="lux-bento-section">
        <div className="lux-bento-header">
          <div>
            <span className="lux-narrative-label" style={{ marginBottom: '10px' }}>STRUCTURE ARCHITECTURE</span>
            <h2 className="lux-bento-title">
              Five Precision Disciplines. One Unified Canvas.
            </h2>
          </div>
          <p style={{ color: 'var(--lux-text-secondary)', fontSize: '15px', maxWidth: '420px', lineHeight: '1.6' }}>
            Seamlessly jump between complex woven matrices and high-gauge warp knit graphs with synchronized state.
          </p>
        </div>

        <div className="lux-bento-grid">
          
          {/* Card 1: WeaveDraft 4-Part Studio (Cols: 8) */}
          <div 
            onClick={() => onSelectTool('woven')}
            className="lux-bento-card lux-bento-8"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div className="lux-icon-frame" style={{ color: 'var(--lux-emerald)' }}>
                <Scissors size={24} />
              </div>
              <div className="lux-mono" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'var(--lux-surface-elevated)', border: '1px solid var(--lux-border)', color: 'var(--lux-emerald)' }}>
                <span>Dobby & Jacquard</span>
                <ArrowRight size={12} />
              </div>
            </div>

            <div>
              <h3 className="lux-card-h3">
                WeaveDraft Studio
              </h3>
              <p className="lux-card-desc" style={{ maxWidth: '580px', marginBottom: '20px' }}>
                Four synchronized matrices: Design Grid, Shaft Harness Threading, Peg/Lifting Plan, and Denting. Automatic calculation of weave repeat sizes and real-time yarn interlacement visualization.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--lux-text-secondary)' }}>
                <span style={{ padding: '4px 10px', borderRadius: '4px', background: '#090a0d', border: '1px solid var(--lux-border)' }}>Straight Draft</span>
                <span style={{ padding: '4px 10px', borderRadius: '4px', background: '#090a0d', border: '1px solid var(--lux-border)' }}>Skip Draft</span>
                <span style={{ padding: '4px 10px', borderRadius: '4px', background: '#090a0d', border: '1px solid var(--lux-border)' }}>Pointed Twill</span>
                <span style={{ padding: '4px 10px', borderRadius: '4px', background: '#090a0d', border: '1px solid var(--lux-border)' }}>Satin 5/8</span>
              </div>
            </div>
          </div>

          {/* Card 2: Knit Studio Single Jersey (Cols: 4) */}
          <div 
            onClick={() => onSelectTool('knit')}
            className="lux-bento-card lux-bento-4"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div className="lux-icon-frame" style={{ color: '#38bdf8' }}>
                <Grid3X3 size={24} />
              </div>
              <span className="lux-mono" style={{ fontSize: '11px', color: '#38bdf8' }}>Cam Engine</span>
            </div>

            <div>
              <h3 className="lux-card-h3">
                Knit Loop Matrix
              </h3>
              <p className="lux-card-desc" style={{ marginBottom: '16px' }}>
                Single jersey needle matrices. Synchronize Knit, Tuck, and Miss actions with automatic feeder colorway sequencing.
              </p>
              
              {/* Interactive micro cam switcher */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }} onClick={(e) => e.stopPropagation()}>
                {['knit', 'tuck', 'miss'].map((cam) => (
                  <button
                    key={cam}
                    onClick={() => setActiveCam(cam)}
                    className="lux-mono"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      border: '1px solid',
                      background: activeCam === cam ? 'rgba(56, 189, 248, 0.15)' : 'var(--lux-surface-elevated)',
                      borderColor: activeCam === cam ? '#38bdf8' : 'var(--lux-border)',
                      color: activeCam === cam ? '#38bdf8' : 'var(--lux-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {cam}
                  </button>
                ))}
              </div>

              <div className="lux-mono" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
                <span>Launch Knit Studio</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* Card 3: Double Jersey Matrix (Cols: 4) */}
          <div 
            onClick={() => onSelectTool('doublejersey')}
            className="lux-bento-card lux-bento-sm-4"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div className="lux-icon-frame" style={{ color: '#f43f5e' }}>
                <Layers size={22} />
              </div>
              <span className="lux-mono" style={{ fontSize: '11px', color: '#f43f5e' }}>Dial/Cylinder</span>
            </div>

            <div>
              <h3 className="lux-card-h3">
                Double Jersey Bed
              </h3>
              <p className="lux-card-desc" style={{ fontSize: '13px', marginBottom: '16px' }}>
                Dial and cylinder needle gaiting for Rib (1x1, 2x2), Interlock, and Milano structures with uniform loop tension calculation.
              </p>
              <span className="lux-mono" style={{ fontSize: '11px', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Open Double Jersey</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* Card 4: Warp Knit Lapping (Cols: 4) */}
          <div 
            onClick={() => onSelectTool('lapping')}
            className="lux-bento-card lux-bento-sm-4"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div className="lux-icon-frame" style={{ color: '#fbbf24' }}>
                <FileText size={22} />
              </div>
              <span className="lux-mono" style={{ fontSize: '11px', color: '#fbbf24' }}>Guide Bars</span>
            </div>

            <div>
              <h3 className="lux-card-h3">
                Lapping Diagram
              </h3>
              <p className="lux-card-desc" style={{ fontSize: '13px', marginBottom: '16px' }}>
                Visual guide-bar displacement curves for Tricot and Raschel. Automated chain notation output like 1-0/1-2 and shog paths.
              </p>
              <span className="lux-mono" style={{ fontSize: '11px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>Open Lapping Tool</span>
                <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* Card 5: Calculation Engine (Cols: 4 with Live Interactive Slider) */}
          <div 
            id="calculations"
            onClick={scrollToYieldDemo}
            className="lux-bento-card lux-bento-sm-4"
            style={{ cursor: 'pointer', scrollMarginTop: '100px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div className="lux-icon-frame" style={{ color: 'var(--lux-emerald)' }}>
                <Calculator size={22} />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToYieldDemo();
                }}
                className="lux-mono" 
                style={{ 
                  fontSize: '11px', 
                  color: 'var(--lux-emerald)', 
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Explore Live Yield Engine Simulator"
              >
                <span>Live Demo</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div>
              <h3 className="lux-card-h3">
                Textile Math & GSM
              </h3>
              
              {/* Live interactive slider container */}
              <div className="lux-interactive-calc-box lux-mono" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--lux-text-secondary)' }}>Yarn Count:</span>
                  <span style={{ color: 'var(--lux-emerald)', fontWeight: 'bold' }}>{yarnCountNe} Ne ({liveTex} Tex)</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={yarnCountNe}
                  onChange={(e) => setYarnCountNe(Number(e.target.value))}
                  className="lux-calc-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--lux-border)' }}>
                  <span style={{ color: 'var(--lux-text-secondary)' }}>Predicted GSM:</span>
                  <strong style={{ color: '#ffffff' }}>{liveGSM} g/m²</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToYieldDemo();
                }}
                className="lux-mono" 
                style={{ 
                  fontSize: '12px', 
                  color: 'var(--lux-emerald)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '6px', 
                  marginTop: '14px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--lux-emerald)';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                  e.currentTarget.style.color = 'var(--lux-emerald)';
                }}
              >
                <Calculator size={14} />
                <span>Explore Interactive Yield Demo</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* LIVE YIELD ENGINE DEMO SECTION */}
      <YieldEngineDemo onLaunchStudioCalculations={() => onSelectTool('calculations')} />

      {/* PINNED ARCHITECTURE SECTION */}
      <section ref={pinnedSectionRef} id="architecture" className="lux-pinned-section">
        <div className="lux-pinned-grid">
          
          {/* Pinned Sticky Left Column */}
          <div className="lux-sticky-column">
            <span className="lux-narrative-label" style={{ marginBottom: '12px' }}>ENGINEERING CORE</span>
            <h2 className="lux-bento-title" style={{ marginBottom: '16px' }}>
              Calculated Precision in Every Pick and Course.
            </h2>
            <p style={{ color: 'var(--lux-text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
              WeaveX replaces disjointed legacy tools with an integrated reactive computing model. Modify the draft harness, and the peg plan immediately recalculates all cam positions.
            </p>
            <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--lux-surface)', border: '1px solid var(--lux-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0' }}>
                <Cpu size={16} style={{ color: 'var(--lux-emerald)' }} />
                <span>Zero Latency Client-Side Execution</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0' }}>
                <Activity size={16} style={{ color: '#38bdf8' }} />
                <span>Synchronous 4-Way Drafting Feedback</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0' }}>
                <Compass size={16} style={{ color: '#f43f5e' }} />
                <span>High-Resolution Vector Export for Looms</span>
              </div>
            </div>
          </div>

          {/* Scrolling Right Column: Engine Cards */}
          <div className="lux-engine-cards-stack">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.id} className="lux-engine-row">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--lux-surface-elevated)', color: tool.accent }}>
                        <Icon size={18} />
                      </div>
                      <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{tool.role}</span>
                    </div>
                    <span className="lux-mono" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'var(--lux-surface-elevated)', border: '1px solid var(--lux-border)', color: tool.accent }}>
                      {tool.metric}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>{tool.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--lux-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>{tool.desc}</p>
                  <button
                    onClick={() => onSelectTool(tool.id)}
                    className="lux-mono"
                    style={{ background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#e2e8f0', cursor: 'pointer', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--lux-emerald)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#e2e8f0'}
                  >
                    <span>Launch in Studio</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ACTION CTA SECTION */}
      <section className="lux-cta-section">
        <div className="lux-cta-banner">
          <div className="lux-cta-glow-spot" />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <span className="lux-narrative-label" style={{ marginBottom: '14px' }}>INSTANT ACCESS</span>
            <h2 className="lux-cta-title">
              Ready to Draft Your Next Structure?
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--lux-text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
              No subscription gates. No complex installations. Jump directly into industrial-grade structure matrices right in your browser.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onLaunchStudio}
                className="lux-btn-primary"
                style={{ padding: '15px 32px' }}
              >
                Launch Studio Workspace
              </button>

              <button
                onClick={() => onSelectTool('woven')}
                className="lux-btn-secondary"
                style={{ padding: '15px 26px' }}
              >
                Open WeaveDraft
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lux-footer">
        <div className="lux-footer-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="WeaveX" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff' }}>WeaveX Studio</span>
            <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-text-muted)' }}>Fabric Structure Design System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: 'var(--lux-text-secondary)' }}>
            <button onClick={() => onSelectTool('woven')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>WeaveDraft</button>
            <button onClick={() => onSelectTool('knit')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Knit Studio</button>
            <button onClick={() => onSelectTool('doublejersey')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Double Jersey</button>
            <button onClick={() => onSelectTool('lapping')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Lapping</button>
            <button onClick={scrollToYieldDemo} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Yield Engine Demo</button>
          </div>

          <div className="lux-mono" style={{ fontSize: '12px', color: 'var(--lux-text-secondary)' }}>
            © Developed by Aseer Awsaf
          </div>
        </div>
      </footer>

    </div>
  );
}
