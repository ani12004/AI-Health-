import React from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="group relative flex items-center ml-2">
      <Info className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs scale-0 transform rounded-md bg-gray-800 dark:bg-black p-2 text-xs font-medium text-white dark:text-gray-200 shadow-lg transition-all duration-200 ease-in-out group-hover:scale-100 z-10">
        {text}
      </span>
    </div>
  );
};
