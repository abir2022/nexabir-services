import React from 'react';
import { Mail, Phone, MapPin, Share2, Globe, MessageSquare, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

const Footer = () => {
  const { config } = useConfig();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col branding">
            <Link to="/" className="footer-logo">
              <span className="logo-text">Nexa<span>bro</span></span>
            </Link>
            <p className="footer-desc">{config.aboutText}</p>
            <div className="social-links">
              <a href="#"><Share2 size={20} /></a>
              <a href="#"><Globe size={20} /></a>
              <a href="#"><MessageSquare size={20} /></a>
              <a href="#"><Code2 size={20} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/category/Design">Graphics & Design</Link></li>
              <li><Link to="/category/Marketing">Digital Marketing</Link></li>
              <li><Link to="/category/Web Dev">Web Services</Link></li>
              <li><Link to="/category/ERP">ERP (Odoo) Integration</Link></li>
              <li><Link to="/category/Data">Data Analysis</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How it Works</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p><Mail size={16} /> {config.contactEmail}</p>
              <p><Phone size={16} /> {config.contactPhone}</p>
              <p><MapPin size={16} /> Dhaka, Bangladesh</p>
            </div>
            <div className="footer-owner">
              <p>Founder: <strong>{config.founderName}</strong></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Nexabro. All rights reserved.</p>
          <div className="footer-badges">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
