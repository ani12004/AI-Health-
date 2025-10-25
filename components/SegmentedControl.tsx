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
      <div className="relative grid grid-cols-2 gap-1 rounded-lg bg-black/10 dark:bg-white/10 p-1">
        <div 
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md bg-white/80 dark:bg-black/20 shadow-md transition-transform duration-300 ease-in-out"
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
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
