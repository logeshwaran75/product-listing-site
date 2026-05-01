import React, { useState, useEffect } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import './App.css';

const SHEET_ID = '1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng';

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const url =
        'https://docs.google.com/spreadsheets/d/' +
        SHEET_ID +
        '/gviz/tq?tqx=out:json&sheet=Products_Display';

      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const json = JSON.parse(text.substring(start, end + 1));
      const rows = json.table ? json.table.rows : [];

      if (!rows || rows.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const fetched = rows
        .map(function(row, i) {
          return {
            id: 'sheet-' + i,
            name:        row.c[0] ? String(row.c[0].v || '') : '',
            price:       row.c[1] ? String(row.c[1].v || '') : '',
            category:    row.c[2] ? String(row.c[2].v || '') : '',
            description: row.c[3] ? String(row.c[3].v || '') : '',
            seoKeywords: row.c[4] ? String(row.c[4].v || '') : '',
            status: 'Published',
            timestamp: new Date().toLocaleString()
          };
        })
        .filter(function(p) { return p.name !== ''; });

      setProducts(fetched);
    } catch (err) {
      setError('Could not load products. Make sure Google Sheet is public and has data in Products_Display tab.');
    }
    setLoading(false);
  };

  const addProduct = function(product) {
    alert(
      'Product "' + product.name + '" received!\n\n' +
      'Now add this to your Google Sheet (Products tab):\n\n' +
      'Product Name: ' + product.name + '\n' +
      'Features: ' + product.features + '\n' +
      'Price: ' + product.price + '\n' +
      'Category: ' + product.category + '\n' +
      'Status: Pending\n' +
      'Timestamp: ' + new Date().toLocaleDateString() + '\n\n' +
      'n8n will auto-detect the new row and send approval email!'
    );
    setActiveTab('list');
  };

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