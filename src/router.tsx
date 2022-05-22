import React from "react"
import { Switch, Route } from "wouter"
import ItemsScreen from './screens/items'
import LoginScreen from "./screens/login"
import { VerifyScreen } from './screens/verify'

export default () => {
    return <div className="flex flex-col items-center px-4">
        <header className="my-8">
            <a href="/">
                <h1 className="font-bold text-4xl text-gray-800">
                    🍳 pantry
                </h1>
            </a>
        </header>
        <main className="w-80">
            <Switch>
                <Route path="/">
                    <ItemsScreen />
                </Route>
                <Route path="/login">
                    <LoginScreen />
                </Route>
                <Route path="/verify">
                    <VerifyScreen />
                </Route>
            </Switch>
        </main>
    </div>
}