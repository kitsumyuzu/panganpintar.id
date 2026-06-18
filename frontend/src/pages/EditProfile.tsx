import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Upload, ArrowLeft, User } from 'lucide-react'
import { getProfile, updateProfile, uploadAvatar } from '@/services/profileApi'
import type { ProfileData } from '@/services/profileApi'

export default function EditProfile() {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [formState, setFormState] = useState({
        username: '',
        namaLengkap: '',
        tanggalLahir: '',
        province: '',
        kota: '',
        kodePos: '',
        phone: '',
        bio: '',
        address: ''
    })

    useEffect(() => {
        let isMounted = true
        
        const loadProfile = async () => {
            setLoading(true)
            try {
                const data = await getProfile()
                if (data && isMounted) {
                    setFormState({
                        username: data.username || '',
                        namaLengkap: data.namaLengkap || '',
                        tanggalLahir: data.tanggalLahir?.slice(0, 10) || '',
                        province: data.province || '',
                        kota: data.kota || '',
                        kodePos: data.kodePos || '',
                        phone: data.phone || '',
                        bio: data.bio || '',
                        address: data.address || ''
                    })
                    setImagePreview(data.avatar || null)
                } else if (isMounted) {
                    setError('Failed to load profile information.')
                }
            } catch (err) {
                if (isMounted) setError('An unexpected error occurred while fetching profile.')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadProfile()

        return () => {
            isMounted = false
        }
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormState((prev) => ({ ...prev, [name]: value }))
    }

    const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.')
            return
        }

        setError('')
        setSuccess('')
        setUploading(true)

        // Generate immediate local preview URL safely
        const localPreviewUrl = URL.createObjectURL(file)
        setImagePreview(localPreviewUrl)

        try {
            const updated = await uploadAvatar(file)
            if (updated) {
                const currentAuthUser = JSON.parse(localStorage.getItem('user') || '{}')
                localStorage.setItem('user', JSON.stringify({
                    ...currentAuthUser,
                    avatar: updated.avatar,
                    namaLengkap: updated.namaLengkap,
                    username: updated.username
                }))
                window.dispatchEvent(new Event('user-logged-in'))
                setSuccess('Avatar uploaded successfully.')
            } else {
                setError('Could not upload avatar.')
            }
        } catch {
            setError('Avatar upload failed due to a network issue.')
        } finally {
            setUploading(false)
            // Revoke memory reference for the string blob preview
            URL.revokeObjectURL(localPreviewUrl)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!formState.namaLengkap.trim()) {
            setError('Nama lengkap wajib diisi.')
            return
        }

        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const updated = await updateProfile({
                username: formState.username || null,
                namaLengkap: formState.namaLengkap || null,
                tanggalLahir: formState.tanggalLahir || null,
                province: formState.province || null,
                kota: formState.kota || null,
                kodePos: formState.kodePos || null,
                phone: formState.phone || null,
                bio: formState.bio || null,
                address: formState.address || null
            })

            if (updated) {
                setSuccess('Profile updated successfully.')
                const currentAuthUser = JSON.parse(localStorage.getItem('user') || '{}')
                localStorage.setItem('user', JSON.stringify({
                    ...currentAuthUser,
                    namaLengkap: updated.namaLengkap,
                    username: updated.username,
                    phone: updated.phone,
                    avatar: updated.avatar,
                    province: updated.province
                }))
                window.dispatchEvent(new Event('user-logged-in'))
                
                setTimeout(() => {
                    navigate('/profile')
                }, 1200)
            } else {
                setError('Failed to update profile.')
            }
        } catch {
            setError('Profile update failed due to a server error.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#259d84]" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
                        <p className="text-slate-500 dark:text-slate-400">Update your profile details and avatar.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-8">
                        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                            <div className="space-y-4">
                                <div className="w-full h-64 rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[#259d84]">
                                            <User size={72} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarSelect}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#259d84] hover:bg-[#1f7a68] text-white px-5 py-3 font-medium transition disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={18} />
                                                Upload Avatar
                                            </>
                                        )}
                                    </button>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">JPG, PNG, GIF, WebP max 5MB.</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="namaLengkap"
                                        value={formState.namaLengkap}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formState.username}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="tanggalLahir"
                                        value={formState.tanggalLahir}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formState.province}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="kota"
                                        value={formState.kota}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        name="kodePos"
                                        value={formState.kodePos}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formState.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formState.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84] resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formState.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#259d84] resize-none"
                                    />
                                </div>

                                {(error || success) && (
                                    <div className="pt-2">
                                        {error && (
                                            <div className="rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        {success && (
                                            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-3 text-sm">
                                                {success}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/profile')}
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#259d84] hover:bg-[#1f7a68] text-white font-semibold transition disabled:opacity-50 ml-auto"
                                    >
                                        {saving ? (
                                            <span className="inline-flex items-center gap-2">
                                                <Loader2 size={16} className="animate-spin" /> Saving...
                                            </span>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}