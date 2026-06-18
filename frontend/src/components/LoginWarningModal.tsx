import { useCallback, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { X, Lock, ArrowRight } from 'lucide-react'

interface LoginWarningModalProps {
    isOpen: boolean
    onClose: () => void
    message?: string
}

export default function LoginWarningModal({ isOpen, onClose, message }: LoginWarningModalProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Handle visibility with animation
    useEffect(() => {
        if (isOpen) {
            setShow(true)
            const openTimeout = setTimeout(() => setIsVisible(true), 10)
            return () => clearTimeout(openTimeout)
        } else {
            setIsVisible(false)
            const closeTimeout = setTimeout(() => setShow(false), 300)
            return () => clearTimeout(closeTimeout)
        }
    }, [isOpen])

    // Handle login button click
    const handleLoginClick = useCallback(() => {
        onClose()
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
    }, [onClose, navigate, location.pathname])

    // Handle register button click
    const handleRegisterClick = useCallback(() => {
        onClose()
        navigate('/register')
    }, [onClose, navigate])

    if (!show) return null

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                className={`relative bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all duration-300 ${
                    isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Tutup"
                >
                    <X size={18} />
                </button>

                {/* Lock Icon */}
                <div className="w-16 h-16 mx-auto mb-5 bg-[#259d84]/10 dark:bg-[#259d84]/20 rounded-full flex items-center justify-center border border-[#259d84]/20">
                    <Lock size={28} className="text-[#259d84]" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2 tracking-tight">
                    Login Diperlukan
                </h2>

                {/* Message */}
                <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm leading-relaxed">
                    {message || 'Anda harus login untuk mengakses halaman ini. Silakan login terlebih dahulu.'}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleLoginClick}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-[#259d84] hover:bg-[#1f7a68] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#259d84]/20"
                    >
                        <span>Login Sekarang</span>
                        <ArrowRight size={18} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm"
                    >
                        Batal
                    </button>
                </div>

                {/* Register Link Footer */}
                <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Belum punya akun?{' '}
                    <button 
                        onClick={handleRegisterClick}
                        className="text-[#259d84] hover:text-[#1f7a68] hover:underline font-bold transition-colors"
                    >
                        Daftar sekarang
                    </button>
                </p>
            </div>
        </div>
    )
}