import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Mail, Phone, MapPin, Edit2, User } from 'lucide-react'
import { getProfile } from '@/services/profileApi'
import type { ProfileData } from '@/services/profileApi'

export default function Profile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadProfile = async (isMounted = true) => {
        setLoading(true)
        if (isMounted) setError('') // Reset error state on manual reloads
        
        try {
            const data = await getProfile()
            if (isMounted) {
                if (!data) {
                    setError('Failed to load profile details.')
                } else {
                    setProfile(data)
                }
            }
        } catch (err) {
            if (isMounted) setError('An unexpected error occurred while loading your profile.')
        } finally {
            if (isMounted) setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true
        loadProfile(isMounted)

        return () => {
            isMounted = false
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#259d84]" size={40} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
                    <button
                        type="button"
                        onClick={() => loadProfile(true)}
                        className="bg-[#259d84] hover:bg-[#1f7a68] text-white px-6 py-2.5 rounded-xl transition font-medium"
                    >
                        Reload Profile
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 text-center">
                    <p className="text-slate-700 dark:text-slate-300">Profile data could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#259d84] to-teal-600 h-40"></div>
                    <div className="px-8 pb-10 -mt-20">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="w-40 h-40 rounded-3xl border-8 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-lg shrink-0">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.namaLengkap || 'Avatar'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#259d84] bg-slate-200 dark:bg-slate-700">
                                        <User size={56} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                                            {profile.namaLengkap || 'Pengguna'}
                                        </h1>
                                        {profile.username && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                @{profile.username}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/edit-profile')}
                                        className="inline-flex items-center justify-center gap-2 bg-[#259d84] hover:bg-[#1f7a68] text-white px-5 py-3 rounded-2xl font-medium transition w-full sm:w-auto"
                                    >
                                        <Edit2 size={18} />
                                        Edit Profile
                                    </button>
                                </div>
                                {profile.bio && (
                                    <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl text-sm leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2">
                            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact</h2>
                                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Mail className="text-[#259d84] shrink-0" size={18} />
                                        <span className="truncate">{profile.email}</span>
                                    </div>
                                    {profile.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="text-[#259d84] shrink-0" size={18} />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Location</h2>
                                <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                                    {profile.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-[#259d84] mt-0.5 shrink-0" size={18} />
                                            <span className="leading-tight">{profile.address}</span>
                                        </div>
                                    )}
                                    {profile.kota && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-[#259d84] shrink-0" size={18} />
                                            <span>{profile.kota}</span>
                                        </div>
                                    )}
                                    {profile.province && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-[#259d84] shrink-0" size={18} />
                                            <span>{profile.province}</span>
                                        </div>
                                    )}
                                    {profile.kodePos && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="text-[#259d84] shrink-0" size={18} />
                                            <span>{profile.kodePos}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Details</h2>
                            <div className="grid gap-4 sm:grid-cols-3 text-slate-700 dark:text-slate-300 text-sm">
                                <div>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Email Verified</p>
                                    <p className="font-medium">{profile.emailVerified ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Joined On</p>
                                    <p className="font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                                </div>
                                {profile.tanggalLahir && (
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                                        <p className="font-medium">{new Date(profile.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}