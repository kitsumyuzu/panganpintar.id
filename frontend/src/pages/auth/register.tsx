import style from '@/styles/auth/login.module.css'
import api from '@/services/api'

import {
    useState,
    type ChangeEvent
} from 'react'

import {
    Link,
    useNavigate
} from 'react-router-dom'

import {
    Eye,
    EyeClosed,
    MapPin,
    CalendarDays,
    ShieldCheck,
    BellRing,
    ChartNoAxesCombined
} from 'lucide-react'

const RegisterPage = () => {
    const navigate = useNavigate()

    const indonesiaProvince = [
        'Aceh',
        'Sumatera Utara',
        'Sumatera Barat',
        'Riau',
        'Kepulauan Riau',
        'Jambi',
        'Bengkulu',
        'Sumatera Selatan',
        'Kepulauan Bangka Belitung',
        'Lampung',
        'DKI Jakarta',
        'Banten',
        'Jawa Barat',
        'Jawa Tengah',
        'DI Yogyakarta',
        'Jawa Timur',
        'Bali',
        'Nusa Tenggara Barat',
        'Nusa Tenggara Timur',
        'Kalimantan Barat',
        'Kalimantan Tengah',
        'Kalimantan Selatan',
        'Kalimantan Timur',
        'Kalimantan Utara',
        'Sulawesi Utara',
        'Gorontalo',
        'Sulawesi Tengah',
        'Sulawesi Barat',
        'Sulawesi Selatan',
        'Sulawesi Tenggara',
        'Maluku',
        'Maluku Utara',
        'Papua',
        'Papua Barat',
        'Papua Selatan',
        'Papua Tengah',
        'Papua Pegunungan',
        'Papua Barat Daya'
    ]

    const [nickname, setNickname] =
        useState('')

    const [birthDate, setBirthDate] =
        useState('')

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [selectedProvince, setSelectedProvince] =
        useState('')

    const [showPassword, setShowPassword] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')

    const handleProvince = (
        event: ChangeEvent<HTMLSelectElement>
    ): void => {
        setSelectedProvince(
            event.target.value
        )
    }

    const handleRegister = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')

            await api.post('/auth/register', {
                nickname,
                birthDate,
                province: selectedProvince,
                email,
                password
            })

            navigate('/login')

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Failed to register account'
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
                    Kelola kebutuhan pangan
                    & bisnis UMKM lebih
                    mudah
                </h4>

                <p>
                    Pantau harga pangan,
                    atur pengeluaran, dan
                    kelola kebutuhan bisnis
                    harian dalam satu
                    sistem terpadu.
                </p>

                <ul>
                    <li>
                        <ChartNoAxesCombined size={24} />

                        Prediksi harga
                        pangan realtime
                    </li>

                    <li>
                        <ShieldCheck size={24} />

                        Monitoring bisnis
                        lebih aman
                    </li>

                    <li>
                        <BellRing size={24} />

                        Notifikasi perubahan
                        harga pasar
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
                            Create Account
                        </h6>

                        <p>
                            Register your
                            account to continue
                            using PanganPintar.
                        </p>
                    </div>

                    <div
                        className={
                            style.card__form__content
                        }
                    >
                        <button
                            type='button'
                            className={`${style.btn} ${style.btn_cta_google}`}
                        >
                            Continue with
                            Google
                        </button>

                        <div
                            className={
                                style.divider
                            }
                        ></div>

                        <form
                            onSubmit={
                                handleRegister
                            }
                        >
                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='nickname'>
                                    Nickname
                                </label>

                                <input
                                    id='nickname'
                                    type='text'
                                    className={
                                        style.form__control
                                    }
                                    placeholder='Your nickname'
                                    autoComplete='nickname'
                                    value={
                                        nickname
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setNickname(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='birth_date'>
                                    Birth Date
                                </label>

                                <div
                                    className={
                                        style.icon__wrapper
                                    }
                                >
                                    <input
                                        id='birth_date'
                                        type='date'
                                        className={
                                            style.form__control
                                        }
                                        value={
                                            birthDate
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setBirthDate(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                    <button
                                        type='button'
                                        tabIndex={
                                            -1
                                        }
                                    >
                                        <CalendarDays
                                            size={
                                                18
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='province'>
                                    Province
                                </label>

                                <div
                                    className={
                                        style.icon__wrapper
                                    }
                                >
                                    <select
                                        name='province'
                                        id='province'
                                        value={
                                            selectedProvince
                                        }
                                        onChange={
                                            handleProvince
                                        }
                                        className={
                                            style.form__control
                                        }
                                    >
                                        <option
                                            value=''
                                            disabled
                                        >
                                            Select province
                                        </option>

                                        {[...indonesiaProvince]
                                            .sort()
                                            .map(
                                                (
                                                    item,
                                                    key
                                                ) => (
                                                    <option
                                                        key={
                                                            key
                                                        }
                                                        value={
                                                            item
                                                        }
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>

                                    <button
                                        type='button'
                                        tabIndex={
                                            -1
                                        }
                                    >
                                        <MapPin
                                            size={
                                                18
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='email'>
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
                                />
                            </div>

                            <div
                                className={
                                    style.input__form__group
                                }
                            >
                                <label htmlFor='password'>
                                    Password
                                </label>

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
                                        autoComplete='new-password'
                                        minLength={
                                            8
                                        }
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
                                    id='terms'
                                    type='checkbox'
                                />

                                <label htmlFor='terms'>
                                    By creating this
                                    account, I agree
                                    to the{' '}
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

                            <button
                                type='submit'
                                disabled={
                                    loading
                                }
                                className={`${style.btn} ${style.btn__cta__submit}`}
                            >
                                {loading
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    <div
                        className={
                            style.card__form__footer
                        }
                    >
                        <p>
                            Already have
                            account?
                        </p>

                        <Link to='/login'>
                            Login
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RegisterPage