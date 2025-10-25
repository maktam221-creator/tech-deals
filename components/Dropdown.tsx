import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface DropdownOption<T> {
    value: T;
    label: string;
}

interface DropdownProps<T extends string | number> {
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    renderButton: (selectedOption: DropdownOption<T> | undefined) => ReactNode;
}

export const Dropdown = <T extends string | number>({ options, value, onChange, renderButton }: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language } = useLocalization();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {renderButton(selectedOption)}
        <ChevronDownIcon className={`w-4 h-4 text-light transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
            className={`absolute top-full mt-2 w-48 bg-secondary border border-accent/50 rounded-lg shadow-xl z-50 overflow-hidden ${language.dir === 'rtl' ? 'left-0' : 'right-0'}`}
        >
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(option.value);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    value === option.value
                      ? 'bg-brand text-primary font-semibold'
                      : 'text-highlight hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
