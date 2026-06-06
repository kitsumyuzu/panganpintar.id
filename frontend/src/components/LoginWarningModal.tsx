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
            setTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
            setTimeout(() => setShow(false), 300)
        }
    }, [isOpen])

    // Handle login button click
    const handleLoginClick = useCallback(() => {
        onClose()
        navigate(`/login?redirect=${location.pathname}`)
    }, [onClose, navigate, location.pathname])

    // Handle register button click
    const handleRegisterClick = useCallback(() => {
        onClose()
        navigate('/register')
    }, [onClose, navigate])

    if (!show) return null

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}`}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Lock Icon */}
                <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Lock size={36} className="text-yellow-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    Login Diperlukan
                </h2>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    {message || 'Anda harus login untuk mengakses halaman ini. Silakan login terlebih dahulu.'}
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleLoginClick}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-[#259d84] hover:bg-[#1f7a68] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                        <span>Login Sekarang</span>
                        <ArrowRight size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        Batal
                    </button>
                </div>

                {/* Register Link */}
                <p className="text-center mt-5 text-gray-500 dark:text-gray-400">
                    Belum punya akun?{' '}
                    <button 
                        onClick={handleRegisterClick}
                        className="text-[#259d84] hover:underline font-medium"
                    >
                        Daftar sekarang
                    </button>
                </p>
            </div>
        </div>
    )
}