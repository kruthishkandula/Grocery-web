import { create, } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export interface AuthStore {
    isAuthenticated: boolean;
    userRole: "admin" | "user" | "guest"; // Default role 'guest'
    userDetails?: {
        id?: number;
        user_id?: string;
        email?: string;
        username?: string;
        phonenumber?: string;
        profile_image?: string | null;
        createdAt?: string;
        role?: "admin" | "user" | "guest";
        status?: "active" | "inactive";
        currencyCode?: string;
        currencySymbol?: string;
        language?: string;
        [key: string]: any; // Allow additional properties
    };
    setUserDetails: (details: any) => void;
    setUserLoggedIn: (loggedIn: boolean) => void;

    metadata: {
        requestId?: string;
        firebasetoken?: string;
        countryOpco?: string;
        language?: string;
    };
    setMetadata: (metadata: any) => void;
}

export const useAuthStore = create<AuthStore>()(persist((set) => ({
    isAuthenticated: false,
    userRole: 'guest', // Default role ( guest Or admin)
    userDetails: undefined,
    setUserDetails: (details) => set({ userDetails: details }),
    setUserLoggedIn: (loggedIn) => set({ isAuthenticated: loggedIn }),
    metadata: {},
    setMetadata: (metadata) => set({ metadata })
}),
    {
        name: 'auth-storage', // storage key
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used

    }
));