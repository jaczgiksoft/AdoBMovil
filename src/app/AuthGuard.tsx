import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { IonLoading } from '@ionic/react';
import { useAuthStore } from '../store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, user, isHydrated } = useAuthStore(); // 👈 importante
  const location = useLocation();

  // 🔹 Esperar a que Zustand cargue (si usas persist)
  if (!isHydrated) {
    return <IonLoading isOpen message="Loading..." />;
  }

  // 🔹 No autenticado → enviar a login
  if (!isAuthenticated) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location.pathname }, // 👈 guarda ruta original
        }}
      />
    );
  }

  return <>{children}</>;
};