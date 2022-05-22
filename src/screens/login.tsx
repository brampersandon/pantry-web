import * as React from 'react'
import { useForm } from 'react-hook-form'
import { FirebaseContainer } from '../containers/firebase'
import { TextInput } from '../components/forms'
import { useLocation } from 'wouter'
import { useAuthedUserGoHome } from '../hooks/auth'

export default () => {
    const { register, handleSubmit, getValues } = useForm()
    const { login, signup } = FirebaseContainer.useContainer()
    const [, setLocation] = useLocation()

    useAuthedUserGoHome()

    return <div
        className={`p-2 rounded border-2 border-gray-800 text-gray-800 overflow-hidden`}
    >
        <form onSubmit={handleSubmit(({ email, password }) => {
            if (!email || !password) return alert("Enter a username and a password if you know what's good for ya.")
            login.execute({ email, password }).then(() => setLocation('/'))
        })}>
            <TextInput name="email" label="email" placeholder="evan@thirdroom.club" inputRef={register()} />
            <TextInput name="password" label="password" placeholder="************" inputRef={register()} type={'password'} />
            <button
                type="submit"
                className="bg-green-500 border-green-500 border-2 rounded text-white px-4 py-1 my-2 font-bold tracking-wider uppercase"
            >
                Log in
            </button>
            <button
                className="border-yellow-500 border-2 rounded text-yellow-500 px-4 py-1 my-2 ml-1 font-bold tracking-wider uppercase"
                onClick={(e) => {
                    e.preventDefault()
                    signup.execute(getValues()).then(() => {
                        setLocation('/')
                    })
                }}
            >
                Sign up
            </button>
            {login.error && <p>Crap, something went wrong: {login.error.toString()}</p>}
            {signup.error && <p>Crap, I couldn't register you: {signup.error.toString()}</p>}
        </form>
    </div>
}