import {initializeApp, FirebaseOptions} from "firebase/app"
import App from "./App"
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore'
import {getDatabase, connectDatabaseEmulator} from 'firebase/database'
import {getAuth, connectAuthEmulator} from 'firebase/auth'
import {createRoot} from 'react-dom/client'
import {createElement} from 'react'

fetch('/__/firebase/init.json').then(async configRes => {
    const firebaseConfig = await configRes.json() as FirebaseOptions

    const app = initializeApp(firebaseConfig)
    console.log(app)

    const firestore = getFirestore(app)
    const database = getDatabase(app)
    const auth = getAuth(app)

    if (window.location.hostname === "localhost") {
        connectFirestoreEmulator(firestore, location.hostname, 8080)
        connectDatabaseEmulator(database, location.hostname, 9000)
        connectAuthEmulator(auth, "http://localhost:9099")
        firebaseConfig.databaseURL = "http://localhost:9000/?ns=lezsak-email"
    }

    const root = createRoot(document.getElementById('root'))
    root.render(createElement(App, {app, firestore, database, auth}))
}).catch(e => {
    console.error(e)
    document.getElementById('root').innerHTML = "Could not load application<br>" + e
})
