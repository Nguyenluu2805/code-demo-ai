import React from 'react';
import { CheckIcon, CloseIcon, SparklesIcon } from './Icons';

export interface ToastProps {
  message: { text: string; type: 'success' | 'info' | 'error' } | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-medium backdrop-blur-md ${
          message.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10'
            : message.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-500/10'
            : 'bg-zinc-900/90 border-indigo-500/40 text-zinc-200 shadow-indigo-500/10'
        }`}
      >
        {message.type === 'success' && <CheckIcon className="w-4 h-4 text-emerald-400" />}
        {message.type === 'error' && <CloseIcon className="w-4 h-4 text-rose-400" />}
        {message.type === 'info' && <SparklesIcon className="w-4 h-4 text-indigo-400" />}
        <span>{message.text}</span>
      </div>
    </div>
  );
};
