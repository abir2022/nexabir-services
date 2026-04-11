import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = signup(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="auth-image-side"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="auth-overlay">
            <h1>Join the Nexabro Network</h1>
            <p>Unlock professional services, track your projects, and scale your business with ease.</p>
            
            <div className="auth-benefits">
              <div className="benefit-pill">
                <CheckCircle size={16} /> <span>Personalized Dashboard</span>
              </div>
              <div className="benefit-pill">
                <CheckCircle size={16} /> <span>Order History & Tracking</span>
              </div>
              <div className="benefit-pill">
                <CheckCircle size={16} /> <span>Premium Service Delivery</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="auth-form-side"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="auth-form-card">
            <Link to="/" className="auth-logo">
              Nexa<span>bro</span>
            </Link>
            <h2>Create Client Profile</h2>
            <p>Start your journey with Nexabro today.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label><User size={16} /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="Md. Abir Ul Islam" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="auth-input-group">
                <label><Mail size={16} /> Work Email</label>
                <input 
                  type="email" 
                  placeholder="nexabir@gmail.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>

              <div className="auth-input-group">
                <label><Phone size={16} /> Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="01797989412" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>

              <div className="auth-input-group">
                <label><Lock size={16} /> Password</label>
                <input 
                  type="password" 
                  placeholder="Minimum 8 characters" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-switch">
              Already have an account? <Link to="/admin/login">Sign In</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
