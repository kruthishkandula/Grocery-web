import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import nodeApi from '../nodeApi';
import { CMSResponse, Product } from './types';

interface ProductFilters {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchValue?: string;
    priceMin?: number | undefined;
    priceMax?: number | undefined;
    categoryId?: number | undefined;
    isActive?: boolean | undefined;
}

interface ProductImagePayload {
    url: string;
    thumbnailUrl?: string;
}

interface ProductVariantPayload {
    name: string;
    sku: string;
    price: number;
    discountPrice: number;
    stockQuantity: number;
    weight: number;
    weightUnit: string;
    isDefault: boolean;
    isActive: boolean;
}
interface ProductPayload {
    name: string;
    description: string;
    shortDescription: string;
    basePrice: number;
    discountPrice: number;
    costPrice: number;
    images: ProductImagePayload[];
    weightUnit: string;
    brand: string;
    category?: {
        id: number;
        name: string;
        isActive: boolean;
    }
    categoryId: number;
    currency: string;
    currencySymbol: string;
    isActive: boolean;
    variants?: ProductVariantPayload[];
}

const getProducts = async (filters?: ProductFilters) => {
    try {
        // Use the provided filters in the API request
        const response = await nodeApi.post<{ data: Product[], meta: any }>('/products/list', {
            page: filters?.page || 1,
            pageSize: filters?.pageSize || 10,
            sortBy: filters?.sortBy || "updatedAt",
            sortOrder: filters?.sortOrder || "desc",
            searchValue: filters?.searchValue || "",
            priceMin: filters?.priceMin,
            priceMax: filters?.priceMax,
            categoryId: filters?.categoryId,
            isActive: filters?.isActive
        });

        // Handle the API response structure
        return {
            data: response.data.data || [],
            meta: response.data.meta
        };
    } catch (error: any) {
        console.error('Error fetching products:', error);
        // If this is a 401 error, handle it differently
        if (error?.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API token.');
        }
        throw error;
    }
};

const getProduct = async (id: number) => {
    try {
        const response = await nodeApi.post<Product>(`/products/detail`, {
            id: id
        });

        // Handle the API response structure
        return {
            data: response.data,
            meta: response.data
        };
    } catch (error: any) {
        console.error(`Error fetching product ${id}:`, error);
        // If this is a 401 error, handle it differently
        if (error?.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API token.');
        }
        throw error;
    }
};

const createProduct = async (payload: ProductPayload) => {
    try {
        const response = await nodeApi.post<CMSResponse<Product>>('/products/create', {
            "name": payload.name,
            "shortDescription": payload.shortDescription || "",
            "description": payload.description,
            "basePrice": parseFloat(payload?.basePrice?.toString()),
            "discountPrice": parseFloat(payload?.discountPrice?.toString()),
            "costPrice": parseFloat(payload?.costPrice?.toString()),
            "weightUnit": payload.weightUnit,
            "isActive": payload.isActive || true,
            "currency": payload.currency || "INR",
            "currencySymbol": payload.currencySymbol || "₹",
            "brand": payload.brand || "",
            "categoryId": payload.categoryId,
            "images": payload.images,
            "variants": payload.variants || []
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

const updateProduct = async ({ id, payload }: { id: number; payload: Partial<ProductPayload> }) => {
    try {
        const response = await nodeApi.post<CMSResponse<Product>>(`/products/update`, {
            "id": id,
            "name": payload.name,
            "shortDescription": payload.shortDescription || "",
            "description": payload.description,
            "weightUnit": payload.weightUnit,
            "isActive": payload.isActive || true,
            "currency": payload.currency || "INR",
            "currencySymbol": payload.currencySymbol || "₹",
            "brand": payload.brand || "",
            "categoryId": payload.categoryId,
            "images": payload.images,
            "variants": payload.variants || [],
            ...(payload.basePrice !== undefined && { "basePrice": parseFloat(payload.basePrice.toString()) }),
            ...(payload.discountPrice !== undefined && { "discountPrice": parseFloat(payload.discountPrice.toString()) }),
            ...(payload.costPrice !== undefined && { "costPrice": parseFloat(payload.costPrice.toString()) }),
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        throw error;
    }
};

const deleteProduct = async (id: number) => {
    try {
        const response = await nodeApi.post<CMSResponse<Product>>(`/products/delete`, {
            id
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        throw error;
    }
};

export const useProducts = (filters?: ProductFilters) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => getProducts(filters),
        retry: (failureCount, error: any) => {
            // Don't retry on authentication errors
            if (error?.response?.status === 401) {
                return false;
            }
            // Retry other errors up to 3 times
            return failureCount < 3;
        },
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => getProduct(id),
        enabled: !!id,
        retry: (failureCount, error: any) => {
            // Don't retry on authentication errors
            if (error?.response?.status === 401) {
                return false;
            }
            // Retry other errors up to 2 times
            return failureCount < 2;
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
