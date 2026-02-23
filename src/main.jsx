import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// We wrap in StrictMode to catch potential issues early
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
