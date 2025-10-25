import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { DownloadIcon } from './icons/DownloadIcon';

interface InstallPWAButtonProps {
    onInstall: () => void;
}

export const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ onInstall }) => {
  const { t } = useLocalization();
  return (
    <button
      onClick={onInstall}
      className="fixed bottom-4 right-4 bg-brand text-primary font-bold py-3 px-5 rounded-full shadow-lg flex items-center gap-3 hover:bg-sky-400 transition-all duration-300 transform hover:scale-105 z-50 animate-bounce"
      aria-label={t('pwa.installButton')}
    >
      <DownloadIcon className="w-6 h-6" />
      <span>{t('pwa.installButton')}</span>
       <style>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-5%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(0);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          .animate-bounce {
            animation: bounce 1.5s infinite;
          }
        `}</style>
    </button>
  );
};
