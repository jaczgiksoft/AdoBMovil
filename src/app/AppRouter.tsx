import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import LoginPage from '../modules/auth/pages/LoginPage';
import FirstAccessPage from '../modules/auth/pages/FirstAccessPage';
import TabsLayout from '../components/layout/TabsLayout';
import { AuthGuard } from './AuthGuard';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { usePatient } from '../core/context/PatientContext';
import { demoSelfRelationships, demoPatientsData } from '../core/demo/demo-data';

setupIonicReact();

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setCurrentPatient } = usePatient();

  // 🔹 Inicializar tema (solo una vez)
  useEffect(() => {
    useThemeStore.getState();
  }, []);

  // 🔹 Manejo de paciente activo según rol
  useEffect(() => {
    if (!user) {
      setCurrentPatient(null);
      return;
    }

    if (user.role === 'patient') {
      const patientId = demoSelfRelationships[user.id];
      const profile = demoPatientsData[patientId];

      if (profile) {
        setCurrentPatient({
          id: profile.id!,
          fullName: profile.fullName ?? '',
          age: profile.age ?? 0,
        });
      } else {
        setCurrentPatient(null);
      }
    } else {
      setCurrentPatient(null);
    }
  }, [user, setCurrentPatient]);

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

              return (
                <Redirect
                  to={user?.role === 'tutor' ? '/app/overview' : '/app/home'}
                />
              );
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