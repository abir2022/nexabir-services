import React from 'react';
import { Hammer, Clock, Mail, Phone } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Maintenance = () => {
  const { config } = useConfig();

  return (
    <div className="maintenance-page">
      <div className="maintenance-card animate-in">
        <div className="maintenance-icon">
          <Hammer size={64} color="var(--maroon)" />
        </div>
        <h1>Nexabro is Under Maintenance</h1>
        <p>We are currently upgrading our platforms to provide you with a better experience. We'll be back online shortly!</p>
        
        <div className="maintenance-timer">
          <Clock size={24} />
          <span>Expected back: Soon</span>
        </div>

        <div className="maintenance-contact">
          <h3>Need urgent assistance?</h3>
          <p><Mail size={16} /> {config.contactEmail}</p>
          <p><Phone size={16} /> {config.contactPhone}</p>
        </div>

        <div className="login-hint">
          <p>Admin? <a href="/admin/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
