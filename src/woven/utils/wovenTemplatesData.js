import { CELL_STATE, createEmptyGrid, computeDrawdown } from './weaveMath';

const M = CELL_STATE.MARKED;
const E = CELL_STATE.EMPTY;

const straightTh = (s, w) => {
  const grid = createEmptyGrid(s, w);
  for(let c=0; c<w; c++) grid[c % s][c] = M;
  return grid;
};

const pointTh = (s, w) => {
  const grid = createEmptyGrid(s, w);
  let shaft = 0;
  let dir = 1;
  for(let c=0; c<w; c++) {
    grid[shaft][c] = M;
    if (shaft === s - 1) dir = -1;
    if (shaft === 0) dir = 1;
    shaft += dir;
  }
  return grid;
};

const makeTu = (s, t, pattern) => {
  const grid = createEmptyGrid(s, t);
  for(let r=0; r<s; r++) {
    for(let c=0; c<t; c++) {
      grid[r][c] = pattern[r][c] || E;
    }
  }
  return grid;
};

const straightTr = (r, t) => {
  const grid = createEmptyGrid(r, t);
  for(let row=0; row<r; row++) grid[row][row % t] = M;
  return grid;
};

// Common tieups
const plainTieup = makeTu(4, 4, [
  [M, E, M, E],
  [E, M, E, M],
  [M, E, M, E],
  [E, M, E, M]
]);

const twill2_2Tieup = makeTu(4, 4, [
  [M, M, E, E],
  [E, M, M, E],
  [E, E, M, M],
  [M, E, E, M]
]);

const buildTemplate = (name, category, s, t, w, r, threading, tieup, treadling) => ({
  name, category, numShafts: s, numTreadles: t, warpEnds: w, weftPicks: r,
  threading, tieup, treadling
});

export const wovenTemplates = [
  // 1. Basic Weaves - Plain Weave Family
  buildTemplate('Plain Weave', '1. Basic Weaves', 4, 4, 8, 8, straightTh(4, 8), plainTieup, straightTr(8, 4)),
  buildTemplate('Basket Weave (2x2)', '1. Basic Weaves', 4, 4, 8, 8, 
    makeTu(4, 8, [[M,M,E,E,M,M,E,E],[M,M,E,E,M,M,E,E],[E,E,M,M,E,E,M,M],[E,E,M,M,E,E,M,M]]),
    makeTu(4, 4, [[M,M,E,E],[M,M,E,E],[E,E,M,M],[E,E,M,M]]), 
    straightTr(8, 4)
  ),
  
  // Twill Weave Family
  buildTemplate('2/2 Twill', '1. Basic Weaves', 4, 4, 8, 8, straightTh(4, 8), twill2_2Tieup, straightTr(8, 4)),
  buildTemplate('3/1 Twill', '1. Basic Weaves', 4, 4, 8, 8, straightTh(4, 8), makeTu(4, 4, [[M,M,M,E],[E,M,M,M],[M,E,M,M],[M,M,E,M]]), straightTr(8, 4)),
  buildTemplate('Herringbone Twill', '1. Basic Weaves', 4, 4, 16, 8, pointTh(4, 16), twill2_2Tieup, straightTr(8, 4)),
  buildTemplate('Diamond Twill', '1. Basic Weaves', 4, 4, 16, 16, pointTh(4, 16), twill2_2Tieup, pointTh(4, 16)), // point treadling = point threading
  
  // Satin / Sateen
  buildTemplate('5-End Satin', '1. Basic Weaves', 5, 5, 10, 10, straightTh(5, 10), makeTu(5, 5, [[M,E,E,E,E],[E,E,M,E,E],[E,E,E,E,M],[E,M,E,E,E],[E,E,E,M,E]]), straightTr(10, 5)),

  // 2. Derivative Weaves
  buildTemplate('Honeycomb', '2. Derivative Weaves', 4, 4, 8, 8, pointTh(4, 8), makeTu(4, 4, [[M,E,E,E],[E,M,M,E],[E,M,M,M],[E,E,E,M]]), pointTh(4, 8)),
  buildTemplate('Huck-a-back', '2. Derivative Weaves', 4, 4, 10, 10, straightTh(4, 10), twill2_2Tieup, straightTr(10, 4)), // Approx

  // 3. Decorative
  buildTemplate('Floral Jacquard (Sim)', '3. Decorative', 8, 8, 16, 16, straightTh(8, 16), makeTu(8, 8, [[M,M,E,E,E,E,M,M],[M,M,M,E,E,M,M,M],[E,M,M,M,M,M,M,E],[E,E,M,M,M,M,E,E],[E,E,M,M,M,M,E,E],[E,M,M,M,M,M,M,E],[M,M,M,E,E,M,M,M],[M,M,E,E,E,E,M,M]]), straightTr(16, 8)),

  // 4. Pile
  buildTemplate('Velvet (Sim)', '4. Pile Fabrics', 6, 6, 12, 12, straightTh(6, 12), plainTieup, straightTr(12, 6)),

  // 5. Open Structure
  buildTemplate('Mock Leno', '5. Open Structure', 4, 4, 12, 12, straightTh(4, 12), makeTu(4, 4, [[M,M,M,E],[M,M,E,M],[M,E,M,M],[E,M,M,M]]), straightTr(12, 4)),

  // 6. Double Cloth
  buildTemplate('Double Weave', '6. Double Cloth', 4, 4, 8, 8, straightTh(4, 8), makeTu(4, 4, [[M,E,M,M],[E,M,M,M],[E,E,M,E],[E,E,E,M]]), straightTr(8, 4)),

  // 7. Functional / Technical
  buildTemplate('Carbon / Kevlar (3D Sim)', '7. Functional', 8, 8, 16, 16, straightTh(8, 16), makeTu(8, 8, [[M,E,M,E,M,E,M,E],[E,M,E,M,E,M,E,M],[M,M,M,M,E,E,E,E],[E,E,E,E,M,M,M,M],[M,E,M,E,M,E,M,E],[E,M,E,M,E,M,E,M],[M,M,M,M,E,E,E,E],[E,E,E,E,M,M,M,M]]), straightTr(16, 8)),
  
  // 8. Surface Texture
  buildTemplate('Bedford Cord', '8. Surface Texture', 4, 4, 8, 8, straightTh(4, 8), makeTu(4, 4, [[M,M,E,M],[M,M,M,E],[E,M,M,M],[M,E,M,M]]), straightTr(8, 4)),
  
  // 9. Color & Pattern
  buildTemplate('Log Cabin', '9. Color & Pattern', 4, 4, 8, 8, straightTh(4, 8), plainTieup, straightTr(8, 4)), // True effect relies on color assign
  
  // 10. Specialty Artistic
  buildTemplate('Ikat (Sim)', '10. Artistic', 4, 4, 16, 16, straightTh(4, 16), plainTieup, straightTr(16, 4))
];

export const getTemplateCategories = () => {
  const cats = new Set(wovenTemplates.map(t => t.category));
  return Array.from(cats);
};
