import { LOOP_TYPES } from './fabricDetection';

const makeGrid = (w, h, data) => {
  const grid = [];
  for(let r=0; r<h; r++) {
    const row = [];
    const rFromBottom = h - 1 - r;
    const dataR = rFromBottom % data.length;
    for(let c=0; c<w; c++) {
      row.push(data[dataR][c % data[0].length]);
    }
    grid.push(row);
  }
  return grid;
};

const K = LOOP_TYPES.KNIT;
const T = LOOP_TYPES.TUCK;
const M = LOOP_TYPES.MISS;
const E = LOOP_TYPES.EMPTY;

export const templates = [
  // 1. Plain Jersey
  { name: 'Plain Jersey', wales: 4, courses: 4, data: makeGrid(4, 4, [[K]]) },
  { name: 'Double Jersey', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K, M, M], [M, M, K, K]]) },
  
  // 2. Rib Structures
  { name: '1×1 Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M]]) },
  { name: '2×2 Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K, M, M]]) },
  { name: '3×1 Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K, K, M]]) },
  { name: 'Milano Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [K, M], [M, K]]) },
  { name: 'Fisherman Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M], [T, K], [K, M], [T, K]]) },
  { name: 'Polka Rib', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T], [M, K]]) },
  
  // 3. Purl Structures
  { name: 'Full Purl', wales: 4, courses: 4, data: makeGrid(4, 4, [[K], [M]]) },
  { name: 'Half Cardigan', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [T, K]]) },
  { name: 'Full Cardigan', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T], [T, K]]) },
  
  // 4. Single Tuck Fabric
  { name: 'Horizontal Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [T, T]]) },
  { name: 'Vertical Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T]]) },
  { name: 'Spot Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K, K, K], [K, T, K, K], [K, K, K, K], [K, K, K, T]]) },

  // 5. Double Tuck Structures
  { name: 'Repeated Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[T, K], [T, K]]) },
  { name: 'Dense Textured Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[T, T, K, K], [K, K, T, T]]) },
  
  // 6. Tuck Jacquard
  { name: 'Multi-Color Tuck', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T, M, K], [M, K, T, M]]) },
  
  // 7. Bubble / Quilted Effects
  { name: 'Raised Surface Texture', wales: 8, courses: 8, data: makeGrid(8, 8, [
      [K, K, K, K, M, M, M, M], [K, K, K, K, M, M, M, M],
      [M, M, M, M, K, K, K, K], [M, M, M, M, K, K, K, K]
  ]) },
  { name: 'Honeycomb Effect', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T, K, T], [K, K, K, K], [T, K, T, K], [K, K, K, K]]) },
  
  // 8. Waffle Structures
  { name: 'Deep Waffle', wales: 6, courses: 6, data: makeGrid(6, 6, [
      [K, M, M, K, K, K], [K, M, M, K, K, K],
      [K, K, K, K, M, M], [K, K, K, K, M, M]
  ]) },

  // 9. Thermal Fabrics
  { name: 'Thick Insulating', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M], [K, M], [T, T]]) },

  // 10. Float Jacquard
  { name: 'Float Jacquard', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, M, M, K, K, M, M], [M, M, K, K, M, M, K, K]]) },

  // 11. Striper Designs
  { name: 'Horizontal Stripes', wales: 4, courses: 8, data: makeGrid(4, 8, [[K], [K], [K], [K], [M], [M], [M], [M]]) },
  { name: 'Engineered Striping', wales: 4, courses: 8, data: makeGrid(4, 8, [[K], [K], [T], [T], [M], [M]]) },

  // 12. Bird’s Eye Jacquard
  { name: 'Bird\'s Eye Jacquard', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M, M, K], [M, K, K, M]]) },

  // 13. Backed Jacquard
  { name: 'Backed Jacquard', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [M, M]]) },

  // 14. Mesh Effects
  { name: 'Open Patterned Mesh', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T, K, M], [M, K, T, K]]) },

  // 15. Camo / Pixel
  { name: 'Camouflage / Pixel', wales: 8, courses: 8, data: makeGrid(8, 8, [
      [K, K, M, M, T, T, K, K], [K, M, M, T, T, K, K, K],
      [M, M, T, T, K, K, K, M], [M, T, T, K, K, M, M, M]
  ]) },

  // 16. Lace Structures
  { name: 'Openwork Lace', wales: 6, courses: 6, data: makeGrid(6, 6, [
      [K, K, M, K, K, M], [K, M, K, M, K, M], [M, K, K, K, M, K]
  ]) },
  { name: 'Eyelet Pattern', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [K, M]]) },

  // 17. Cable Designs
  { name: 'Rope Cable', wales: 6, courses: 8, data: makeGrid(6, 8, [[K, K, K, K, M, M], [M, M, K, K, K, K]]) },
  { name: 'Braided Cable', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, T, K, T, M, M, M, M]]) },
  { name: 'Celtic Cable', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, K, M, K, M, K, M]]) },

  // 18. Fully Fashioned
  { name: 'Fashion Shaping', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, K, K, E, E, E, E], [E, E, K, K, K, K, E, E]]) },
  { name: 'Contoured Garment', wales: 8, courses: 8, data: makeGrid(8, 8, [[E, K, K, E], [K, K, K, K]]) },

  // 19. Pointelle Fabrics
  { name: 'Decorative Transfer Holes', wales: 6, courses: 6, data: makeGrid(6, 6, [[K, K, K], [K, M, K], [K, K, K]]) },

  // 20. Zigzag Transfer
  { name: 'Geometric Zigzag', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, K, K], [K, K, M, K], [K, K, K, M], [K, K, M, K]]) },

  // 21. Diamond Transfer
  { name: 'Argyle-inspired', wales: 8, courses: 8, data: makeGrid(8, 8, [
      [K, K, M, K, K, K, K, K], [K, M, K, M, K, K, K, K],
      [M, K, K, K, M, K, K, K], [K, M, K, M, K, K, K, K]
  ]) },

  // 22. Jacquard Structures
  { name: 'Single Jersey Jacquard', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M], [M, K]]) },
  { name: 'Double Jersey Jacquard', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, M, M], [M, M, K, K]]) },
  { name: 'Floating Jacquard', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, M, M], [M, K, M, M]]) },
  { name: 'Blister Jacquard', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, T, T], [M, M, M, M]]) },

  // 23. Honeycomb Fabrics
  { name: 'Knit + Tuck Honeycomb', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T, K, T], [K, K, K, K], [T, K, T, K], [K, K, K, K]]) },

  // 24. Pique & Lacoste Structures
  { name: 'Polo-Shirt Texture', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M, K, M], [K, K, K, K], [M, K, M, K], [K, K, K, K]]) },
  { name: 'Single Lacoste', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T], [K, K], [T, K], [K, K]]) },
  { name: 'Double Lacoste', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, T], [K, T], [T, K], [T, K]]) },

  // 25. Ottoman Structures
  { name: 'Horizontal Cord', wales: 4, courses: 8, data: makeGrid(4, 8, [[K], [K], [K], [M], [M], [M]]) },

  // 26. Crepe Effects
  { name: 'Irregular Texture', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, T, K], [T, K, K, M], [K, K, M, T], [M, T, K, K]]) },

  // 27. Relief Structures
  { name: '3D Raised Textures', wales: 6, courses: 6, data: makeGrid(6, 6, [[K, K, K, M, M, M], [K, K, K, M, M, M], [M, M, M, K, K, K], [M, M, M, K, K, K]]) },

  // 28. Embossed Fabrics
  { name: 'Pattern Depth Illusion', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, T, T, K], [T, M, M, T], [T, M, M, T], [K, T, T, K]]) },

  // 29. Lace Jacquard
  { name: 'Decorative Open Motifs', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, M, M], [K, M, E, M], [M, E, E, E]]) },

  // 30. Engineered Panels
  { name: 'Structured Garment Sec', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, K, K, T, T, T, T]]) },

  // 31. Decorative Openwork
  { name: 'Fashion-oriented Textures', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, K, M], [M, E, M, E]]) },

  // 32. Spacer Fabrics
  { name: '3D Double-layer', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, M, M], [M, M, K, K], [T, T, T, T]]) },

  // 33. Double Knit
  { name: 'Interlock', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, M], [M, K]]) },
  { name: 'Ponte', wales: 4, courses: 4, data: makeGrid(4, 4, [[K, K], [M, M], [K, M], [M, K]]) },

  // 34. Seamless Knits
  { name: 'Whole Garment', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, K, K], [E, K, K, E]]) },

  // 35. Compression Zones
  { name: 'Sportswear Support', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, T, K, T], [K, K, K, K]]) },

  // 36. Air-Mesh Structures
  { name: 'Breathable Engineered', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, K, M], [M, M, M, M]]) },

  // 37. Technical Mapping
  { name: 'Zoned Stretch', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, K, K], [T, T, T, T], [M, M, M, M]]) },

  // 38. Geometric Textures
  { name: 'Diamond Texture', wales: 8, courses: 8, data: makeGrid(8, 8, [[M, K, K, M], [K, M, M, K], [K, M, M, K], [M, K, K, M]]) },
  { name: 'Hexagon Texture', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, M, M, K], [M, K, K, M], [M, K, K, M], [K, M, M, K], [K, K, K, K]]) },
  { name: 'Cube Illusion', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, T, M], [T, M, K], [M, K, T]]) },

  // 39. Organic Textures
  { name: 'Leaf / Wave / Floral', wales: 8, courses: 8, data: makeGrid(8, 8, [[M, K, M, K, M], [M, M, K, M, M], [M, K, M, K, M]]) },

  // 40. Optical Illusion
  { name: 'Shadow / Depth', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, T, M, K, T, M], [T, M, K, T, M, K]]) },

  // 41. 3D Sculptural Knits
  { name: 'Raised Knit Arch', wales: 8, courses: 8, data: makeGrid(8, 8, [[K, K, M, M, K, K], [K, K, T, T, K, K], [K, K, M, M, K, K]]) }
];
