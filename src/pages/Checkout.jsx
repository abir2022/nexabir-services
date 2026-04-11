import { supabase } from '../supabase';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // User info - auto-filled if logged in
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  if (cart.length === 0) {
    return (
      <motion.div 
        className="checkout-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>Your cart is empty.</h2>
        <p>You need to add a service to your selection before checking out.</p>
        <Link to="/" className="continue-link">Go back to services</Link>
      </motion.div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create and save order record for the invoice
    const orderData = {
      orderId: `NB-${Math.floor(Math.random() * 900000) + 100000}`,
      customer: formData,
      userId: user?.id || null,
      items: [...cart],
      total: (parseFloat(cartTotal) + 2.5).toFixed(2),
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
      status: 'Pending',
      delivery: null,
      created_at: new Date().toISOString()
    };

    // Save to Supabase
    const { error } = await supabase.from('orders').insert([orderData]);

    if (!error) {
      // Save to temporary last_order (for success page)
      localStorage.setItem('nexabro_last_order', JSON.stringify(orderData));
      
      setIsProcessing(false);
      clearCart();
      navigate('/success');
    } else {
      console.error('Order Error:', error);
      alert('Failed to place order: ' + error.message);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      className="checkout-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="checkout-header">
          <Link to="/" className="back-link"><ArrowLeft size={18} /> Back</Link>
          <h1>Secure Checkout</h1>
        </div>

        <div className="checkout-layout">
          {/* Left: Forms */}
          <motion.div 
            className="checkout-main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <section className="checkout-section">
              <h3><User size={20} /> Contact Details</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h3><CreditCard size={20} /> Payment Method</h3>
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="option-radio"></div>
                  <div className="option-info">
                    <strong>Credit/Debit Card</strong>
                    <p>Pay securely via Stripe gateway.</p>
                  </div>
                  <div className="option-icons">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width="30"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width="25"/>
                  </div>
                </div>

                <div className="local-payment-grid">
                  {['Bkash', 'Nagad', 'Rocket'].map(method => (
                    <div 
                      key={method}
                      className={`payment-option local ${paymentMethod === method.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(method.toLowerCase())}
                    >
                      <div className="option-radio"></div>
                      <div className="option-info">
                        <strong>{method}</strong>
                        <p>Mobile Banking</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <motion.div 
                  className="card-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="input-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" />
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="input-group">
                      <label>CVC</label>
                      <input type="text" placeholder="***" />
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          </motion.div>

          {/* Right: Summary */}
          <motion.div 
            className="checkout-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="order-summary-card sticky-pricing">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-txt">
                      <p>{item.serviceTitle}</p>
                      <span>{item.tierName} x {item.quantity}</span>
                    </div>
                    <span className="item-price">${item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${(parseFloat(cartTotal) + 2.5).toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="place-order-btn" 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay & Place Order`}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
