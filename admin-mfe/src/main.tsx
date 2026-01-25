import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App user={{ id: '1', email: 'test@example.com', role: 'admin' }} apiClient={{} as any} />
  </React.StrictMode>
);
