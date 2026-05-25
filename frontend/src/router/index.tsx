import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import LandingPage from '@/pages/landing/index'
import AffiliatePage from '@/pages/landing/affiliate/index'
import SmartBudgetPage from '@/pages/landing/smartBudgeting/index'
import SmartBudgetSession from '@/pages/landing/smartBudgeting/smartbudgeting'
import AboutPage from '@/pages/landing/about'

import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ForgotPasswordPage from '@/pages/auth/forgotPassword'
import ResetPasswordPage from '@/pages/auth/resetPassword'

import AdminLayout from '@/layouts/AdminLayout'
import DashboardPage from '@/pages/admin/index'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index path={'/'} element={<LandingPage />} />
                    <Route path={'/affiliate'} element={<AffiliatePage />} />
                    <Route path={'/smart-budget'} element={<SmartBudgetPage />} />
                    <Route path={'/smart-budget/session'} element={<SmartBudgetSession />} />
                    <Route path={'/about'} element={<AboutPage />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path={'/login'} element={<LoginPage />} />
                    <Route path={'/register'} element={<RegisterPage />} />
                    <Route path={'/forgot-password'} element={<ForgotPasswordPage />} />
                    <Route path={'/reset-password'} element={<ResetPasswordPage />} />
                </Route>

                <Route element={<AdminLayout />}>
                    <Route path={'/admin'}>
                        <Route index element={<DashboardPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}