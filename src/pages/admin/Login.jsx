import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-mode">
        <motion.div 
          className="auth-image-side"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-overlay">
            <h1>Welcome Back</h1>
            <p>Access your projects, track your orders, and see what's trending at Nexabro.</p>
          </div>
        </motion.div>

        <motion.div 
          className="auth-form-side"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-form-card">
            <Link to="/" className="auth-logo">
              Nexa<span>bro</span>
            </Link>
            <h2>Member Login</h2>
            <p>Sign in to your Nexabro account</p>

            {error && <div className="auth-error"><AlertCircle size={18} /> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label><Mail size={16} /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label><Lock size={16} /> Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-submit-btn">
                Secure Login <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-switch">
              New to Nexabro? <Link to="/signup">Register as a Client</Link>
            </div>
            
            <div className="login-footer">
              <p>Protected by Nexabro Secure Identity</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
