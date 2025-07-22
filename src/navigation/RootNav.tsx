import { useAuthStore } from '@/store/auth/authStore'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthNav } from './AuthNav'
import { MainNav } from './MainNav'

export const RootNav = () => {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    // Handle navigation after authentication status changes
    // useEffect(() => {
    //     // Get the current pathname
    //     const currentPath = location.pathname;

    //     if (isAuthenticated) {
    //         // If user is authenticated and on an auth route (like /login), redirect to dashboard
    //         if (currentPath === '/login' || currentPath === '/' || currentPath === '') {
    //             console.log('Authenticated user on login route, redirecting to dashboard');
    //             navigate('/dashboard', { replace: true });
    //         }
    //     } else {
    //         // If user is not authenticated and trying to access a protected route, redirect to login
    //         if (currentPath === '/dashboard' || currentPath == '') {
    //             console.log('Unauthenticated user on protected route, redirecting to login');
    //             navigate('/login', { replace: true });
    //         }
    //     }
    // }, [isAuthenticated, location.pathname, navigate])

    return (
        <div className='vh-100 vw-100' >
            <Routes>
                {/* Auth routes (login/register) */}
                {!isAuthenticated && (
                    <Route path="/*" element={<AuthNav />} />
                )}

                {/* App routes (dashboard/profile/etc) */}
                {isAuthenticated && (
                    <Route path="/*" element={<MainNav />} />
                )}
            </Routes>
        </div>
    )
}
