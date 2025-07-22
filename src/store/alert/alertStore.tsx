// store/alertStore.js
import { IconNames } from '@/components/molecule/Icon';
import { _randmomString } from '@/utility/utility';
import { create } from 'zustand';

export type AlertType = {
    id?: string;
    title?: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number | 'none'; // Optional duration for auto-dismiss
    alignment?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'bottomCenter' | 'topCenter';
    icon?: IconNames;
    close?: boolean;
};

export interface AlertStore {
    alerts: AlertType[];
    addAlert: (alert: AlertType) => void;
    removeAlert: (id?: string) => void;
    clearAlerts: () => void;
}

const useAlertStore = create<AlertStore>()((set: any) => ({
    alerts: [],
    addAlert: (alert: any) => set((state: any) => ({ alerts: [...state.alerts, {...alert, id: _randmomString()}] })),
    removeAlert: (id: any) => set((state: any) => ({
        alerts: state.alerts.filter((alert: any) => alert.id !== id)
    })),
    clearAlerts: () => set({
        alerts: []
    }),
}));

export default useAlertStore;