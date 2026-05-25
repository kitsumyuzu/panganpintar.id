import style from '@/styles/auth/login.module.css'
import api from '@/services/api'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeClosed } from 'lucide-react'

const LoginPage = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError('')

            const response = await api.post('/auth/login', {
                email,
                password
            })

            localStorage.setItem(
                'token',
                response.data.token
            )

            navigate('/')

        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Login failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={'wrapper'}>
            <section className={`${style.section__header}`}>
                <h4>Header Title</h4>
                <p>Header Description</p>
            </section>
            <section className={`${style.section__content}`}>
                <div className={`${style.card__form}`}>
                    <div className={`${style.card__form__header}`}>
                        <h6>Card Title</h6>
                        <p>Card Description</p>
                    </div>

                    <div className={`${style.card__form__content}`}>
                        <button className={`${style.btn} ${style.btn_cta_google}`}>Button Title</button>
                        <div className={`${style.divider}`}></div>

                        <form onSubmit={handleLogin}>
                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'username'}>Username or E-mail</label>
                                <input type={'email'} className={`${style.form__control}`} placeholder={'name@email.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <div className={`${style.label__wrapper}`}>
                                    <label htmlFor={'password'}>Password</label>
                                    <Link to={'/forgot-password'}><span>Forgot password</span></Link>
                                </div>
                                <div className={`${style.icon__wrapper}`}>
                                    <input type={showPassword ? 'text' : 'password'} className={`${style.form__control}`} placeholder={'Your password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type={'button'} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <Eye size={18} />
                                        ) : (
                                            <EyeClosed size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className={`${style.input__form__cta}`}>
                                <input type={'checkbox'} />
                                <span>Remember me</span>
                            </div>

                            {error && (
                                <p className={style.error_message}>
                                    {error}
                                </p>
                            )}

                            <button type={'submit'} disabled={loading} className={`${style.btn} ${style.btn__cta__submit}`}>{loading ? 'Signing In...' : 'Sign In'}</button>
                        </form>
                    </div>

                    <div className={`${style.card__form__footer}`}>
                        <p>Don't have account?</p>
                        <Link to={'/register'}>Register</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LoginPage