import { BootSplash, introWasSeen } from '../shared/components/BootSplash';
import { Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useHashRoute, rememberLoginDestination, loginDestination, clearLoginDestination } from './routing';
import { Auth } from '../features/auth/pages/Auth';
import { Home } from '../features/home/pages/Home';
import { Progress } from '../features/progress/pages/Progress';
import { Account } from '../features/account/pages/Account';
import { Spaces, SpaceDetail } from '../features/spaces/pages/Spaces';
import { TaskWorkspace } from '../features/tasks/pages/TaskWorkspace';
import { Shifts } from '../features/shifts/pages/Shifts';
import { Reminders } from '../features/reminders/pages/Reminders';
import { AccessTools, Welcome } from '../features/auth/pages/AccessTools';
import { FocusSession } from '../features/focus/pages/FocusSession';
import { Desk } from '../features/desk/pages/Desk';
import { InstallApp } from '../features/installation/components/InstallApp';
import { Insights, MeasureSpace, Privacy } from '../features/insights/pages/Insights';

export function AppContent() {
  const { user, loading } = useAuth();
  const { hash: fullHash, navigate } = useHashRoute();
  const hash = fullHash.split('?')[0];
  useEffect(()=>{if(user&&!loading&&!['#/acceso','#/registro','#/bienvenida','#/recuperar'].includes(hash))clearLoginDestination();},[user,loading,hash]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-main text-text-secondary">
        Cargando…
      </div>
    );
  }
  const isAuthRoute = ['#/acceso', '#/registro', '#/recuperar', '#/bienvenida'].includes(hash);
  
  if (!user && !isAuthRoute) {
    rememberLoginDestination(hash);
    navigate('#/acceso');
    return null;
  }

  if (user && ['#/acceso', '#/registro', '#/bienvenida'].includes(hash)) {
    navigate(loginDestination());
    return null;
  }

  switch (hash) {
    case '#/sesion': return <FocusSession navigate={navigate}/>;
    case '#/mi-escritorio': return <Desk navigate={navigate}/>;
    case '#/medir-espacio': return <MeasureSpace navigate={navigate}/>;
    case '#/metricas': return <Insights navigate={navigate}/>;
    case '#/estado': return <Insights navigate={navigate} summary/>;
    case '#/privacidad': return <Privacy navigate={navigate}/>;
    case '#/bienvenida': return <Welcome navigate={navigate}/>;
    case '#/recuperar': return <AccessTools navigate={navigate}/>;
    case '#/verificar-correo': return <AccessTools navigate={navigate} verify/>;
    case '#/espacios': return <Spaces navigate={navigate}/>;
    case '#/escritorio': return <TaskWorkspace navigate={navigate} mode="fisica"/>;
    case '#/digital': return <TaskWorkspace navigate={navigate} mode="digital"/>;
    case '#/correos': return <TaskWorkspace navigate={navigate} mode="correo"/>;
    case '#/archivos': return <TaskWorkspace navigate={navigate} mode="archivo"/>;
    case '#/kanban': return <TaskWorkspace navigate={navigate} mode="kanban"/>;
    case '#/archivadas': return <TaskWorkspace navigate={navigate} mode="archivada"/>;
    case '#/turnos': return <Shifts navigate={navigate}/>;
    case '#/recordatorios': return <Reminders navigate={navigate}/>;
    case '#/acceso':
      return <Auth key="login" isRegister={false} navigate={navigate} />;
    case '#/registro':
      return <Auth key="register" isRegister={true} navigate={navigate} />;
    case '#/inicio':
      return <Home navigate={navigate} />;
    case '#/progreso':
      return <Progress navigate={navigate} />;
    case '#/perfil':
      return <Account navigate={navigate} />;
    default:
      if (user && /^#\/espacio\/[0-9a-f-]{36}$/i.test(hash)) return <SpaceDetail key={hash} id={hash.split('/')[2]} navigate={navigate}/>;
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
  const {loading}=useAuth();
  const {hash}=useHashRoute();
  const [introComplete,setIntroComplete]=useState(introWasSeen);
  const preserveStreak=hash.split('?')[0]==='#/progreso';
  return (
    <ErrorBoundary>
      {!introComplete&&<BootSplash ready={!loading} onDone={()=>setIntroComplete(true)}/>}
      <div className={preserveStreak?'preserve-streak':'antilia-world'} inert={!introComplete}>
        <InstallApp />
        <AppContent />
      </div>
    </ErrorBoundary>
  );
}
