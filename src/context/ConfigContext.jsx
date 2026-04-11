import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const DEFAULT_CONFIG = {
  maintenanceMode: false,
  siteTitle: 'Nexabro',
  heroTitle: 'Grow Your Business with Nexabro Expertise',
  heroSubtitle: 'Find professional services for data analysis, ODOO integration, and promotional design.',
  contactEmail: 'nexabir@gmail.com',
  contactPhone: '01797989412',
  founderName: 'Md. Abir Ul Islam',
  aboutText: 'Scale your business with expert tech services. From ODOO integration to advanced data analysis, we provide the tools for your digital growth.'
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();

    const channel = supabase
      .channel('config_changes')
      .on('postgres_changes', { event: 'UPDATE', table: 'site_config', filter: 'id=eq.1' }, (payload) => {
        setConfig(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single();
    if (!error && data) {
      setConfig(data);
    } else if (error && error.code === 'PGRST116') {
      // Row doesn't exist, seed it
      await supabase.from('site_config').insert([{ id: 1, ...DEFAULT_CONFIG }]);
    }
    setLoading(false);
  };

  const updateConfig = async (newConfig) => {
    const { error } = await supabase.from('site_config').update(newConfig).eq('id', 1);
    if (!error) {
      setConfig(prev => ({ ...prev, ...newConfig }));
    }
    return { success: !error, message: error?.message };
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
