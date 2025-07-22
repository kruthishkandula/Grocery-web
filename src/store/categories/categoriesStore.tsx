import { Product } from '@/api/cmsApi/types';
import { create, } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export interface CategoriesStore {
    categories: Product;
    setCategoriesdata: (categories: Product) => void;
}

export const useCategoriesStore = create<CategoriesStore>()(persist((set) => ({
    categories: {} as Product,
    setCategoriesdata: (categories) => set({ categories })
}),
    {
        name: 'categories-storage',
        storage: createJSONStorage(() => window.localStorage),

    }
));