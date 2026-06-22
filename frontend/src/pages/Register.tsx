import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle, MapPin, Calendar } from 'lucide-react'

declare global {
    interface Window {
        grecaptcha?: {
            render: (container: string | HTMLElement, config: Record<string, unknown>) => string
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
                } catch {
                    // ...
                }
            }
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type } = e.target
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            const value = e.target.value
            setFormData(prev => ({ ...prev, [name]: value }))
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Terjadi kesalahan yang tidak diketahui')
            }
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-24 selection:bg-emerald-500/20 selection:text-emerald-600">
            <div className="w-full max-w-md md:max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
                            <span className="text-white font-black text-2xl tracking-tighter">P</span>
                        </div>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm shadow-slate-100/40 dark:shadow-none">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Buat Akun
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm font-medium">
                        Daftar untuk memulai
                    </p>

                    {error && (
                        <div className="mb-5 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-fade-in">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 p-4 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium flex items-center">
                            <CheckCircle size={18} className="mr-2 shrink-0 text-green-600 dark:text-green-400" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Nama Lengkap *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="text"
                                    name="namaLengkap"
                                    value={formData.namaLengkap}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Tanggal Lahir *
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                                    <select
                                        name="tanggal"
                                        value={formData.tanggal}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-9 pr-2 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm appearance-none"
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
                                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm appearance-none"
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
                                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm appearance-none"
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
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Provinsi Asal *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingProvinces}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none disabled:opacity-60"
                                >
                                    <option value="">{loadingProvinces ? 'Memuat...' : 'Pilih Provinsi'}</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Nomor Handphone *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+6281234567890"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="johndoe"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {formData.password && (
                                <div className="mt-2.5 animate-fade-in">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                                    i <= passwordStrength.strength
                                                        ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                                                        : 'bg-slate-200 dark:bg-slate-800'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1.5 font-semibold ${
                                        passwordStrength.strength <= 1 ? 'text-red-500' :
                                        passwordStrength.strength <= 2 ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                        {passwordStrength.text}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Konfirmasi Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Google reCAPTCHA */}
                        <div className="flex justify-center py-2">
                            <div id="recaptcha-container" className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"></div>
                        </div>

                        {/* Agree Terms */}
                        <div className="flex items-center space-x-2.5 py-1">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                id="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="w-4 h-4 text-emerald-600 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded focus:ring-emerald-500/20 focus:ring-offset-0 dark:checked:bg-emerald-500 dark:checked:border-emerald-500 transition-colors"
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-400 font-medium select-none">
                                Saya menyetujui{' '}
                                <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors">
                                    Syarat dan Ketentuan
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !captchaToken}
                            className="w-full flex items-center justify-center px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md shadow-emerald-500/5 transition-all duration-200 transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="animate-pulse">Memuat...</span>
                            ) : (
                                <>
                                    Daftar
                                    <ArrowRight size={18} className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}