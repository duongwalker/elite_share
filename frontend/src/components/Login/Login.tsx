import { useState } from 'react'
import { logo } from '../../utils/icons'
import { logIn } from '../../services/auth'
import { useNavigate } from 'react-router-dom';
// import { setToken } from '../../services/groups'


type Email = string
type Password = string
type EmailError = string
type PasswordError = string


export const Login = () => {

    const [email, setEmail] = useState<Email>('')
    const [password, setPassword] = useState<Password>('')
    const [emailError, setEmailError] = useState<EmailError>('')
    const [passwordError, setPasswordError] = useState<PasswordError>('')
    const emailRegex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
    // const [user, setUser] = useState<User>()
    const navigate = useNavigate();

    const onButtonClick = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setEmailError('')
        setPasswordError('')
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }
        if ('' === password) {
            setPasswordError('Please enter a password')
            return
        }
    const user = await logIn({email, password})
    if(user) {
        // setToken(user.accessToken)
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        navigate('/dashboard')
    }
    }



    // useEffect(() => {
    //     const loggedUserJSON = window.localStorage.getItem('loggedUser')
    //     if (loggedUserJSON) {
    //         navigate('/dashboard')
    //     }
    //   }, [])

    return (
        <div className="relative h-screen w-screen flex overflow-hidden">
            <div className="absolute top-0 left-0 m-4">
                <img className='w-16 h-16' src={logo} alt='Logo'></img>
            </div>

            <div className="flex flex-col flex-grow items-center justify-center">
                <div className='flex flex-col items-center justify-center text-4xl font-bold'>
                    Welcome to Elite Share!
                </div>
                <br />

                <div className='flex flex-col justify-center '>
                    <input
                        value={email}
                        placeholder=" Username"
                        onChange={(ev) => setEmail(ev.target.value)}
                        className='rounded-sm'
                    />
                    <label className="errorLabel text-red-500 text-xs font-bold">{emailError}</label>
                </div>
                <br />

                <div className='flex flex-col justify-center'>
                    <input
                        value={password}
                        placeholder=" Password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className='rounded-sm'
                    />
                    <label className="errorLabel text-red-500 text-xs font-bold">{passwordError}</label>
                </div>

                <div className='flex flex-col justify-center'>
                    <input className="bg-[#464BD8] text-white px-6 py-1 m-2 text-lg rounded-lg focus:outline-none" onClick={onButtonClick} type="button" value={'Log in'} />
                </div>
            </div>

            <div className="h-full w-1/2">
                <img className='h-full w-full object-cover' src='/loginBackground.svg' alt='Login Background'></img>
            </div>
        </div>
    )
}
