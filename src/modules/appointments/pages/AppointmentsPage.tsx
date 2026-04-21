import React, { useEffect, useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonSpinner, 
  IonText, 
  IonModal, 
  IonButton, 
  IonAlert, 
  IonToast, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonLoading,
  useIonViewWillEnter 
} from '@ionic/react';
import { appointmentsService } from '../services';
import { AppointmentItem } from '../types';
import { 
  calendarOutline, 
  timeOutline, 
  checkmarkCircleOutline, 
  alertCircleOutline, 
  closeOutline,
  checkmarkDoneOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { usePatient } from '../../../core/context/PatientContext';
import { useAuthStore } from '../../../store/useAuthStore';
import { updateAppointmentStatusApi } from '../services/appointments.api';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for appointment management
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string, color: string } | null>(null);

  const { currentPatient } = usePatient();
  const { user, token } = useAuthStore();

  const loadAppointments = (idToLoad: string) => {
    setIsLoading(true);
    setError(null);

    // @ts-ignore - appointmentsService might not have token in its type definition yet
    appointmentsService.getAppointments(idToLoad, token || undefined)
      .then((data: any[]) => {
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
        setError('No pudimos cargar tus citas. Por favor, intenta de nuevo.');
        setIsLoading(false);
      });
  };

  useIonViewWillEnter(() => {
    const idToLoad = currentPatient?.id || (user?.role === 'patient' ? user.id : null);
    if (idToLoad) {
      loadAppointments(idToLoad);
    }
  });

  useEffect(() => {
    // Intentamos cargar usando el paciente seleccionado o el ID del usuario (si es paciente)
    const idToLoad = currentPatient?.id || (user?.role === 'patient' ? user.id : null);

    if (idToLoad) {
      loadAppointments(idToLoad);
    } else {
      setIsLoading(false);
    }
  }, [currentPatient?.id, token, user?.id, user?.role]);

  const handleUpdateStatus = async (status: 'confirmada' | 'cancelada') => {
    if (!selectedAppointment) return;

    setIsUpdating(true);
    try {
      await updateAppointmentStatusApi(selectedAppointment.id, status, token || undefined);
      setToastMessage({
        message: `Cita ${status === 'confirmada' ? 'confirmada' : 'cancelada'} con éxito`,
        color: status === 'confirmada' ? 'success' : 'warning'
      });
      setShowModal(false);
      
      // Refresh list
      const idToLoad = currentPatient?.id || (user?.role === 'patient' ? user.id : null);
      if (idToLoad) loadAppointments(idToLoad);
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setToastMessage({
        message: err.message || 'No se pudo actualizar la cita. Intenta de nuevo.',
        color: 'danger'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openManagementModal = (apt: AppointmentItem) => {
    if (apt.status === 'pendiente' || apt.status === 'scheduled') {
      setSelectedAppointment(apt);
      setShowModal(true);
    }
  };

  const getStatusLabel = (status: string) => {
    const mapping: Record<string, string> = {
      'pendiente': 'Falta confirmar',
      'scheduled': 'Falta confirmar',
      'en_espera': 'Esperando',
      'en_tratamiento': 'Atendiendo',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'finalizada': 'Finalizada'
    };
    return mapping[status] || status;
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-700';
      case 'cancelada': return 'bg-red-100 text-red-700';
      case 'en_espera': return 'bg-yellow-100 text-yellow-700';
      case 'en_tratamiento': return 'bg-blue-100 text-blue-700';
      case 'pendiente':
      case 'scheduled': 
        return 'bg-orange-100 text-orange-700';
      default: return 'bg-accent-subtle text-brand-primary';
    }
  };

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
              <div 
                key={apt.id} 
                className={`glass-card p-5 relative overflow-hidden transition-all active:scale-[0.98] ${
                  (apt.status === 'pendiente' || apt.status === 'scheduled') ? 'cursor-pointer' : ''
                }`}
                onClick={() => openManagementModal(apt)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-base font-semibold text-[var(--text-primary)] pr-4">{apt.reason}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest whitespace-nowrap ${getStatusColorClass(apt.status)}`}>
                    {getStatusLabel(apt.status)}
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

        {/* Management Modal */}
        <IonModal 
          isOpen={showModal} 
          onDidDismiss={() => setShowModal(false)}
          initialBreakpoint={0.4}
          breakpoints={[0, 0.4, 0.6]}
          className="management-modal"
        >
          <div className="ion-padding h-full flex flex-col glass-modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Gestionar Cita</h2>
              <IonButton fill="clear" onClick={() => setShowModal(false)} color="medium">
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="space-y-4 flex-1">
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Selecciona una acción para tu cita del <strong>{selectedAppointment && new Date(selectedAppointment.date).toLocaleDateString()}</strong>.
              </p>
              
              <IonButton 
                expand="block" 
                className="btn-confirm-appointment"
                onClick={() => handleUpdateStatus('confirmada')}
              >
                <IonIcon icon={checkmarkDoneOutline} slot="start" />
                Confirmar Cita
              </IonButton>

              <IonButton 
                expand="block" 
                fill="outline" 
                color="danger"
                className="btn-cancel-appointment"
                onClick={() => setShowAlert(true)}
              >
                <IonIcon icon={closeCircleOutline} slot="start" />
                Cancelar Cita
              </IonButton>
              
              <IonButton 
                expand="block" 
                fill="clear" 
                color="medium"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </IonButton>
            </div>
          </div>
        </IonModal>

        {/* Cancellation Confirmation Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="¿Confirmar cancelación?"
          message="¿Estás seguro que deseas cancelar esta cita? Esta acción no se puede deshacer."
          buttons={[
            {
              text: 'No, mantener',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Sí, cancelar',
              handler: () => handleUpdateStatus('cancelada'),
              cssClass: 'alert-button-danger',
            },
          ]}
        />

        {/* Feedback Components */}
        <IonLoading isOpen={isUpdating} message="Actualizando cita..." />
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage?.message}
          duration={3000}
          color={toastMessage?.color}
          onDidDismiss={() => setToastMessage(null)}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default AppointmentsPage;
