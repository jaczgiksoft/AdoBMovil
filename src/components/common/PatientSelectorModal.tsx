import React, { useEffect, useState } from 'react';
import { IonModal, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { checkmarkCircle, personCircleOutline } from 'ionicons/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { profileService } from '../../modules/profile/services';
import { PatientProfile } from '../../modules/profile/types';
import { usePatient } from '../../core/context/PatientContext';

interface Props {
  isOpen: boolean;
  onDidDismiss: () => void;
}

export const PatientSelectorModal: React.FC<Props> = ({ isOpen, onDidDismiss }) => {
  const { user } = useAuthStore();
  const { currentPatient, setCurrentPatient } = usePatient();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true);
      profileService.getLinkedPatients(user.id)
        .then(setPatients)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, user?.id]);

  const handleSelect = (p: PatientProfile) => {
    setCurrentPatient({
      id: p.id!,
      fullName: p.fullName ?? `${p.firstName} ${p.lastName}`,
      age: p.age ?? 0,
    });

    onDidDismiss();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDidDismiss}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 0.75]}
      className="patient-selector-modal"
    >
      <IonContent className="ion-padding bg-app">
        <div className="pt-4 pb-2 text-center">
          <div className="w-12 h-1.5 bg-[var(--border-subtle)] rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Switch Patient</h2>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Select a linked account to view</p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-[var(--text-secondary)] font-medium animate-pulse text-sm">
            Loading linked patients...
          </div>
        ) : (
          <IonList className="bg-transparent mt-4 mb-safe" lines="none">
            {patients.map(p => {
              const isActive = p.id === currentPatient?.id;
              return (
                <IonItem
                  key={p.id}
                  button
                  onClick={() => handleSelect(p)}
                  className={`mb-3 rounded-2xl mx-1 overflow-hidden transition-all ${isActive ? 'border-2 border-brand-primary/50 bg-brand-primary/5' : 'border border-[var(--border-subtle)] bg-[var(--bg-surface-solid)] shadow-sm'}`}
                  detail={false}
                >
                  <IonIcon
                    icon={personCircleOutline}
                    slot="start"
                    className={`text-3xl ${isActive ? 'text-brand-primary' : 'text-[var(--text-secondary)] opacity-50'}`}
                  />
                  <IonLabel>
                    <h3 className={`font-semibold tracking-tight ${isActive ? 'text-brand-primary' : 'text-[var(--text-primary)]'}`}>
                      {p.firstName} {p.lastName}
                    </h3>
                    <p className="font-medium text-xs text-[var(--text-secondary)] mt-0.5">
                      DOB: {new Date(p.dateOfBirth).toLocaleDateString()}
                    </p>
                  </IonLabel>
                  {isActive && (
                    <IonIcon icon={checkmarkCircle} slot="end" className="text-brand-primary" />
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};

export default PatientSelectorModal;
