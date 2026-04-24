import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import LoginPage from '../modules/auth/pages/LoginPage';
import FirstAccessPage from '../modules/auth/pages/FirstAccessPage';
import SelectPatientPage from '../modules/auth/pages/SelectPatientPage';
import TabsLayout from '../components/layout/TabsLayout';
import { AuthGuard } from './AuthGuard';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { usePatient } from '../core/context/PatientContext';

setupIonicReact();

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setCurrentPatient } = usePatient();

  // 🔹 Inicializar tema (solo una vez)
  useEffect(() => {
    useThemeStore.getState();
  }, []);

  // Removed old demo-based patient selection. PatientContext now handles persistence
  // and selection via SelectPatientPage.

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>

          {/* LOGIN */}
          <Route
            exact
            path="/login"
            render={() => {
              if (!isAuthenticated) return <LoginPage />;

              // Redirigir a selección de perfil si es necesario
              const profiles = useAuthStore.getState().availableProfiles;
              if (profiles && profiles.length > 1) {
                return <Redirect to="/select-patient" />;
              }
              if (profiles && profiles.length === 1 && profiles[0].type === 'represented') {
                return <Redirect to="/select-patient" />;
              }

              return (
                <Redirect
                  to={user?.role === 'tutor' ? '/app/overview' : '/app/home'}
                />
              );
            }}
          />

          {/* SELECT PATIENT */}
          <Route
            exact
            path="/select-patient"
            render={() => {
              if (!isAuthenticated) return <Redirect to="/login" />;
              return <SelectPatientPage />;
            }}
          />

          {/* FIRST ACCESS */}
          <Route
            exact
            path="/first-access"
            render={() => {
              if (!isAuthenticated) return <Redirect to="/login" />;

              if (!user?.isFirstAccess) {
                return (
                  <Redirect
                    to={user?.role === 'tutor' ? '/app/overview' : '/app/home'}
                  />
                );
              }

              return <FirstAccessPage />;
            }}
          />

          {/* APP (PROTEGIDO) */}
          <Route
            path="/app"
            render={() => (
              <AuthGuard>
                <TabsLayout />
              </AuthGuard>
            )}
          />

          {/* ROOT */}
          <Route
            exact
            path="/"
            render={() => {
              if (!isAuthenticated) return <Redirect to="/login" />;

              const profiles = useAuthStore.getState().availableProfiles;
              if (profiles && profiles.length > 1) {
                return <Redirect to="/select-patient" />;
              }
              if (profiles && profiles.length === 1 && profiles[0].type === 'represented') {
                return <Redirect to="/select-patient" />;
              }

              return (
                <Redirect
                  to={user?.role === 'tutor' ? '/app/overview' : '/app/home'}
                />
              );
            }}
          />

          {/* FALLBACK (opcional pero recomendado) */}
          <Route render={() => <Redirect to="/" />} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppRouter;