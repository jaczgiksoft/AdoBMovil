import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { treatmentService } from '../services';
import { TreatmentSummary } from '../types';
import { shieldCheckmarkOutline, checkmarkCircleOutline, timeOutline, ellipseOutline } from 'ionicons/icons';
import { usePatient } from '../../../core/context/PatientContext';

const getStatusIcon = (status: string) => {
  if (status === 'completed') return checkmarkCircleOutline;
  if (status === 'in-progress') return timeOutline;
  return ellipseOutline;
};

const getStatusColor = (status: string) => {
  if (status === 'completed') return 'text-brand-primary';
  if (status === 'in-progress') return 'text-orange-400';
  return 'text-gray-400';
};

export const TreatmentPage: React.FC = () => {
  const { currentPatient } = usePatient();
  const [treatment, setTreatment] = useState<TreatmentSummary | null>(null);

  const loadTreatment = (patientId: string) => {
    setTreatment(null);
    treatmentService
      .getTreatmentSummary(patientId)
      .then((data) => {
        setTreatment(data);
      })
      .catch(console.error);
  };

  useIonViewWillEnter(() => {
    if (currentPatient) {
      loadTreatment(currentPatient.id);
    }
  });

  useEffect(() => {
    if (currentPatient) {
      loadTreatment(currentPatient.id);
    }
  }, [currentPatient?.id]);

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Treatment Plan</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Your path to a perfect smile.</p>
        </div>

        {treatment ? (
          <div className="space-y-6">
            <div className="p-6 relative overflow-hidden brand-gradient text-white rounded-[24px] shadow-xl border border-white/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none"></div>
              <IonIcon icon={shieldCheckmarkOutline} className="text-5xl mb-4 opacity-80" />
              <h2 className="text-xl font-semibold tracking-tight mb-2 text-white">{treatment.title}</h2>
              <div className="mb-3 flex justify-between items-end">
                <span className="text-[0.65rem] font-semibold opacity-90 uppercase tracking-widest text-white">Overall Progress</span>
                <span className="text-2xl font-semibold tracking-tight text-white">{treatment.overallProgress}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5 mb-1 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${treatment.overallProgress}%` }}></div>
              </div>
            </div>

            <div className="px-1">
              <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-4 tracking-tight">Phases</h3>
              <div className="space-y-3">
                {treatment.phases.map((phase, index) => (
                  <div key={phase.id} className="glass-card p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-subtle flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[var(--text-primary)] font-medium text-[0.95rem]">{phase.name}</h4>
                      <p className={`text-[0.65rem] uppercase tracking-widest font-semibold mt-1 ${getStatusColor(phase.status)}`}>
                        {phase.status.replace('-', ' ')}
                      </p>
                    </div>
                    <IonIcon icon={getStatusIcon(phase.status)} className={`text-2xl ${getStatusColor(phase.status)}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Loading treatment plan...</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TreatmentPage;
