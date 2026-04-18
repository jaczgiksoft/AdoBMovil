import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonIcon, IonModal, IonSpinner } from '@ionic/react';
import { elasticsService } from '../services';
import { ElasticInstruction, PatientElastic } from '../types';
import { timeOutline, calendarOutline, checkmarkCircleOutline, ellipsisHorizontalCircleOutline, playCircleOutline, alertCircleOutline } from 'ionicons/icons';
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

// 🗺️ Mapper: Backend -> UI
const mapBackendToUI = (data: PatientElastic[]): ElasticInstruction[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return data.map((inst) => {
    const startDate = inst.start_date ? new Date(inst.start_date) : null;
    const endDate = inst.end_date ? new Date(inst.end_date) : null;

    let status: 'active' | 'completed' | 'upcoming' = 'active';
    if (endDate && endDate < now) {
      status = 'completed';
    } else if (startDate && startDate > now) {
      status = 'upcoming';
    }

    const elastics: { type: 'Heavy' | 'Medium' | 'Light'; color: string }[] = [];
    
    // Simple mapping for demonstration, real app might need more logic
    if (inst.upper_elastic) {
      const type = inst.upper_elastic.toLowerCase().includes('heavy') ? 'Heavy' : 
                   inst.upper_elastic.toLowerCase().includes('light') ? 'Light' : 'Medium';
      const color = type === 'Heavy' ? '#ef4444' : type === 'Light' ? '#22c55e' : '#a855f7';
      elastics.push({ type, color });
    }

    if (inst.lower_elastic) {
      const type = inst.lower_elastic.toLowerCase().includes('heavy') ? 'Heavy' : 
                   inst.lower_elastic.toLowerCase().includes('light') ? 'Light' : 'Medium';
      const color = type === 'Heavy' ? '#ef4444' : type === 'Light' ? '#22c55e' : '#a855f7';
      elastics.push({ type, color });
    }

    // Use the image from backend if it exists, otherwise use placeholder
    const imagePath = inst.preview_image_url 
      ? (inst.preview_image_url.startsWith('http') ? inst.preview_image_url : `${BASE_URL}/${inst.preview_image_url}`)
      : '/example/instrucciones.png';

    return {
      id: inst.id.toString(),
      title: inst.upper_elastic || 'Tratamiento de Elásticos',
      startDate: inst.start_date || '',
      endDate: inst.end_date || '',
      dailyHours: parseInt(inst.hours?.replace(/\D/g, '') || '0'),
      elastics,
      instructions: inst.notes || 'Sigue las indicaciones de tu ortodoncista.',
      imagePath,
      status
    };
  });
};

export const ElasticsPage: React.FC = () => {
  const { currentPatient } = usePatient();
  const [instructions, setInstructions] = useState<ElasticInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadElastics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await elasticsService.getElastics();
        setInstructions(mapBackendToUI(data as PatientElastic[]));
      } catch (err: any) {
        console.error('Error loading elastics:', err);
        setError('No se pudieron cargar las instrucciones. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadElastics();
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
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1 tracking-tight">Elásticos</h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm opacity-90">Tus instrucciones de elásticos ortodónticos.</p>
        </div>

        {loading ? (
          <div className="h-60 flex flex-col items-center justify-center gap-4">
            <IonSpinner name="crescent" color="primary" />
            <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse tracking-wide">Cargando instrucciones...</p>
          </div>
        ) : error ? (
          <div className="h-60 flex flex-col items-center justify-center gap-4 text-center px-6">
            <IonIcon icon={alertCircleOutline} className="text-4xl text-red-500" />
            <p className="text-[var(--text-secondary)] font-medium text-sm">{error}</p>
          </div>
        ) : (
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
                        {inst.startDate ? new Date(inst.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '---'} – {inst.endDate ? new Date(inst.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '---'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IonIcon icon={timeOutline} className="text-brand-primary opacity-80" />
                      <span>{inst.dailyHours} hrs/día</span>
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
              <div className="h-40 flex items-center justify-center text-center px-6">
                <p className="text-[var(--text-secondary)] font-medium text-sm opacity-70">
                  No tienes instrucciones de elásticos activas en este momento.
                </p>
              </div>
            )}
          </div>
        )}
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
