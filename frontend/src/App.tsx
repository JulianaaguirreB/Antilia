import { Component, ErrorInfo, ReactNode } from 'react';
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

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-dvh items-center justify-center bg-bg-main p-6 text-center">
          <p className="text-text-main mb-4">Algo salió mal. Recarga la página.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
