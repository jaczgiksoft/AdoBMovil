import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { appointmentsService } from '../services';
import { getAppointmentsMock } from '../services/appointments.mock';
import { AppointmentItem } from '../types';
import { calendarOutline, timeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { usePatient } from '../../../core/context/PatientContext';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const { currentPatient } = usePatient();

  useEffect(() => {
    let isActive = true;
    setAppointments([]);

    const loadAppointments = (idToLoad: string) => {
      getAppointmentsMock(idToLoad)
        .then((data) => {
          if (isActive) setAppointments(data);
        })
        .catch((err) => {
          console.error('Error al cargar la lista de visitas:', err);
          if (isActive && idToLoad !== 'pat-sj-1029') {
            console.log('Haciendo fallback a citas demostrativas...');
            loadAppointments('pat-sj-1029');
          }
        });
    };

    loadAppointments(currentPatient?.id || 'pat-sj-1029');

    return () => {
      isActive = false;
    };
  }, [currentPatient?.id]);

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Visits</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Track your smile journey.</p>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="glass-card p-5 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-base font-semibold text-[var(--text-primary)] pr-4">{apt.reason}</h2>
                <span className="px-2.5 py-1 bg-accent-subtle text-brand-primary rounded-full text-[0.65rem] font-bold uppercase tracking-widest whitespace-nowrap">
                  {apt.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-[var(--text-secondary)] text-[0.8rem] font-medium">
                  <IonIcon icon={calendarOutline} className="mr-3 text-base text-brand-primary opacity-80" />
                  {new Date(apt.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center text-[var(--text-secondary)] text-[0.8rem] font-medium">
                  <IonIcon icon={timeOutline} className="mr-3 text-base text-brand-primary opacity-80" />
                  {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center text-[var(--text-secondary)] text-[0.8rem] font-medium">
                  <IonIcon icon={checkmarkCircleOutline} className="mr-3 text-base text-brand-primary opacity-80" />
                  {apt.dentistName}
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="h-40 flex items-center justify-center">
              <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">No appointments pending.</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppointmentsPage;
