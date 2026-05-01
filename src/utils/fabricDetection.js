// Constants for loop types
export const LOOP_TYPES = {
  EMPTY: 'E',
  KNIT: 'K',
  TUCK: 'T',
  MISS: 'M',
};

// Next loop type in sequence for simple clicking
export const getNextLoopType = (current) => {
  switch (current) {
    case LOOP_TYPES.EMPTY: return LOOP_TYPES.KNIT;
    case LOOP_TYPES.KNIT: return LOOP_TYPES.TUCK;
    case LOOP_TYPES.TUCK: return LOOP_TYPES.MISS;
    case LOOP_TYPES.MISS: return LOOP_TYPES.EMPTY;
    default: return LOOP_TYPES.EMPTY;
  }
};

/**
 * Detects the smallest repeating block in the grid.
 * @param {string[][]} grid - 2D array of loop types
 * @returns {{width: number, height: number}} The dimensions of the repeat unit
 */
export const detectRepeatSize = (grid) => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return { width: 0, height: 0 };
  }
  
  const rows = grid.length;
  const cols = grid[0].length;

  const candidates = [];
  for (let h = 1; h <= rows; h++) {
    for (let w = 1; w <= cols; w++) {
      candidates.push({ w, h, area: w * h });
    }
  }
  
  // Sort by smallest area. If tied, prefer smaller width
  candidates.sort((a, b) => a.area !== b.area ? a.area - b.area : a.w - b.w);

  for (const { w, h } of candidates) {
    if (isRepeating(grid, w, h)) {
      return { width: w, height: h };
    }
  }

  return { width: cols, height: rows };
};

/**
 * Checks if the grid is tiled exactly by a block of width w and height h.
 */
const isRepeating = (grid, w, h) => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      // Allow 'Empty' to be a wildcard? Or strict match? 
      // Usually, structural repeat means strict match.
      if (grid[r][c] !== grid[r % h][c % w]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Extracts the repeat unit block from the grid.
 */
export const extractRepeatUnit = (grid, w, h) => {
  if (!grid || w === 0 || h === 0) return [];
  const unit = [];
  for (let r = 0; r < h; r++) {
    const row = [];
    for (let c = 0; c < w; c++) {
      row.push(grid[r][c]);
    }
    unit.push(row);
  }
  return unit;
};

/**
 * Analyzes the grid to detect the structure name.
 * @param {string[][]} grid - The full grid
 * @param {number} repeatW - Repeat width
 * @param {number} repeatH - Repeat height
 * @returns {{name: string, confidence: number}}
 */
export const detectStructureName = (grid, repeatW, repeatH) => {
  const unit = extractRepeatUnit(grid, repeatW, repeatH);
  if (unit.length === 0) return { name: 'Empty / Invalid', confidence: 0 };

  const allCells = unit.flat();
  const total = allCells.length;
  
  const counts = {
    [LOOP_TYPES.KNIT]: allCells.filter(c => c === LOOP_TYPES.KNIT).length,
    [LOOP_TYPES.TUCK]: allCells.filter(c => c === LOOP_TYPES.TUCK).length,
    [LOOP_TYPES.MISS]: allCells.filter(c => c === LOOP_TYPES.MISS).length,
    [LOOP_TYPES.EMPTY]: allCells.filter(c => c === LOOP_TYPES.EMPTY).length,
  };

  if (counts[LOOP_TYPES.EMPTY] === total) {
    return { name: 'Empty Canvas', confidence: 100 };
  }

  // 1. Plain Jersey (All Knit)
  if (counts[LOOP_TYPES.KNIT] === total) {
    return { name: 'Plain Jersey / Single Jersey', confidence: 100 };
  }

  // 2. Check for alternating columns or rows
  const isAlternatingCols = (type1, type2) => {
    // Check if every column is purely type1 or type2, and they alternate
    for (let c = 0; c < repeatW; c++) {
      const colType = c % 2 === 0 ? type1 : type2;
      for (let r = 0; r < repeatH; r++) {
        if (unit[r][c] !== colType) return false;
      }
    }
    return true;
  };

  const isAlternatingRows = (type1, type2) => {
    for (let r = 0; r < repeatH; r++) {
      const rowType = r % 2 === 0 ? type1 : type2;
      for (let c = 0; c < repeatW; c++) {
        if (unit[r][c] !== rowType) return false;
      }
    }
    return true;
  };

  // 1x1 Lacoste / Eyelet (1x1 Knit-Miss alternation)
  // Usually involves staggered rows, but let's check basic patterns
  // Pattern matching is complex, we use heuristics.

  if (counts[LOOP_TYPES.MISS] > 0 && counts[LOOP_TYPES.TUCK] === 0) {
    if (repeatW === 2 && repeatH === 2) {
       const isCheckerboardKM = 
         (unit[0][0] === LOOP_TYPES.KNIT && unit[0][1] === LOOP_TYPES.MISS &&
          unit[1][0] === LOOP_TYPES.MISS && unit[1][1] === LOOP_TYPES.KNIT);
       if (isCheckerboardKM) return { name: '1×1 Lacoste / Eyelet', confidence: 95 };
    }
    if (isAlternatingCols(LOOP_TYPES.KNIT, LOOP_TYPES.MISS) || isAlternatingRows(LOOP_TYPES.KNIT, LOOP_TYPES.MISS)) {
      return { name: 'Float Stitch / Miss Stitch Fabric', confidence: 90 };
    }
  }

  if (counts[LOOP_TYPES.TUCK] > 0 && counts[LOOP_TYPES.MISS] === 0) {
    if (repeatW === 2 && repeatH === 2) {
      const isCheckerboardKT = 
        (unit[0][0] === LOOP_TYPES.KNIT && unit[0][1] === LOOP_TYPES.TUCK &&
         unit[1][0] === LOOP_TYPES.TUCK && unit[1][1] === LOOP_TYPES.KNIT);
      if (isCheckerboardKT) return { name: 'Seed Stitch / Moss Stitch (Tuck var.)', confidence: 90 };
      
      const isCardigan = 
        (unit[0][0] === LOOP_TYPES.KNIT && unit[0][1] === LOOP_TYPES.TUCK &&
         unit[1][0] === LOOP_TYPES.TUCK && unit[1][1] === LOOP_TYPES.KNIT); // Simplified
    }
    
    // Half Cardigan: Every other row fully Miss/Tuck ? Actually Half Cardigan is 1x1 Rib with Tuck on one bed.
    // In our simplified single bed representation:
    if (isAlternatingRows(LOOP_TYPES.KNIT, LOOP_TYPES.TUCK)) {
        return { name: 'Half Cardigan (Single Bed Sim)', confidence: 85 };
    }
    
    if (isAlternatingCols(LOOP_TYPES.KNIT, LOOP_TYPES.TUCK)) {
        return { name: 'Tuck Stitch Fabric', confidence: 90 };
    }
  }

  // Fallback for mixed or unrecognized
  let closest = 'Custom / Irregular Structure';
  let conf = 100;
  
  if (counts[LOOP_TYPES.KNIT] > 0 && counts[LOOP_TYPES.TUCK] > 0 && counts[LOOP_TYPES.MISS] > 0) {
    closest = 'Mixed Structure (K, T, M)';
  } else if (counts[LOOP_TYPES.KNIT] > 0 && counts[LOOP_TYPES.TUCK] > 0) {
    closest = 'Custom Tuck Structure';
  } else if (counts[LOOP_TYPES.KNIT] > 0 && counts[LOOP_TYPES.MISS] > 0) {
    closest = 'Custom Float Structure';
  }

  return { name: closest, confidence: conf };
};
