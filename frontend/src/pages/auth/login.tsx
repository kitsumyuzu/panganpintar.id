import style from '@/styles/auth/login.module.css'
import api from '@/services/api'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
    Eye,
    EyeClosed,
    ShieldCheck,
    ChartNoAxesCombined,
    BellRing
} from 'lucide-react'

const LoginPage = () => {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] =
        useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [error, setError] = useState('')

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')

            const response = await api.post(
                '/auth/login',
                {
                    email,
                    password
                }
            )

            localStorage.setItem(
                'token',
                response.data.token
            )

            navigate('/')

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Failed to login'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns:
                    '1fr 520px',
                minHeight: '100vh'
            }}
        >
            <section
                className={style.section__header}
            >
                <h4>
                    Kelola kebutuhan pangan
                    dan bisnis UMKM dalam
                    satu platform modern
                </h4>

                <ul>
                    <li>
                        <ChartNoAxesCombined
                            size={24}
                        />

                        Prediksi harga pangan
                        harian secara realtime
                    </li>

                    <li>
                        <ShieldCheck
                            size={24}
                        />

                        Kelola anggaran dan
                        stok bisnis lebih aman
                    </li>

                    <li>
                        <BellRing size={24} />

                        Dapatkan notifikasi
                        perubahan harga pasar
                    </li>
                </ul>
            </section>

            <section
                className={
                    style.section__content
                }
            >
                <div
                    className={style.card__form}
                >
                    <div
                        className={
                            style.card__form__header
                        }
                    >
                        <h6>Welcome Back</h6>

                        <p>
                            Login to continue
                            using PanganPintar.
                        </p>
                    </div>

                    <div
                        className={
                            style.card__form__content
                        }
                    >
                        <button
                            className={`${style.btn} ${style.btn_cta_google}`}
                            type='button'
                        >
                            Continue with Google
                        </button>

                        <div
                            className={
                                style.divider
                            }
                        ></div>

                        <form
                            onSubmit={
                                handleLogin
                            }
                        >
                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='email'>
                                    Username or
                                    E-mail
                                </label>

                                <input
                                    id='email'
                                    type='email'
                                    className={
                                        style.form__control
                                    }
                                    placeholder='name@email.com'
                                    autoComplete='email'
                                    value={email}
                                    onChange={(
                                        e
                                    ) =>
                                        setEmail(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <div
                                    className={
                                        style.label__wrapper
                                    }
                                >
                                    <label htmlFor='password'>
                                        Password
                                    </label>

                                    <Link
                                        to='/forgot-password'
                                    >
                                        <span>
                                            Forgot
                                            password
                                        </span>
                                    </Link>
                                </div>

                                <div
                                    className={
                                        style.icon__wrapper
                                    }
                                >
                                    <input
                                        id='password'
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className={
                                            style.form__control
                                        }
                                        placeholder='Your password'
                                        autoComplete='current-password'
                                        value={
                                            password
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setPassword(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <Eye
                                                size={
                                                    18
                                                }
                                            />
                                        ) : (
                                            <EyeClosed
                                                size={
                                                    18
                                                }
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div
                                className={
                                    style.input__form__cta
                                }
                            >
                                <input
                                    id='remember_me'
                                    type='checkbox'
                                />

                                <label htmlFor='remember_me'>
                                    Remember me
                                </label>
                            </div>

                            {error && (
                                <p
                                    className={
                                        style.error_message
                                    }
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type='submit'
                                disabled={
                                    loading
                                }
                                className={`${style.btn} ${style.btn__cta__submit}`}
                            >
                                {loading
                                    ? 'Signing In...'
                                    : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <div
                        className={
                            style.card__form__footer
                        }
                    >
                        <p>
                            Don't have account?
                        </p>

                        <Link to='/register'>
                            Register
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LoginPage