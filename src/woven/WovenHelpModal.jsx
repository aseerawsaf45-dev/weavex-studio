import React from 'react';
import { CELL_STATE } from './utils/weaveMath';

const WovenHelpModal = ({ onClose }) => {
  
  const renderDrawdown = (matrix) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrix[0].length}, 20px)`, gridTemplateRows: `repeat(${matrix.length}, 20px)`, gap: '1px', background: 'var(--border-strong)', padding: '1px' }}>
      {matrix.map((row, r) => row.map((cell, c) => (
        <div key={`${r}-${c}`} style={{ background: 'var(--bg-grid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cell === CELL_STATE.WARP_UP ? 
            <div style={{ width: '100%', height: '100%', background: 'var(--warp-up)' }}></div> : 
            <div style={{ width: '100%', height: '100%', background: 'var(--weft-up)' }}></div>
          }
        </div>
      )))}
    </div>
  );

  const renderDraft = (threading, liftPlan, drawdown) => (
    <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', padding: '16px', background: 'var(--bg-grid)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      {/* Top Left: Threading */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${threading[0].length}, 20px)`, gridTemplateRows: `repeat(${threading.length}, 12px)`, gap: '1px', background: 'var(--border)', padding: '1px' }}>
        {threading.map((row, s) => row.map((cell, c) => (
          <div key={`th-${s}-${c}`} style={{ background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cell === CELL_STATE.MARKED && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-shaft)' }}></div>}
          </div>
        )))}
      </div>
      {/* Top Right: Empty */}
      <div></div>
      {/* Bottom Left: Drawdown */}
      {renderDrawdown(drawdown)}
      {/* Bottom Right: Lifting Plan (Peg Plan) */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${liftPlan[0].length}, 12px)`, gridTemplateRows: `repeat(${liftPlan.length}, 20px)`, gap: '1px', background: 'var(--border)', padding: '1px' }}>
        {liftPlan.map((row, p) => row.map((cell, s) => (
          <div key={`lp-${p}-${s}`} style={{ background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cell === CELL_STATE.MARKED && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-treadle)' }}></div>}
          </div>
        )))}
      </div>
    </div>
  );

  // Plain Weave Data
  const pwTh = [[1,0,1,0],[0,1,0,1]]; // 2 shafts
  const pwLp = [[1,0],[0,1],[1,0],[0,1]]; // Peg Plan
  const pwDd = [[1,0,1,0],[0,1,0,1],[1,0,1,0],[0,1,0,1]];

  // Twill Data
  const twTh = [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]]; // 4 shafts straight
  const twLp = [[1,1,0,0],[0,1,1,0],[0,0,1,1],[1,0,0,1]]; // Peg Plan
  const twDd = [[1,1,0,0],[0,1,1,0],[0,0,1,1],[1,0,0,1]];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{
        background: 'var(--bg-base)', border: '1px solid var(--border)',
        borderRadius: '8px', width: '900px', maxWidth: '95vw', maxHeight: '90vh',
        overflowY: 'auto', padding: '32px', position: 'relative',
        fontFamily: 'var(--font-woven-body)', color: 'var(--text-primary)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>✕</button>

        <h2 style={{ fontFamily: 'var(--font-woven-display)', fontSize: '32px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
          Visual Guide to Weaving
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
          See how Threading, Tie-up, and Treadling combine to create woven structures.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section style={{ display: 'flex', gap: '32px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '20px' }}>Plain Weave</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                The simplest over-under structure. Notice the <strong>Drafting (top)</strong> alternates between shaft 1 and 2. The <strong>Weaving Plan (right)</strong> alternates between pedal 1 and 2. The resulting <strong>Weave Design (main grid)</strong> is a perfect checkerboard.
              </p>
            </div>
            <div>
              {renderDraft(pwTh, pwLp, pwDd)}
            </div>
          </section>

          <section style={{ display: 'flex', gap: '32px', background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '12px', fontSize: '20px' }}>2/2 Twill (Denim)</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Twills create diagonal lines. The <strong>Drafting</strong> is a straight line across 4 shafts. The <strong>Lifting (side)</strong> connects 2 shafts on each pick. The <strong>Weave Design</strong> shows the classic denim diagonal step.
              </p>
            </div>
            <div>
              {renderDraft(twTh, twLp, twDd)}
            </div>
          </section>

          <section style={{ background: 'var(--bg-elevated)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '18px' }}>100% Manual Independent Design</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
              WeaveDraft operates in a fully manual mode. There are no automatic algorithms or mathematical links forced upon you. You can independently draw 'X' marks on the Drafting Plan, Lifting Plan, and Weaving Plan exactly as you envision them, giving you complete artistic freedom without interference.
            </p>
          </section>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn-primary" onClick={onClose} style={{ padding: '12px 32px', fontSize: '16px', fontFamily: 'var(--font-woven-body)' }}>
              Start Drafting
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WovenHelpModal;
