import React, { useState, useRef, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonButtons
} from '@ionic/react';
import { closeOutline, send } from 'ionicons/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { API_URL, getBaseHeaders } from '../../core/config/api.config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

interface AssistantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
}

export const AssistantChatModal: React.FC<AssistantChatModalProps> = ({ isOpen, onClose, patientId }) => {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', text: '¡Hola! Soy tu asistente de IA. ¿En qué te puedo ayudar hoy?', sender: 'assistant' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    });
  };

  // Auto scroll when modal opens
  useEffect(() => {
    if (isOpen) scrollToBottom(false);
  }, [isOpen]);

  // Auto scroll on new messages / typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = '38px';
    }

    try {
      const response = await fetch(`${API_URL}/ai-agent/chat`, {
        method: 'POST',
        headers: getBaseHeaders(token),
        body: JSON.stringify({
          patient_id: patientId ? parseInt(patientId, 10) : undefined,
          message: userMsg.text
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result?.data?.content || 'Lo siento, no pude procesar tu solicitud.',
        sender: 'assistant',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, tuve problemas para conectarme con el servidor. Por favor, intenta de nuevo más tarde.',
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getMascotSrc = () => '/assets/mascot.png';

  const avatarFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://ui-avatars.com/api/?name=AI&background=0052D4&color=fff&rounded=true';
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      breakpoints={[0, 0.4, 1]}
      initialBreakpoint={1}
      className="assistant-modal"
    >
      <IonHeader className="ion-no-border">
        <IonToolbar className="bg-[var(--bg-app)] pt-2 pb-1 px-1">
          <IonButtons slot="start" className="ml-3 mr-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-white p-1.5 flex items-center justify-center">
              <img src={getMascotSrc()} alt="Mascot" className="w-full h-full object-contain" onError={avatarFallback} />
            </div>
          </IonButtons>
          <div className="flex flex-col justify-center">
            <IonTitle className="p-0 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Assistant</IonTitle>
            <span className="text-xs font-medium text-[var(--text-secondary)] opacity-90">How can I help you?</span>
          </div>
          <IonButtons slot="end" className="mr-1">
            <IonButton onClick={onClose} className="text-[var(--text-secondary)]">
              <IonIcon icon={closeOutline} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* scrollY=false disables IonContent's native scroll so our inner div owns it */}
      <IonContent scrollY={false} className="bg-[var(--bg-app)]">
        {/* Full-height flex column — only the messages div scrolls */}
        <div className="flex flex-col h-full">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-5"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-auto border border-[var(--border-subtle)] shadow-sm bg-white p-1 flex items-center justify-center">
                      <img src={getMascotSrc()} alt="assistant" className="w-full h-full object-contain" onError={avatarFallback} />
                    </div>
                  )}
                  <div
                    className={`relative px-4 py-2.5 max-w-[82%] rounded-[20px] shadow-sm text-[0.95rem] leading-relaxed tracking-wide ${isUser
                      ? 'bg-[var(--color-brand-primary)] text-white rounded-br-sm brand-gradient'
                      : 'bg-[var(--bg-surface-solid)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-bl-sm'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                className="flex w-full justify-start"
                style={{ animation: 'fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-auto border border-[var(--border-subtle)] shadow-sm bg-white p-1 flex items-center justify-center">
                  <img src={getMascotSrc()} alt="assistant" className="w-full h-full object-contain" onError={avatarFallback} />
                </div>
                <div className="px-4 py-4 max-w-[80%] rounded-2xl bg-[var(--bg-surface-solid)] border border-[var(--border-subtle)] rounded-bl-sm shadow-sm flex items-center space-x-1 h-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* Scroll anchor — scrollIntoView targets this element */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border bg-[var(--bg-app)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="px-3 py-3 bg-[var(--bg-app)] border-t border-[var(--border-subtle)] pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-end bg-[var(--bg-surface-solid)] rounded-[24px] px-2 py-1.5 shadow-sm border border-[var(--border-subtle)] focus-within:border-[var(--color-brand-primary)] focus-within:shadow-[0_4px_12px_rgba(0,82,212,0.08)] transition-all duration-300">
            <textarea
              ref={textAreaRef}
              value={inputText}
              placeholder="Type a message..."
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full bg-transparent resize-none outline-none text-[0.95rem] leading-[1.3] py-2 px-3 mx-1 text-[var(--text-primary)]"
              style={{ minHeight: '38px', height: '38px', maxHeight: '80px', flexGrow: 1 }}
              rows={1}
            />
            <IonButton
              fill="clear"
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className={`m-0 mb-0.5 h-9 w-9 min-w-0 flex-shrink-0 rounded-full transition-all duration-300 ${inputText.trim() && !isTyping
                ? 'bg-[var(--color-brand-primary)] text-white shadow-md active:scale-90 hover:scale-105'
                : 'bg-transparent text-gray-400'
                }`}
            >
              <IonIcon
                icon={send}
                className={inputText.trim() && !isTyping ? 'text-white' : 'text-gray-400'}
                size="small"
              />
            </IonButton>
          </div>
        </div>
      </IonFooter>
    </IonModal>
  );
};
