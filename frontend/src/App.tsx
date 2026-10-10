import { useAuth } from './auth';
import { useHashRoute } from './route';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Progress } from './pages/Progress';
import { Account } from './pages/Account';

export function AppContent() {
  const { user, loading } = useAuth();
  const { hash, navigate } = useHashRoute();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-main text-text-secondary">
        Cargando…
      </div>
    );
  }

  // Routing Logic
  const isAuthRoute = hash === '#/acceso' || hash === '#/registro';
  
  if (!user && !isAuthRoute) {
    navigate('#/acceso');
    return null;
  }

  if (user && isAuthRoute) {
    navigate('#/inicio');
    return null;
  }

  switch (hash) {
    case '#/acceso':
      return <Auth isRegister={false} navigate={navigate} />;
    case '#/registro':
      return <Auth isRegister={true} navigate={navigate} />;
    case '#/inicio':
      return <Home navigate={navigate} />;
    case '#/progreso':
      return <Progress navigate={navigate} />;
    case '#/perfil':
      return <Account navigate={navigate} />;
    default:
      if (user) {
        navigate('#/inicio');
      } else {
        navigate('#/acceso');
      }
      return null;
  }
}
