import html2canvas from 'html2canvas';

export const exportToPNG = async (elementId, filename = 'fabric-structure.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0F1117', // Match dark theme base
      scale: 2, // High resolution
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export PNG', error);
  }
};

export const exportToJSON = (grid, metadata, filename = 'fabric-design.json') => {
  const data = {
    version: '1.0',
    metadata,
    grid,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
};

export const exportToCSV = (grid, filename = 'fabric-design.csv') => {
  const csvContent = grid.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
};

export const copyToClipboard = (grid) => {
  const textContent = grid.map(row => row.join(' ')).join('\n');
  navigator.clipboard.writeText(textContent)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy text: ', err));
};
