import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from '../context/ServiceContext';
import ServiceCard from '../components/ServiceCard';
import { ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { id } = useParams();
  const { services } = useServices();
  const filteredServices = services.filter(service => 
    service.category.toLowerCase() === id.toLowerCase() || 
    service.category.includes(id)
  );

  return (
    <div className="category-page">
      <div className="container">
        <header className="category-header">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <span>{id}</span>
          </nav>
          <h1>{id} Services</h1>
          <p>Explore professional services in the {id} category to grow your business.</p>
        </header>

        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No services found in this category yet.</h3>
            <Link to="/" className="continue-btn">Explore other services</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
