import * as React from 'react'
import {useState} from 'react'
import {FirebaseApp} from 'firebase/app'
import {Firestore} from 'firebase/firestore'
import {Database} from 'firebase/database'
import {Auth, User} from 'firebase/auth'
import AuthComponent from './Auth'
import Interface from './Interface'

// noinspection JSUnusedLocalSymbols
export default function App({app, firestore, database, auth}: { app: FirebaseApp, firestore: Firestore, database: Database, auth: Auth }): JSX.Element {
    const [user, setUser] = useState<User>()

    return (
        <main
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AuthComponent auth={auth} userChanged={setUser}/>
            <Interface user={user} enabled={!!user}/>
        </main>
    )
}
