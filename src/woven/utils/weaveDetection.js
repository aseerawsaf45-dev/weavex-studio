import { CELL_STATE, computeLiftDrawdown, convertToLiftPlan } from './weaveMath';
import { wovenTemplates } from './wovenTemplatesData';

/**
 * Detects the smallest repeating block in the drawdown.
 */
export const detectRepeatSize = (drawdown) => {
  if (!drawdown || drawdown.length === 0 || drawdown[0].length === 0) {
    return { width: 0, height: 0, unit: [] };
  }
  
  const R = drawdown.length;
  const C = drawdown[0].length;

  for (let w = 1; w <= C; w++) {
    if (C % w !== 0 && w !== C) continue;
    for (let h = 1; h <= R; h++) {
      if (R % h !== 0 && h !== R) continue;
      
      if (isValidRepeat(drawdown, w, h)) {
        return { width: w, height: h, unit: extract(drawdown, w, h) };
      }
    }
  }
  return { width: C, height: R, unit: drawdown };
};

const isValidRepeat = (grid, w, h) => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] !== grid[r % h][c % w]) return false;
    }
  }
  return true;
};

const extract = (grid, w, h) => {
  const unit = [];
  for (let r = 0; r < h; r++) {
    unit.push(grid[r].slice(0, w));
  }
  return unit;
};

/**
 * Computes the maximum float lengths for warp and weft.
 */
export const analyzeFloats = (drawdown) => {
  let maxWarpFloat = 0;
  let maxWeftFloat = 0;

  const R = drawdown.length;
  const C = drawdown[0].length;

  for (let c = 0; c < C; c++) {
    let currentWarp = 0;
    for (let r = 0; r < R; r++) {
      if (drawdown[r][c] === CELL_STATE.WARP_UP) {
        currentWarp++;
        if (currentWarp > maxWarpFloat) maxWarpFloat = currentWarp;
      } else {
        currentWarp = 0;
      }
    }
  }

  for (let r = 0; r < R; r++) {
    let currentWeft = 0;
    for (let c = 0; c < C; c++) {
      if (drawdown[r][c] === CELL_STATE.WEFT_UP) {
        currentWeft++;
        if (currentWeft > maxWeftFloat) maxWeftFloat = currentWeft;
      } else {
        currentWeft = 0;
      }
    }
  }

  return { maxWarpFloat, maxWeftFloat };
};

const getShiftedMatrix = (matrix, shiftR, shiftC) => {
  const R = matrix.length;
  const C = matrix[0].length;
  const shifted = [];
  for (let r = 0; r < R; r++) {
    const row = [];
    for (let c = 0; c < C; c++) {
      row.push(matrix[(r + shiftR) % R][(c + shiftC) % C]);
    }
    shifted.push(row);
  }
  return shifted;
};

const areMatricesEqual = (m1, m2) => {
  if (m1.length !== m2.length) return false;
  if (m1[0].length !== m2[0].length) return false;
  for (let r = 0; r < m1.length; r++) {
    for (let c = 0; c < m1[0].length; c++) {
      if (m1[r][c] !== m2[r][c]) return false;
    }
  }
  return true;
};

/**
 * Detects the weave structure based on the drawdown unit.
 */
export const detectWeaveStructure = (drawdown, repeatW, repeatH) => {
  const unit = extract(drawdown, repeatW, repeatH);
  if (unit.length === 0) return { name: 'Empty / Invalid', confidence: 0, classification: 'Unknown' };

  let totalCells = repeatW * repeatH;
  let warpUpCount = 0;
  
  unit.forEach(row => row.forEach(cell => {
    if (cell === CELL_STATE.WARP_UP) warpUpCount++;
  }));

  const warpRatio = warpUpCount / totalCells;
  let classification = 'Balanced';
  if (warpRatio > 0.55) classification = 'Warp-Faced';
  if (warpRatio < 0.45) classification = 'Weft-Faced';

  if (warpRatio === 0) return { name: 'Empty (No Warp)', confidence: 100, classification: 'Weft-Faced' };
  if (warpRatio === 1) return { name: 'Solid Warp', confidence: 100, classification: 'Warp-Faced' };

  // 100% Accurate Template Matching!
  // We check the user's unit against all known templates. We check all cyclic shifts to ensure we match even if they started drawing from a different offset.
  for (const template of wovenTemplates) {
    // Generate template's drawdown
    const liftPlan = convertToLiftPlan(template.tieup, template.treadling);
    const tempDrawdown = computeLiftDrawdown(template.threading, liftPlan);
    // Find template's repeat unit
    const tempRepeat = detectRepeatSize(tempDrawdown);
    
    // If the repeat sizes match exactly
    if (tempRepeat.width === repeatW && tempRepeat.height === repeatH) {
      // Check all possible cyclic shifts
      let matchFound = false;
      for (let sr = 0; sr < repeatH; sr++) {
        for (let sc = 0; sc < repeatW; sc++) {
          const shiftedUserUnit = getShiftedMatrix(unit, sr, sc);
          if (areMatricesEqual(shiftedUserUnit, tempRepeat.unit)) {
            matchFound = true;
            break;
          }
        }
        if (matchFound) break;
      }
      
      if (matchFound) {
        return { name: template.name, confidence: 100, classification };
      }
    }
  }

  // Fallback heuristic detection if no exact template match
  let isPlainWeave = true;
  for (let r = 0; r < repeatH; r++) {
    for (let c = 0; c < repeatW; c++) {
      const expected = (r + c) % 2 === 0 ? CELL_STATE.WARP_UP : CELL_STATE.WEFT_UP;
      if (unit[r][c] !== expected) isPlainWeave = false;
    }
  }
  if (isPlainWeave) return { name: 'Plain Weave / Tabby', confidence: 100, classification };

  if (repeatW === repeatH && repeatW >= 3) {
    let isZ = true;
    let isS = true;
    for (let r = 1; r < repeatH; r++) {
      for (let c = 0; c < repeatW; c++) {
        if (unit[r][c] !== unit[r-1][(c - 1 + repeatW) % repeatW]) isZ = false;
        if (unit[r][c] !== unit[r-1][(c + 1) % repeatW]) isS = false;
      }
    }
    if (isZ || isS) {
      let warpCount = unit[0].filter(x => x === CELL_STATE.WARP_UP).length;
      let weftCount = repeatW - warpCount;
      const dir = isZ ? '(Z)' : '(S)';
      
      let transitions = 0;
      for(let i=0; i<repeatW; i++) {
         if (unit[0][i] !== unit[0][(i+1)%repeatW]) transitions++;
      }
      
      if (transitions === 2) {
        return { name: `${warpCount}/${weftCount} Twill ${dir}`, confidence: 100, classification };
      }
    }
  }

  if (repeatW >= 4 && repeatW === repeatH) {
    let isWarpSatin = true;
    let isWeftSateen = true;
    for (let r=0; r<repeatH; r++) {
      const warpCount = unit[r].filter(c => c === CELL_STATE.WARP_UP).length;
      if (warpCount !== repeatW - 1) isWarpSatin = false;
      if (warpCount !== 1) isWeftSateen = false;
    }
    if (isWarpSatin) return { name: `${repeatW}-End Satin`, confidence: 95, classification: 'Warp-Faced' };
    if (isWeftSateen) return { name: `${repeatW}-End Sateen`, confidence: 95, classification: 'Weft-Faced' };
  }

  return { name: 'Custom / Complex Interlacement', confidence: 100, classification };
};
