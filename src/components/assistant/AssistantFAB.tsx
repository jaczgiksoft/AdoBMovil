import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IonToast, IonSpinner } from '@ionic/react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { AssistantChatModal } from './AssistantChatModal';
import { useAuthStore } from '../../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL as string;

// ─── QR Check-In Service (pure, stateless) ────────────────────────────────────
async function postQrCheckIn(
  token: string,
  phoneNumber: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/attendance/qr-checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, phoneNumber }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Error desconocido');
  }
  return data;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const AssistantFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' } | null>(null);

  const location = useLocation();
  const { user } = useAuthStore();

  // Offset logic to avoid overlapping other FABs (like on the Profile page)
  const isProfilePage = location.pathname.includes('/app/profile');
  const assistantBottom = isProfilePage ? 170 : 90;
  const qrBottom = assistantBottom + 70;

  // ── QR Scanner Handler ───────────────────────────────────────────────────────
  const handleQrScan = async () => {
    if (isScanning) return;

    try {
      setIsScanning(true);

      // 1. Request camera permission
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
        setToast({ message: 'Permiso de cámara denegado. Actívalo en Ajustes.', color: 'danger' });
        return;
      }

      // 2. Scan QR code
      const { barcodes } = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode] });
      if (!barcodes.length || !barcodes[0].rawValue) {
        setToast({ message: 'No se detectó ningún código QR.', color: 'danger' });
        return;
      }

      const token = barcodes[0].rawValue;
      const phoneNumber = user?.phoneNumber ?? '';

      if (!phoneNumber) {
        setToast({
          message: 'No se encontró tu número de teléfono en el perfil.',
          color: 'danger',
        });
        return;
      }

      // 3. Send check-in request to backend
      await postQrCheckIn(token, phoneNumber);
      setToast({ message: '✅ Registrado correctamente', color: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      // Swallow gracefully if user cancelled the scan dialog
      if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismiss')) return;
      setToast({
        message: 'No se pudo validar el QR. Por favor usar la pantalla manualmente.',
        color: 'danger',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      {/* ── QR Check-In FAB ───────────────────────────────────────────────── */}
      <div
        role="button"
        aria-label="Escanear QR de Kiosco"
        className="fixed right-4 z-[9998] flex items-center justify-center w-[50px] h-[50px] rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: `${qrBottom}px`,
          backgroundColor: '#0f172a',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '2px solid rgba(255,255,255,0.08)',
        }}
        onClick={handleQrScan}
      >
        {isScanning ? (
          <IonSpinner name="crescent" style={{ color: 'white', width: 22, height: 22 }} />
        ) : (
          /* QR icon inline — avoids extra icon dependency */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="5" y="5" width="3" height="3" fill="white" stroke="none" />
            <rect x="16" y="5" width="3" height="3" fill="white" stroke="none" />
            <rect x="16" y="16" width="3" height="3" fill="white" stroke="none" />
            <rect x="5" y="16" width="3" height="3" fill="white" stroke="none" />
          </svg>
        )}
      </div>

      {/* ── Assistant FAB (unchanged) ──────────────────────────────────────── */}
      <div
        className="fixed right-4 z-[9999] flex items-center justify-center w-[50px] h-[50px] rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: `${assistantBottom}px`,
          boxShadow: '0 8px 32px rgba(0, 82, 212, 0.35)',
          backgroundColor: 'var(--color-brand-primary)',
        }}
        onClick={() => setIsOpen(true)}
      >
        {/* Soft pulse animation ring */}
        <div
          className="absolute inset-0 rounded-full bg-[var(--color-brand-primary)] opacity-40"
          style={{ animation: 'softPing 2.5s ease-out infinite' }}
        ></div>
        {/* Inner container for image */}
        <div className="w-full h-full p-2.5 rounded-full overflow-hidden z-10 bg-white shadow-inner flex items-center justify-center">
          <img
            src="/assets/mascot.png"
            alt="Assistant Mascot"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'https://ui-avatars.com/api/?name=AI&background=0052D4&color=fff&rounded=true';
            }}
          />
        </div>
      </div>

      <AssistantChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        patientId={user?.id ? String(user.id) : undefined}
      />

      {/* ── Toast feedback ────────────────────────────────────────────────── */}
      <IonToast
        isOpen={!!toast}
        message={toast?.message}
        color={toast?.color}
        duration={3500}
        position="top"
        onDidDismiss={() => setToast(null)}
      />
    </>
  );
};
