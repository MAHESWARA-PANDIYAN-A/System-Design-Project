import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm transition-all duration-200 ${
        hover ? 'hover:border-indigo-500/40 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
