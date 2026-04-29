import React, { useState } from 'react';
import './AddProduct.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Kitchen',
  'Sports', 'Beauty', 'Books', 'Toys', 'Other'];

function AddProduct({ onAdd }) {
  const [form, setForm] = useState({
    name: '', features: '', price: '', category: 'Electronics'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.features.trim()) e.features = 'Features are required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      e.price = 'Enter a valid price';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onAdd(form);
    setForm({ name: '', features: '', price: '', category: 'Electronics' });
    setErrors({});
    alert('✅ Product added! Go to View Products to see it.');
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>

      <div className="field">
        <label>Product Name *</label>
        <input
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          placeholder="e.g. Wireless Bluetooth Headphones"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Features *</label>
        <textarea
          value={form.features}
          onChange={e => setForm({...form, features: e.target.value})}
          placeholder="e.g. Noise cancellation, 30hr battery, Foldable design"
          rows={4}
        />
        {errors.features && <span className="error">{errors.features}</span>}
      </div>

      <div className="field">
        <label>Price (₹) *</label>
        <input
          type="number"
          value={form.price}
          onChange={e => setForm({...form, price: e.target.value})}
          placeholder="e.g. 2999"
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div className="field">
        <label>Category</label>
        <select
          value={form.category}
          onChange={e => setForm({...form, category: e.target.value})}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        ➕ Add Product
      </button>
    </div>
  );
}

export default AddProduct;