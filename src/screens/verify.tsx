import * as React from 'react'
import { FirebaseContainer } from '../containers/firebase'

export const VerifyScreen = () => {
    const { user, sendVerification } = FirebaseContainer.useContainer()
    return <div>
        <h2 className="font-bold text-lg">Please verify your email address.</h2>
        {user && <p className="py-2">Check your inbox at {user.email} or resend verification below for the link.</p>}
        <button className="px-2 py-1 text-white bg-green-500 rounded" onClick={() => { sendVerification.execute() }}>Send Verification Email</button>
    </div>
}