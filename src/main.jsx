import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store'
import './index.css'

const container = document.getElementById('root')

// Support pre-rendering: hydrate if content exists, otherwise render
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    container,
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
} else {
  ReactDOM.createRoot(container).render(
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
}
