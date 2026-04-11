import { supabase } from '../supabase';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const { services } = useServices();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    fetchMyOrders();

    // Subscribe to changes in my orders
    const channel = supabase
      .channel(`user_orders_${user.id}`)
      .on('postgres_changes', { 
        event: '*', 
        table: 'orders', 
        filter: `userId=eq.${user.id}` 
      }, () => {
        fetchMyOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const fetchMyOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setUserOrders(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Simple recommendation engine
  const getRecommendations = () => {
    const purchasedCats = userOrders.map(o => o.items[0]?.category);
    // Suggest services from other categories or popular ones
    return services.filter(s => !purchasedCats.includes(s.category)).slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className="admin-dashboard client-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          NB <span>Member</span>
        </div>
        <div className="user-profile-brief">
          <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={20} /> My Orders
          </button>
          <button className={activeTab === 'discover' ? 'active' : ''} onClick={() => setActiveTab('discover')}>
            <TrendingUp size={20} /> Recommendations
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Account Settings
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
            <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p>Track your project progress and explore new growth opportunities.</p>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <span>ACTIVE PROJECTS</span>
              <strong>{userOrders.filter(o => o.status !== 'Delivered').length}</strong>
            </div>
            <div className="stat-card">
              <span>COMPLETED</span>
              <strong>{userOrders.filter(o => o.status === 'Delivered').length}</strong>
            </div>
          </div>
        </header>

        <div className="admin-content-card">
          {activeTab === 'orders' && (
            <div className="orders-panel animate-in">
              <div className="panel-actions">
                <h3>Order History ({userOrders.length})</h3>
                <Link to="/" className="add-service-btn">
                  <Search size={18} /> New Order
                </Link>
              </div>

              <div className="leads-table-container">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Placed Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map(order => (
                      <tr key={order.orderId}>
                        <td>
                          <div className="order-id-cell">
                            <strong>{order.items[0]?.serviceTitle}</strong>
                            <span>{order.orderId}</span>
                          </div>
                        </td>
                        <td>{order.date}</td>
                        <td className="bold">${order.total}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link to="/track-order" className="deliver-btn" title="View Delivery">
                            <ArrowRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {userOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-row">You haven't placed any orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="discover-panel animate-in">
              <div className="panel-actions">
                <h3>Suggested for Your Business</h3>
                <p>Based on our expert analysis of your industry needs.</p>
              </div>

              <div className="recommendations-grid">
                {recommendations.map(service => (
                  <motion.div 
                    key={service.id} 
                    className="rec-card"
                    whileHover={{ y: -5 }}
                  >
                    <div className="rec-img" style={{ backgroundImage: `url(${service.image})`}}></div>
                    <div className="rec-info">
                      <span className="rec-cat">{service.category}</span>
                      <h4>{service.title}</h4>
                      <Link to={`/service/${service.id}`} className="rec-link">
                        Explore <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-panel animate-in">
              <div className="panel-actions">
                <h3>Account Information</h3>
              </div>
              
              <div className="settings-grid">
                <div className="settings-section">
                  <div className="input-field disabled">
                    <label>Full Name</label>
                    <input type="text" value={user?.name} readOnly />
                  </div>
                  <div className="input-field disabled">
                    <label>Email Address</label>
                    <input type="email" value={user?.email} readOnly />
                  </div>
                  <div className="input-field disabled">
                    <label>Phone Number</label>
                    <input type="text" value={user?.phone} readOnly />
                  </div>
                </div>
              </div>
              <p className="notice">To update your profile information, please contact our support team at nexabir@gmail.com.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
