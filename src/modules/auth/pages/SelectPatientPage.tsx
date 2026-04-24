import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAvatar,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePatient } from '../../../core/context/PatientContext';
import { logOutOutline, personOutline, peopleOutline } from 'ionicons/icons';
import { API_URL, BASE_URL } from '../../../core/config/api.config';

const SelectPatientPage: React.FC = () => {
  const { availableProfiles, logout } = useAuthStore();
  const { switchPatient } = usePatient();
  const history = useHistory();

  const handleSelectPatient = (patientId: string) => {
    switchPatient(patientId);
    history.push('/app/home');
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  console.log(BASE_URL)

  return (
    <IonPage>
      <IonHeader className="ion-no-border shadow-sm">
        <IonToolbar color="primary">
          <IonTitle>Seleccionar Perfil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" color="light">
        <div className="max-w-md mx-auto mt-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">¿Quién consultará hoy?</h2>
            <p className="text-[var(--text-secondary)]">Selecciona un perfil para continuar</p>
          </div>

          <div className="flex flex-col gap-4">
            {availableProfiles.map((profile) => (
              <IonCard
                key={profile.id}
                className="m-0 cursor-pointer transition-transform active:scale-95 shadow-md hover:shadow-lg border border-[var(--border-subtle)]"
                onClick={() => handleSelectPatient(profile.id)}
              >
                <IonItem lines="none" className="py-2">
                  <IonAvatar slot="start" className="w-14 h-14 border-2 border-primary/20 overflow-hidden">
                    <img
                      src={profile.photo ? `${BASE_URL}/${profile.photo}` : '/assets/mascot.png'}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </IonAvatar>
                  <IonLabel>
                    <IonCardTitle className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      {profile.name}
                    </IonCardTitle>
                    <IonCardSubtitle className="flex items-center gap-1 mt-1 text-sm font-medium">
                      {profile.type === 'self' ? (
                        <span className="text-blue-500 flex items-center gap-1"><IonIcon icon={personOutline} /> Mi Perfil</span>
                      ) : (
                        <span className="text-emerald-500 flex items-center gap-1"><IonIcon icon={peopleOutline} /> Representado</span>
                      )}
                    </IonCardSubtitle>
                  </IonLabel>
                </IonItem>
              </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectPatientPage;
