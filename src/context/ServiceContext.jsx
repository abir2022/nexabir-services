import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ServiceContext = createContext();

export const useServices = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchServices();

    // Real-time subscription
    const channel = supabase
      .channel('services_changes')
      .on('postgres_changes', { event: '*', table: 'services' }, (payload) => {
        fetchServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
    if (!error) {
      setServices(data);
    }
    setLoading(false);
  };

  const addService = async (service) => {
    const { error } = await supabase.from('services').insert([service]);
    return { success: !error, message: error?.message };
  };

  const updateService = async (id, updatedData) => {
    const { error } = await supabase.from('services').update(updatedData).eq('id', id);
    return { success: !error, message: error?.message };
  };

  const deleteService = async (id) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    return { success: !error, message: error?.message };
  };

  return (
    <ServiceContext.Provider value={{ services, addService, updateService, deleteService, loading }}>
      {children}
    </ServiceContext.Provider>
  );
};
