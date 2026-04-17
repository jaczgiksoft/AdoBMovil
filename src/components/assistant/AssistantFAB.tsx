import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AssistantChatModal } from './AssistantChatModal';
import { useAuthStore } from '../../store/useAuthStore';

export const AssistantFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  // Offset logic to avoid overlapping other FABs (like on the Profile page)
  const isProfilePage = location.pathname.includes('/app/profile');
  const bottomPosition = isProfilePage ? '170px' : '90px';

  return (
    <>
      <div
        className="fixed right-4 z-[9999] flex items-center justify-center w-[50px] h-[50px] rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: bottomPosition,
          boxShadow: '0 8px 32px rgba(0, 82, 212, 0.35)',
          backgroundColor: 'var(--color-brand-primary)'
        }}
        onClick={() => setIsOpen(true)}
      >
        {/* Soft pulse animation ring */}
        <div
          className="absolute inset-0 rounded-full bg-[var(--color-brand-primary)] opacity-40"
          style={{
            animation: 'softPing 2.5s ease-out infinite',
          }}
        ></div>
        {/* Inner container for image */}
        <div className="w-full h-full p-2.5 rounded-full overflow-hidden z-10 bg-white shadow-inner flex items-center justify-center">
          <img
            src="/assets/mascot.png"
            alt="Assistant Mascot"
            className="w-full h-full object-contain"
            onError={(e) => {
              // fallback if mascot.png doesn't exist yet
              const target = e.target as HTMLImageElement;
              target.src = 'https://ui-avatars.com/api/?name=AI&background=0052D4&color=fff&rounded=true';
            }}
          />
        </div>
      </div>

      <AssistantChatModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        patientId={user?.id ? String(user.id) : undefined}
      />
    </>
  );
};
