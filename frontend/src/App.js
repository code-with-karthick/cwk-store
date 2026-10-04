import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // AI Chatbox State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your CWK Store AI Assistant. How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Fetching products from Django Backend REST API
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Handle Add to Cart button click
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`"${product.title}" has been added to your cart! 🛒`);
  };

  // Handle Remove from Cart button click
  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Handle sending chat message to Django Backend API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: data.reply }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: "Sorry, I am having trouble connecting to the store server right now." }
      ]);
    }
  };

  // Filter products based on selected category (matches database 'clothing', 'gadgets', 'digital')
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#fcfcfc', minHeight: '100vh', color: '#333', position: 'relative' }}>
      
      {/* Header / Navbar */}
      <header style={{
        background: 'linear-gradient(135deg, #cc0000, #990000)',
        color: 'white',
        padding: '0.9rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
            CWK <span style={{ background: 'white', color: '#cc0000', padding: '2px 9px', borderRadius: '4px', fontSize: '1.1rem' }}>Store</span>
          </div>
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '22px', margin: 0, padding: 0, alignItems: 'center' }}>
              <li><a href="#products" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Products</a></li>
              <li><a href="#categories" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Categories</a></li>
              <li>
                <a href="#cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem' }}>
                  🛒 Cart <span style={{ backgroundColor: 'white', color: '#cc0000', padding: '1px 6px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Categories Bar */}
      <div id="categories" style={{ maxWidth: '1100px', margin: '2rem auto 0 auto', padding: '0 1rem', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#990000', marginRight: '8px', fontSize: '0.95rem' }}>Filter Categories:</span>
        {[
          { label: 'All', value: 'All' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Gadgets', value: 'gadgets' },
          { label: 'Digital Products', value: 'digital' }
        ].map(cat => (
          <button 
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: selectedCategory === cat.value ? '2px solid #cc0000' : '1px solid #ddd',
              backgroundColor: selectedCategory === cat.value ? '#cc0000' : 'white',
              color: selectedCategory === cat.value ? 'white' : '#444',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Products Container (Exact Screenshot Card Size Match: minmax 220px) */}
      <div id="products" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#990000', marginBottom: '1.5rem', borderBottom: '2px solid #cc0000', display: 'inline-block', paddingBottom: '4px' }}>
          {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory.toUpperCase()} Collection`}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', padding: '3rem' }}>
            Loading products from Django server...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', padding: '3rem' }}>
            No products found in this category. Add products from Django Admin!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map(product => {
              const imageUrl = product.download_file || product.image_url || 'https://via.placeholder.com/220x180/cc0000/ffffff?text=CWK+Store';
              const categoryBadge = product.category ? product.category.toUpperCase() : 'PRODUCT';
              
              return (
                <div key={product.id} style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  {/* Image Container with Top Category Tag Style */}
                  <div style={{ position: 'relative', backgroundColor: '#f9f9f9' }}>
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: '#ff4d4d',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {categoryBadge}
                    </span>
                    <img 
                      src={imageUrl} 
                      alt={product.title} 
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </h3>
                    <div style={{ fontSize: '1.05rem', color: '#cc0000', fontWeight: 'bold' }}>
                      ₹{product.price}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      style={{
                        display: 'block',
                        width: '100%',
                        backgroundColor: '#cc0000',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        marginTop: '4px'
                      }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Summary Section */}
      <div id="cart" style={{ maxWidth: '1100px', margin: '4rem auto 2rem auto', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#990000', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
          Your Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
        </h2>
        {cart.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>Your cart is empty. Click "Add to Cart" on any product above!</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#333', fontSize: '0.95rem' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Qty: {item.quantity} × ₹{item.price}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#cc0000', fontSize: '0.95rem' }}>
                    ₹{item.quantity * item.price}
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{
                      backgroundColor: '#ff4d4d',
                      color: 'white',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    Remove ❌
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
              <span>Total Amount:</span>
              <span style={{ color: '#cc0000' }}>₹{cart.reduce((acc, item) => acc + (item.quantity * item.price), 0)}</span>
            </div>
            <button 
              onClick={() => alert('Checkout feature coming soon! Thank you for shopping with CWK Store.')}
              style={{
                marginTop: '1.2rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.7rem 1.8rem',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                float: 'right'
              }}
            >
              Proceed to Checkout
            </button>
            <div style={{ clear: 'both' }}></div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#990000', color: 'white', textAlign: 'center', padding: '1.2rem', marginTop: '3rem', fontSize: '0.85rem' }}>
        <p style={{ margin: 0 }}>&copy; 2026 CWK Store. All rights reserved.</p>
      </footer>

      {/* --- AI ASSISTANT CHATBOX WIDGET --- */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        
        {/* Chat Window */}
        {isChatOpen && (
          <div style={{
            width: '320px',
            height: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '15px',
            border: '1px solid #ffcccc'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #cc0000, #990000)',
              color: 'white',
              padding: '12px 15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              <span>🤖 CWK AI Assistant</span>
              <button 
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9', whiteSpace: 'pre-line' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#cc0000' : '#e5e5ea',
                  color: msg.sender === 'user' ? 'white' : '#333',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '80%',
                  fontSize: '0.9rem'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '10px', backgroundColor: 'white' }}>
              <input 
                type="text" 
                placeholder="Ask anything..." 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ marginLeft: '8px', backgroundColor: '#cc0000', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                Send
              </button>
            </form>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            backgroundColor: '#cc0000',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 10px rgba(204,0,0,0.3)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.3s'
          }}
        >
          <span>🤖</span> AI Assistant
        </button>
      </div>

    </div>
  );
}

export default App;