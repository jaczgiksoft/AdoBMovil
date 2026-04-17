import React from 'react';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import {
  home,
  calendar,
  notifications,
  person,
  shieldCheckmark,
  peopleOutline,
} from 'ionicons/icons';

import HomePage from '../../modules/home/pages/HomePage';
import AppointmentsPage from '../../modules/appointments/pages/AppointmentsPage';
import AlertsPage from '../../modules/alerts/pages/AlertsPage';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import ElasticsPage from '../../modules/elastics/pages/ElasticsPage';
import OverviewPage from '../../modules/overview/pages/OverviewPage';
import { AssistantFAB } from '../assistant/AssistantFAB';

import { useAuthStore } from '../../store/useAuthStore';
import { usePatient } from '../../core/context/PatientContext';

export const TabsLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { setCurrentPatient } = usePatient();

  const isTutor = user?.role === 'tutor';

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>

        {/* 🔹 IMPORTANTE: esta ruta SIEMPRE debe existir */}
        <Route
          exact
          path="/app/overview"
          render={() =>
            isTutor ? <OverviewPage /> : <Redirect to="/app/home" />
          }
        />

        <Route exact path="/app/home" component={HomePage} />
        <Route exact path="/app/appointments" component={AppointmentsPage} />
        <Route exact path="/app/alerts" component={AlertsPage} />
        <Route exact path="/app/profile" component={ProfilePage} />
        <Route exact path="/app/elastics" component={ElasticsPage} />

        {/* 🔹 Redirección base */}
        <Route
          exact
          path="/app"
          render={() => (
            <Redirect to={isTutor ? '/app/overview' : '/app/home'} />
          )}
        />

      </IonRouterOutlet>

      {/* 🔹 Tabs (aquí sí puedes usar condicionales) */}
      <IonTabBar
        slot="bottom"
        className="border-t border-[var(--border-subtle)] bg-tabbar backdrop-blur-md pb-safe pt-1 h-[72px]"
      >
        {isTutor && (
          <IonTabButton
            tab="overview"
            href="/app/overview"
            onClick={() => setCurrentPatient(null)}
          >
            <IonIcon icon={peopleOutline} />
            <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
              Overview
            </IonLabel>
          </IonTabButton>
        )}

        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={home} />
          <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
            Home
          </IonLabel>
        </IonTabButton>

        <IonTabButton tab="appointments" href="/app/appointments">
          <IonIcon icon={calendar} />
          <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
            Visits
          </IonLabel>
        </IonTabButton>

        <IonTabButton tab="elastics" href="/app/elastics">
          <IonIcon icon={shieldCheckmark} />
          <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
            Elastics
          </IonLabel>
        </IonTabButton>

        <IonTabButton tab="alerts" href="/app/alerts">
          <IonIcon icon={notifications} />
          <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
            Notifications
          </IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={person} />
          <IonLabel className="font-medium text-[0.65rem] tracking-wide mt-1">
            Profile
          </IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
    <AssistantFAB />
    </>
  );
};

export default TabsLayout;