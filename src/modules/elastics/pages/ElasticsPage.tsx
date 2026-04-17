import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, IonModal } from '@ionic/react';
import { elasticsService } from '../services';
import { ElasticInstruction } from '../types';
import { timeOutline, calendarOutline, checkmarkCircleOutline, ellipsisHorizontalCircleOutline, playCircleOutline } from 'ionicons/icons';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { usePatient } from '../../../core/context/PatientContext';

const getStatusBadge = (status: string) => {
  if (status === 'active') {
    return { color: 'text-green-600 bg-green-500/10 border-green-500/20', label: 'Active', icon: playCircleOutline };
  }
  if (status === 'completed') {
    return { color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', label: 'Completed', icon: checkmarkCircleOutline };
  }
  return { color: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20', label: 'Upcoming', icon: ellipsisHorizontalCircleOutline };
};

export const ElasticsPage: React.FC = () => {
  const { currentPatient } = usePatient();
  const [instructions, setInstructions] = useState<ElasticInstruction[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    elasticsService.getElastics().then(setInstructions).catch(console.error);
  }, []);

  const handleImageClick = async (imagePath: string) => {
    setSelectedImage(imagePath);
    try {
      await ScreenOrientation.lock({ orientation: 'landscape' });
    } catch (err) {
      console.warn('Screen orientation lock failed', err);
    }
  };

  const handleCloseModal = async () => {
    setSelectedImage(null);
    try {
      await ScreenOrientation.unlock();
    } catch (err) {
      console.warn('Screen orientation unlock failed', err);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-app">
        <div className="pt-8 pb-5">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Elastics</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Your orthodontic elastic instructions.</p>
        </div>

        <div className="space-y-4 pb-8">
          {instructions.map((inst) => {
            const statusStyle = getStatusBadge(inst.status);
            return (
              <div key={inst.id} className="glass-card p-5 relative overflow-hidden flex flex-col gap-4">

                {/* Header: Title & Status */}
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight leading-tight">{inst.title}</h2>
                  <span className={`px-2.5 py-1 rounded-full border text-[0.65rem] font-bold uppercase tracking-widest flex items-center gap-1 shrink-0 ${statusStyle.color}`}>
                    <IonIcon icon={statusStyle.icon} className="text-sm" />
                    {statusStyle.label}
                  </span>
                </div>

                {/* Details Row: Dates & Hours */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[var(--text-secondary)] text-[0.85rem] font-medium opacity-90">
                  <div className="flex items-center gap-2">
                    <IonIcon icon={calendarOutline} className="text-brand-primary opacity-80" />
                    <span>
                      {new Date(inst.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} – {new Date(inst.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IonIcon icon={timeOutline} className="text-brand-primary opacity-80" />
                    <span>{inst.dailyHours} hrs/day</span>
                  </div>
                </div>

                {/* Elastics Chips */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {inst.elastics.map((el, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[var(--bg-surface-solid)] border border-[var(--border-subtle)] shadow-sm text-[var(--text-primary)] rounded-full text-xs font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: el.color }}></span>
                      {el.type}
                    </span>
                  ))}
                </div>

                {/* Instructions Text */}
                <div className="bg-accent-subtle/50 p-3.5 rounded-xl border border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed opacity-95">
                    {inst.instructions}
                  </p>
                </div>

                {/* Image */}
                <div
                  className="w-full h-40 mt-1 rounded-xl overflow-hidden bg-[var(--bg-surface-solid)] border border-[var(--border-subtle)] cursor-pointer active:opacity-70 transition-opacity"
                  onClick={() => handleImageClick(inst.imagePath)}
                >
                  <img src={inst.imagePath} alt={inst.title} className="w-full h-full object-cover opacity-90 pointer-events-none" />
                </div>
              </div>
            );
          })}

          {instructions.length === 0 && (
            <div className="h-40 flex items-center justify-center">
              <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Gathering instructions...</p>
            </div>
          )}
        </div>
      </IonContent>

      {/* Fullscreen Image Modal */}
      <IonModal isOpen={!!selectedImage} onDidDismiss={handleCloseModal}>
        <div
          className="w-full h-full bg-black flex items-center justify-center p-4 cursor-pointer"
          onClick={handleCloseModal}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Fullscreen Instruction"
              className="w-full h-full object-contain pointer-events-none"
            />
          )}
        </div>
      </IonModal>
    </IonPage>
  );
};

export default ElasticsPage;
