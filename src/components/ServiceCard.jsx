import React, { useRef } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ServiceCard = ({ service }) => {
  const cardRef = useRef(null);

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Transformations for rotateX and rotateY
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate relative mouse position (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        perspective: "1000px" 
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Link 
        to={`/service/${service.id}`} 
        className="service-card"
        style={{ transform: "translateZ(50px)" }}
      >
        <div 
          className="service-card-image" 
          style={{ backgroundImage: `url(${service.image})`, transform: "translateZ(20px)" }}
        >
          <div className="category-tag">{service.category}</div>
        </div>
        <div className="service-card-content" style={{ transform: "translateZ(30px)" }}>
          <h3 className="service-title">{service.title}</h3>
          <p className="service-desc-short">{service.description.substring(0, 80)}...</p>
          <div className="service-rating">
            <Star size={16} fill="var(--maroon)" color="var(--maroon)" />
            <span className="rating-val">{service.rating}</span>
            <span className="reviews-count">(100+)</span>
          </div>
          <div className="service-card-footer">
            <div className="price-info">
              <span className="starting-label">Starting at</span>
              <span className="price-val">${service.startingPrice}</span>
            </div>
          </div>
        </div>
        <div className="card-glint" />
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
