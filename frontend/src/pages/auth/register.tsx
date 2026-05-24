import style from '@/styles/auth/login.module.css'

import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeClosed } from 'lucide-react'

const RegisterPage = () => {
    const IndonesiaProvience = [ "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Lampung", "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"];

    const [selectedProvience, setSelectedProvience] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    const handleProvience = (event: ChangeEvent<HTMLSelectElement>): void => {
        setSelectedProvience(event.target.value);
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

                        <form action={''} method={'POST'}>
                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'nickname'}>Nickname</label>
                                <input type={'text'} className={`${style.form__control}`} placeholder={'Full nickname'} />
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'birth_date'}>Birth date</label>
                                <input type={'number'} className={`${style.form__control}`} defaultValue={1} min={1} max={31} />
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'birth_month'}>Birth month</label>
                                <input type={'month'} className={`${style.form__control}`} defaultValue={1} min={1} max={12} />
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'provience'}>Provience</label>
                                <select name={'provience'} id={'provience'} value={selectedProvience} onChange={handleProvience}>
                                    <option value="" selected disabled>Select provience</option>

                                    {[...IndonesiaProvience].sort().map((item, key) => (
                                        <option key={key} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`${style.input__form__group}`}>
                                <label htmlFor={'username'}>Username or E-mail</label>
                                <input type={'text'} className={`${style.form__control}`} placeholder={'name@email.com'} />
                            </div>

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

                            <div className={`${style.input__form__cta}`}>
                                <input type={'checkbox'} />
                                <span>By creating this account. I agree to the <Link to={'/terms-of-service'}>Terms of Service</Link> and <Link to={'privacy'}>Privacy Policy</Link>.</span>
                            </div>

                            <button className={`${style.btn} ${style.btn__cta__submit}`}>Sign Up</button>
                        </form>
                    </div>

                    <div className={`${style.card__form__footer}`}>
                        <p>Already have account?</p>
                        <Link to={'/login'}>Login</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RegisterPage