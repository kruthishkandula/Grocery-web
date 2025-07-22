import { login as loginApi, } from "@/api/nodeApi/Auth/api"; // Adjust the import path as necessary
import { AuthStore, useAuthStore } from "@/store/auth/authStore";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    userDetails: AuthStore['userDetails'] | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    // register: (username: string, password: string, email: string, phonenumber: string) => Promise<boolean>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<boolean>;
    register: (username: string, password: string, email: string, phonenumber: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, setUserLoggedIn, userDetails, setUserDetails } = useAuthStore();

    useEffect(() => {
        (async () => {
            const storedToken = await localStorage.getItem('token');
            const storedUser = await localStorage.getItem('user');
            const sessionExpiry = await localStorage.getItem('sessionExpiry');

            // Check if session is expired
            if (sessionExpiry) {
                const expiryTime = new Date(sessionExpiry).getTime();
                if (Date.now() > expiryTime) {
                    // Session expired, perform logout
                    logout();
                    setLoading(false);
                    return;
                }

                // Set up expiry timer
                const timeUntilExpiry = expiryTime - Date.now();
                if (timeUntilExpiry > 0) {
                    setTimeout(() => {
                        logout();
                        // You might want to show a notification here
                    }, timeUntilExpiry);
                }
            }

            if (storedUser && storedToken) {
                setUserDetails(JSON.parse(storedUser));
                setUserLoggedIn(true);
            }
            setLoading(false);
        })();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await loginApi({ username, password });
            console.log('res------', res)
            if (res?.token) {
                // First update the local storage
                await localStorage.setItem('token', res.token);
                await localStorage.setItem('user', JSON.stringify(res.user));

                // Store CSRF token if available
                if (res.csrfToken) {
                    await window.localStorage.setItem('csrfToken', res.csrfToken);
                }

                // Store session expiry if available
                if (res.expiresAt) {
                    await localStorage.setItem('sessionExpiry', res.expiresAt);
                }

                // Update state
                setUserDetails({
                    currencyCode: "INR",
                    currencySymbol: "₹",
                    language: "en",
                    ...res?.user
                });

                // Set authenticated flag last to ensure all data is ready
                setUserLoggedIn(true);

                // Set up session expiry check
                const expiryTime = res.expiresAt ? new Date(res.expiresAt).getTime() : null;
                if (expiryTime) {
                    const timeUntilExpiry = expiryTime - Date.now();
                    if (timeUntilExpiry > 0) {
                        setTimeout(() => {
                            logout();
                            // You might want to show a notification here
                        }, timeUntilExpiry);
                    }
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (username: string, password: string, email: string, phonenumber: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, phonenumber })
            });
            if (!res.ok) {
                throw new Error('Registration failed');
            }
            const data = await res.json();
            if (data?.token) {
                // Store token and user details in local storage
                await localStorage.setItem('token', data.token);
                await localStorage.setItem('user', JSON.stringify(data.user));
                setUserDetails({
                    currencyCode: "INR",
                    currencySymbol: "₹",
                    language: "en",
                    ...data?.user
                });

                const expiryTime = data.expiresAt ? new Date(data.expiresAt).getTime() : null;
                if (expiryTime) {
                    const timeUntilExpiry = expiryTime - Date.now();
                    if (timeUntilExpiry > 0) {
                        setTimeout(() => {
                            logout();
                        }, timeUntilExpiry);
                    }
                }

                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const forgotPassword = async (email: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                throw new Error('Forgot password failed');
            }
            const data = await res.json();
            if (data?.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Forgot password error:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Make API call to logout
            const token = await localStorage.getItem('token');
            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage and state
            await localStorage.removeItem('token');
            await localStorage.removeItem('user');
            setUserLoggedIn(false);
            setTimeout(() => {
                setUserDetails(null);
            }, 100);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userDetails,
                login,
                logout,
                loading,
                forgotPassword,
                register
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};