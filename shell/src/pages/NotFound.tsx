import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
      <h1 className="text-7xl font-bold text-foreground m-0">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link to="/app/overview">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
