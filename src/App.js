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
      const url = 'https://opensheet.elk.sh/1BHqMHAfaRltJqL4qZJssDk4Al7hBJm8s-ahufYmd8Ng/Products_Display';
      const res = await fetch(url);
      const data = await res.json();
      if (!data || data.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const parsed = data.map(function(row, i) {
        return {
          id: 'row-' + i,
          name: row['Product Name'] || '',
          price: row['Price'] || '',
          category: row['Category'] || '',
          description: row['Final Description'] || '',
          seoKeywords: row['SEO Keywords'] || '',
          status: 'Published'
        };
      }).filter(function(p) { return p.name !== ''; });
      setProducts(parsed);
    } catch (err) {
      setError('Could not load products: ' + err.message);
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