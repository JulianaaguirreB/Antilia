import { Icons } from './Icons';

interface NavigationProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export function Navigation({ currentPath, navigate }: NavigationProps) {
  const items = [
    { id: '#/inicio', label: 'Inicio', icon: Icons.Home },
    { id: '#/progreso', label: 'Progreso', icon: Icons.TrendingUp },
    { id: '#/perfil', label: 'Perfil', icon: Icons.User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-main pb-[env(safe-area-inset-bottom)] z-50">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const isActive = currentPath === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-main'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[12px] ${isActive ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
