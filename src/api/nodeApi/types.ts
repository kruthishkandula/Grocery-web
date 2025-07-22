export interface Product {
    id: number;
    name: string;
    documentId: string;
    is_active: boolean;
    description: string;
    short_description: string;
    base_price: number;
    discount_price: number;
    cost_price: number;
    weight_unit: string;
    currency: string;
    currency_symbol: string;
    image: {
        url: string;
        thumbnail_url?: string;
    };
    slug?: string | null;
    category_id?: {
        id: number;
        name: string;
    } | number;
    brand?: string | null;
    barcode?: string | null;
    variants?: any[];
}

export interface Category {
    id: number;
    name: string;
    documentId: string;
    description: string;
    slug?: string | null;
    isActive: boolean;
    displayOrder: number;
    imageUrl: string;
    imageThumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardData {
    status: string;
    message: string;
    result: {
        user_count: number;
        orders_count: number;
        products_count: number;
        categories_count: number;
        active_products_count: number;
        active_categories_count: number;
        data: {
            few_products: Product[];
            few_categories: Category[];
        };
    }
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    result: T;
}
