import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'show' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
      <aside className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h3>Your Selection ({cart.length})</h3>
          <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>

        <div className="cart-sidebar-items">
          {cart.length === 0 ? (
            <div className="empty-cart-msg">
              <p>Your cart is empty.</p>
              <button className="start-shopping-btn" onClick={() => setIsCartOpen(false)}>Start Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-sidebar-item">
                <div className="item-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                <div className="item-details">
                  <h4>{item.serviceTitle}</h4>
                  <span className="item-tier">{item.tierName}</span>
                  <div className="item-footer">
                    <span className="item-price">${item.price}</span>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-subtotal">
              <span>Total Price</span>
              <span>${cartTotal}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
