import { useState, useCallback } from 'react';

export interface ToastMessage {
  text: string;
  type: 'success' | 'info' | 'error';
}

export function useToast() {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success', duration = 3500) => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  return { toastMessage, showToast };
}
