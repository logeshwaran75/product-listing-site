import React, { useState, useEffect } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line

  async function fetchProducts() {
    setLoading(true);
    setError('');

    try {
      const sheetId = '1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng';
      const sheetName = 'Products_Display';
      const url = 'https://docs.google.com/spreadsheets/d/'
        + sheetId
        + '/gviz/tq?tqx=out:csv&sheet='
        + sheetName;

      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }

      const csvText = await response.text();
      const rows = csvText.split('\n');

      if (rows.length <= 1) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Skip header row (row 0), parse data rows
      const parsed = [];
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (!row.trim()) continue;

        // Parse CSV properly handling quoted fields
        var cols = parseCSVRow(row);

        if (cols.length >= 4 && cols[0].trim()) {
          parsed.push({
            id: 'row-' + i,
            name:        cols[0] ? cols[0].replace(/^"|"$/g, '').trim() : '',
            price:       cols[1] ? cols[1].replace(/^"|"$/g, '').trim() : '',
            category:    cols[2] ? cols[2].replace(/^"|"$/g, '').trim() : '',
            description: cols[3] ? cols[3].replace(/^"|"$/g, '').trim() : '',
            seoKeywords: cols[4] ? cols[4].replace(/^"|"$/g, '').trim() : '',
            status: 'Published'
          });
        }
      }

      setProducts(parsed);

    } catch (err) {
      setError('Could not load products: ' + err.message);
    }

    setLoading(false);
  }

  function parseCSVRow(row) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < row.length; i++) {
      var char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  function addProduct(product) {
    alert(
      'Product "' + product.name + '" received!\n\n' +
      'Now add this to your Google Sheet Products tab:\n\n' +
      'Product Name: ' + product.name + '\n' +
      'Features: ' + product.features + '\n' +
      'Price: ' + product.price + '\n' +
      'Category: ' + product.category + '\n' +
      'Status: Pending\n' +
      'Timestamp: ' + new Date().toLocaleDateString() + '\n\n' +
      'n8n will auto-detect and send approval email in 1 minute!'
    );
    setActiveTab('list');
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛍️ Product Content Manager</h1>
        <p>AI-Powered Product Description Generator</p>
      </header>

      <nav className="nav">
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={function() {
            setActiveTab('list');
            fetchProducts();
          }}
        >
          📋 View Products {loading ? '⏳' : ''}
        </button>
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={function() { setActiveTab('add'); }}
        >
          ➕ Add Product
        </button>
      </nav>

      <main className="main">
        {error && (
          <div className="error-banner">⚠️ {error}</div>
        )}
        {activeTab === 'add' ? (
          <AddProduct onAdd={addProduct} />
        ) : (
          <ProductList
            products={products}
            loading={loading}
            onRefresh={fetchProducts}
          />
        )}
      </main>
    </div>
  );
}

export default App;