import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Grid3X3, 
  Scale, 
  DollarSign, 
  Activity, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

const PRESETS = [
  {
    id: 'poplin',
    name: 'Cotton Poplin',
    type: 'woven',
    badge: 'Shirting',
    epi: 100,
    ppi: 72,
    warpCount: 40,
    weftCount: 40,
    width: 58,
    length: 100,
    warpCrimp: 7.5,
    weftCrimp: 5.5,
    pricePerLb: 4.80,
  },
  {
    id: 'denim',
    name: '3/1 Indigo Denim',
    type: 'woven',
    badge: 'Heavy Bottomweight',
    epi: 68,
    ppi: 46,
    warpCount: 10,
    weftCount: 12,
    width: 60,
    length: 100,
    warpCrimp: 11.0,
    weftCrimp: 6.5,
    pricePerLb: 3.90,
  },
  {
    id: 'chino',
    name: 'Chino Twill',
    type: 'woven',
    badge: 'Suiting & Pants',
    epi: 112,
    ppi: 58,
    warpCount: 20,
    weftCount: 16,
    width: 58,
    length: 100,
    warpCrimp: 9.0,
    weftCrimp: 5.0,
    pricePerLb: 4.20,
  },
  {
    id: 'jersey',
    name: 'Single Jersey Knit',
    type: 'knit',
    badge: 'Circular Knit',
    epi: 32, // wpi
    ppi: 40, // cpi
    warpCount: 30, // knitCount
    weftCount: 30,
    width: 62,
    length: 100,
    warpCrimp: 8.0,
    weftCrimp: 5.0,
    pricePerLb: 5.20,
  }
];

