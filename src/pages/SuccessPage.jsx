import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('nexabro_last_order');
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, []);

  const handleDownloadInvoice = () => {
    if (!orderDetails) return;

    const { orderId, date, items, total, paymentMethod } = orderDetails;
    
    let invoiceContent = `
========================================
         NEXABRO SERVICE INVOICE
========================================
Order ID: ${orderId}
Date: ${date}
Payment Method: ${paymentMethod}
----------------------------------------
SERVICES PURCHASED:
`;

    items.forEach((item, index) => {
      invoiceContent += `${index + 1}. ${item.serviceTitle} (${item.tierName}) - $${item.price}\n`;
    });

    invoiceContent += `
----------------------------------------
Subtotal: $${(parseFloat(total) - 2.5).toFixed(2)}
Service Fee: $2.50
GRAND TOTAL: $${total}
----------------------------------------
Thank you for choosing Nexabro!
Contact: nexabir@gmail.com | 01797989412
Address: Dhaka, Bangladesh
========================================
`;

    // Create blob and download link
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexabro_Invoice_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="success-page">
      <motion.div 
        className="success-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <CheckCircle size={64} color="var(--maroon)" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Thank you for choosing Nexabro. Your order has been received and our experts are already reviewing your requirements.
        </motion.p>
        
        <div className="success-actions">
          <Link to="/track-order" className="primary-btn">Track Order Progress</Link>
          <button 
            className="secondary-btn" 
            onClick={handleDownloadInvoice}
            disabled={!orderDetails}
          >
            <Download size={18} /> Download Invoice
          </button>
        </div>

        <div className="next-steps">
          <h3>What happens next?</h3>
          <ol>
            <li>You'll receive a confirmation email at <strong>nexabir@gmail.com</strong>.</li>
            <li>Our team will contact you for specific briefing details.</li>
            <li>We'll deliver the first draft within the specified delivery time.</li>
          </ol>
        </div>

        <Link to="/" className="home-link">Back to Homepage</Link>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
