import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastItem = {
  id: string;
  content: string;
  error?: boolean;
  duration?: number; // milliseconds
};

type ModalState = {
  isOpen: boolean;
  title?: string;
  view?: string;
  data?: any;
};

type UIContextValue = {
  toasts: ToastItem[];
  showToast: (content: string, options?: Partial<ToastItem>) => string;
  removeToast: (id: string) => void;
  modal: ModalState;
  openModal: (payload: Partial<ModalState>) => void;
  closeModal: () => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

function uid() {
  return crypto.randomUUID();
}

export const ManagedUIContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalState>({ isOpen: false });

  const showToast = useCallback((content: string, options: Partial<ToastItem> = {}) => {
    const id = options.id || uid();
    const toast: ToastItem = {
      id,
      content,
      error: options.error || false,
      duration: options.duration ?? 4000,
    };
    setToasts((s) => [...s, toast]);

    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id));
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const openModal = useCallback((payload: Partial<ModalState>) => {
    setModal({ isOpen: true, ...payload });
  }, []);

  const closeModal = useCallback(() => setModal({ isOpen: false }), []);

  const value = useMemo(
    () => ({ toasts, showToast, removeToast, modal, openModal, closeModal }),
    [toasts, showToast, removeToast, modal, openModal, closeModal]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within ManagedUIContext");
  return ctx;
}

export default ManagedUIContext;
