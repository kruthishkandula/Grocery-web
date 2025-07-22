import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { CMSResponse, Category } from './types';
import nodeApi from '../nodeApi';

// Update the interface to match the expected filters
export interface CategoryFilters {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchValue?: string;
    isActive?: boolean;
}

export interface CategoryPayload {
    name: string;
    description?: string;
    isActive?: boolean;
    displayOrder?: number;
    imageUrl?: string;
    imageThumbnailUrl?: string;
}

const getCategories = async (filters?: CategoryFilters) => {
    // Set default values if not provided
    const requestBody = {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        sortBy: filters?.sortBy || "displayOrder",
        sortOrder: filters?.sortOrder || "asc",
        searchValue: filters?.searchValue || "",
        isActive: filters?.isActive
    };
    
    try {
        // Make sure we're passing the filter values in the request body
        const response = await nodeApi.post<{ data: Category[], meta: any }>('/categories/list', requestBody);

        // Handle the API response structure
        return {
            data: response.data.data || [],
            meta: response.data.meta
        };
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        // If this is a 401 error, handle it differently
        if (error?.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API token.');
        }
        throw error;
    }
};

const getCategory = async (id: number) => {
    try {
        const response = await nodeApi.post<Category>(`/categories/detail`, {
            id: id
        });

        // Handle the API response structure
        return {
            data: response.data,
            meta: response.data
        };
    } catch (error: any) {
        console.error(`Error fetching category ${id}:`, error);
        // If this is a 401 error, handle it differently
        if (error?.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API token.');
        }
        throw error;
    }
};

const createCategory = async (payload: CategoryPayload) => {
    try {
        // Make sure we're using the correct field names
        const requestPayload = {
            name: payload.name,
            description: payload.description || '',
            isActive: payload.isActive !== undefined ? payload.isActive : true,
            displayOrder: payload.displayOrder || 0,
            imageUrl: payload.imageUrl || null,
            imageThumbnailUrl: payload.imageThumbnailUrl || null
        };
        
        const response = await nodeApi.post<CMSResponse<Category>>('/categories/create', requestPayload);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const updateCategory = async ({ id, payload }: { id: number; payload: Partial<CategoryPayload> }) => {
    try {
        // Make sure we're using the correct field names and include the ID
        const requestPayload = {
            id,
            ...payload
        };
        
        // Fix the URL - remove the extra } character
        const response = await nodeApi.post<CMSResponse<Category>>(`/categories/update`, requestPayload);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

const deleteCategory = async (id: number) => {
    try {
        const response = await nodeApi.post<CMSResponse<Category>>(`/categories/delete`, {
            id
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

export const useCategories = (filters?: CategoryFilters, options?: Partial<UseQueryOptions>) => {
    return useQuery({
        queryKey: ['categories', filters],
        queryFn: () => getCategories(filters),
        retry: (failureCount, error: any) => {
            // Don't retry on authentication errors
            if (error?.response?.status === 401) {
                return false;
            }
            // Retry other errors up to 3 times
            return failureCount < 3;
        },
        // Apply any additional options
        // ...options
    });
};

export const useCategory = (id: number) => {
    return useQuery({
        queryKey: ['categories', id],
        queryFn: () => getCategory(id),
        enabled: !!id,
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

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};
