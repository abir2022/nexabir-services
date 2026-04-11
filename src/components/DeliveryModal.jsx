import React, { useState } from 'react';
import { X, Upload, Link, MessageSquare, Image, Save } from 'lucide-react';

const DeliveryModal = ({ isOpen, onClose, onSave, order }) => {
  const [deliveryData, setDeliveryData] = useState({
    mockupImage: '',
    deliveryMessage: '',
    sourceUrl: '',
    additionalNotes: ''
  });

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order.orderId, deliveryData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="admin-modal animate-in">
        <div className="modal-header">
          <div>
            <h2>Deliver Order: {order.orderId}</h2>
            <p>Attach the final project files and presentation.</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-scroll">
            <div className="form-section">
              <h3><Image size={18} /> Visual Presentation</h3>
              <div className="input-field">
                <label>Mockup Image URL (Behance Style)</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  value={deliveryData.mockupImage}
                  onChange={e => setDeliveryData({...deliveryData, mockupImage: e.target.value})}
                  required
                />
                <small>This image will be the hero of the delivery page.</small>
              </div>
            </div>

            <div className="form-section">
              <h3><MessageSquare size={18} /> Project Details</h3>
              <div className="input-field">
                <label>Delivery Message / Story</label>
                <textarea 
                  rows="5"
                  placeholder="Tell the client about the work you've done..."
                  value={deliveryData.deliveryMessage}
                  onChange={e => setDeliveryData({...deliveryData, deliveryMessage: e.target.value})}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-section">
              <h3><Link size={18} /> Final Products</h3>
              <div className="input-field">
                <label>Source File URL (Google Drive, GitHub, etc.)</label>
                <input 
                  type="text" 
                  placeholder="https://drive.google.com/..." 
                  value={deliveryData.sourceUrl}
                  onChange={e => setDeliveryData({...deliveryData, sourceUrl: e.target.value})}
                  required
                />
              </div>
              <div className="input-field">
                <label>Additional Notes</label>
                <input 
                  type="text" 
                  placeholder="Password for archives, etc." 
                  value={deliveryData.additionalNotes}
                  onChange={e => setDeliveryData({...deliveryData, additionalNotes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Discard</button>
            <button type="submit" className="save-btn">
              <Upload size={18} /> Send to Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryModal;
