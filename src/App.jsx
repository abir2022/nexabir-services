import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useConfig } from './context/ConfigContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import SuccessPage from './pages/SuccessPage';
import Maintenance from './pages/Maintenance';
import BecomeClient from './pages/BecomeClient';
import TrackOrder from './pages/TrackOrder';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Helper for scroll to top
const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = ({ children }) => {
  const { config } = useConfig();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If maintenance mode is ON and not an admin
  if (config.maintenanceMode && !isAdmin && !isAdminRoute) {
    return <Maintenance />;
  }

  return (
    <div className="app-wrapper">
      <ScrollToTopOnNav />
      <Navbar hideOnAdmin={isAdminRoute} />
      <CartSidebar />
      <main className="content-area">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/become-client" element={<BecomeClient />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
