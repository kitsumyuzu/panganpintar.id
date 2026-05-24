import style from '@/styles/auth/login.module.css'

import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'

const ResetPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)
    
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
                        <form action={''} method={'POST'}>
                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'password'}>Password</label>
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

                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'passwordConfirmation'}>Confirmation Password</label>
                                <div className={`${style.icon__wrapper}`}>
                                    <input type={showConfirmedPassword ? 'text' : 'password'} className={`${style.form__control}`} placeholder={'Your password'} />
                                    <button type={'button'} onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                                        {showConfirmedPassword ? (
                                            <Eye size={18} />
                                        ) : (
                                            <EyeClosed size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button className={`${style.btn} ${style.btn__cta__submit}`}>Submit</button>
                        </form>
                    </div>

                    <div className={`${style.card__form__footer}`}>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPasswordPage