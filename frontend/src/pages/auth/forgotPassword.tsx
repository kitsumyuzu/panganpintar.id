import style from '@/styles/auth/login.module.css'

import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
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
                                <label htmlFor={'username'}>E-mail</label>
                                <input type={'text'} className={`${style.form__control}`} placeholder={'Account Connected E-mail'} />
                            </div>

                            <div className={`${style.input__form__cta}`}>
                                <input type={'checkbox'} />
                                <span>I agree to the <Link to={'/terms-of-service'}>Terms of Service</Link> and <Link to={'privacy'}>Privacy Policy</Link>.</span>
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

export default ForgotPasswordPage