import style from '@/styles/components/common/navbar.module.css'

import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Bell, CircleUserIcon, LogOut, StickyNote, X, User, Settings } from 'lucide-react'

import logo from '@/assets/Crystal.png'

export default function Navbar() {
    const token = localStorage.getItem('token')
    const isLoggedIn = !!token
    const navigate = useNavigate()
    const [showNotif, setShowNotif] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const notifRef = useRef<HTMLLIElement>(null)
    const profileRef = useRef<HTMLLIElement>(null)

    useEffect(() => {
        const outsideClickHandler = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) { 
                setShowNotif(false) 
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) { 
                setShowProfile(false) 
            }
        }

        document.addEventListener('mousedown', outsideClickHandler);
        return () => { document.removeEventListener('mousedown', outsideClickHandler) }
    }, []);

    const [notifications, setNotifications] = useState([
        { id: 1, icon: <StickyNote size={18} />, title: 'Welcome', description: 'Thanks for joining!', time: 'Just now' }
    ])

    const removeNotifications = (id: number) => {
        setNotifications((prev) => prev.filter((notify) => notify.id !== id));
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <header className={`${style.container}`}>
            <nav className={`${style.navbar}`}>
                <div className={`${style.nav_logo}`}>
                    <img src={logo} alt={'navbar logo'} />
                    <span>Header Title</span>
                </div>
                <ul className={`${style.nav_menu}`}>
                    <li className={`${style.nav_list}`}><NavLink to={'/'} className={`${style.nav_item}`}>Home</NavLink></li>
                    <li className={`${style.nav_list}`}><NavLink to={'/affiliate'} className={`${style.nav_item}`}>Affiliate</NavLink></li>
                    <li className={`${style.nav_list}`}><NavLink to={'/smart-budget'} className={`${style.nav_item}`}>Smart Budgeting</NavLink></li>
                    <li className={`${style.nav_list}`}><NavLink to={'/about'} className={`${style.nav_item}`}>About</NavLink></li>
                </ul>
                <ul className={`${style.nav_menu_right}`}>
                    {isLoggedIn ? (
                        <>
                            <li className={`${style.nav_icon_wrapper}`} ref={notifRef}>
                                <button
                                    className={`${style.icon_button}`}
                                    onClick={() => {
                                        setShowNotif(!showNotif)
                                        setShowProfile(false)
                                    }}
                                >
                                    <Bell size={24} />
                                </button>

                                {showNotif && (
                                    <div className={`${style.notification_dropdown}`}>
                                        <div className={`${style.dropdown_header}`}>
                                            <h5>Notification</h5>
                                            <span>{notifications.length} pesan</span>
                                        </div>

                                        <div className={`${style.notification_wrapper}`}>
                                            {notifications.length > 0 ? (
                                                notifications.map((notify) => (
                                                    <div
                                                        key={notify.id}
                                                        className={`${style.notification_item}`}
                                                    >
                                                        <div className={`${style.notification_icon}`}>
                                                            {notify.icon}
                                                        </div>

                                                        <div className={`${style.notification_content}`}>
                                                            <div className={`${style.notification_top}`}>
                                                                <h5>{notify.title}</h5>

                                                                <button
                                                                    className={`${style.delete_notification}`}
                                                                    onClick={() =>
                                                                        removeNotifications(notify.id)
                                                                    }
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>

                                                            <p>{notify.description}</p>
                                                            <span>{notify.time}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={`${style.empty_notification}`}>
                                                    Tidak ada notifikasi
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </li>

                            <li className={`${style.nav_icon_wrapper}`} ref={profileRef}>
                                <button
                                    className={`${style.icon_button}`}
                                    onClick={() => {
                                        setShowProfile(!showProfile)
                                        setShowNotif(false)
                                    }}
                                >
                                    <CircleUserIcon size={24} />
                                </button>

                                {showProfile && (
                                    <div className={`${style.profile_dropdown}`}>
                                        <Link
                                            to={'/profile'}
                                            className={style.dropdown_link}
                                        >
                                            <User size={18} />
                                            Profile
                                        </Link>

                                        <Link
                                            to={'/pengaturan'}
                                            className={style.dropdown_link}
                                        >
                                            <Settings size={18} />
                                            Pengaturan
                                        </Link>

                                        <button
                                            className={`${style.btn} ${style.btn_logout}`}
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to={'/login'}>
                                <button>Login</button>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}