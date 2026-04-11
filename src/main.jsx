import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider } from './context/ConfigContext'
import { ServiceProvider } from './context/ServiceContext'
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <AuthProvider>
        <ServiceProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ServiceProvider>
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
