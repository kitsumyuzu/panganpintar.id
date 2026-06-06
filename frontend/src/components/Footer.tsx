import { Mail, Phone, MapPin } from 'lucide-react'

// Custom Social Icon Components with size prop
const FacebookIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const InstagramIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const YoutubeIcon = ({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

// Footer Component
export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: '#', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: TwitterIcon, href: '#', color: 'hover:bg-sky-500' },
    { name: 'Instagram', icon: InstagramIcon, href: '#', color: 'hover:bg-pink-600' },
    { name: 'Youtube', icon: YoutubeIcon, href: '#', color: 'hover:bg-red-600' },
  ]

  const shortcutLinks = [
    { name: 'Smart Budgeting', href: '#' },
    { name: 'Affiliate Program', href: '#' },
    { name: 'Contact Us', href: '#' },
  ]

  const contactInfo = [
    { icon: Mail, text: 'hello@panganpintar.id', href: 'mailto:hello@panganpintar.id' },
    { icon: Phone, text: '+62 812 3456 7890', href: 'tel:+6281234567890' },
    { icon: MapPin, text: 'Jakarta, Indonesia', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Header - Title, Social Links, License */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Title & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Pangan<span className="text-green-500">Pintar</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Platform pintar untuk manajemen pangan dan anggaran bisnis Anda. 
                Mulai perjalanan finansial Anda hari ini!
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <item.icon size={18} />
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Shortcut - 3 Menu */}
            <div>
              <h3 className="text-white font-semibold mb-4">Shortcut</h3>
              <ul className="space-y-3">
                {shortcutLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white transition-all ${social.color} hover:scale-110`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - License */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} PanganPintar. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-green-500 text-sm transition-colors">
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}