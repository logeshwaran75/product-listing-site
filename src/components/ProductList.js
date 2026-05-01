import React from 'react';
import './ProductList.css';

function ProductList({ products, loading, onRefresh }) {

  if (loading) {
    return (
      <div className="empty">
        <p>⏳ Loading products from Google Sheet...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty">
        <p>🛒 No published products yet.</p>
        <p style={{marginTop:'10px', fontSize:'0.9rem', color:'#aaa'}}>
          Add a product to Google Sheet → approve email → it appears here!
        </p>
        <button className="refresh-btn" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="list-header">
        <h2>Published Products ({products.length})</h2>
        <button className="refresh-btn" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      {products.map(product => (
        <div key={product.id} className="product-card">

          <div className="card-header">
            <div>
              <h3>{product.name}</h3>
              <span className="category">{product.category}</span>
            </div>
            <div className="right">
              <span className="price">₹{product.price}</span>
              <span className="status published">✅ Published</span>
            </div>
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

        </div>
      ))}
    </div>
  );
}

export default ProductList;