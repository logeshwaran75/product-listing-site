export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const sheetId = '1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng';
    const url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?tqx=out:json&sheet=Products_Display';
    const response = await fetch(url);
    const text = await response.text();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const json = JSON.parse(text.substring(start, end + 1));
    const rows = json.table.rows || [];
    const products = rows.map(function(row, i) {
      return {
        id: i,
        name:        row.c[0] ? String(row.c[0].v || '') : '',
        price:       row.c[1] ? String(row.c[1].v || '') : '',
        category:    row.c[2] ? String(row.c[2].v || '') : '',
        description: row.c[3] ? String(row.c[3].v || '') : '',
        seoKeywords: row.c[4] ? String(row.c[4].v || '') : ''
      };
    }).filter(function(p) { return p.name !== ''; });
    res.status(200).json({ success: true, products: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}