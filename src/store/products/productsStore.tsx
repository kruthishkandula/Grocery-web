import { Product } from '@/api/cmsApi/types';
import { create, } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export interface ProductsStore {
    products: Product;
    setProductsdata: (products: Product) => void;
}

export const useProductsStore = create<ProductsStore>()(persist((set) => ({
    products: {} as Product,
    setProductsdata: (products) => set({ products })
}),
    {
        name: 'products-storage', 
        storage: createJSONStorage(() => window.localStorage),

    }
));