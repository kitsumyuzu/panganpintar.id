import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://kdn.infinitelearningstudent.id/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
          {!success ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Lupa Password?
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Masukkan email Anda untuk menerima link reset password
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                                            type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-8 py-3 bg-[#259d84] hover:bg-[#1f7a68] disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="animate-pulse">Mengirim...</span>
                  ) : (
                    'Kirim Link Reset'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Cek Email Anda
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Kami telah发送link reset password ke email {email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jika tidak menemukan email, cek folder spam
                </p>
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-[#259d84] hover:underline"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}