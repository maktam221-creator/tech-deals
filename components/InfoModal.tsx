import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CloseIcon } from './icons/CloseIcon';

interface InfoModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
    const { t } = useLocalization();

    const modalContentProps = {
        className: "bg-secondary rounded-2xl p-6 md:p-8 w-full max-w-3xl mx-auto shadow-2xl border border-accent/30 max-h-[80vh] flex flex-col transform animate-scale-in",
        onClick: (e: React.MouseEvent) => e.stopPropagation()
    };

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
        >
          <div {...modalContentProps}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 id="info-modal-title" className="text-2xl font-bold text-white">{title}</h2>
              <button onClick={onClose} className="text-light hover:text-white p-1 rounded-full hover:bg-accent transition-colors" aria-label={t('modal.close')}>
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto prose prose-invert max-w-none text-highlight prose-p:text-light prose-headings:text-white">
                <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
            </div>
          </div>

           <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
              }
              @keyframes scale-in {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              .animate-scale-in {
                animation: scale-in 0.3s ease-out forwards;
              }
            `}</style>
        </div>
    );
};
