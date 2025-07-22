import ForgotPassword from '@/pages/Auth/ForgotPassword'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import { ThemeScreen } from '@/pages/Orders/ThemeScreen'
import PrivacyPolicy from '@/pages/Others/PrivacyPolicy'
import TermsAndConditions from '@/pages/Others/TermsAndConditions'
import { Navigate, Route, Routes } from 'react-router-dom'

export const AuthNav = () => {
    return (
        <Routes>
            {/* Redirect / to /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/theme" element={<ThemeScreen />} />

            {/* Default redirect for unknown unauthenticated routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
