const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://firmanfadilah-pangan-pintar-api.hf.space'
const AI_API_BASE = `${AI_API_URL}/api/v1`

export interface Commodity {
    id: string
    name: string
    category?: string
}

export interface Province {
    id: string
    name: string
}

export interface PredictionRequest {
    commodity: string
    province: string
    target_week: string
}

export interface PredictionResponse {
    predicted_price: number
    current_price: number
    trend: 'up' | 'down' | 'stable'
    confidence?: number
    week: string
    commodity: string
    province: string
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export async function getCommodities(): Promise<Commodity[]> {
    try {
        const response = await fetch(`${AI_API_BASE}/commodities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch commodities')
        }

        const data = await response.json()
        return data.commodities || data.data || []
    } catch (error) {
        console.error('Error fetching commodities:', error)
        return defaultCommodities
    }
}

export async function getProvinces(): Promise<Province[]> {
    try {
        const response = await fetch(`${AI_API_BASE}/provinces`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch provinces')
        }

        const data = await response.json()
        const provinces = data.provinces || data.data || []

        if (!Array.isArray(provinces)) {
            return defaultProvinces
        }

        if (provinces.length === 0) {
            return defaultProvinces
        }

        if (typeof provinces[0] === 'string') {
            return provinces.map((name) => ({ id: name, name }))
        }

        return provinces.map((province: any) => ({
            id: province.id ?? province.name,
            name: province.name ?? province.id ?? ''
        }))
    } catch (error) {
        console.error('Error fetching provinces:', error)
        return defaultProvinces
    }
}

export async function getPrediction( commodity: string, province: string, targetWeek: string): Promise<PredictionResponse | null> {
    try {
        const response = await fetch(`${AI_API_BASE}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commodity,
                province,
                target_week: targetWeek,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to get prediction')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting prediction:', error)
        return null
    }
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${AI_API_URL}/health`)
        return response.ok
    } catch {
        return false
    }
}

export const defaultCommodities: Commodity[] = [
    { id: 'beras', name: 'Beras', category: 'Instan' },
    { id: 'cabai', name: 'Cabai Rawit', category: 'Sayuran' },
    { id: 'bawang_putih', name: 'Bawang Putih', category: 'Bumbu' },
    { id: 'bawang_merah', name: 'Bawang Merah', category: 'Bumbu' },
    { id: 'daging_ayam', name: 'Daging Ayam', category: 'Daging' },
    { id: 'telur_ayam', name: 'Telur Ayam', category: 'Telur' },
    { id: 'minyak_goreng', name: 'Minyak Goreng', category: 'Minyak' },
    { id: 'gula_pasir', name: 'Gula Pasir', category: 'Gula' },
]

export const defaultProvinces: Province[] = [
    { id: 'DKI Jakarta', name: 'DKI Jakarta' },
    { id: 'Jawa Barat', name: 'Jawa Barat' },
    { id: 'Jawa Tengah', name: 'Jawa Tengah' },
    { id: 'Jawa Timur', name: 'Jawa Timur' },
    { id: 'Sumatera Utara', name: 'Sumatera Utara' },
    { id: 'Sumatera Selatan', name: 'Sumatera Selatan' },
    { id: 'Lampung', name: 'Lampung' },
    { id: 'Bali', name: 'Bali' },
    { id: 'Sulawesi Selatan', name: 'Sulawesi Selatan' },
    { id: 'Kalimantan Timur', name: 'Kalimantan Timur' },
]