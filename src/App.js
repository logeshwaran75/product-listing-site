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
      const url = 'https://docs.google.com/spreadsheets/d/'
        + sheetId
        + '/gviz/tq?tqx=out:json&sheet=Products_Display&headers=1';

      const res = await fetch(url);
      const text = await res.text();

      const start = text.indexOf('(') + 1;
      const end = text.lastIndexOf(')');
      const json = JSON.parse(text.substring(start, end));

      const cols = json.table.cols;
      const rows = json.table.rows;

      if (!rows || rows.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Find column indexes dynamically
      var nameIdx = -1, priceIdx = -1, catIdx = -1, descIdx = -1, seoIdx = -1;
      cols.forEach(function(col, i) {
        var label = (col.label || '').toLowerCase().trim();
        if (label === 'product name') nameIdx = i;
        else if (label === 'price') priceIdx = i;
        else if (label === 'category') catIdx = i;
        else if (label === 'final description') descIdx = i;
        else if (label === 'seo keywords') seoIdx = i;
      });

      var parsed = rows.map(function(row, i) {
        var c = row.c;
        return {
          id: 'row-' + i,
          name:        (c[nameIdx]  && c[nameIdx].v)  ? String(c[nameIdx].v)  : '',
          price:       (c[priceIdx] && c[priceIdx].v) ? String(c[priceIdx].v) : '',
          category:    (c[catIdx]   && c[catIdx].v)   ? String(c[catIdx].v)   : '',
          description: (c[descIdx]  && c[descIdx].v)  ? String(c[descIdx].v)  : '',
          seoKeywords: (c[seoIdx]   && c[seoIdx].v)   ? String(c[seoIdx].v)   : '',
          status: 'Published'
        };
      }).filter(function(p) { return p.name !== ''; });

      setProducts(parsed);

    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  }

  function addProduct(product) {
    alert(
      'Product "' + product.name + '" received!\n\n' +
      'Add to Google Sheet Products tab:\n\n' +
      'Product Name: ' + product.name + '\n' +
      'Features: ' + product.features + '\n' +
      'Price: ' + product.price + '\n' +
      'Category: ' + product.category + '\n' +
      'Status: Pending\n' +
      'Timestamp: ' + new Date().toLocaleDateString()
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
          onClick={function() { setActiveTab('list'); fetchProducts(); }}
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
        {error && <div className="error-banner">⚠️ {error}</div>}
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