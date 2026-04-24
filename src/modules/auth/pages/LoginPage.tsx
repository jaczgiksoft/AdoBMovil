import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonInput,
  IonItem,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline, personOutline, alertCircleOutline } from 'ionicons/icons';
import { useAuthStore } from '../../../store/useAuthStore';
import { authService } from '../services';

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(username, password);
      login(response.user, response.token, response.profiles);
      // Routing is handled by AppRouter / AuthGuard based on auth state
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true}>
        {/* Background */}
        <div className="absolute inset-0 bg-app z-0">
          <div className="absolute inset-0 bg-brand-primary opacity-10 pointer-events-none" />
          <div className="absolute top-[-15%] right-[-15%] w-[55vw] h-[55vw] bg-brand-primary opacity-20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col items-center min-h-full px-5 pt-safe pb-10">
          {/* Logo / Mascot */}
          <div className="w-28 h-28 mt-12 mb-6 drop-shadow-2xl">
            <img src="/assets/mascot.png" alt="BWISE Mascot" className="w-full h-full object-contain" />
          </div>

          {/* Brand headline */}
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-1 text-center">
            BWISE Dental
          </h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm text-center mb-8 opacity-90">
            Select your account to continue
          </p>

          {/* Username Input */}
          <div className="w-full max-w-sm mb-4">
            <IonItem
              lines="none"
              className={`rounded-xl border transition-colors ${error ? 'border-red-400/60 bg-red-500/5' : 'border-[var(--border-subtle)] bg-[var(--bg-surface-solid)]'
                } shadow-sm`}
            >
              <IonIcon slot="start" icon={personOutline} className="text-[var(--text-secondary)] opacity-60 ml-2" />
              <IonInput
                type="text"
                value={username}
                onIonInput={e => { setUsername(e.detail.value!); setError(''); }}
                placeholder="Username"
                className="font-medium text-[var(--text-primary)] py-1"
              />
            </IonItem>
          </div>

          {/* Password field */}
          <div className="w-full max-w-sm mb-2">
            <IonItem
              lines="none"
              className={`rounded-xl border transition-colors ${error ? 'border-red-400/60 bg-red-500/5' : 'border-[var(--border-subtle)] bg-[var(--bg-surface-solid)]'
                } shadow-sm`}
            >
              <IonInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={e => { setPassword(e.detail.value!); setError(''); }}
                placeholder="Password"
                className="font-medium text-[var(--text-primary)] py-1"
                onKeyUp={e => e.key === 'Enter' && handleLogin()}
              />
              <IonIcon
                slot="end"
                icon={showPassword ? eyeOffOutline : eyeOutline}
                className="text-[var(--text-secondary)] opacity-60 cursor-pointer pr-1"
                onClick={() => setShowPassword(v => !v)}
              />
            </IonItem>
          </div>

          <div className="mb-5 py-2"></div>

          {/* Error message */}
          {error && (
            <div className="w-full max-w-sm flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-500/10 rounded-xl border border-red-400/30">
              <IonIcon icon={alertCircleOutline} className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-red-500 font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Login button */}
          <IonButton
            expand="block"
            className="w-full max-w-sm h-14 font-semibold text-base tracking-wide rounded-2xl overflow-hidden"
            onClick={handleLogin}
            disabled={loading || !username || !password}
            shape="round"
          >
            {loading ? (
              <IonSpinner name="crescent" color="light" />
            ) : (
              'Log In'
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
