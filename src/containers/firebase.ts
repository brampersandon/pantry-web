import { useState, useEffect, useMemo } from 'react';
import { FirebaseApp, FirebaseUser, initialize } from '../firebase';
import { useAsync } from '../hooks/firebase';

import { createContainer } from 'unstated-next';
import firebase from 'firebase/app'
import 'firebase/auth'

const useFirebase = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [app, setApp] = useState<FirebaseApp | null>(null)

  useEffect(() => {
    initialize()
    setApp(firebase.app())
  }, [])

  useEffect(() => {
    if (app != null && !user) {
      const unsubscribe = firebase.auth().onAuthStateChanged((updatedUser) => {
        setUser(updatedUser);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [app, user]);

  const auth = useMemo(() => {
    if (app == null) return null
    return app.auth()
  }, [app])

  const loginFn = async ({ email, password }: Record<'email' | 'password', string>) => {
    const user = await auth?.signInWithEmailAndPassword(email, password)
    return user
  }

  const signupFn = async ({ email, password }: Record<'email' | 'password', string>) => {
    const userCredential = await auth?.createUserWithEmailAndPassword(email, password)
    await sendVerificationFn(userCredential?.user!)
    return user
  }

  const sendVerificationFn = async (u?: firebase.User) => {
    await (u || user)?.sendEmailVerification()
  }

  const logout = async () => {
    await auth?.signOut()
    window.location.reload()
  }

  const login = useAsync(loginFn)
  const signup = useAsync(signupFn)
  const sendVerification = useAsync(sendVerificationFn)

  return { app, user, login, signup, sendVerification, logout };
};

export const FirebaseContainer = createContainer(useFirebase);
