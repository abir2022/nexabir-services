import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from '../context/ServiceContext';
import { useCart } from '../context/CartContext';
import { Star, Check, Clock, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceDetail = () => {
  const { id } = useParams();
  const { services } = useServices();
  const { addToCart } = useCart();
  const service = services.find(s => s.id === parseInt(id));
  const [activeTier, setActiveTier] = useState('standard');

  if (!service) {
    return <div className="no-service">Service not found. <Link to="/">Go Home</Link></div>;
  }

  const currentTier = service.tiers[activeTier];

  return (
    <motion.div 
      className="service-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="detail-layout">
          {/* Left Column: Info & Media */}
          <motion.div 
            className="detail-left"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <nav className="breadcrumb">
              <Link to="/">Home</Link> / <Link to={`/category/${service.category}`}>{service.category}</Link>
            </nav>
            <h1>{service.title}</h1>
            
            <div className="seller-brief">
              <div className="seller-avatar">NB</div>
              <div className="seller-info">
                <strong>Nexabro Expert Team</strong>
                <div className="rating">
                  <Star size={16} fill="gold" color="gold" />
                  <span>{service.rating} (100+ reviews)</span>
                  <span className="orders-in-queue">5 orders in queue</span>
                </div>
              </div>
            </div>

            <motion.div 
              className="service-hero-img" 
              style={{ backgroundImage: `url(${service.image})` }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            ></motion.div>

            <div className="service-description">
              <h3>About This Service</h3>
              <p>{service.description}</p>
              <p>Our team at Nexabro specializes in providing high-end business and technical solutions. With this service, you get access to our top-tier analysts and developers who ensure every project is handled with extreme attention to detail.</p>
              
              <div className="benefits-grid">
                <motion.div 
                  className="benefit"
                  whileHover={{ y: -5 }}
                >
                  <ShieldCheck size={24} />
                  <div>
                    <h4>Quality Assured</h4>
                    <p>Every delivery passes through a dual-review phase.</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="benefit"
                  whileHover={{ y: -5 }}
                >
                  <Clock size={24} />
                  <div>
                    <h4>Fast Turnaround</h4>
                    <p>We respect your deadlines and provide early drafts.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Pricing Tiers & Sticky Checkout */}
          <motion.div 
            className="detail-right"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="pricing-card sticky-pricing">
              <div className="tier-tabs">
                {Object.keys(service.tiers).map(tierKey => (
                  <button 
                    key={tierKey}
                    className={`tier-tab ${activeTier === tierKey ? 'active' : ''}`}
                    onClick={() => setActiveTier(tierKey)}
                  >
                    {tierKey.charAt(0).toUpperCase() + tierKey.slice(1)}
                  </button>
                ))}
              </div>

              <motion.div 
                key={activeTier}
                className="tier-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="tier-header">
                  <h4>{currentTier.name}</h4>
                  <span className="price">${currentTier.price}</span>
                </div>
                <p className="tier-desc">Get professional results with our {activeTier} package, including all essential features for this service.</p>
                
                <div className="tier-meta">
                  <span><Clock size={16} /> {currentTier.delivery} Delivery</span>
                  <span><RotateCcw size={16} /> {currentTier.revisions} Revisions</span>
                </div>

                <ul className="tier-features">
                  {currentTier.features.map((feature, idx) => (
                    <li key={idx}><Check size={16} /> {feature}</li>
                  ))}
                </ul>

                <button className="continue-btn" onClick={() => addToCart(service, activeTier)}>
                  Continue (${currentTier.price})
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;
