import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        checkAdmin(session.user.email);
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        checkAdmin(currentUser.email);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = (email) => {
    if (email === 'nexabir@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      role: email === 'nexabir@gmail.com' ? 'admin' : 'client' 
    };
  };

  const signup = async (userData) => {
    const { email, password, name, phone } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phone,
          role: 'client'
        }
      }
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Provide user metadata as a flat user object for compatibility
  const userWithMeta = user ? {
    ...user,
    ...user.user_metadata,
  } : null;

  return (
    <AuthContext.Provider value={{ user: userWithMeta, isAdmin, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
