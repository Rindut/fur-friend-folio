
import React, { ReactElement } from 'react';
import { Droplets, Pill, Weight, AlertCircle } from 'lucide-react';

export type RecordType = 'vaccination' | 'medication' | 'weight' | 'visit';

export const useRecordUtils = () => {
  const getRecordIcon = (type: RecordType): ReactElement => {
    switch (type) {
      case 'vaccination':
        return React.createElement(Droplets, { className: "w-4 h-4" });
      case 'medication':
        return React.createElement(Pill, { className: "w-4 h-4" });
      case 'weight':
        return React.createElement(Weight, { className: "w-4 h-4" });
      case 'visit':
        return React.createElement(AlertCircle, { className: "w-4 h-4" });
    }
  };
  
  const getRecordTypeColor = (type: RecordType): string => {
    switch (type) {
      case 'vaccination':
        return 'bg-lavender/20 text-lavender';
      case 'medication':
        return 'bg-coral/20 text-coral';
      case 'weight':
        return 'bg-sage/20 text-sage';
      case 'visit':
        return 'bg-blue-400/20 text-blue-500';
    }
  };

  return {
    getRecordIcon,
    getRecordTypeColor
  };
};
