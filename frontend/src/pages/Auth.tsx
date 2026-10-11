import { useState, useRef, useEffect } from 'react';
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
  const [confirmation, setConfirmation] = useState('');
  const requirements = [password.length >= 8, /[A-Za-z]/.test(password), /[0-9]/.test(password)];

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
    
    const passErr = isRegister ? validatePassword(password) : (!password ? 'La contraseña es obligatoria' : null);
    if (isRegister && confirmation !== password) newErrors.confirmation = 'Las contraseñas no coinciden';
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
          body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
        });
        login(res.token, res.user);
      } else {
        const res = await api('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });
        login(res.token, res.user);
      }
      const meRes = await api<{ user: any }>('/auth/me');
      login(localStorage.getItem('antilia_token') || '', meRes.user);
      navigate('#/inicio');
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

  useEffect(() => {
    try {
      if (sessionStorage.getItem('session_expired')) {
        setGlobalError('Tu sesión venció. Inicia sesión de nuevo.');
        sessionStorage.removeItem('session_expired');
      }
    } catch(e) {}
  }, []);

  return (
    <div key={isRegister ? 'register' : 'login'} className="flex flex-col min-h-dvh max-w-[480px] mx-auto bg-bg-main p-6 pb-[env(safe-area-inset-bottom)]">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-10"><span className="brand-mark" aria-hidden="true">a</span><span className="text-xl font-bold tracking-tight">antilia<span className="text-primary">.</span></span></div>
        <div className="mb-6 rounded-[28px] bg-primary-soft p-6"><p className="eyebrow mb-3">Un espacio para enfocarte</p><p className="text-2xl font-semibold leading-tight text-[#39315f]">Menos desorden.<br/>Más calma en tu día.</p><div className="mt-5 flex gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-xs text-primary">Organiza</span><span className="rounded-full bg-white px-3 py-1.5 text-xs text-primary">Completa</span><span className="rounded-full bg-white px-3 py-1.5 text-xs text-primary">Avanza</span></div></div>
        <h1 className="text-[28px] font-bold text-text-main mb-2">
          {isRegister ? 'Crea tu cuenta' : 'Qué bueno verte'}
        </h1>
        <p className="text-text-secondary mb-8">
          {isRegister 
            ? 'Empieza a ordenar tu espacio con Antilia'
            : 'Entra y retoma tu organización del día'}
        </p>

        {globalError && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm" role="alert" aria-live="assertive">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {isRegister && (
            <Input
              id="name"
              ref={nameRef}
              label="Nombre completo"
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
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
            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
            onBlur={() => { if (email) setErrors(prev => ({ ...prev, email: validateEmail(email) || '' })); }}
            maxLength={254}
            spellCheck={false}
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
                  className="text-text-secondary hover:text-text-main p-2"
                  aria-pressed={showPassword}
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

          {isRegister && <><div className="grid grid-cols-3 gap-2" aria-label="Requisitos de contraseña">{['8 caracteres', 'Una letra', 'Un número'].map((label, i) => <span key={label} className={`rounded-lg px-2 py-2 text-xs text-center ${requirements[i] ? 'bg-success/10 text-[#05775b]' : 'bg-white text-text-secondary'}`}>{requirements[i] ? '✓ ' : ''}{label}</span>)}</div><Input id="confirmation" label="Confirmar contraseña" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} error={errors.confirmation} /></>}
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
