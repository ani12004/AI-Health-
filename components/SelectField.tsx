
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
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        className="block w-full appearance-none rounded-lg border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-gray-800 shadow-sm transition-colors duration-300 focus:border-ios-blue focus:bg-white focus:ring-2 focus:ring-ios-blue focus:shadow-ios-focus"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Field>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
