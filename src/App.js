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

      const SHEET_ID = '1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng';
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Products_Display`;

      console.log('Fetching from:', url);

      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const text = await res.text();
      console.log('Raw response:', text.substring(0, 200));

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');

      if (start === -1 || end === -1) {
        throw new Error('Invalid response format from Google Sheets');
      }

      const jsonStr = text.substring(start, end + 1);
      const json = JSON.parse(jsonStr);
      const rows = json.table?.rows || [];

      console.log('Rows found:', rows.length);

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

        console.log('Products loaded:', fetched.length);
        setProducts(fetched);
      } else {
        console.log('No rows in sheet yet');
        setProducts([]);
      }

    } catch (err) {
      console.error('Fetch error details:', err);
      setError(`Could not load products: ${err.message}`);
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