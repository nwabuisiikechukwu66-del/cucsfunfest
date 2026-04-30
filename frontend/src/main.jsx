import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL || ''
const convex = new ConvexReactClient(convexUrl.replace(/\/$/, ""))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid #FFD700',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
            },
          }}
        />
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>,
)
