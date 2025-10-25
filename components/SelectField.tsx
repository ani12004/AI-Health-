import React from 'react';
import { Field } from 'formik';
import type { LucideProps } from 'lucide-react';

interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  icon: Icon,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        className="block w-full appearance-none rounded-lg border-transparent bg-black/10 dark:bg-white/10 py-3 pl-10 pr-10 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-white dark:bg-gray-800">
            {option}
          </option>
        ))}
      </Field>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);
