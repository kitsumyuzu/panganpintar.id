import style from '@/styles/auth/login.module.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeClosed } from 'lucide-react'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)

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

                        <form action={''} method={'POST'}>
                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'username'}>Username or E-mail</label>
                                <input type={'text'} className={`${style.form__control}`} placeholder={'name@email.com'} />
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <div className={`${style.label__wrapper}`}>
                                    <label htmlFor={'password'}>Password</label>
                                    <Link to={'/forgot-password'}><span>Forgot password</span></Link>
                                </div>
                                <div className={`${style.icon__wrapper}`}>
                                    <input type={showPassword ? 'text' : 'password'} className={`${style.form__control}`} placeholder={'Your password'} />
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

                            <button className={`${style.btn} ${style.btn__cta__submit}`}>Sign In</button>
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