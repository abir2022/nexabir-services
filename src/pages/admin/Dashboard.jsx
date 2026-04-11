import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import ServiceModal from '../../components/ServiceModal';
import DeliveryModal from '../../components/DeliveryModal';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useServices } from '../../context/ServiceContext';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Layout, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Power, 
  Save, 
  Globe, 
  Info,
  CheckCircle,
  XCircle,
  Users,
  ShoppingBag,
  ExternalLink,
  PackageCheck
} from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth();
  const { config, updateConfig } = useConfig();
  const { services, addService, updateService, deleteService } = useServices();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for forms
  const [siteConfig, setSiteConfig] = useState({ ...config });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
    fetchOrders();

    // Subscriptions for real-time updates
    const leadsChannel = supabase
      .channel('admin_leads')
      .on('postgres_changes', { event: '*', table: 'leads' }, () => fetchLeads())
      .subscribe();

    const ordersChannel = supabase
      .channel('admin_orders')
      .on('postgres_changes', { event: '*', table: 'orders' }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error) setLeads(data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
    setLoading(false);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleAddService = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleSaveService = (serviceData) => {
    if (currentService) {
      updateService(currentService.id, serviceData);
    } else {
      addService(serviceData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleSaveConfig = () => {
    updateConfig(siteConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMaintenance = () => {
    const newVal = !siteConfig.maintenanceMode;
    setSiteConfig({ ...siteConfig, maintenanceMode: newVal });
    updateConfig({ ...config, maintenanceMode: newVal });
  };

  const deleteLead = async (id) => {
    if (window.confirm('Remove this inquiry?')) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) alert(error.message);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Remove this order from history?')) {
      const { error } = await supabase.from('orders').delete().eq('orderId', id);
      if (error) alert(error.message);
    }
  };

  const handleOpenDelivery = (order) => {
    setCurrentOrder(order);
    setIsDeliveryModalOpen(true);
  };

  const handleSaveDelivery = async (orderId, deliveryData) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Delivered', delivery: deliveryData })
      .eq('orderId', orderId);
    
    if (error) alert(error.message);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          NB <span>Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Site Settings
          </button>
          <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
            <Layout size={20} /> Manage Services
          </button>
          <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')}>
            <Users size={20} /> Client Leads
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={20} /> Client Orders
          </button>
          <div className="sidebar-divider"></div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>{
              activeTab === 'settings' ? 'Global Configuration' : 
              activeTab === 'services' ? 'Service Management' : 
              activeTab === 'leads' ? 'Client Inquiries' : 'Order History'
            }</h1>
            <p>Master control panel for Nexabro</p>
          </div>
          
          <div className={`maintenance-status ${siteConfig.maintenanceMode ? 'on' : 'off'}`} onClick={toggleMaintenance}>
            <Power size={18} />
            {siteConfig.maintenanceMode ? 'Maintenance Mode: ON' : 'Maintenance Mode: OFF'}
          </div>
        </header>

        <div className="admin-content-card">
          {activeTab === 'settings' && (
            <div className="settings-panel animate-in">
              <div className="settings-grid">
                <div className="settings-section">
                  <h3><Globe size={18} /> Hero & Branding</h3>
                  <div className="input-field">
                    <label>Main Title</label>
                    <input 
                      type="text" 
                      value={siteConfig.heroTitle}
                      onChange={(e) => setSiteConfig({...siteConfig, heroTitle: e.target.value})}
                    />
                  </div>
                  <div className="input-field">
                    <label>Subtitle</label>
                    <textarea 
                      rows="3"
                      value={siteConfig.heroSubtitle}
                      onChange={(e) => setSiteConfig({...siteConfig, heroSubtitle: e.target.value})}
                    />
                  </div>
                </div>

                <div className="settings-section">
                  <h3><Info size={18} /> Contact & About</h3>
                  <div className="form-row">
                    <div className="input-field">
                      <label>Email</label>
                      <input 
                        type="email" 
                        value={siteConfig.contactEmail}
                        onChange={(e) => setSiteConfig({...siteConfig, contactEmail: e.target.value})}
                      />
                    </div>
                    <div className="input-field">
                      <label>Phone</label>
                      <input 
                        type="text" 
                        value={siteConfig.contactPhone}
                        onChange={(e) => setSiteConfig({...siteConfig, contactPhone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>About Description</label>
                    <textarea 
                      rows="4"
                      value={siteConfig.aboutText}
                      onChange={(e) => setSiteConfig({...siteConfig, aboutText: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="panel-footer">
                <button className="save-btn" onClick={handleSaveConfig}>
                  {saveSuccess ? <><CheckCircle size={18} /> Saved! </> : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-panel animate-in">
              <div className="panel-actions">
                <h3>Current Catalog ({services.length})</h3>
                <button className="add-service-btn" onClick={handleAddService}>
                  <Plus size={18} /> Add New Service
                </button>
              </div>

              <div className="admin-services-list">
                {services.map(service => (
                  <div key={service.id} className="admin-service-item">
                    <div className="item-main">
                      <div className="item-img" style={{ backgroundImage: `url(${service.image})`}}></div>
                      <div className="item-info">
                        <h4>{service.title}</h4>
                        <span>{service.category} • Starting ${service.startingPrice}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => handleEditService(service)}><Edit3 size={18} /></button>
                      <button className="delete-btn" onClick={() => handleDeleteService(service.id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="leads-panel animate-in">
              <div className="panel-actions">
                <h3>Total Leads ({leads.length})</h3>
              </div>

              <div className="leads-table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Service Needed</th>
                      <th>Problem Brief</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>{lead.date}</td>
                        <td>
                          <div className="lead-client">
                            <strong>{lead.name}</strong>
                            <span>{lead.company || lead.email}</span>
                            <small>{lead.phone}</small>
                          </div>
                        </td>
                        <td><span className="lead-type">{lead.serviceType}</span></td>
                        <td>
                          <div className="lead-problem" title={lead.problem}>
                            {lead.problem.substring(0, 100)}...
                          </div>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteLead(lead.id)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-row">No inquiries yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-panel animate-in">
              <div className="panel-actions">
                <h3>Transaction History ({orders.length})</h3>
              </div>

              <div className="leads-table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Order Info</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>
                          <div className="order-id-cell">
                            <strong>{order.orderId}</strong>
                            <span>{order.date}</span>
                          </div>
                        </td>
                        <td>
                          <div className="lead-client">
                            <strong>{order.customer.name}</strong>
                            <span>{order.customer.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="order-amount">
                            <strong>${order.total}</strong>
                            <span>{order.paymentMethod}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="item-actions">
                            {order.status !== 'Delivered' && (
                              <button className="deliver-btn" title="Deliver Service" onClick={() => handleOpenDelivery(order)}>
                                <PackageCheck size={18} />
                              </button>
                            )}
                            <button className="delete-btn" onClick={() => deleteOrder(order.orderId)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-row">No orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveService} 
        service={currentService}
      />

      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSave={handleSaveDelivery}
        order={currentOrder}
      />
    </div>
  );
};

export default Dashboard;
