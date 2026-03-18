import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '8px' },
              success: { iconTheme: { primary: '#2D5A27', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)
