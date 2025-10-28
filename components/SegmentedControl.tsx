import React from 'react';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  selectedValue: T;
  onChange: (value: T) => void;
  label: string;
}

export const SegmentedControl = <T extends string>({
  options,
  selectedValue,
  onChange,
  label,
}: SegmentedControlProps<T>) => {
  const selectedIndex = options.findIndex(opt => opt.value === selectedValue);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative grid grid-cols-2 gap-1 rounded-lg bg-slate-200/60 dark:bg-slate-900/40 p-1">
        <div 
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md bg-white dark:bg-slate-700 shadow-md transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${selectedIndex * 100}%)` }}
          aria-hidden="true"
        />
        {options.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-health-buddy-blue focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              selectedValue === value
                ? 'text-health-buddy-blue'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
            aria-pressed={selectedValue === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};