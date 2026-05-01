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
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Products_Display`;
      const res = await fetch(url);
      const text = await res.text();

      // Google wraps response in weird format - clean it
      const jsonStr = text.substring(47).slice(0, -2);
      const json = JSON.parse(jsonStr);
      const rows = json.table?.rows || [];

      if (rows.length > 0) {
        const fetched = rows.map((row, i) => ({
          id: `sheet-${i}`,
          name: row.c[0]?.v || '',
          price: row.c[1]?.v || '',
          category: row.c[2]?.v || '',
          description: row.c[3]?.v || '',
          seoKeywords: row.c[4]?.v || '',
          features: '',
          status: 'Published',
          timestamp: new Date().toLocaleString()
        })).filter(p => p.name !== '');

        setProducts(fetched);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError('Could not load products. Make sure Google Sheet is public.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product) => {
    alert(`✅ Product "${product.name}" noted!\n\nNow add this product to your Google Sheet:\n\nProduct Name: ${product.name}\nFeatures: ${product.features}\nPrice: ${product.price}\nCategory: ${product.category}\n\nAfter adding to sheet, n8n will auto-generate AI description and send approval email!`);
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
          onClick={() => { setActiveTab('list'); fetchProducts(); }}
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