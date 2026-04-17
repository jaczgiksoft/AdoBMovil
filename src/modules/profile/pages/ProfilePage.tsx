import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon, useIonRouter, IonToggle,
  IonFab, IonFabButton, IonModal, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonItem, IonInput, IonAlert
} from '@ionic/react';
import { profileService } from '../services';
import { getProfileMock } from '../services/profile.mock';
import { PatientProfile } from '../types';
import { useThemeStore } from '../../../store/useThemeStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePatient } from '../../../core/context/PatientContext';
import {
  mailOutline, callOutline, calendarOutline, logOutOutline, moonOutline,
  personOutline, maleFemaleOutline, locationOutline, add, pencil, trashOutline
} from 'ionicons/icons';

export const ProfilePage: React.FC = () => {
  const { logout } = useAuthStore();
  const { currentPatient } = usePatient();
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  // Hobbies local state
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentHobby, setCurrentHobby] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [hobbyToDelete, setHobbyToDelete] = useState<number | null>(null);

  const { isDarkMode, toggleTheme } = useThemeStore();
  const router = useIonRouter();

  const handleLogout = () => {
    logout();
    router.push('/login', 'root', 'replace');
  };

  useEffect(() => {
    let isActive = true;
    setProfile(null);

    const loadProfile = (idToLoad: string) => {
      getProfileMock(idToLoad)
        .then((data) => {
          if (!isActive) return;
          setProfile(data);
          setHobbies(data.hobbies || []);
        })
        .catch((err) => {
          console.error('Error al cargar perfil:', err);
          if (isActive && idToLoad !== 'pat-sj-1029') {
            console.log('Haciendo fallback a perfil demostrativo...');
            loadProfile('pat-sj-1029');
          }
        });
    };

    loadProfile(currentPatient?.id || 'pat-sj-1029');

    return () => {
      isActive = false;
    };
  }, [currentPatient?.id]);

  // Hobbies CRUD
  const openAddModal = () => {
    setCurrentHobby('');
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setCurrentHobby(hobbies[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const saveHobby = () => {
    if (!currentHobby.trim()) return;

    if (editingIndex !== null) {
      const updated = [...hobbies];
      updated[editingIndex] = currentHobby.trim();
      setHobbies(updated);
    } else {
      setHobbies([...hobbies, currentHobby.trim()]);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (hobbyToDelete !== null) {
      const updated = hobbies.filter((_, i) => i !== hobbyToDelete);
      setHobbies(updated);
      setHobbyToDelete(null);
      setShowModal(false); // Can close modal here as delete button is inside it
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-1">Profile</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Manage your details.</p>
        </div>

        {profile ? (
          <div className="space-y-6 pb-20">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-surface-solid)] shadow-md p-1 border border-[var(--border-subtle)] overflow-hidden mb-4">
                <img src="/assets/mascot.png" alt="Profile Mascot" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                {profile.fullName || `${profile.firstName} ${profile.lastName}`}
              </h2>
              <p className="text-brand-primary font-semibold text-xs tracking-widest uppercase mt-1">Patient</p>
            </div>

            {/* Appearance Toggle */}
            <div className="glass-card p-2">
              <div className="flex items-center gap-4 p-4">
                <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                  <IonIcon icon={moonOutline} className="text-xl" />
                </div>
                <div className="flex-grow flex justify-between items-center">
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Appearance</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">Dark Mode</p>
                  </div>
                  <IonToggle checked={isDarkMode} onIonChange={toggleTheme} color="primary" />
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 px-1">Personal Info</h3>
              <div className="glass-card p-2">
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)]">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={personOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Age</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">{profile.age || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)]">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={maleFemaleOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Gender</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem] capitalize">{profile.gender || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)]">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={locationOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Address</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">{profile.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)]">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={mailOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Email</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-subtle)]">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={callOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Phone</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4">
                  <div className="p-3 bg-accent-subtle rounded-xl text-brand-primary">
                    <IonIcon icon={calendarOutline} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-widest opacity-80 mb-1">Date of Birth</p>
                    <p className="text-[var(--text-primary)] font-medium text-[0.95rem]">{new Date(profile.birthDate || profile.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies Section */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 px-1">Hobbies</h3>
              {hobbies.length === 0 ? (
                <div className="glass-card p-6 flex items-center justify-center">
                  <p className="text-[var(--text-secondary)] font-medium text-sm opacity-60">No hobbies registered</p>
                </div>
              ) : (
                <div className="glass-card p-4 flex flex-wrap gap-3">
                  {hobbies.map((hobby, index) => (
                    <div
                      key={index}
                      onClick={() => openEditModal(index)}
                      className="px-4 py-2 rounded-2xl bg-[var(--bg-surface-solid)] border border-[var(--border-subtle)] shadow-sm flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
                    >
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{hobby}</span>
                      <IonIcon icon={pencil} className="text-xs text-brand-primary opacity-80" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 pb-10">
              <IonButton fill="clear" color="danger" expand="block" onClick={handleLogout} className="font-semibold h-12 text-sm tracking-widest uppercase">
                <IonIcon slot="start" icon={logOutOutline} />
                Sign Out
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Loading profile...</p>
          </div>
        )}

        {/* FAB for Add Hobby */}
        {profile && (
          <IonFab horizontal="end" vertical="bottom" slot="fixed" className="mb-4 mr-2">
            <IonFabButton color="primary" onClick={openAddModal}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>

      {/* CRUD Modal for Hobby */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        breakpoints={[0, 0.4, 0.7]}
        initialBreakpoint={0.4}
      >
        <IonHeader className="ion-no-border">
          <IonToolbar className="bg-[var(--bg-app)] px-2">
            <IonTitle className="text-lg font-semibold tracking-tight">
              {editingIndex !== null ? 'Edit Hobby' : 'New Hobby'}
            </IonTitle>

            <IonButtons slot="end">
              <IonButton
                onClick={() => setShowModal(false)}
                className="text-[var(--text-secondary)] font-medium"
              >
                Cancel
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="bg-[var(--bg-app)]">
          <div className="px-5 pt-6 pb-8 space-y-6">

            {/* INPUT LABEL */}
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 tracking-wide uppercase">
                Hobby name
              </p>

              <IonItem
                lines="none"
                className="rounded-2xl px-3 py-2 border border-[var(--border-subtle)] bg-[var(--bg-surface-solid)] focus-within:border-brand-primary transition-all"
              >
                <IonInput
                  value={currentHobby}
                  onIonInput={(e) => setCurrentHobby(e.detail.value!)}
                  placeholder="e.g. Piano, Football..."
                  clearInput
                  className="text-[0.95rem]"
                />
              </IonItem>
            </div>

            {/* PRIMARY BUTTON */}
            <IonButton
              expand="block"
              onClick={saveHobby}
              className="h-12 rounded-xl font-semibold text-[0.95rem] shadow-sm brand-gradient"
            >
              {editingIndex !== null ? 'Update Hobby' : 'Save Hobby'}
            </IonButton>

            {/* DELETE (ONLY EDIT MODE) */}
            {editingIndex !== null && (
              <div className="pt-2">
                <IonButton
                  fill="clear"
                  expand="block"
                  className="text-red-500 font-semibold text-sm"
                  onClick={() => {
                    setHobbyToDelete(editingIndex);
                    setShowAlert(true);
                  }}
                >
                  <IonIcon slot="start" icon={trashOutline} />
                  Delete Hobby
                </IonButton>
              </div>
            )}

          </div>
        </IonContent>
      </IonModal>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Remove hobby?"
        message="This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'text-[var(--text-secondary)]',
            handler: () => {
              setHobbyToDelete(null);
            }
          },
          {
            text: 'Remove',
            role: 'destructive',
            handler: confirmDelete
          }
        ]}
      />
    </IonPage>
  );
};

export default ProfilePage;
