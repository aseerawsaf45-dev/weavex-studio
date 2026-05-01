import { CELL_STATE } from './weaveMath';

/**
 * Generates the WIF (Weaving Information File) standard format string.
 */
export const generateWIF = (draftState, metadata) => {
  const { threading, tieup, treadling, drawdown, warpEnds, weftPicks, numShafts, numTreadles, sett, ppi } = draftState;
  
  let wif = '';
  
  // Basic Info
  wif += '[WIF]\n';
  wif += 'Version=1.1\n';
  wif += `Date=${new Date().toLocaleDateString()}\n`;
  wif += 'Source Program=WeaveDraft App\n\n';

  wif += '[CONTENTS]\n';
  wif += 'Warp=yes\nWeft=yes\nThreading=yes\nTieup=yes\nTreadling=yes\n\n';

  // Warp & Weft
  wif += '[WARP]\n';
  wif += `Threads=${warpEnds}\n`;
  wif += 'Units=cm\n';
  wif += `Spacing=${sett}\n\n`; // WIF uses Spacing or Ends/Unit

  wif += '[WEFT]\n';
  wif += `Threads=${weftPicks}\n`;
  wif += 'Units=cm\n';
  wif += `Spacing=${ppi}\n\n`;

  // Threading
  wif += '[THREADING]\n';
  // WIF threading: 1=shaft_num, 2=shaft_num (for each end 1 to warpEnds)
  for (let c = 0; c < warpEnds; c++) {
    // Find which shaft is marked. Assume 1 marked shaft per end for standard WIF.
    let shaft = 1;
    for (let s = 0; s < numShafts; s++) {
      if (threading[s][c] === CELL_STATE.MARKED) {
        // WIF shafts usually 1-indexed, 1 is bottom or top depending on software.
        // We'll use 1-indexed (s + 1).
        shaft = numShafts - s; // Assuming row 0 is top shaft, usually Shaft N
        break;
      }
    }
    wif += `${c + 1}=${shaft}\n`;
  }
  wif += '\n';

  // Tieup
  wif += '[TIEUP]\n';
  // WIF Tieup: treadle=shaft1,shaft2...
  for (let t = 0; t < numTreadles; t++) {
    const tiedShafts = [];
    for (let s = 0; s < numShafts; s++) {
      if (tieup[s][t] === CELL_STATE.MARKED) {
        tiedShafts.push(numShafts - s);
      }
    }
    if (tiedShafts.length > 0) {
      wif += `${t + 1}=${tiedShafts.join(',')}\n`;
    }
  }
  wif += '\n';

  // Treadling
  wif += '[TREADLING]\n';
  // WIF Treadling: 1=treadle_num
  for (let r = 0; r < weftPicks; r++) {
    let treadle = 1;
    for (let t = 0; t < numTreadles; t++) {
      if (treadling[r][t] === CELL_STATE.MARKED) {
        treadle = t + 1;
        break;
      }
    }
    wif += `${r + 1}=${treadle}\n`;
  }
  wif += '\n';

  return wif;
};

export const exportWIF = (draftState, filename = 'draft.wif') => {
  const wifContent = generateWIF(draftState, {});
  const blob = new Blob([wifContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
};
