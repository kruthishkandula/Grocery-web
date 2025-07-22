import nodeApi from '..';


// Login
export const login = async ({
    username,
    password,
}: { username: string; password: string }) => {
    try {
        // Login request is exempt from CSRF protection
        // Make sure not to include any CSRF token for the login request
        const res = await nodeApi.post(
            `/auth/login`,
            { username, password },
            {
                headers: { 
                    'Content-Type': 'application/json',
                    // Remove any existing CSRF token to prevent conflicts
                    'X-CSRF-TOKEN': undefined 
                },
                withCredentials: true, // Important for cookies
            }
        );
        
        // If login is successful, store the CSRF token
        if (res.data?.csrfToken) {
            localStorage.setItem('csrfToken', res.data.csrfToken);
            // Also store the token in a session cookie as fallback
            document.cookie = `XSRF-TOKEN=${res.data.csrfToken}; path=/; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
            console.log('CSRF token received and stored in localStorage and cookie');
        }
        
        return res.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

// Register
export const register = async ({
    username,
    password,
    email,
    phonenumber,
    role,
}: {
    username: string;
    password: string;
    email: string;
    phonenumber: string;
    role: string;
}) => {
    const res = await nodeApi.post(
        `/api/auth/register`,
        { username, password, email, phonenumber, role },
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
    );
    return res.data;
};