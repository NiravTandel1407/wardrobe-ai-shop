import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  id,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value ?? opt.id,
        label: opt.label ?? opt.name ?? String(opt.value ?? opt.id),
      };
    }
    return { value: opt, label: String(opt) };
  });

  // Find currently selected label
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-11 border rounded-lg px-3.5 text-sm text-[#111] bg-white flex items-center justify-between cursor-pointer transition select-none ${isOpen
            ? 'border-[#111] ring-2 ring-[#FFD400]'
            : 'border-[#b9b6aa] hover:border-[#111]'
          }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate font-normal">
          {selectedOption ? selectedOption.label : <span className="text-[#888]">{placeholder}</span>}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#555] transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180 text-[#111]' : ''
            }`}
        />
      </button>

      {/* Custom Themed Options Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#e7e5e0] rounded-xl shadow-xl py-1.5 z-50 max-h-60 overflow-y-auto animate-fadeIn"
          role="listbox"
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3.5 py-2.5 text-xs text-[#888] text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={`mx-1.5 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition flex items-center justify-between ${isSelected
                      ? 'bg-[#111] text-[#FFD400] font-medium shadow-xs'
                      : 'text-[#111] hover:bg-[#FFF9DB] hover:text-[#111]'
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#FFD400] flex-shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

