import React, { ReactNode } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface CollapsibleSectionProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, description, isOpen, onToggle, children }) => {
  const { language } = useLocalization();
  return (
    <div className="bg-secondary rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-accent/50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-')}`}
      >
        <div className={language.dir === 'rtl' ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description && <p className="text-light mt-1 text-sm">{description}</p>}
        </div>
        <ChevronDownIcon className={`w-6 h-6 text-light transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id={`collapsible-content-${title.replace(/\s+/g, '-')}`}
          className="p-6 border-t border-accent/20"
        >
          {children}
        </div>
      )}
    </div>
  );
};
