/**
 * WeaveMath.js
 * Core algorithms for weave structure calculation.
 */

// Cell States
export const CELL_STATE = {
  WARP_UP: 1, // ■
  WEFT_UP: 0, // □
  EMPTY: 0,   // For threading/tieup/treadling unassigned
  MARKED: 1   // For threading/tieup/treadling assigned
};

/**
 * Computes the drawdown matrix from threading, tieup, and treadling.
 * 
 * @param {number[][]} threading - [shafts][warpEnds]
 * @param {number[][]} tieup - [shafts][treadles]
 * @param {number[][]} treadling - [weftPicks][treadles]
 * @returns {number[][]} drawdown - [weftPicks][warpEnds]
 */
export const computeDrawdown = (threading, tieup, treadling) => {
  if (!threading || !tieup || !treadling) return [];
  if (threading.length === 0 || tieup.length === 0 || treadling.length === 0) return [];

  const numShafts = threading.length;
  const warpEnds = threading[0].length;
  const treadles = tieup[0].length;
  const weftPicks = treadling.length;

  const drawdown = Array(weftPicks).fill(0).map(() => Array(warpEnds).fill(CELL_STATE.WEFT_UP));

  for (let pick = 0; pick < weftPicks; pick++) {
    for (let end = 0; end < warpEnds; end++) {
      let isLifted = false;

      // OR over all shafts
      for (let s = 0; s < numShafts; s++) {
        // If end is threaded on shaft s
        if (threading[s][end] === CELL_STATE.MARKED) {
          // Check if any treadle tied to shaft s is pressed in this pick
          let isTreadlePressed = false;
          for (let t = 0; t < treadles; t++) {
            if (tieup[s][t] === CELL_STATE.MARKED && treadling[pick][t] === CELL_STATE.MARKED) {
              isTreadlePressed = true;
              break;
            }
          }
          if (isTreadlePressed) {
            isLifted = true;
            break;
          }
        }
      }

      drawdown[pick][end] = isLifted ? CELL_STATE.WARP_UP : CELL_STATE.WEFT_UP;
    }
  }

  return drawdown;
};

/**
 * Computes the drawdown matrix directly from threading and a lift plan (peg plan).
 * 
 * @param {number[][]} threading - [shafts][warpEnds]
 * @param {number[][]} liftPlan - [weftPicks][shafts]
 * @returns {number[][]} drawdown - [weftPicks][warpEnds]
 */
export const computeLiftDrawdown = (threading, liftPlan) => {
  if (!threading || !liftPlan) return [];
  if (threading.length === 0 || liftPlan.length === 0) return [];

  const numShafts = threading.length;
  const warpEnds = threading[0].length;
  const weftPicks = liftPlan.length;

  const drawdown = Array(weftPicks).fill(0).map(() => Array(warpEnds).fill(CELL_STATE.WEFT_UP));

  for (let pick = 0; pick < weftPicks; pick++) {
    for (let end = 0; end < warpEnds; end++) {
      let isLifted = false;
      for (let s = 0; s < numShafts; s++) {
        if (threading[s][end] === CELL_STATE.MARKED && liftPlan[pick][s] === CELL_STATE.MARKED) {
          isLifted = true;
          break;
        }
      }
      drawdown[pick][end] = isLifted ? CELL_STATE.WARP_UP : CELL_STATE.WEFT_UP;
    }
  }

  return drawdown;
};

/**
 * Converts classical tieup + treadling into a direct lift plan.
 */
export const convertToLiftPlan = (tieup, treadling) => {
  if (!tieup || !treadling) return [];
  const numShafts = tieup.length;
  if (numShafts === 0) return [];
  const numTreadles = tieup[0].length;
  const weftPicks = treadling.length;
  
  const liftPlan = Array.from({ length: weftPicks }, () => Array(numShafts).fill(CELL_STATE.EMPTY));
  
  for (let pick = 0; pick < weftPicks; pick++) {
    for (let s = 0; s < numShafts; s++) {
      for (let t = 0; t < numTreadles; t++) {
        if (treadling[pick][t] === CELL_STATE.MARKED && tieup[s][t] === CELL_STATE.MARKED) {
          liftPlan[pick][s] = CELL_STATE.MARKED;
          break;
        }
      }
    }
  }
  return liftPlan;
};

/**
 * Creates an empty matrix of the given dimensions.
 */
export const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(CELL_STATE.EMPTY));
};

/**
 * Standard Inference Algorithm for Direct Mode
 * Converts a hand-drawn drawdown into the optimal Threading, Tieup, and Treadling.
 */
export const inferDraftFromDrawdown = (drawdown) => {
  if (!drawdown || drawdown.length === 0) return null;
  
  const weftPicks = drawdown.length;
  const warpEnds = drawdown[0].length;

  // 1. Find unique columns (each unique column = 1 shaft)
  const columns = [];
  for (let c = 0; c < warpEnds; c++) {
    const colData = drawdown.map(row => row[c]).join('');
    columns.push(colData);
  }
  
  const uniqueColumns = Array.from(new Set(columns));
  const numShafts = uniqueColumns.length;
  
  const threading = createEmptyGrid(numShafts, warpEnds);
  for (let c = 0; c < warpEnds; c++) {
    const shaftIndex = uniqueColumns.indexOf(columns[c]);
    threading[shaftIndex][c] = CELL_STATE.MARKED;
  }

  // 2. Find unique rows (each unique row = 1 treadle)
  const rows = [];
  for (let r = 0; r < weftPicks; r++) {
    const rowData = drawdown[r].join('');
    rows.push(rowData);
  }

  const uniqueRows = Array.from(new Set(rows));
  const numTreadles = uniqueRows.length;

  const treadling = createEmptyGrid(weftPicks, numTreadles);
  for (let r = 0; r < weftPicks; r++) {
    const treadleIndex = uniqueRows.indexOf(rows[r]);
    treadling[r][treadleIndex] = CELL_STATE.MARKED;
  }

  // 3. Build Tie-up
  const tieup = createEmptyGrid(numShafts, numTreadles);
  for (let t = 0; t < numTreadles; t++) {
    const rowPattern = uniqueRows[t]; // Represents the treadle action
    for (let s = 0; s < numShafts; s++) {
      // Find one end threaded to this shaft
      let sampleEnd = -1;
      for (let c = 0; c < warpEnds; c++) {
        if (threading[s][c] === CELL_STATE.MARKED) {
          sampleEnd = c;
          break;
        }
      }
      if (sampleEnd !== -1) {
        // If the drawdown for this treadle row at the sample end is WARP_UP, the tie-up must be marked
        if (rowPattern[sampleEnd] === String(CELL_STATE.WARP_UP)) {
          tieup[s][t] = CELL_STATE.MARKED;
        }
      }
    }
  }

  return { threading, tieup, treadling, numShafts, numTreadles };
};
