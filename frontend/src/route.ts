import { useState, useEffect } from 'react';

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/inicio');

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/inicio');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  return { hash, navigate };
}
