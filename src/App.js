import React, { useState, useEffect } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const SHEET_ID = '1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Products_Display`;

      const res = await fetch(url);
      const text = await res.text();

      // Clean Google's weird response wrapper format
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const jsonStr = text.substring(start, end + 1);
      const json = JSON.parse(jsonStr);
      const rows = json.table?.rows || [];

      if (rows.length > 0) {
        const fetched = rows
          .map((row, i) => ({
            id: `sheet-${i}`,
            name:        row.c[0]?.v?.toString() || '',
            price:       row.c[1]?.v?.toString() || '',
            category:    row.c[2]?.v?.toString() || '',
            description: row.c[3]?.v?.toString() || '',
            seoKeywords: row.c[4]?.v?.toString() || '',
            status: 'Published',
            timestamp: new Date().toLocaleString()
          }))
          .filter(p => p.name !== '');

        setProducts(fetched);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load products. Make sure Google Sheet is public and has data.');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product) => {
    alert(
      `✅ Product "${product.name}" received!\n\n` +
      `Now add this to your Google Sheet (Products tab):\n\n` +
      `Product Name: ${product.name}\n` +
      `Features: ${product.features}\n` +
      `Price: ${product.price}\n` +
      `Category: ${product.category}\n` +
      `Status: Pending\n` +
      `Timestamp: ${new Date().toLocaleDateString()}\n\n` +
      `After adding, n8n will auto-generate AI description and send approval email!`
    );
    setActiveTab('list');
    setTimeout(() => fetchProducts(), 2000);
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
          onClick={() => {
            setActiveTab('list');
            fetchProducts();
          }}
        >
          📋 View Products {loading && '⏳'}
        </button>
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add Product
        </button>
      </nav>

      <main className="main">
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
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