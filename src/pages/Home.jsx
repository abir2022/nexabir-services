import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useServices } from '../context/ServiceContext';
import { useConfig } from '../context/ConfigContext';
import ServiceCard from '../components/ServiceCard';
import { Zap, Target, TrendingUp } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Home = () => {
  const { services } = useServices();
  const { config } = useConfig();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFilter = searchParams.get('search')?.toLowerCase() || '';

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Transforms for different layers
  const moveX = useTransform(springX, [0, window.innerWidth], [-20, 20]);
  const moveY = useTransform(springY, [0, window.innerHeight], [-20, 20]);
  
  const moveXFast = useTransform(springX, [0, window.innerWidth], [-40, 40]);
  const moveYFast = useTransform(springY, [0, window.innerHeight], [-40, 40]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.title.toLowerCase().includes(searchFilter) || 
      service.description.toLowerCase().includes(searchFilter) ||
      service.category.toLowerCase().includes(searchFilter)
    );
  }, [services, searchFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="home-page" onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Background Elements with Parallax */}
        <div className="hero-decorations">
          <motion.div 
            className="floating-shape cube"
            style={{ x: moveX, y: moveY }}
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="floating-shape sphere"
            style={{ x: moveXFast, y: moveYFast }}
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="floating-shape ring"
            style={{ x: moveY, y: moveX }} // Offset axis for depth
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="floating-shape glass-card"
            style={{ x: moveX, y: moveYFast }}
            animate={{ 
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="glass-glint" />
          </motion.div>
        </div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {config.heroTitle.split('Nexabro')[0]}
            <motion.span
              className="magnetic-wrap"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Nexabro
            </motion.span>
            {config.heroTitle.split('Nexabro')[1]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {config.heroSubtitle}
          </motion.p>
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="magnetic-wrap">
              <div className="stat">
                <Zap size={18} />
                <span>Fast Delivery</span>
              </div>
            </div>
            <div className="magnetic-wrap">
              <div className="stat">
                <Target size={18} />
                <span>Goal Oriented</span>
              </div>
            </div>
            <div className="magnetic-wrap">
              <div className="stat">
                <TrendingUp size={18} />
                <span>Scalable Results</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Services Grid */}
      <section className="services-section">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {searchFilter ? `Search Results for "${searchFilter}"` : "Most Popular Services"}
          </motion.h2>
          {!searchFilter && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Explore our wide range of professional tech and business services.
            </motion.p>
          )}
        </div>

        {filteredServices.length > 0 ? (
          <motion.div 
            className="services-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredServices.map(service => (
              <motion.div key={service.id} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="no-results">
            <h3>No services found matching your search.</h3>
            <p>Try different keywords or check our popular categories.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
