import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { homeService } from '../services';
import { getHomeSummaryMock } from '../services/home.mock';
import { PatientHomeSummary } from '../types';
import { calendar, alertCircle, sparkles, chevronForwardOutline, timeOutline, chevronDownOutline, alert } from 'ionicons/icons';
import { useAuthStore } from '../../../store/useAuthStore';
import PatientSelectorModal from '../../../components/common/PatientSelectorModal';
import { usePatient } from '@/core/context/PatientContext';


export const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<PatientHomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { availableProfiles, user, token } = useAuthStore();
  const { currentPatient } = usePatient();
  const router = useIonRouter();

  const canSwitchPatient = availableProfiles && availableProfiles.length > 1;

  const loadSummary = (idToLoad: string) => {
    setIsLoading(true);
    // Usamos el service que detecta si debe usar Mock o API
    homeService.getHomeSummary(idToLoad, token || undefined)
      .then((data) => {
        console.log(JSON.stringify(data));
        setSummary(data);
      })
      .catch((err) => {
        console.error('Error al cargar datos del paciente:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useIonViewWillEnter(() => {
    const idToLoad = currentPatient?.id || (availableProfiles?.length === 1 ? availableProfiles[0].id : null);
    if (idToLoad) {
      loadSummary(idToLoad);
    }
  });

  useEffect(() => {
    const idToLoad = currentPatient?.id || (availableProfiles?.length === 1 ? availableProfiles[0].id : null);

    if (idToLoad) {
      loadSummary(idToLoad);
    } else if (!isLoading && !currentPatient) {
      // If still loading state but no ID, we might need to wait for hydration or redirect
      setIsLoading(false);
    }
  }, [currentPatient?.id, availableProfiles, token]);

  /* 
  if (user?.role === 'tutor' && !currentPatient) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-[var(--text-secondary)] font-medium text-sm">
              Please select a patient from Overview.
            </p>
          </div>
        </IonContent>
      </IonPage>
    );
  }
  */

  return (
    <IonPage>
      <IonContent className="ion-padding relative overflow-hidden bg-app">
        {/* Background glow orb */}
        <div className="absolute top-[-5%] left-[-10%] w-[40vh] h-[40vh] bg-brand-primary mix-blend-plus-lighter filter blur-[80px] opacity-30 pointer-events-none"></div>

        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Gathering your dashboard...</p>
          </div>
        ) : summary ? (
          <div className="relative z-10 pt-8 pb-8 space-y-6">

            {/* Header Hero Area */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1
                  className={`text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight flex items-center gap-2 ${canSwitchPatient ? 'cursor-pointer active:opacity-70' : ''}`}
                  onClick={() => canSwitchPatient && router.push('/select-patient', 'forward')}
                >
                  Hola, {summary.patientFirstName || 'Patient'}!
                  {canSwitchPatient && (
                    <IonIcon icon={chevronDownOutline} className="text-xl text-[var(--text-secondary)] opacity-60" />
                  )}
                </h1>
                <p className="text-[var(--text-secondary)] font-medium text-[0.85rem] opacity-90 tracking-wide">¿Listo para lucir tu mejor sonrisa?</p>
              </div>
              <div
                className="w-14 h-14 rounded-full bg-[var(--bg-surface-solid)] shadow-sm p-[2px] border border-[var(--border-subtle)] overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/app/profile', 'forward')}
              >
                <img src="/assets/mascot.png" alt="Profile Mascot" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            {/* Next Appointment Card (Priority Action) */}
            {summary.nextAppointmentDate && (
              <div
                className="brand-gradient text-white rounded-[24px] p-5 shadow-lg relative overflow-hidden"
                onClick={() => router.push('/app/appointments', 'forward')}
              >
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <IonIcon icon={calendar} className="text-white opacity-90 text-xl" />
                    <span className="text-[0.65rem] uppercase tracking-widest font-semibold text-white opacity-90">Next Visit</span>
                  </div>
                  <IonIcon icon={chevronForwardOutline} className="text-white opacity-80" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-[1.35rem] font-semibold tracking-tight text-white leading-tight mb-1">
                    {new Date(summary.nextAppointmentDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h2>
                  <div className="flex items-center gap-2 opacity-90">
                    <IonIcon icon={timeOutline} className="text-sm" />
                    <p className="text-sm font-medium">
                      {new Date(summary.nextAppointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-xs font-medium opacity-80 mt-3 bg-black/20 self-start inline-block px-3 py-1.5 rounded-full">
                    {summary.nextAppointmentReason}
                  </p>
                </div>
              </div>
            )}

            {/* Treatment Progress Snapshot */}
            <div
              className="glass-card p-5 cursor-pointer"
              onClick={() => router.push('/app/elastics', 'forward')}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <IonIcon icon={sparkles} className="text-brand-primary text-xl" />
                  <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">Treatment Plan</h3>
                </div>
                <IonIcon icon={chevronForwardOutline} className="text-[var(--text-secondary)] opacity-70" />
              </div>

              <div className="mb-2 flex justify-between items-end">
                <span className="text-[0.7rem] font-semibold text-[var(--text-secondary)] tracking-wide">{summary.treatmentStatus}</span>
                <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">{summary.treatmentProgress}%</span>
              </div>
              <div className="w-full bg-[var(--border-subtle)] rounded-full h-1.5 overflow-hidden">
                <div className="brand-gradient h-full rounded-full transition-all duration-1000" style={{ width: `${summary.treatmentProgress}%` }}></div>
              </div>
            </div>

            {/* Alerts Section (Only shows if there are alerts) */}
            {summary.activeAlertsCount > 0 && (
              <div
                className="glass-card p-5 relative overflow-hidden flex items-center justify-between cursor-pointer"
                onClick={() => router.push('/app/alerts', 'forward')}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 opacity-80"></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 shadow-sm">
                    <IonIcon icon={alertCircle} className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-[0.85rem] font-semibold text-[var(--text-primary)] mb-0.5">Action Required</h3>
                    <p className="text-xs font-medium text-[var(--text-secondary)] tracking-wide opacity-90">
                      You have {summary.activeAlertsCount} new notification{summary.activeAlertsCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <IonIcon icon={chevronForwardOutline} className="text-[var(--text-secondary)] opacity-70" />
              </div>
            )}

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <p className="text-[var(--text-secondary)] font-medium text-sm tracking-wide">No patient data found.</p>
          </div>
        )}

      </IonContent>
    </IonPage >
  );
};

export default HomePage;
