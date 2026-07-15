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
 * Checks if the grid is tiled exactly by a block of width w and height h,
 * starting from the bottom-left corner.
 */
const isRepeating = (grid, w, h) => {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rFromBottom = rows - 1 - r;
      const expectedR = rows - 1 - (rFromBottom % h);
      const expectedC = c % w;
      if (grid[r][c] !== grid[expectedR][expectedC]) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Extracts the repeat unit block from the grid, originating from the bottom-left.
 * The returned unit is ordered from bottom row to top row (unit[0] is the bottom row).
 */
export const extractRepeatUnit = (grid, w, h) => {
  if (!grid || w === 0 || h === 0) return [];
  const unit = [];
  const rows = grid.length;
  for (let r = rows - 1; r >= rows - h; r--) {
    const row = [];
    for (let c = 0; c < w; c++) {
      row.push(grid[r][c]);
    }
    unit.push(row);
  }
  return unit;
};

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

  if (counts[LOOP_TYPES.KNIT] === total) {
    return { name: 'Plain Jersey / Single Jersey', confidence: 100 };
  }

  // Helper to serialize a grid unit into a string
  const gridToString = (g) => g.map(row => row.join('')).join('|');

  // Helper to generate a shifted string (cyclic permutation)
  const getShiftedString = (dx, dy) => {
    const shifted = [];
    for (let r = 0; r < repeatH; r++) {
      const row = [];
      for (let c = 0; c < repeatW; c++) {
        row.push(unit[(r + dy) % repeatH][(c + dx) % repeatW]);
      }
      shifted.push(row.join(''));
    }
    return shifted.join('|');
  };

  // Exact pattern matching for common repeat blocks
  const exactMatches = {
    'KM': '1×1 Rib',
    'KKMM': '2×2 Rib',
    'KKKM': '3×1 Rib',
    'KK|KM|MK': 'Milano Rib',
    'K|M': 'Full Purl',
    'KM|TK|KM|TK': 'Fisherman Rib',
    'KK|TK': 'Half Cardigan',
    'KT|TK': 'Full Cardigan',
    'KK|TT': 'Horizontal Tuck',
    'KT': 'Vertical Tuck',
    'TK|TK': 'Repeated Tuck',
    'TTKK|KKTT': 'Dense Textured Tuck',
    'KM|MK': 'Interlock / 1×1 Lacoste',
    'KK|MM|KM|MK': 'Ponte',
    'KTMK|MKTM': 'Multi-Color Tuck',
    'KMMK|MKKM': 'Bird\'s Eye Jacquard',
    'KK|MM': 'Backed Jacquard',
    'KTKM|MKTK': 'Open Patterned Mesh',
    'KKMK|KMKM|MKKK': 'Openwork Lace',
    'KK|KM': 'Eyelet Pattern',
    'KKKKMM|MMKKKK': 'Rope Cable',
    'KTKTMMMM': 'Braided Cable',
    'KMKMKMKM': 'Celtic Cable',
    'KKMM|MMKK': 'Double Jersey Jacquard / Double Jersey',
    'KMMM|MKMM': 'Floating Jacquard',
    'KKTT|MMMM': 'Blister Jacquard',
    'KTKT|KKKK|TKTK|KKKK': 'Knit + Tuck Honeycomb',
    'KMKM|KKKK|MKMK|KKKK': 'Polo-Shirt Texture / Pique',
    'KT|KK|TK|KK': 'Single Lacoste / Single Pique',
    'KT|KT|TK|TK': 'Double Lacoste / Double Pique',
    'KT|MK': 'Polka Rib',
    'KMTK|TKKM|KKMT|MTKK': 'Crepe Effects',
    'KMMKMM|KMMKMM|MMMKMM|MMMKMM': '3D Raised Textures',
  };

  // Exact pattern matching for common repeat blocks against ALL cyclic shifts
  for (let dy = 0; dy < repeatH; dy++) {
    for (let dx = 0; dx < repeatW; dx++) {
      const shiftedStr = getShiftedString(dx, dy);
      if (exactMatches[shiftedStr]) {
        let name = exactMatches[shiftedStr];
        // Resolve simple overlaps
        if (shiftedStr === 'KM|MK' || shiftedStr === 'MK|KM') name = 'Interlock / Double Jersey / Single Jersey Jacquard';
        return { name, confidence: 95 };
      }
    }
  }

  // 2. Check for alternating columns or rows (shift-invariant)
  const isAlternatingCols = (type1, type2) => {
    let match1 = true;
    let match2 = true;
    for (let c = 0; c < repeatW; c++) {
      for (let r = 0; r < repeatH; r++) {
        if (unit[r][c] !== (c % 2 === 0 ? type1 : type2)) match1 = false;
        if (unit[r][c] !== (c % 2 === 0 ? type2 : type1)) match2 = false;
      }
    }
    return match1 || match2;
  };

  const isAlternatingRows = (type1, type2) => {
    let match1 = true;
    let match2 = true;
    for (let r = 0; r < repeatH; r++) {
      for (let c = 0; c < repeatW; c++) {
        if (unit[r][c] !== (r % 2 === 0 ? type1 : type2)) match1 = false;
        if (unit[r][c] !== (r % 2 === 0 ? type2 : type1)) match2 = false;
      }
    }
    return match1 || match2;
  };

  if (counts[LOOP_TYPES.MISS] > 0 && counts[LOOP_TYPES.TUCK] === 0) {
    if (isAlternatingCols(LOOP_TYPES.KNIT, LOOP_TYPES.MISS) || isAlternatingRows(LOOP_TYPES.KNIT, LOOP_TYPES.MISS)) {
      return { name: 'Float Stitch / Miss Stitch Fabric', confidence: 90 };
    }
  }

  if (counts[LOOP_TYPES.TUCK] > 0 && counts[LOOP_TYPES.MISS] === 0) {
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
