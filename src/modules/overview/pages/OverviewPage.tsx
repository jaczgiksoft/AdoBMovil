import React, { useMemo } from 'react';
import { IonPage, IonContent, IonIcon, useIonRouter } from '@ionic/react';
import {
  alertCircleOutline,
  calendarOutline,
  chevronForwardOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  demoTutorRelationships,
  demoPatientsData,
  demoAppointmentsData,
  demoAlertsData,
  demoTreatmentData,
} from '../../../core/demo/demo-data';
import { usePatient, Patient } from '../../../core/context/PatientContext';

const OverviewPage: React.FC = () => {
  const { user } = useAuthStore();
  const { setCurrentPatient } = usePatient();
  const router = useIonRouter();

  const patients = useMemo(() => {
    const userId = user?.id ?? '';
    const patientIds = demoTutorRelationships[userId] ?? [];
    return patientIds.map((id) => ({
      profile: demoPatientsData[id],
      appointments: demoAppointmentsData[id] ?? [],
      alerts: demoAlertsData[id] ?? [],
      treatment: demoTreatmentData[id] ?? null,
    }));
  }, [user]);

  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  const totalUnreadAlerts = useMemo(
    () => patients.reduce((acc, p) => acc + p.alerts.filter((a) => !a.read).length, 0),
    [patients]
  );

  const upcomingCount = useMemo(
    () =>
      patients.reduce(
        (acc, p) =>
          acc +
          p.appointments.filter((a) => {
            const d = new Date(a.date).getTime();
            return d >= now && d <= now + sevenDays;
          }).length,
        0
      ),
    [patients]
  );

  const handleSelectPatient = (id: string, fullName: string, age: number) => {
    const patient: Patient = { id, fullName, age };
    setCurrentPatient(patient);
    router.push('/app/home', 'forward', 'push');
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <IonPage>
      <IonContent className="ion-padding relative overflow-hidden bg-app">
        {/* Background glow orb */}
        <div className="absolute top-[-5%] right-[-10%] w-[40vh] h-[40vh] bg-brand-primary mix-blend-plus-lighter filter blur-[80px] opacity-20 pointer-events-none" />

        <div className="relative z-10 pt-8 pb-12 space-y-6">
          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
              Family Overview
            </h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium opacity-80 mt-0.5">
              All patients at a glance
            </p>
          </div>

          {/* Global Summary Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-3 flex flex-col items-center gap-1 text-center">
              <IonIcon icon={peopleOutline} className="text-brand-primary text-xl" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {patients.length}
              </span>
              <span className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Patients
              </span>
            </div>
            <div className="glass-card p-3 flex flex-col items-center gap-1 text-center">
              <IonIcon icon={alertCircleOutline} className="text-red-400 text-xl" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {totalUnreadAlerts}
              </span>
              <span className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Alerts
              </span>
            </div>
            <div className="glass-card p-3 flex flex-col items-center gap-1 text-center">
              <IonIcon icon={calendarOutline} className="text-green-400 text-xl" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {upcomingCount}
              </span>
              <span className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                This Week
              </span>
            </div>
          </div>

          {/* Patient Cards */}
          <div className="space-y-4">
            {patients.map(({ profile, appointments, alerts, treatment }) => {
              if (!profile || !profile.fullName || !profile.id) return null;

              const unread = alerts.filter((a) => !a.read).length;
              const nextAppt = appointments
                .filter((a) => new Date(a.date).getTime() >= now)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

              const progress = treatment?.overallProgress ?? 0;

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelectPatient(profile.id!, profile.fullName!, profile.age ?? 0)}
                  className="glass-card rounded-2xl p-4 flex flex-col gap-3 cursor-pointer active:opacity-75 transition-opacity"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brand-primary/15 flex items-center justify-center text-brand-primary font-bold text-base flex-shrink-0">
                      {getInitials(profile.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[var(--text-primary)] font-semibold text-base leading-tight truncate">
                        {profile.fullName}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-xs font-medium opacity-80">
                        {profile.age} yrs
                      </p>
                    </div>
                    <IonIcon
                      icon={chevronForwardOutline}
                      className="text-[var(--text-secondary)] opacity-50 text-lg flex-shrink-0"
                    />
                  </div>

                  {/* Treatment Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[0.65rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                        {treatment?.title ?? 'No treatment'}
                      </span>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--border-subtle)] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="brand-gradient h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-2">
                    {unread > 0 ? (
                      <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <IonIcon icon={alertCircleOutline} className="text-xs" />
                        {unread} alert{unread !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-[0.65rem] font-medium text-[var(--text-secondary)] opacity-40">
                        No alerts
                      </span>
                    )}

                    {nextAppt ? (
                      <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full ml-auto">
                        <IonIcon icon={calendarOutline} className="text-xs" />
                        {new Date(nextAppt.date).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-[0.65rem] font-medium text-[var(--text-secondary)] opacity-40 ml-auto">
                        No visits scheduled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OverviewPage;
