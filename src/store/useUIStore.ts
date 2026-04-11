import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface UIState {
    toastVisible: boolean;
    toastMessage: string;
    toastType: ToastType;
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
}

export const useUIStore = create<UIState>(set => ({
    toastVisible: false,
    toastMessage: '',
    toastType: 'success',
    showToast: (message, type = 'success') => {
        set({ toastVisible: true, toastMessage: message, toastType: type });
    },
    hideToast: () => {
        set({ toastVisible: false });
    },
}));
