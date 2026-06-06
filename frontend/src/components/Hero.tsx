import { ArrowRight, TrendingUp, Shield, Wallet } from 'lucide-react'

// Hero Component
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Header - Title, Description, Button CTA */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 text-sm font-medium mb-6">
              <TrendingUp size={16} className="mr-2" />
              <span>#1 Platform Manajemen Pangan</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Kelola Pangan{' '}
              <span className="text-green-600">Lebih Cerdas</span>{' '}
              Bersama Kami
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Platform pintar untuk membantu Anda mengelola anggaran pangan, 
              menemukan supplier terbaik, dan memaksimalkan profit bisnis Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-green-600/30">
                Mulai Sekarang
                <ArrowRight size={20} className="ml-2" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-500 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all">
                Pelajari Lebih Lanjut
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Dipercaya oleh 1000+ pelaku bisnis
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Shield size={20} className="text-green-600 mr-2" />
                  <span className="text-sm font-medium">Aman & Terpercaya</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Wallet size={20} className="text-green-600 mr-2" />
                  <span className="text-sm font-medium">Budget Fleksibel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Main image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Smart Dashboard</h3>
                  <p className="text-green-100">
                    Pantau semua keuangan pangan Anda dalam satu tempat
                  </p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-6 top-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Penghematan</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">+25%</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Wallet size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Rp 5jt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}