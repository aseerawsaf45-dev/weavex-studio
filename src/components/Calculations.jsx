import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Scale, Ruler, Settings, Layers, Grid3X3 } from 'lucide-react';

const Calculations = () => {
  const [mode, setMode] = useState('woven'); // 'woven' or 'knit'

  // ─── Woven State ──────────────────────────────────
  const [epi, setEpi] = useState(60);
  const [ppi, setPpi] = useState(50);
  const [wovenWidth, setWovenWidth] = useState(44);
  const [wovenLength, setWovenLength] = useState(100);
  const [warpCrimp, setWarpCrimp] = useState(10);
  const [weftCrimp, setWeftCrimp] = useState(5);
  const [warpCount, setWarpCount] = useState(30);
  const [weftCount, setWeftCount] = useState(30);
  const [wovenPricePerLb, setWovenPricePerLb] = useState(5.50);
  const [wovenResults, setWovenResults] = useState({
    warpYards: 0, warpLbs: 0, weftYards: 0, weftLbs: 0, totalWeight: 0, gsm: 0, cost: 0
  });

  // ─── Knit State ───────────────────────────────────
  const [gauge, setGauge] = useState(7); // GG (Gauge)
  const [wpi, setWpi] = useState(14); // Wales per inch
  const [cpi, setCpi] = useState(18); // Courses per inch
  const [knitWidth, setKnitWidth] = useState(60); // inches (tubular diameter)
  const [knitLength, setKnitLength] = useState(100); // yards
  const [knitCount, setKnitCount] = useState(24); // Ne
  const [stitchLength, setStitchLength] = useState(0.3); // cm
  const [knitPricePerLb, setKnitPricePerLb] = useState(6.00);
  const [knitResults, setKnitResults] = useState({
    totalYarn: 0, yarnWeight: 0, gsm: 0, cost: 0, stitchesPerSqIn: 0
  });

  // ─── Woven Calculations ───────────────────────────
  useEffect(() => {
    const totalEnds = epi * wovenWidth;
    const warpYards = totalEnds * wovenLength * (1 + warpCrimp / 100);
    const warpLbs = warpYards / (840 * warpCount);
    const lengthInches = wovenLength * 36;
    const totalPicks = ppi * lengthInches;
    const weftYards = (totalPicks * wovenWidth / 36) * (1 + weftCrimp / 100);
    const weftLbs = weftYards / (840 * weftCount);
    const totalWeight = warpLbs + weftLbs;
    const cost = totalWeight * wovenPricePerLb;
    const weightGrams = totalWeight * 453.592;
    const areaSqMeters = (wovenWidth * 0.0254) * (wovenLength * 0.9144);
    const gsm = areaSqMeters > 0 ? (weightGrams / areaSqMeters) : 0;
    setWovenResults({ warpYards, warpLbs, weftYards, weftLbs, totalWeight, gsm, cost });
  }, [epi, ppi, wovenWidth, wovenLength, warpCrimp, weftCrimp, warpCount, weftCount, wovenPricePerLb]);

  // ─── Knit Calculations ────────────────────────────
  useEffect(() => {
    const stitchesPerSqIn = wpi * cpi;
    const fabricWidthCm = knitWidth * 2.54;
    const fabricLengthCm = knitLength * 91.44;
    const totalStitches = stitchesPerSqIn * (knitWidth * knitLength * 36);
    const totalYarnCm = totalStitches * stitchLength;
    const totalYarnYards = totalYarnCm / 91.44;
    const yarnWeight = totalYarnYards / (840 * knitCount);
    const cost = yarnWeight * knitPricePerLb;
    const weightGrams = yarnWeight * 453.592;
    const areaSqMeters = (fabricWidthCm / 100) * (fabricLengthCm / 100);
    const gsm = areaSqMeters > 0 ? (weightGrams / areaSqMeters) : 0;
    setKnitResults({ totalYarn: totalYarnYards, yarnWeight, gsm, cost, stitchesPerSqIn });
  }, [wpi, cpi, knitWidth, knitLength, knitCount, stitchLength, knitPricePerLb]);

  const inputStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const labelStyle = { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Mode Selector */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
        <button
          onClick={() => setMode('woven')}
          style={{
            padding: '12px 28px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '14px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: mode === 'woven' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: mode === 'woven' ? '#120f18' : 'var(--text-secondary)',
            transition: 'all 0.3s ease'
          }}
        >
          <Layers size={16} /> Woven
        </button>
        <button
          onClick={() => setMode('knit')}
          style={{
            padding: '12px 28px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '14px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: mode === 'knit' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: mode === 'knit' ? '#120f18' : 'var(--text-secondary)',
            transition: 'all 0.3s ease',
            borderLeft: '1px solid var(--border)'
          }}
        >
          <Grid3X3 size={16} /> Knit
        </button>
      </div>

      {/* ═══════════════ WOVEN SECTION ═══════════════ */}
      {mode === 'woven' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Woven Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={inputStyle}>
                <label style={labelStyle}>Warp EPI</label>
                <input type="number" value={epi} onChange={e => setEpi(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Weft PPI</label>
                <input type="number" value={ppi} onChange={e => setPpi(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Fabric Width (in)</label>
                <input type="number" value={wovenWidth} onChange={e => setWovenWidth(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Fabric Length (yd)</label>
                <input type="number" value={wovenLength} onChange={e => setWovenLength(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Warp Crimp (%)</label>
                <input type="number" value={warpCrimp} onChange={e => setWarpCrimp(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Weft Crimp (%)</label>
                <input type="number" value={weftCrimp} onChange={e => setWeftCrimp(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Warp Count (Ne)</label>
                <input type="number" value={warpCount} onChange={e => setWarpCount(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Weft Count (Ne)</label>
                <input type="number" value={weftCount} onChange={e => setWeftCount(Number(e.target.value))} />
              </div>
              <div style={{ ...inputStyle, gridColumn: 'span 2' }}>
                <label style={labelStyle}>Yarn Price per lb ($)</label>
                <input type="number" value={wovenPricePerLb} onChange={e => setWovenPricePerLb(Number(e.target.value))} step="0.1" />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fabric Weight (GSM)</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(57, 255, 20, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={24} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{wovenResults.gsm.toFixed(2)}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Cost</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={24} color="var(--accent-secondary)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${wovenResults.cost.toFixed(2)}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Yarn Requirements</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(57, 255, 20, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ruler size={16} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Warp: {wovenResults.warpLbs.toFixed(2)} lbs</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({wovenResults.warpYards.toLocaleString(undefined, {maximumFractionDigits:0})} yds)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ruler size={16} color="var(--accent-secondary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Weft: {wovenResults.weftLbs.toFixed(2)} lbs</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({wovenResults.weftYards.toLocaleString(undefined, {maximumFractionDigits:0})} yds)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ KNIT SECTION ═══════════════ */}
      {mode === 'knit' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Knit Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={inputStyle}>
                <label style={labelStyle}>Machine Gauge (GG)</label>
                <input type="number" value={gauge} onChange={e => setGauge(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Stitch Length (cm)</label>
                <input type="number" value={stitchLength} onChange={e => setStitchLength(Number(e.target.value))} step="0.01" />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Wales per Inch (WPI)</label>
                <input type="number" value={wpi} onChange={e => setWpi(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Courses per Inch (CPI)</label>
                <input type="number" value={cpi} onChange={e => setCpi(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Fabric Width (in)</label>
                <input type="number" value={knitWidth} onChange={e => setKnitWidth(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Fabric Length (yd)</label>
                <input type="number" value={knitLength} onChange={e => setKnitLength(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Yarn Count (Ne)</label>
                <input type="number" value={knitCount} onChange={e => setKnitCount(Number(e.target.value))} />
              </div>
              <div style={inputStyle}>
                <label style={labelStyle}>Yarn Price per lb ($)</label>
                <input type="number" value={knitPricePerLb} onChange={e => setKnitPricePerLb(Number(e.target.value))} step="0.1" />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stitch Density</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(57, 255, 20, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Grid3X3 size={24} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{knitResults.stitchesPerSqIn}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>stitches / sq in</div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fabric Weight (GSM)</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(57, 255, 20, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={24} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{knitResults.gsm.toFixed(2)}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Yarn Required</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ruler size={24} color="var(--accent-secondary)" />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{knitResults.yarnWeight.toFixed(2)} lbs</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({knitResults.totalYarn.toLocaleString(undefined, {maximumFractionDigits:0})} yds)</div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Cost</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={24} color="var(--accent-secondary)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${knitResults.cost.toFixed(2)}</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Calculations;
