import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, onSave, service }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    startingPrice: '',
    rating: 5.0,
    tiers: {
      basic: { name: 'Basic', price: '', delivery: '2 days', revisions: 1, features: [] },
      standard: { name: 'Standard', price: '', delivery: '4 days', revisions: 3, features: [] },
      premium: { name: 'Premium', price: '', delivery: '7 days', revisions: 'Unlimited', features: [] }
    }
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      // Reset for new service
      setFormData({
        title: '',
        category: '',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        description: '',
        startingPrice: '',
        rating: 5.0,
        tiers: {
          basic: { name: 'Basic', price: '', delivery: '2 days', revisions: 1, features: ["Feature 1", "Feature 2"] },
          standard: { name: 'Standard', price: '', delivery: '4 days', revisions: 3, features: ["Feature 1", "Feature 2", "Feature 3"] },
          premium: { name: 'Premium', price: '', delivery: '7 days', revisions: 'Unlimited', features: ["All Features"] }
        }
      });
    }
  }, [service, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleTierChange = (tier, field, value) => {
    setFormData({
      ...formData,
      tiers: {
        ...formData.tiers,
        [tier]: {
          ...formData.tiers[tier],
          [field]: value
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 3000 }}>
      <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-scroll">
            <div className="form-section">
              <h3>General Information</h3>
              <div className="input-group">
                <label>Service Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required 
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Starting Price ($)</label>
                  <input 
                    type="number" 
                    value={formData.startingPrice} 
                    onChange={e => setFormData({ ...formData, startingPrice: parseInt(e.target.value) })}
                    required 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  rows="4" 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Pricing Tiers</h3>
              {['basic', 'standard', 'premium'].map(tier => (
                <div key={tier} className="tier-edit-row">
                  <h4>{tier.toUpperCase()}</h4>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        value={formData.tiers[tier].name} 
                        onChange={e => handleTierChange(tier, 'name', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Price ($)</label>
                      <input 
                        type="number" 
                        value={formData.tiers[tier].price} 
                        onChange={e => handleTierChange(tier, 'price', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">
              {service ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
