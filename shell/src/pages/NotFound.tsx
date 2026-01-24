import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#666' }}>Page not found</p>
      <Link 
        to="/dashboard" 
        style={{ 
          padding: '0.75rem 1.5rem',
          backgroundColor: '#1976d2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
