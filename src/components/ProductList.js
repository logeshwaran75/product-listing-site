import React from 'react';
import './ProductList.css';

const STATUS_COLORS = {
  'Pending': '#f6ad55',
  'AI Generated': '#68d391',
  'Approved': '#4299e1',
  'Rejected': '#fc8181',
  'Published': '#9f7aea'
};

function ProductList({ products, onUpdate }) {
  if (products.length === 0) {
    return (
      <div className="empty">
        <p>🛒 No products yet. Click "Add Product" to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Products ({products.length})</h2>
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="card-header">
            <div>
              <h3>{product.name}</h3>
              <span className="category">{product.category}</span>
            </div>
            <div className="right">
              <span className="price">₹{product.price}</span>
              <span
                className="status"
                style={{ background: STATUS_COLORS[product.status] || '#ccc' }}
              >
                {product.status}
              </span>
            </div>
          </div>

          <div className="features">
            <strong>Features:</strong> {product.features}
          </div>

          {product.description && (
            <div className="description-box">
              <strong>🤖 AI Generated Description:</strong>
              <p>{product.description}</p>
            </div>
          )}

          {product.seoKeywords && (
            <div className="seo-box">
              <strong>🔍 SEO Keywords:</strong>
              <div className="tags">
                {product.seoKeywords.split(',').map((k, i) => (
                  <span key={i} className="tag">{k.trim()}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card-footer">
            <span className="time">🕐 {product.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;