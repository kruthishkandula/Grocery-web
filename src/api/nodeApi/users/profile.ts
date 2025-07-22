import { useQuery } from '@tanstack/react-query';
import nodeApi from '..';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

const fetchUserProfile = async () => {
    // Get CSRF token from localStorage
    const csrfToken = localStorage.getItem('csrfToken');
    
    // Get CSRF token from cookie as fallback
    let csrfCookie = '';
    if (!csrfToken) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('XSRF-TOKEN=')) {
                csrfCookie = cookie.substring('XSRF-TOKEN='.length);
                break;
            }
        }
    }
    
    // Use headers to ensure CSRF token is included
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
        console.log('Using localStorage CSRF token for profile request');
    } else if (csrfCookie) {
        headers['X-CSRF-TOKEN'] = csrfCookie;
        console.log('Using cookie CSRF token for profile request');
    } else {
        console.warn('No CSRF token available for profile request');
    }
    
    const response = await nodeApi.post('/users/profile', {}, { headers });
    return response.data.result as UserProfile;
};

export const useUserProfile = () => {
    return useQuery<UserProfile>({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        retry: 1, // Limit retries on failure
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
    });
};
