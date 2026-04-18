import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonText } from '@ionic/react';
import { appointmentsService } from '../services';
import { AppointmentItem } from '../types';
import { calendarOutline, timeOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { usePatient } from '../../../core/context/PatientContext';
import { useAuthStore } from '../../../store/useAuthStore';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentPatient } = usePatient();
  const { user, token } = useAuthStore();

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);

    const loadAppointments = (idToLoad: string) => {
      // @ts-ignore - appointmentsService might not have token in its type definition yet
      appointmentsService.getAppointments(idToLoad, token || undefined)
        .then((data: any[]) => {
          if (!isActive) return;

          // Mapping backend data to current AppointmentItem structure
          const mappedData: AppointmentItem[] = data.map((apt: any) => ({
            id: String(apt.id),
            // Combining date and start_time if needed, but assuming apt.date might be sufficient or needs joining
            date: apt.date && apt.start_time ? `${apt.date}T${apt.start_time}` : apt.date,
            dentistName: apt.employee
              ? `${apt.employee.first_name} ${apt.employee.last_name}`
              : 'Especialista',
            reason: apt.reason || apt.treatment_name || 'Consulta Dental',
            status: apt.status || 'scheduled'
          }));

          setAppointments(mappedData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error al cargar la lista de visitas:', err);
          if (isActive) {
            setError('No pudimos cargar tus citas. Por favor, intenta de nuevo.');
            setIsLoading(false);
          }
        });
    };

    // Intentamos cargar usando el paciente seleccionado o el ID del usuario (si es paciente)
    const idToLoad = currentPatient?.id || (user?.role === 'patient' ? user.id : null);

    if (idToLoad) {
      loadAppointments(idToLoad);
    } else {
      setIsLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [currentPatient?.id, token, user?.id, user?.role]);

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Visitas</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Sigue el progreso de tu sonrisa.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <IonSpinner name="crescent" color="primary" />
            <p className="mt-4 text-sm text-[var(--text-secondary)] font-medium animate-pulse">Cargando tus citas...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <IonIcon icon={alertCircleOutline} className="text-4xl text-red-500 mb-2" />
            <p className="text-sm font-medium text-[var(--text-primary)]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Reintentar
            </button>
          </div>
        ) : (
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
                    {new Date(apt.date).toLocaleDateString(['es-ES'], { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-[var(--text-secondary)] text-[0.8rem] font-medium">
                    <IonIcon icon={timeOutline} className="mr-3 text-base text-brand-primary opacity-80" />
                    {new Date(apt.date).toLocaleTimeString(['es-ES'], { hour: '2-digit', minute: '2-digit' })}
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
                <p className="text-[var(--text-secondary)] font-medium text-sm tracking-wide">No hay citas pendientes.</p>
              </div>
            )}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AppointmentsPage;
