import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { useAuthStore } from '../../../store/useAuthStore';

export const FirstAccessPage: React.FC = () => {
  const router = useIonRouter();
  const { user, completeFirstAccess } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleComplete = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (completeFirstAccess) {
      completeFirstAccess();
    }
    router.push('/app/home', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto p-4">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl mb-6 shadow-md flex items-center justify-center">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2 text-center tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Patient'}!
          </h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm text-center mb-8">
            For your security, please set up a new password before accessing your dashbord.
          </p>

          <div className="w-full space-y-4 mb-8">
            <IonItem className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-solid)]" lines="none">
              <IonLabel position="stacked" className="text-[var(--text-secondary)] text-xs font-semibold tracking-wider">NEW PASSWORD</IonLabel>
              <IonInput 
                type="password" 
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                placeholder="Enter password"
                className="font-medium text-[var(--text-primary)] mt-1"
              />
            </IonItem>

            <IonItem className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-solid)]" lines="none">
              <IonLabel position="stacked" className="text-[var(--text-secondary)] text-xs font-semibold tracking-wider">CONFIRM PASSWORD</IonLabel>
              <IonInput 
                type="password" 
                value={confirm}
                onIonInput={(e) => setConfirm(e.detail.value!)}
                placeholder="Confirm password"
                className="font-medium text-[var(--text-primary)] mt-1"
              />
            </IonItem>

            {error && <p className="text-red-500 text-xs font-medium pl-1">{error}</p>}
          </div>

          <IonButton 
            expand="block" 
            className="w-full font-semibold tracking-wide h-12 rounded-xl overflow-hidden" 
            onClick={handleComplete}
          >
            Complete Setup
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FirstAccessPage;
