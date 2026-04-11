import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, CheckCircle, Clock, Download, ExternalLink, ArrowRight, ShieldCheck, FileText, Smartphone, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { user } = useAuth();

  const handleTrack = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    
    // Simulate lookup delay
    setTimeout(async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('orderId', orderId)
        .single();
      
      if (data && !error) {
        setCurrentOrder(data);
      } else {
        setError('Order not found. Please check your Order ID (e.g., NB-123456) and try again.');
        setCurrentOrder(null);
      }
      setIsSearching(false);
    }, 800);
  };

  const getStatusIcon = (status) => {
    if (status === 'Delivered') return <CheckCircle size={40} color="var(--maroon)" />;
    return <Clock size={40} color="var(--gray-400)" />;
  };

  return (
    <div className="track-order-page">
      <div className="container mini">
        {!currentOrder ? (
          <motion.div 
            className="tracking-lookup-card animate-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Track Your Result</h1>
            <p>Enter your Order ID from your invoice to view the progress or download your final files.</p>
            
            <form onSubmit={handleTrack} className="track-form">
              <div className="track-input-wrapper">
                <Search size={22} />
                <input 
                  type="text" 
                  placeholder="Order ID (e.g. NB-123456)" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={isSearching} className="track-btn">
                {isSearching ? 'Searching...' : 'Track Now'}
              </button>
            </form>
            
            {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="track-error">{error}</motion.div>}
            
            <div className="track-help">
              <ShieldCheck size={16} />
              <span>Secure, private access to your professional deliveries.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="delivery-view animate-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Delivery Header */}
            <div className="delivery-header">
              <button className="back-to-track" onClick={() => setCurrentOrder(null)}>
                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Re-track
              </button>
              <div className="order-badge">
                {getStatusIcon(currentOrder.status)}
                <div className="badge-txt">
                  <strong>Status: {currentOrder.status}</strong>
                  <span>Order ID: {currentOrder.orderId}</span>
                </div>
              </div>
            </div>

            {currentOrder.status === 'Delivered' && currentOrder.delivery ? (
              <div className="portfolio-delivery">
                {/* Behance Style Mockup */}
                <motion.div 
                  className="delivery-mockup"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <img src={currentOrder.delivery.mockupImage} alt="Project Mockup" />
                  <div className="mockup-overlay">
                    <CheckCircle size={24} /> Verified Quality Delivery
                  </div>
                </motion.div>

                {/* Project Details */}
                <div className="delivery-content">
                  <div className="content-left">
                    <h2>Project Completion Summary</h2>
                    <p className="delivery-msg">{currentOrder.delivery.deliveryMessage}</p>
                    
                    <div className="order-recap">
                      <h3>Purchased Services</h3>
                      <div className="recap-list">
                        {currentOrder.items.map((item, idx) => (
                          <div key={idx} className="recap-item">
                            <CheckCircle size={16} />
                            <span>{item.serviceTitle} ({item.tierName})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="content-right">
                    <div className="download-card sticky-pricing">
                      <h3>Final Results</h3>
                      
                      {user ? (
                        <>
                          <p>Your source files and high-resolution assets are ready for download.</p>
                          <a href={currentOrder.delivery.sourceUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
                            <Download size={20} /> Download Source Files
                          </a>
                        </>
                      ) : (
                        <div className="gated-content">
                          <div className="lock-icon">
                            <Lock size={32} />
                          </div>
                          <p>Please log in to your account to download the final source files & products.</p>
                          <Link to="/admin/login" className="download-btn">
                            Sign In to Download
                          </Link>
                          <div className="contact-support">
                            <span>Questions?</span>
                            <a href="mailto:nexabir@gmail.com" className="support-link">
                              <Mail size={14} /> Contact with Nexabro
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {currentOrder.delivery.additionalNotes && (
                        <div className="additional-notes">
                          <strong>Note:</strong>
                          <p>{currentOrder.delivery.additionalNotes}</p>
                        </div>
                      )}

                      <div className="security-notice">
                        <ShieldCheck size={16} />
                        <span>MD5 Verified Secure Transfer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="processing-view">
                <div className="pulse-loader">
                  <Package size={48} />
                </div>
                <h2>Your project is being finalized.</h2>
                <p>Nexabro experts are currently working on your delivery. You will be able to download your files here as soon as we mark the order as delivered.</p>
                <div className="service-eta">
                   <Clock size={16} /> <span>Estimated Delivery: Within {currentOrder.items[0]?.delivery || '24h'}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
