import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
  multiSelect?: boolean;
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onChange,
  icon,
  multiSelect = true
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleOption = (value: string) => {
    if (multiSelect) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter(v => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      // Single select mode
      onChange([value]);
      setIsOpen(false);
    }
  };
  
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
          isOpen || selectedValues.length > 0
            ? 'border-primary text-primary bg-primary/5'
            : 'border-gray-300 text-text-primary hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center">
          {icon || <Filter className="w-4 h-4 mr-2" aria-hidden="true" />}
          <span>{label}</span>
          {selectedValues.length > 0 && (
            <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
              {selectedValues.length}
            </span>
          )}
        </div>
        <div className="flex items-center">
          {selectedValues.length > 0 && (
            <button
              onClick={clearSelection}
              className="mr-1 p-0.5 rounded-full hover:bg-gray-200"
              aria-label="Clear selection"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
          <ul role="listbox" aria-labelledby="filter-dropdown">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleOption(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Specialized filter dropdowns for common use cases
export function DamageTypeFilter({ 
  selectedValues, 
  onChange 
}: { 
  selectedValues: string[]; 
  onChange: (values: string[]) => void; 
}) {
  const options = [
    { value: 'Roof Damage', label: 'Roof Damage' },
    { value: 'Water Damage', label: 'Water Damage' },
    { value: 'Fire Damage', label: 'Fire Damage' },
    { value: 'Storm Damage', label: 'Storm Damage' },
    { value: 'Structural', label: 'Structural' },
  ];
  
  return (
    <FilterDropdown
      label="Damage Type"
      options={options}
      selectedValues={selectedValues}
      onChange={onChange}
    />
  );
}

export function LocationFilter({ 
  selectedValues, 
  onChange 
}: { 
  selectedValues: string[]; 
  onChange: (values: string[]) => void; 
}) {
  const options = [
    { value: 'Exterior', label: 'Exterior' },
    { value: 'Interior', label: 'Interior' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Bathroom', label: 'Bathroom' },
    { value: 'Living Room', label: 'Living Room' },
    { value: 'Bedroom', label: 'Bedroom' },
  ];
  
  return (
    <FilterDropdown
      label="Location"
      options={options}
      selectedValues={selectedValues}
      onChange={onChange}
    />
  );
}

export function QualityFilter({ 
  selectedValues, 
  onChange 
}: { 
  selectedValues: string[]; 
  onChange: (values: string[]) => void; 
}) {
  const options = [
    { value: 'high', label: 'High Quality (80%+)' },
    { value: 'medium', label: 'Medium Quality (60-80%)' },
    { value: 'low', label: 'Low Quality (<60%)' },
  ];
  
  return (
    <FilterDropdown
      label="Quality"
      options={options}
      selectedValues={selectedValues}
      onChange={onChange}
    />
  );
}

