import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Grid3X3, 
  Scale, 
  DollarSign, 
  Activity, 
  Sparkles, 
  Printer, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileSpreadsheet
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

const getSliderBg = (val, min, max) => {
  const pct = Math.min(Math.max(((val - min) / (max - min)) * 100, 0), 100);
  return `linear-gradient(to right, #10b981 0%, #10b981 ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
};

const Calculations = () => {
  const [activePreset, setActivePreset] = useState('poplin');
  const [mode, setMode] = useState('woven'); // 'woven' or 'knit'

  // Woven & Knit Shared Parameters
  const [epi, setEpi] = useState(100);
  const [ppi, setPpi] = useState(72);
  const [warpCount, setWarpCount] = useState(40);
  const [weftCount, setWeftCount] = useState(40);
  const [width, setWidth] = useState(58);
  const [length, setLength] = useState(100);
  const [warpCrimp, setWarpCrimp] = useState(7.5);
  const [weftCrimp, setWeftCrimp] = useState(5.5);
  const [pricePerLb, setPricePerLb] = useState(4.80);
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

  // Live Reactive Calculations
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

      const warpTex = warpCount > 0 ? (590.5 / warpCount).toFixed(1) : '0';
      const weftTex = weftCount > 0 ? (590.5 / weftCount).toFixed(1) : '0';

      return {
        gsm,
        ozPerSqYd,
        totalLbs: totalLbs.toFixed(1),
        totalKg: totalKg.toFixed(1),
        warpLbs: warpLbs.toFixed(1),
        weftLbs: weftLbs.toFixed(1),
        warpYards: Math.round(warpYards),
        weftYards: Math.round(weftYards),
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
        warpYards: Math.round(totalYarnYards),
        weftYards: 0,
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header Card */}
      <div style={{ background: 'rgba(14, 17, 23, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>
              <Calculator size={14} />
              <span>Yield Engine &amp; Mathematical Prediction Core</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              Textile Yield &amp; GSM Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '680px', lineHeight: '1.6', margin: 0 }}>
              Industrial mathematical engine calculating fabric weight, yarn requirements, crimp take-up factors, and linear yardage production costs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Print Specification Sheet"
            >
              <Printer size={14} />
              <span>Print Specs</span>
            </button>
          </div>
        </div>

        {/* Preset Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            PRESETS:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: activePreset === p.id ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                background: activePreset === p.id ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: activePreset === p.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{p.name}</span>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
                {p.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid: Controls on Left, Live Yield Analytics on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        
        {/* Left Card: Interactive Controls */}
        <div style={{ background: 'rgba(14, 17, 23, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
          
          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                setMode('woven');
                setActivePreset(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: mode === 'woven' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                background: mode === 'woven' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: mode === 'woven' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={15} />
              <span>Woven Structure</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('knit');
                setActivePreset(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: mode === 'knit' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                background: mode === 'knit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: mode === 'knit' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Grid3X3 size={15} />
              <span>Circular Knit</span>
            </button>
          </div>

          {/* Interactive Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Warp / Wales Yarn Count */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{mode === 'woven' ? 'Warp Yarn Count' : 'Yarn Count'}</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>
                  {warpCount} Ne ({calculations.warpTex} Tex)
                </span>
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
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Weft Yarn Count</span>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>
                    {weftCount} Ne ({calculations.weftTex} Tex)
                  </span>
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{mode === 'woven' ? 'Warp Density (EPI)' : 'Wales per Inch (WPI)'}</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>
                  {epi} {mode === 'woven' ? 'EPI' : 'WPI'}
                </span>
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{mode === 'woven' ? 'Weft Density (PPI)' : 'Courses per Inch (CPI)'}</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>
                  {ppi} {mode === 'woven' ? 'PPI' : 'CPI'}
                </span>
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
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Width</span>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>{width}&quot;</span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="80"
                  step="1"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(width, 36, 80) }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Batch Run</span>
                  <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>{length} yd</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="lux-calc-slider"
                  style={{ background: getSliderBg(length, 50, 1000) }}
                />
              </div>
            </div>

            {/* Crimp Sliders (woven mode) */}
            {mode === 'woven' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Warp Crimp</span>
                    <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>{warpCrimp}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="0.5"
                    value={warpCrimp}
                    onChange={(e) => setWarpCrimp(Number(e.target.value))}
                    className="lux-calc-slider"
                    style={{ background: getSliderBg(warpCrimp, 2, 20) }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Weft Crimp</span>
                    <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>{weftCrimp}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    step="0.5"
                    value={weftCrimp}
                    onChange={(e) => setWeftCrimp(Number(e.target.value))}
                    className="lux-calc-slider"
                    style={{ background: getSliderBg(weftCrimp, 2, 16) }}
                  />
                </div>
              </div>
            )}

            {/* Raw Yarn Price */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Raw Yarn Price</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '12px' }}>${pricePerLb.toFixed(2)} / lb</span>
              </div>
              <input
                type="range"
                min="2.00"
                max="12.00"
                step="0.25"
                value={pricePerLb}
                onChange={(e) => setPricePerLb(Number(e.target.value))}
                className="lux-calc-slider"
                style={{ background: getSliderBg(pricePerLb, 2.00, 12.00) }}
              />
            </div>

          </div>
        </div>

        {/* Right Card: Live Analytical Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* GSM Big Hero Card */}
          <div style={{ padding: '24px', background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 70%), rgba(14, 17, 23, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '20px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              PREDICTED FABRIC DENSITY
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '8px 0 6px' }}>
              <span style={{ fontSize: '56px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#ffffff', letterSpacing: '-0.04em', lineHeight: '1' }}>
                {calculations.gsm}
              </span>
              <span style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '600' }}>g/m²</span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                ({calculations.ozPerSqYd} oz/yd²)
              </span>
            </div>

            {/* Dynamic Classification Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: fabricClass.color, boxShadow: `0 0 8px ${fabricClass.color}` }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>{fabricClass.label}</span>
            </div>

            {/* Spectrum Meter Bar */}
            <div className="lux-yield-spectrum-bar" style={{ marginTop: '16px' }}>
              <div 
                className="lux-yield-spectrum-indicator" 
                style={{ left: `${Math.min(Math.max((calculations.gsm - 60) / (450 - 60) * 100, 2), 98)}%` }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <span>60 gsm (Sheer)</span>
              <span>200 gsm (Mid)</span>
              <span>450+ gsm (Denim)</span>
            </div>
          </div>

          {/* 4 Bento Metrics Cards (2x2 Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Total Yarn Mass */}
            <div style={{ background: 'rgba(14, 17, 23, 0.75)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                <Scale size={15} color="var(--accent-primary)" />
                <span>Total Yarn Mass</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {calculations.totalLbs} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>lbs</span>
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                ≈ {calculations.totalKg} kg
              </div>
            </div>

            {/* Material Cost */}
            <div style={{ background: 'rgba(14, 17, 23, 0.75)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                <DollarSign size={15} color="#fbbf24" />
                <span>Material Cost</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24', lineHeight: '1.2' }}>
                ${calculations.costPerYard} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ yd</span>
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                ${calculations.totalCost} total
              </div>
            </div>

            {/* Loom Geometry */}
            <div style={{ background: 'rgba(14, 17, 23, 0.75)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                <Activity size={15} color="#38bdf8" />
                <span>Loom Geometry</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {calculations.totalEnds} <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>warp ends</span>
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {calculations.totalPicks}
              </div>
            </div>

            {/* Yield Factor */}
            <div style={{ background: 'rgba(14, 17, 23, 0.75)', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
                <Sparkles size={15} color="#f43f5e" />
                <span>Yield Factor</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-primary)', lineHeight: '1.2' }}>
                {calculations.yieldEfficiency}%
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                take-up adjusted
              </div>
            </div>

          </div>

          {/* Warp vs Weft Balance Bar (Woven mode) */}
          {mode === 'woven' && (
            <div style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(14, 17, 23, 0.75)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                <span>Warp: <strong>{calculations.warpLbs} lbs ({calculations.warpRatio}%)</strong></span>
                <span>Weft: <strong>{calculations.weftLbs} lbs ({calculations.weftRatio}%)</strong></span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: `${calculations.warpRatio}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
                <div style={{ width: `${calculations.weftRatio}%`, background: '#38bdf8', transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} /> Warp Beam Yarn ({calculations.warpYards} yd)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} /> Weft Insertion Yarn ({calculations.weftYards} yd)
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Calculations;
