import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Globe, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ hideOnAdmin }) => {
  const { cart, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const { config } = useConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (hideOnAdmin) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="nav-logo">
            <span className="logo-text">Nexa<span>bro</span></span>
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="What service are you looking for?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className={`nav-right ${isMenuOpen ? 'mobile-show' : ''}`}>
          <Link to="/category/ERP" className="nav-link">ERP Solutions</Link>
          <Link to="/category/Data" className="nav-link">Data Analysis</Link>
          <Link to="/category/Design" className="nav-link">Design</Link>
          {!user && <Link to="/track-order" className="nav-link track-link">Track Order</Link>}
          
          {user ? (
            <>
              <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="nav-link">Dashboard</Link>
              <button onClick={logout} className="nav-signin">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link professional">Become our Client</Link>
              <Link to="/admin/login" className="nav-signin">Sign In</Link>
            </>
          )}

          <button className="nav-cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
