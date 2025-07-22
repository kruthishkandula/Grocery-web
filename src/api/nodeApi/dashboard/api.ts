import { useQuery } from '@tanstack/react-query';
import nodeApi from '..';
import { DashboardData } from '../types';

const getDashboardData = async () => {
    const response = await nodeApi.get<DashboardData>('/admin/dashboard');
    console.log('response----', response)
    return response.data;
};

export const useDashboardData = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
    });
};
