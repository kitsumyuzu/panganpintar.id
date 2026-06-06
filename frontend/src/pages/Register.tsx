import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle, MapPin, Calendar } from 'lucide-react'

declare global {
    interface Window {
        grecaptcha?: {
            render: (container: string | HTMLElement, config: any) => string
            execute: (widgetId: string) => void
            reset: (widgetId: string) => void
            getResponse: (widgetId: string) => string
        }
        onRecaptchaLoad?: () => void
    }
}

export default function Register() {
    const navigate = useNavigate()
    const recaptchaRef = useRef<string | null>(null)
    const [formData, setFormData] = useState({
        namaLengkap: '',
        tanggal: '',
        bulan: '',
        tahun: '',
        province: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [provinces, setProvinces] = useState<string[]>([])
    const [loadingProvinces, setLoadingProvinces] = useState(true)
    const [captchaToken, setCaptchaToken] = useState('')

    const currentYear = new Date().getFullYear()
    const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - 79 + i).reverse()
    const MONTHS = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://firmanfadilah-pangan-pintar-api.hf.space/api/v1/provinces')
                if (res.ok) {
                    const data = await res.json()
                    if (Array.isArray(data)) {
                        setProvinces(data)
                    } else if (data.provinces) {
                        setProvinces(data.provinces)
                    } else if (data.data) {
                        setProvinces(data.data)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch provinces:', err)
                setProvinces([
                    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Bengkulu',
                    'Sumatera Selatan', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah',
                    'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Kalimantan Barat', 'Kalimantan Tengah',
                    'Kalimantan Selatan', 'Kalimantan Timur', 'Sulawesi Utara', 'Sulawesi Tengah',
                    'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Papua', 'Papua Barat'
                ])
            } finally {
                setLoadingProvinces(false)
            }
        }

        fetchProvinces()
    }, [])

    useEffect(() => {
        if (document.getElementById('google-recaptcha-script')) {
            initRecaptcha()
            return
        }

        window.onRecaptchaLoad = initRecaptcha

        const script = document.createElement('script')
        script.id = 'google-recaptcha-script'
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        function initRecaptcha() {
            if (window.grecaptcha && document.getElementById('recaptcha-container')) {
                try {
                    recaptchaRef.current = window.grecaptcha.render('recaptcha-container', {
                        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
                        theme: 'light',
                        callback: (token: string) => {
                            setCaptchaToken(token)
                        },
                        'expired-callback': () => {
                            setCaptchaToken('')
                        }
                    })
                } catch (err) {
                    console.error('reCAPTCHA render error:', err)
                }
            }
        }

        return () => {
            if (recaptchaRef.current && window.grecaptcha) {
                try {
                    window.grecaptcha.reset(recaptchaRef.current)
                } catch (e) { /* ignore */ }
            }
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        if (!formData.agreeTerms) {
            setError('Anda harus menyetujui syarat dan ketentuan')
            return
        }

        if (!captchaToken) {
            setError('Mohon centang reCAPTCHA')
            return
        }

        if (!formData.tanggal || !formData.bulan || !formData.tahun) {
            setError('Tanggal lahir harus diisi lengkap')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    namaLengkap: formData.namaLengkap,
                    tanggalLahir: `${formData.tahun}-${String(MONTHS.indexOf(formData.bulan) + 1).padStart(2, '0')}-${formData.tanggal.padStart(2, '0')}`,
                    province: formData.province,
                    phone: formData.phone,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    captchaToken: captchaToken
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            setSuccess('Pendaftaran berhasil! Silakan cek email untuk verifikasi.')
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getPasswordStrength = () => {
        if (formData.password.length === 0) return { strength: 0, text: '' }
        if (formData.password.length < 6) return { strength: 1, text: 'Lemah' }
        if (formData.password.length < 10) return { strength: 2, text: 'Sedang' }
        if (/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) {
            return { strength: 4, text: 'Kuat' }
        }
        return { strength: 3, text: 'Cukup' }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center px-4 py-24">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-[#259d84] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">P</span>
                        </div>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Buat Akun
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Daftar untuk memulai
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg text-sm flex items-center">
                            <CheckCircle size={18} className="mr-2" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Lengkap *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="namaLengkap"
                                    value={formData.namaLengkap}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                            </div>
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tanggal Lahir *
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        name="tanggal"
                                        value={formData.tanggal}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-2 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84] text-sm"
                                    >
                                        <option value="">Tgl</option>
                                        {DAYS.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select
                                        name="bulan"
                                        value={formData.bulan}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84] text-sm"
                                    >
                                        <option value="">Bulan</option>
                                        {MONTHS.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select
                                        name="tahun"
                                        value={formData.tahun}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84] text-sm"
                                    >
                                        <option value="">Thn</option>
                                        {YEARS.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Provinsi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Provincia Asal *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingProvinces}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                >
                                    <option value="">{loadingProvinces ? 'Memuat...' : 'Pilih Provinces'}</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nomor Handphone *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+6281234567890"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="johndoe"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded ${
                                                    i <= passwordStrength.strength
                                                        ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                                                        : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        passwordStrength.strength <= 1 ? 'text-red-500' :
                                        passwordStrength.strength <= 2 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                        {passwordStrength.text}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Konfirmasi Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                />
                            </div>
                        </div>

                        {/* Google reCAPTCHA */}
                        <div className="flex justify-center py-2">
                            <div id="recaptcha-container"></div>
                        </div>

                        {/* Agree Terms */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                id="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#259d84] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded focus:ring-[#259d84]"
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-gray-600 dark:text-gray-400">
                                Saya menyetujui{' '}
                                <Link to="/terms" className="text-[#259d84] hover:underline">
                                    Syarat dan Ketentuan
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !captchaToken}
                            className="w-full flex items-center justify-center px-8 py-3 bg-[#259d84] hover:bg-[#1f7a68] disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors"
                        >
                            {loading ? (
                                <span className="animate-pulse">Memuat...</span>
                            ) : (
                                <>
                                    Daftar
                                    <ArrowRight size={20} className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-[#259d84] hover:underline font-medium">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}