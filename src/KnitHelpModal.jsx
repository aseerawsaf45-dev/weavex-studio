import React from 'react';
import { LOOP_TYPES } from './utils/fabricDetection';

const KnitHelpModal = ({ onClose }) => {
  
  const renderCell = (type) => {
    let content = '';
    let color = '';
    if (type === LOOP_TYPES.KNIT) { content = '●'; color = 'var(--knit-color)'; }
    if (type === LOOP_TYPES.TUCK) { content = '∩'; color = 'var(--tuck-color)'; }
    if (type === LOOP_TYPES.MISS) { content = '─'; color = 'var(--miss-color)'; }

    return (
      <div style={{
        width: '24px', height: '24px', background: 'var(--bg-grid)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontWeight: type !== LOOP_TYPES.KNIT ? 'bold' : 'normal', fontSize: '14px'
      }}>
        {content}
      </div>
    );
  };

  const renderGrid = (matrix) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', padding: '1px', border: '1px solid var(--border-strong)' }}>
      {matrix.map((row, r) => (
        <div key={r} style={{ display: 'flex', gap: '1px' }}>
          {row.map((cell, c) => <React.Fragment key={c}>{renderCell(cell)}</React.Fragment>)}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{
        background: 'var(--bg-base)', border: '1px solid var(--border)',
        borderRadius: '8px', width: '800px', maxWidth: '90vw', maxHeight: '90vh',
        overflowY: 'auto', padding: '32px', position: 'relative',
        color: 'var(--text-primary)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>✕</button>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
          How to Design in KnitCAD Pro
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
          A visual guide to weft-knitting structures. Paint loops onto the grid to create fabrics.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '16px', fontSize: '20px' }}>1. The Three Basic Loops</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{renderCell(1)}</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Knit (K)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>The standard loop. Pulls the new yarn through the old loop. Creates a smooth V-shaped face.</p>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{renderCell(2)}</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Tuck (T)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Holds the old loop and adds a new yarn over it. Creates width, texture, and cellular holes.</p>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{renderCell(3)}</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Miss / Float (M)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>The needle stays down. Yarn floats behind the fabric. Used for jacquard colorwork and reducing width.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '16px', fontSize: '20px' }}>2. Visual Examples</h3>
            
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {renderGrid([
                  [1, 1, 1, 1],
                  [1, 1, 1, 1],
                  [1, 1, 1, 1],
                  [1, 1, 1, 1]
                ])}
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Plain Jersey</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>All knit loops. The simplest and most common t-shirt fabric.</p>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {renderGrid([
                  [1, 0, 1, 0],
                  [1, 0, 1, 0],
                  [1, 0, 1, 0],
                  [1, 0, 1, 0]
                ])}
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1x1 Rib</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Alternating Knit and Empty (purl) columns. Highly elastic, used in cuffs and collars.</p>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {renderGrid([
                  [1, 2, 1, 2],
                  [2, 1, 2, 1],
                  [1, 2, 1, 2],
                  [2, 1, 2, 1]
                ])}
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Moss Stitch (Tuck)</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Alternating knit and tuck loops. Creates a textured, cellular "waffle" surface.</p>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '24px', alignItems: 'center' }}>
                {renderGrid([
                  [1, 1, 1, 1],
                  [3, 3, 1, 1],
                  [1, 1, 1, 1],
                  [1, 1, 3, 3]
                ])}
                <div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Float Jacquard</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Miss stitches create horizontal floats on the back, allowing multiple colors to be used on the face.</p>
                </div>
              </div>
            </div>
          </section>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn-primary" onClick={onClose} style={{ padding: '12px 32px', fontSize: '16px' }}>
              Got it! Let's Knit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KnitHelpModal;