// Helper to compute CSS gradient fill for range sliders
const getSliderBg = (val, min, max) => {
  const pct = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
  return `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
};

export default function YieldEngineDemo({ onLaunchStudioCalculations }) {
  const [activePreset, setActivePreset] = useState('jersey');
  const [mode, setMode] = useState('knit'); // 'woven' or 'knit'

  // Woven / Knit Parameters
  const [epi, setEpi] = useState(32);
  const [ppi, setPpi] = useState(40);
  const [warpCount, setWarpCount] = useState(30);
  const [weftCount, setWeftCount] = useState(30);
  const [width, setWidth] = useState(62);
  const [length, setLength] = useState(100);
  const [warpCrimp, setWarpCrimp] = useState(8.0);
  const [weftCrimp, setWeftCrimp] = useState(5.0);
  const [pricePerLb, setPricePerLb] = useState(5.20);
  const [stitchLengthCm, setStitchLengthCm] = useState(0.29);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setMode(preset.type);
    setEpi(preset.epi);
    setPpi(preset.ppi);
    setWarpCount(preset.warpCount);
    setWeftCount(preset.weftCount);
    setWidth(preset.width);
    setLength(preset.length);
    setWarpCrimp(preset.warpCrimp);
    setWeftCrimp(preset.weftCrimp);
    setPricePerLb(preset.pricePerLb);
  };

  // Live Calculated Yield Analytics
  const calculations = useMemo(() => {
    if (mode === 'woven') {
      const totalEnds = Math.round(epi * width);
      const warpYards = totalEnds * length * (1 + warpCrimp / 100);
      const warpLbs = (warpCount > 0) ? (warpYards / (840 * warpCount)) : 0;

      const lengthInches = length * 36;
      const totalPicks = ppi * lengthInches;
      const weftYards = (totalPicks * width / 36) * (1 + weftCrimp / 100);
      const weftLbs = (weftCount > 0) ? (weftYards / (840 * weftCount)) : 0;

      const totalLbs = warpLbs + weftLbs;
      const totalKg = totalLbs * 0.453592;
      const weightGrams = totalLbs * 453.592;

      const areaSqM = (width * 0.0254) * (length * 0.9144);
      const gsm = (areaSqM > 0) ? Math.round(weightGrams / areaSqM) : 0;
      const ozPerSqYd = (gsm * 0.0294935).toFixed(1);

      const totalCost = totalLbs * pricePerLb;
      const costPerYard = (length > 0) ? (totalCost / length).toFixed(2) : '0.00';

      const warpRatio = (totalLbs > 0) ? Math.round((warpLbs / totalLbs) * 100) : 50;
      const weftRatio = 100 - warpRatio;

      const avgCrimp = (warpCrimp + weftCrimp) / 2;
      const yieldEfficiency = (100 / (1 + avgCrimp / 100)).toFixed(1);

      // Tex conversions
      const warpTex = warpCount > 0 ? (590.5 / warpCount).toFixed(1) : '0';
      const weftTex = weftCount > 0 ? (590.5 / weftCount).toFixed(1) : '0';

      return {
        gsm,
        ozPerSqYd,
        totalLbs: totalLbs.toFixed(1),
        totalKg: totalKg.toFixed(1),
        warpLbs: warpLbs.toFixed(1),
        weftLbs: weftLbs.toFixed(1),
        totalEnds,
        totalPicks: Math.round(totalPicks / 1000) + 'k picks',
        warpRatio,
        weftRatio,
        costPerYard,
        totalCost: totalCost.toFixed(2),
        yieldEfficiency,
        warpTex,
        weftTex
      };
    } else {
      // Knit mode
      const wpi = epi;
      const cpi = ppi;
      const stitchesPerSqIn = wpi * cpi;
      const totalStitches = stitchesPerSqIn * (width * length * 36);
      const totalYarnCm = totalStitches * stitchLengthCm;
      const totalYarnYards = totalYarnCm / 91.44;
      const yarnWeightLbs = (warpCount > 0) ? (totalYarnYards / (840 * warpCount)) : 0;
      const totalKg = yarnWeightLbs * 0.453592;
      const weightGrams = yarnWeightLbs * 453.592;

      const areaSqM = (width * 0.0254) * (length * 0.9144);
      const gsm = (areaSqM > 0) ? Math.round(weightGrams / areaSqM) : 0;
      const ozPerSqYd = (gsm * 0.0294935).toFixed(1);
      const totalCost = yarnWeightLbs * pricePerLb;
      const costPerYard = (length > 0) ? (totalCost / length).toFixed(2) : '0.00';
      const knitTex = warpCount > 0 ? (590.5 / warpCount).toFixed(1) : '0';

      return {
        gsm,
        ozPerSqYd,
        totalLbs: yarnWeightLbs.toFixed(1),
        totalKg: totalKg.toFixed(1),
        warpLbs: yarnWeightLbs.toFixed(1),
        weftLbs: '0',
        totalEnds: Math.round(wpi * width),
        totalPicks: Math.round((cpi * length * 36) / 1000) + 'k courses',
        warpRatio: 100,
        weftRatio: 0,
        costPerYard,
        totalCost: totalCost.toFixed(2),
        yieldEfficiency: '96.2',
        warpTex: knitTex,
        weftTex: knitTex
      };
    }
  }, [mode, epi, ppi, warpCount, weftCount, width, length, warpCrimp, weftCrimp, pricePerLb, stitchLengthCm]);

  // GSM Classification
  const fabricClass = useMemo(() => {
    const g = calculations.gsm;
    if (g < 110) return { label: 'Ultra-Lightweight / Voile & Lawn', color: '#38bdf8' };
    if (g <= 165) return { label: 'Lightweight / Poplin & Fine Shirting', color: '#34d399' };
    if (g <= 240) return { label: 'Medium-Weight / Chino, Oxford & Suiting', color: '#fbbf24' };
    if (g <= 330) return { label: 'Medium-Heavy / Drill & Workwear', color: '#f97316' };
    return { label: 'Heavyweight / Rigid Denim & Canvas', color: '#f43f5e' };
  }, [calculations.gsm]);

  return (
    <section id="yield-demo" className="lux-yield-demo-section">
      <div className="lux-yield-demo-container">
        
        {/* Section Header */}
        <div className="lux-yield-demo-header">
          <div>
            <div className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-emerald)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: '600' }}>
              <Calculator size={14} />
              <span>INTERACTIVE SIMULATOR</span>
            </div>
            <h2 className="lux-yield-title">
              Textile Yield &amp; GSM Engine
            </h2>
            <p className="lux-yield-subtitle">
              Explore how yarn count, crimp percentage, and loom reed density dynamically compute physical fabric GSM, material consumption weight, and manufacturing cost in real time.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="lux-yield-presets-bar">
            <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>PRESETS:</span>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`lux-yield-preset-chip ${activePreset === p.id ? 'active' : ''}`}
              >
                <span>{p.name}</span>
                <span className="chip-badge">{p.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="lux-yield-demo-grid">

          {/* Left Column: Interactive Controls */}
          <div className="lux-yield-controls-card">
            
            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('woven');
                  setActivePreset(null);
                }}
                className={`lux-yield-mode-btn ${mode === 'woven' ? 'active' : ''}`}
              >
                <Layers size={14} />
                <span>Woven Structure</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('knit');
                  setActivePreset(null);
                }}
                className={`lux-yield-mode-btn ${mode === 'knit' ? 'active' : ''}`}
              >
                <Grid3X3 size={14} />
                <span>Circular Knit</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="lux-yield-inputs-layout">

              {/* Yarn Count */}
              <div className="lux-yield-input-group">
                <div className="lux-yield-label-row">
                  <label>{mode === 'woven' ? 'Warp Yarn Count' : 'Yarn Count'}</label>
                  <span className="lux-mono highlight">{warpCount} Ne ({calculations.warpTex} Tex)</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="80"
                  step="1"
                  value={warpCount}
                  onChange={(e) => {
                    setWarpCount(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(warpCount, 6, 80) }}
                />
              </div>

              {/* Weft Yarn Count (woven only) */}
              {mode === 'woven' && (
                <div className="lux-yield-input-group">
                  <div className="lux-yield-label-row">
                    <label>Weft Yarn Count</label>
                    <span className="lux-mono highlight">{weftCount} Ne ({calculations.weftTex} Tex)</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="80"
                    step="1"
                    value={weftCount}
                    onChange={(e) => {
                      setWeftCount(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="lux-calc-slider"
                    style={{ background: getSliderBg(weftCount, 6, 80) }}
                  />
                </div>
              )}

              {/* Density: EPI / WPI */}
              <div className="lux-yield-input-group">
                <div className="lux-yield-label-row">
                  <label>{mode === 'woven' ? 'Warp Density (EPI)' : 'Wales per Inch (WPI)'}</label>
                  <span className="lux-mono highlight">{epi} {mode === 'woven' ? 'EPI' : 'WPI'}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  step="2"
                  value={epi}
                  onChange={(e) => {
                    setEpi(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(epi, 20, 160) }}
                />
              </div>

              {/* Density: PPI / CPI */}
              <div className="lux-yield-input-group">
                <div className="lux-yield-label-row">
                  <label>{mode === 'woven' ? 'Weft Density (PPI)' : 'Courses per Inch (CPI)'}</label>
                  <span className="lux-mono highlight">{ppi} {mode === 'woven' ? 'PPI' : 'CPI'}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="140"
                  step="2"
                  value={ppi}
                  onChange={(e) => {
                    setPpi(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(ppi, 20, 140) }}
                />
              </div>

              {/* Width & Order Length side-by-side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="lux-yield-input-group">
                  <div className="lux-yield-label-row">
                    <label>Width</label>
                    <span className="lux-mono highlight">{width}&quot;</span>
                  </div>
                  <input
                    type="range"
                    min="36"
                    max="80"
                    step="1"
                    value={width}
                    onChange={(e) => {
                      setWidth(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="lux-calc-slider"
                    style={{ background: getSliderBg(width, 36, 80) }}
                  />
                </div>

                <div className="lux-yield-input-group">
                  <div className="lux-yield-label-row">
                    <label>Batch Run</label>
                    <span className="lux-mono highlight">{length} yd</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={length}
                    onChange={(e) => {
                      setLength(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="lux-calc-slider"
                    style={{ background: getSliderBg(length, 50, 1000) }}
                  />
                </div>
              </div>

              {/* Crimp Sliders (woven mode) */}
              {mode === 'woven' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="lux-yield-input-group">
                    <div className="lux-yield-label-row">
                      <label>Warp Crimp</label>
                      <span className="lux-mono highlight">{warpCrimp}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="0.5"
                      value={warpCrimp}
                      onChange={(e) => {
                        setWarpCrimp(Number(e.target.value));
                        setActivePreset(null);
                      }}
                      className="lux-calc-slider"
                      style={{ background: getSliderBg(warpCrimp, 2, 20) }}
                    />
                  </div>

                  <div className="lux-yield-input-group">
                    <div className="lux-yield-label-row">
                      <label>Weft Crimp</label>
                      <span className="lux-mono highlight">{weftCrimp}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="16"
                      step="0.5"
                      value={weftCrimp}
                      onChange={(e) => {
                        setWeftCrimp(Number(e.target.value));
                        setActivePreset(null);
                      }}
                      className="lux-calc-slider"
                      style={{ background: getSliderBg(weftCrimp, 2, 16) }}
                    />
                  </div>
                </div>
              )}

              {/* Raw Yarn Price */}
              <div className="lux-yield-input-group">
                <div className="lux-yield-label-row">
                  <label>Raw Yarn Price</label>
                  <span className="lux-mono highlight">${pricePerLb.toFixed(2)} / lb</span>
                </div>
                <input
                  type="range"
                  min="2.00"
                  max="12.00"
                  step="0.25"
                  value={pricePerLb}
                  onChange={(e) => {
                    setPricePerLb(Number(e.target.value));
                    setActivePreset(null);
                  }}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(pricePerLb, 2.00, 12.00) }}
                />
              </div>

            </div>
          </div>

          {/* Right Column: Live Yield Analytics & Outputs */}
          <div className="lux-yield-results-card">
            
            {/* GSM Main Display */}
            <div className="lux-yield-gsm-hero">
              <span className="lux-mono" style={{ fontSize: '11px', color: 'var(--lux-text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                PREDICTED FABRIC DENSITY
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '8px 0 6px' }}>
                <span className="lux-yield-gsm-num">{calculations.gsm}</span>
                <span style={{ fontSize: '18px', color: 'var(--lux-text-secondary)', fontWeight: '600' }}>g/m²</span>
                <span className="lux-mono" style={{ fontSize: '13px', color: 'var(--lux-text-muted)', marginLeft: 'auto' }}>
                  ({calculations.ozPerSqYd} oz/yd²)
                </span>
              </div>

              {/* Classification Tag */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: fabricClass.color, boxShadow: `0 0 8px ${fabricClass.color}` }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>{fabricClass.label}</span>
              </div>

              {/* Spectrum Meter Bar */}
              <div className="lux-yield-spectrum-bar">
                <div 
                  className="lux-yield-spectrum-indicator" 
                  style={{ left: `${Math.min(Math.max((calculations.gsm - 60) / (450 - 60) * 100, 2), 98)}%` }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--lux-text-muted)', marginTop: '6px' }}>
                <span>60 gsm (Sheer)</span>
                <span>200 gsm (Mid)</span>
                <span>450+ gsm (Denim)</span>
              </div>
            </div>

            {/* Key Metrics Bento (2x2 Grid) */}
            <div className="lux-yield-metrics-grid">
              
              {/* Total Yarn Weight */}
              <div className="lux-yield-metric-box">
                <div className="metric-title">
                  <Scale size={14} color="var(--lux-emerald)" />
                  <span>Total Yarn Mass</span>
                </div>
                <div className="metric-val">
                  {calculations.totalLbs} <span className="unit">lbs</span>
                </div>
                <div className="metric-sub lux-mono">
                  ≈ {calculations.totalKg} kg
                </div>
              </div>

              {/* Estimated Batch Cost */}
              <div className="lux-yield-metric-box">
                <div className="metric-title">
                  <DollarSign size={14} color="#fbbf24" />
                  <span>Material Cost</span>
                </div>
                <div className="metric-val" style={{ color: '#fbbf24' }}>
                  ${calculations.costPerYard} <span className="unit">/ yd</span>
                </div>
                <div className="metric-sub lux-mono">
                  ${calculations.totalCost} total
                </div>
              </div>

              {/* Production Ends / Picks */}
              <div className="lux-yield-metric-box">
                <div className="metric-title">
                  <Activity size={14} color="#38bdf8" />
                  <span>Loom Geometry</span>
                </div>
                <div className="metric-val" style={{ color: '#ffffff' }}>
                  {calculations.totalEnds} <span className="unit">warp ends</span>
                </div>
                <div className="metric-sub lux-mono">
                  {calculations.totalPicks}
                </div>
              </div>

              {/* Crimp Yield Factor */}
              <div className="lux-yield-metric-box">
                <div className="metric-title">
                  <Sparkles size={14} color="#f43f5e" />
                  <span>Yield Factor</span>
                </div>
                <div className="metric-val" style={{ color: 'var(--lux-emerald)' }}>
                  {calculations.yieldEfficiency}%
                </div>
                <div className="metric-sub lux-mono">
                  take-up adjusted
                </div>
              </div>

            </div>

            {/* Yarn Ratio Bar (Woven mode) */}
            {mode === 'woven' && (
              <div style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--lux-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--lux-text-secondary)', marginBottom: '8px' }}>
                  <span>Warp: <strong>{calculations.warpLbs} lbs ({calculations.warpRatio}%)</strong></span>
                  <span>Weft: <strong>{calculations.weftLbs} lbs ({calculations.weftRatio}%)</strong></span>
                </div>
                <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: `${calculations.warpRatio}%`, background: 'var(--lux-emerald)', transition: 'width 0.3s ease' }} />
                  <div style={{ width: `${calculations.weftRatio}%`, background: '#38bdf8', transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--lux-text-muted)', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lux-emerald)' }} /> Warp Beam Yarn
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} /> Weft Insertion Yarn
                  </span>
                </div>
              </div>
            )}

            {/* In-Studio Launch Link Button at the bottom */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button
                type="button"
                onClick={onLaunchStudioCalculations}
                className="lux-yield-launch-studio-btn"
              >
                <span>Launch Full Calculation Suite in Studio</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
