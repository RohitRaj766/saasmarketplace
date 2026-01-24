import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Standalone mode for development
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App 
        user={{ id: '1', email: 'dev@example.com', firstName: 'Dev', lastName: 'User', role: 'admin' }}
        apiClient={{
          get: async () => ({ data: [] }),
          post: async () => ({ data: {} }),
          put: async () => ({ data: {} }),
          delete: async () => ({ data: {} })
        }}
      />
    </React.StrictMode>
  );
}
