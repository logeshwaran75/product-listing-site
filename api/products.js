export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGhvhXkRgWVhdxRRk-VnJLJ8cwZyTK5FjJSudxNQIAt7DDtVXQD1dtfz3CCdoRJ8JtQ7voHD4lF_E5/pub?gid=525669910&single=true&output=csv';
    
    const response = await fetch(csvUrl);
    const text = await response.text();
    const lines = text.trim().split('\n');

    if (lines.length <= 1) {
      return res.status(200).json({ success: true, products: [] });
    }

    const products = [];
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim()) continue;

      // Handle CSV with commas inside quoted fields
      var cols = [];
      var current = '';
      var inQuotes = false;
      for (var j = 0; j < line.length; j++) {
        if (line[j] === '"') {
          inQuotes = !inQuotes;
        } else if (line[j] === ',' && !inQuotes) {
          cols.push(current.trim());
          current = '';
        } else {
          current += line[j];
        }
      }
      cols.push(current.trim());

      if (cols[0] && cols[0].trim()) {
        products.push({
          id: i,
          name:        cols[0] || '',
          price:       cols[1] || '',
          category:    cols[2] || '',
          description: cols[3] || '',
          seoKeywords: cols[4] || ''
        });
      }
    }

    res.status(200).json({ success: true, products: products });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}