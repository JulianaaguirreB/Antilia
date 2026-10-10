import { useState, useRef } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../auth';
import { Input, Button } from '../components/ui';
import { validateEmail, validatePassword, validateName } from '../validation';
import { Icons } from '../components/Icons';

interface AuthProps {
  isRegister: boolean;
  navigate: (path: string) => void;
}

export function Auth({ isRegister, navigate }: AuthProps) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const newErrors: Record<string, string> = {};
    
    if (isRegister) {
      const nameErr = validateName(name);
      if (nameErr) newErrors.name = nameErr;
    }
    
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    
    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error
      if (newErrors.name && nameRef.current) nameRef.current.focus();
      else if (newErrors.email && emailRef.current) emailRef.current.focus();
      else if (newErrors.password && passwordRef.current) passwordRef.current.focus();
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
        });
        login(res.token, res.user);
        navigate('#/inicio');
      } else {
        const res = await api('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), password }),
        });
        login(res.token, res.user);
        navigate('#/inicio');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setGlobalError(err.message);
      } else {
        setGlobalError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh max-w-[480px] mx-auto bg-bg-main p-6 pb-[env(safe-area-inset-bottom)]">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[28px] font-bold text-text-main mb-2">
          {isRegister ? 'Crea tu cuenta' : 'Empezar'}
        </h1>
        <p className="text-text-secondary mb-8">
          {isRegister 
            ? 'Empieza a ordenar tu espacio con Antilia'
            : 'Únete a Antilia y mantén el orden'}
        </p>

        {globalError && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert" aria-live="assertive">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isRegister && (
            <Input
              id="name"
              ref={nameRef}
              label="Nombre completo"
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          )}

          <Input
            id="email"
            ref={emailRef}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            label="Correo Electrónico"
            placeholder="ejemplo@antilia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />

          <div className="flex flex-col gap-1">
            <Input
              id="password"
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : isRegister ? 'password-help' : undefined}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-secondary hover:text-text-main p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              }
            />
            {isRegister && !errors.password && (
              <p id="password-help" className="text-xs text-text-secondary mt-1">
                Mínimo 8 caracteres, con una letra y un número
              </p>
            )}
          </div>

          <Button type="submit" loading={loading} className="mt-2">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => navigate('#/acceso')} className="text-primary font-medium hover:underline">
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{' '}
              <button onClick={() => navigate('#/registro')} className="text-primary font-medium hover:underline">
                Regístrate aquí
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
