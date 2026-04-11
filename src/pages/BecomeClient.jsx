import { supabase } from '../supabase';

const BecomeClient = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceType: 'Data Analysis',
    problem: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to Supabase as a "Lead"
    const { error } = await supabase.from('leads').insert([{
      ...formData,
      status: 'New',
      created_at: new Date().toISOString()
    }]);

    if (!error) {
      setIsSubmitted(true);
      setTimeout(() => navigate('/'), 4000);
    } else {
      alert('Failed to send inquiry: ' + error.message);
    }
    setIsSubmitting(false);
  };
 invasions:

  if (isSubmitted) {
    return (
      <div className="become-client-page success-view">
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={64} color="var(--maroon)" />
          <h1>Inquiry Received!</h1>
          <p>Thank you for reaching out to Nexabro. Our strategists will review your problem and get back to you within 24 hours.</p>
          <button className="continue-btn" onClick={() => navigate('/')}>Return to Homepage</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="become-client-page">
      <div className="container">
        <div className="client-grid">
          <motion.div 
            className="client-intro"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="badge">Partner with us</span>
            <h1>Scale Your Business with <span>Nexabro</span></h1>
            <p>We don't just provide services; we solve business problems. Tell us about your challenges and let our experts build the solution.</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <CheckCircle size={20} /> <span>Dedicated business analysts</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} /> <span>Custom ERP & Data solutions</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={20} /> <span>Scalable tech infrastructure</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="client-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="client-form">
              <h2>Get Expert Support</h2>
              
              <div className="form-group">
                <label><User size={16} /> Full Name *</label>
                <input 
                  type="text" 
                  placeholder="Md. Abir Ul Islam"
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Building size={16} /> Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Nexabro Ltd."
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label><Phone size={16} /> Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="01797989412"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label><Mail size={16} /> Work Email *</label>
                <input 
                  type="email" 
                  placeholder="nexabir@gmail.com"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label><MessageSquare size={16} /> How can we help you? *</label>
                <select 
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value})}
                >
                  <option>Data Analysis & Visualization</option>
                  <option>ERP / Odoo Integration</option>
                  <option>Graphics & Visual Branding</option>
                  <option>Digital Marketing Strategy</option>
                  <option>Custom Web Development</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tell us about your problem *</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe the challenges you are facing..."
                  required
                  value={formData.problem}
                  onChange={e => setFormData({...formData, problem: e.target.value})}
                />
              </div>

              <button type="submit" className="submit-btn">
                Send Inquiry <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BecomeClient;
