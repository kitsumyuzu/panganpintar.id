import style from '@/styles/auth/login.module.css'
import api from '@/services/api'

import { useState } from 'react'

import {
    Link
} from 'react-router-dom'

import {
    Mail,
    ShieldCheck,
    BellRing,
    LockKeyhole
} from 'lucide-react'

const ForgotPasswordPage = () => {
    const [email, setEmail] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const [success, setSuccess] =
        useState(false)

    const handleForgotPassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')

            await api.post(
                '/auth/forgot-password',
                {
                    email
                }
            )

            setSuccess(true)

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Failed to send reset link'
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
                className={
                    style.section__header
                }
            >
                <h4>
                    Amankan akun dan akses
                    kembali sistem Anda
                </h4>

                <p>
                    Reset password dengan
                    mudah untuk melanjutkan
                    pengelolaan bisnis dan
                    kebutuhan pangan Anda.
                </p>

                <ul>
                    <li>
                        <ShieldCheck size={24} />

                        Sistem keamanan akun
                        terenkripsi
                    </li>

                    <li>
                        <BellRing size={24} />

                        Notifikasi aktivitas
                        akun realtime
                    </li>

                    <li>
                        <LockKeyhole size={24} />

                        Pemulihan akun cepat
                        dan aman
                    </li>
                </ul>
            </section>

            <section
                className={
                    style.section__content
                }
            >
                <div
                    className={
                        style.card__form
                    }
                >
                    <div
                        className={
                            style.card__form__header
                        }
                    >
                        <h6>
                            Forgot Password
                        </h6>

                        <p>
                            Enter your account
                            e-mail and we'll
                            send you a password
                            reset link.
                        </p>
                    </div>

                    <div
                        className={
                            style.card__form__content
                        }
                    >
                        <form
                            onSubmit={
                                handleForgotPassword
                            }
                        >
                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='email'>
                                    E-mail
                                </label>

                                <div
                                    className={
                                        style.icon__wrapper
                                    }
                                >
                                    <input
                                        id='email'
                                        type='email'
                                        className={
                                            style.form__control
                                        }
                                        placeholder='Account connected e-mail'
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

                                    <button
                                        type='button'
                                        tabIndex={
                                            -1
                                        }
                                    >
                                        <Mail
                                            size={
                                                18
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            <div
                                className={
                                    style.input__form__cta
                                }
                            >
                                <input
                                    id='terms'
                                    type='checkbox'
                                    required
                                />

                                <label htmlFor='terms'>
                                    I agree to
                                    the{' '}
                                    <Link to='/terms-of-service'>
                                        Terms of
                                        Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to='/privacy-policy'>
                                        Privacy
                                        Policy
                                    </Link>
                                    .
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

                            {success && (
                                <p
                                    className={
                                        style.success_message
                                    }
                                >
                                    Password reset
                                    link successfully
                                    sent to your
                                    e-mail.
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
                                    ? 'Sending Link...'
                                    : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>

                    <div
                        className={
                            style.card__form__footer
                        }
                    >
                        <p>
                            Remember your
                            password?
                        </p>

                        <Link to='/login'>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPasswordPage