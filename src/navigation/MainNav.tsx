import Dashboard from '@/pages/Dashboard'
import Orders from '@/pages/Orders'
import { NotFound } from '@/pages/Others/NotFound'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/Products/ProductDetail'
import Categories from '@/pages/Categories'
import CategoryDetail from '@/pages/Categories/CategoryDetail'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const MainNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Handle direct access to /login when authenticated
    useEffect(() => {
        if (location.pathname === '/login') {
            console.log('Authenticated user on /login, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [location.pathname, navigate]);
    
    return (
        <Routes >
            {/* Redirect / to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Authenticated routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Handle /login path when authenticated - redirect to dashboard */}
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />

            {/* Default redirect for unknown protected routes */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
