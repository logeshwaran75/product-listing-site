import React, { useState, useEffect } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchProducts(); }, []); // eslint-disable-line

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed: ' + data.error);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
    setLoading(false);
  }

  function addProduct(product) {
    alert(
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