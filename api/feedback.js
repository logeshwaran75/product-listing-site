export default async function handler(req, res) {
  const { productName, price, category, description, keywords } = req.query;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Reject Feedback</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h2 { color: #e53e3e; margin-bottom: 10px; }
    .product-info { background: #f7fafc; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; }
    .current-desc { background: #fff5f5; border-left: 3px solid #fc8181; padding: 12px; margin: 15px 0; font-size: 13px; border-radius: 4px; }
    label { font-weight: bold; display: block; margin-bottom: 8px; color: #444; }
    textarea { width: 100%; padding: 12px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 14px; resize: vertical; }
    textarea:focus { outline: none; border-color: #667eea; }
    button { background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%; margin-top: 15px; }
    button:hover { background: #5a67d8; }
    .success { display: none; text-align: center; color: #38a169; font-size: 18px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>❌ Content Rejected</h2>
    <p>Please tell us why you rejected this and what you want changed.</p>
    
    <div class="product-info">
      <strong>Product:</strong> ${productName || ''}<br/>
      <strong>Price:</strong> Rs.${price || ''}<br/>
      <strong>Category:</strong> ${category || ''}
    </div>

    <div class="current-desc">
      <strong>Rejected Description:</strong><br/>
      ${description || ''}
    </div>

    <label>Your Feedback (What should be improved?):</label>
    <textarea id="feedback" rows="4" placeholder="Example: Make it shorter and more exciting. Focus on the gaming features more..."></textarea>

    <button onclick="submitFeedback()">🔄 Regenerate with Feedback</button>
    
    <div class="success" id="successMsg">
      ✅ Feedback submitted! New description being generated...<br/>
      Check your email in 1-2 minutes!
    </div>
  </div>

  <script>
    async function submitFeedback() {
      var feedback = document.getElementById('feedback').value;
      if (!feedback.trim()) {
        alert('Please enter your feedback first!');
        return;
      }

      var btn = document.querySelector('button');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      try {
        var webhookUrl = 'https://logesh75.app.n8n.cloud/webhook/regenerate-content';
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: '${productName || ''}',
            price: '${price || ''}',
            category: '${category || ''}',
            feedback: feedback
          })
        });

        document.getElementById('successMsg').style.display = 'block';
        btn.style.display = 'none';
      } catch (err) {
        alert('Error submitting feedback. Please try again.');
        btn.textContent = 'Regenerate with Feedback';
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}