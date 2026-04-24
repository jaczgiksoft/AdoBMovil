import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { getAlertsApi } from '../services/alerts.api';
import { AlertItem } from '../types';
import { notificationsOutline, warningOutline, informationCircleOutline } from 'ionicons/icons';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePatient } from '../../../core/context/PatientContext';

const getSeverityIcon = (severity: string) => {
  if (severity === 'urgent') return warningOutline;
  if (severity === 'warning') return warningOutline;
  return informationCircleOutline;
};

const getSeverityColor = (severity: string) => {
  if (severity === 'urgent') return 'text-red-500 bg-red-500/10';
  if (severity === 'warning') return 'text-orange-500 bg-orange-500/10';
  return 'text-brand-primary bg-accent-subtle';
};

export const AlertsPage: React.FC = () => {
  const { token } = useAuthStore();
  const { currentPatient } = usePatient();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async (patientId: string) => {
    try {
      setLoading(true);
      const data = await getAlertsApi(patientId, token || undefined);
      setAlerts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    if (currentPatient?.id) {
      loadAlerts(currentPatient.id);
    }
  });

  useEffect(() => {
    if (currentPatient?.id) {
      loadAlerts(currentPatient.id);
    }
  }, [currentPatient?.id, token]);

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Notifications</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Stay up to date with your treatment.</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`glass-card p-5 flex gap-4 items-start ${!alert.read ? 'border-l-4 border-l-brand-primary' : ''}`}>
              <div className={`p-3 rounded-xl shrink-0 ${getSeverityColor(alert.severity)}`}>
                <IonIcon icon={getSeverityIcon(alert.severity)} className="text-xl" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1 leading-tight">{alert.title}</h2>
                <p className="text-[var(--text-secondary)] text-[0.85rem] font-medium leading-relaxed opacity-90">{alert.message}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-brand-primary mt-3 font-semibold opacity-80">
                  {new Date(alert.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {alerts.length === 0 && !loading && (
            <div className="h-40 flex flex-col items-center justify-center opacity-60">
              <IonIcon icon={notificationsOutline} className="text-4xl mb-2" />
              <p className="text-[var(--text-secondary)] font-medium text-sm tracking-wide">No notifications found.</p>
            </div>
          )}
          {loading && (
            <div className="h-40 flex items-center justify-center">
              <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Loading notifications...</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlertsPage;
