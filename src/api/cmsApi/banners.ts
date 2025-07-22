import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cmsApi } from '.';
import { Banner, CMSResponse } from './types';

interface BannerFilters {
    page?: number;
    pageSize?: number;
    active?: boolean;
}

interface BannerPayload {
    title: string;
    description: string;
    image: string;
    link: string;
    active: boolean;
}

const getBanners = async (filters?: BannerFilters) => {
    const response = await cmsApi.get<CMSResponse<Banner[]>>('/banners', {
        params: filters,
    });
    return response.data;
};

const getBanner = async (id: number) => {
    const response = await cmsApi.get<CMSResponse<Banner>>(`/banners/${id}`);
    return response.data;
};

const createBanner = async (payload: BannerPayload) => {
    const response = await cmsApi.post<CMSResponse<Banner>>('/banners', {
        data: payload
    });
    return response.data;
};

const updateBanner = async ({ id, payload }: { id: number; payload: Partial<BannerPayload> }) => {
    const response = await cmsApi.put<CMSResponse<Banner>>(`/banners/${id}`, {
        data: payload
    });
    return response.data;
};

const deleteBanner = async (id: number) => {
    const response = await cmsApi.delete<CMSResponse<Banner>>(`/banners/${id}`);
    return response.data;
};

export const useBanners = (filters?: BannerFilters) => {
    return useQuery({
        queryKey: ['banners', filters],
        queryFn: () => getBanners(filters),
    });
};

export const useBanner = (id: number) => {
    return useQuery({
        queryKey: ['banners', id],
        queryFn: () => getBanner(id),
        enabled: !!id,
    });
};

export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBanner,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            queryClient.invalidateQueries({ queryKey: ['banners', variables.id] });
        },
    });
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
};
