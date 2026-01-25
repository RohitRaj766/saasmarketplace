import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App user={{ id: '1', email: 'test@example.com' }} apiClient={{} as any} />
  </React.StrictMode>
);
