import React from 'react';
import { Field } from 'formik';
import type { LucideProps } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  tooltipText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  icon: Icon,
  tooltipText,
}) => (
  <div>
    <div className="flex items-center mb-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      {tooltipText && <Tooltip text={tooltipText} />}
    </div>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-400" aria-hidden="true" />
      </div>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="block w-full rounded-lg border-transparent bg-slate-200/60 dark:bg-slate-900/40 py-3 pl-10 pr-3 text-gray-800 dark:text-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-health-buddy-blue/80 focus:shadow-glow-blue"
      />
    </div>
  </div>
);