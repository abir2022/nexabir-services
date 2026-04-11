import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nexabro_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexabro_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service, tierKey) => {
    const tierData = service.tiers[tierKey];
    const cartItem = {
      id: `${service.id}-${tierKey}-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      tierName: tierData.name,
      tierLevel: tierKey,
      price: tierData.price,
      quantity: 1,
      image: service.image
    };

    setCart(prev => [...prev, cartItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
