import { Order } from '@/api/cmsApi/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface OrdersStore {
    orders: Order[];
    setOrdersdata: (orders: Order[]) => void;
}

export const useOrdersStore = create<OrdersStore>()(persist((set) => ({
    orders: [],
    setOrdersdata: (orders) => set({ orders })
}),
    {
        name: 'orders-storage',
        storage: createJSONStorage(() => window.localStorage),

    }
));