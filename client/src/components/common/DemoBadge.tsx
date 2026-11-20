import React from 'react';

export const DemoBadge: React.FC<{ label?: string; className?: string }> = ({
  label = 'DEMO / SYNTHETIC DATA',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
      title="This record is synthetic and for demonstration only."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
      {label}
    </span>
  );
};
