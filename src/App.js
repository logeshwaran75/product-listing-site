import React, { useState, useEffect } from 'react';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import './App.css';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;

function App() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) setProducts(JSON.parse(saved));
    fetchApprovedProducts();
  }, []);

  const fetchApprovedProducts = async () => {
    try {
      setLoading(true);
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Products_Display`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows;

      if (rows && rows.length > 0) {
        const sheetProducts = rows.map((row, index) => ({
          id: `sheet-${index}`,
          name: row.c[0]?.v || '',
          price: row.c[1]?.v || '',
          category: row.c[2]?.v || '',
          description: row.c[3]?.v || '',
          seoKeywords: row.c[4]?.v || '',
          features: '',
          status: 'Published',
          timestamp: new Date().toLocaleString(),
          source: 'sheet'
        })).filter(p => p.name);

        const saved = JSON.parse(localStorage.getItem('products') || '[]');
        const localNames = saved.map(p => p.name.toLowerCase());
        const newFromSheet = sheetProducts.filter(
          p => !localNames.includes(p.name.toLowerCase())
        );
        const merged = [...saved, ...newFromSheet];
        setProducts(merged);
        localStorage.setItem('products', JSON.stringify(merged));
      }
    } catch (err) {
      console.log('Sheet fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      status: 'Pending',
      description: '',
      seoKeywords: '',
      timestamp: new Date().toLocaleString(),
      source: 'local'
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setActiveTab('list');
  };

  const updateProduct = (id, updates) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
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
          onClick={() => { setActiveTab('list'); fetchApprovedProducts(); }}
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
        {activeTab === 'add' ? (
          <AddProduct onAdd={addProduct} />
        ) : (
          <ProductList products={products} onUpdate={updateProduct} />
        )}
      </main>
    </div>
  );
}

export default App;