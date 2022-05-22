import React from "react"
import { useRequireLogin } from "../hooks/auth"
import { AddItem, ListItems } from "../components/items"
import { ItemsContainer } from "../containers/items"
import { FirebaseContainer } from "../containers/firebase"

export default () => {
    const { user, logout } = FirebaseContainer.useContainer()
    useRequireLogin()
    return <ItemsContainer.Provider>
        <AddItem />
        <ListItems />
        {user &&
            <div className="w-full flex justify-center pt-8">
                <button onClick={logout} className="rounded px-2 py-1 border-gray-600 text-gray-600 border-2 uppercase tracking-wider font-bold">Sign out</button>
            </div>
        }
    </ItemsContainer.Provider>
}