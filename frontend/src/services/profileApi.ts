const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface ProfileData {
    id: number
    email: string
    username: string | null
    role: number
    emailVerified: boolean
    namaLengkap: string | null
    tanggalLahir: string | null
    createdAt: string | null
    province: string | null
    phone: string | null
    avatar: string | null
    bio: string | null
    address: string | null
    kota: string | null
    kodePos: string | null
}

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data?: T
    error?: string
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    }
}

export async function getProfile(): Promise<ProfileData | null> {
    try {
        const response = await fetch(`${API_URL}/api/profile/me`, {
            method: 'GET',
            headers: getAuthHeaders()
        })

        if (!response.ok) {
            throw new Error('Failed to load profile')
        }

        const data: ApiResponse<ProfileData> = await response.json()
        return data.data || null
    } catch (error) {
        console.error('Error fetching profile:', error)
        return null
    }
}

export async function updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData | null> {
    try {
        const response = await fetch(`${API_URL}/api/profile/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        })

        if (!response.ok) {
            throw new Error('Failed to update profile')
        }

        const data: ApiResponse<ProfileData> = await response.json()
        return data.data || null
    } catch (error) {
        console.error('Error updating profile:', error)
        return null
    }
}

export async function uploadAvatar(file: File): Promise<ProfileData | null> {
    try {
        const formData = new FormData()
        formData.append('avatar', file)

        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/profile/avatar`, {
            method: 'POST',
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            },
            body: formData
        })

        if (!response.ok) {
            throw new Error('Failed to upload avatar')
        }

        const data: ApiResponse<{ avatar: string; profile: ProfileData }> = await response.json()
        return data.data?.profile || null
    } catch (error) {
        console.error('Error uploading avatar:', error)
        return null
    }
}
