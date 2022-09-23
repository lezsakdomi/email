import * as React from 'react'
import {Component, CSSProperties} from 'react'
import {Auth, GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithCredential, signInWithEmailLink, signInWithPopup, signInAnonymously, signOut, User, onAuthStateChanged, linkWithPopup} from 'firebase/auth'
import {FcGoogle} from 'react-icons/fc'
import {MdEmail, MdExitToApp, MdNoAccounts, MdSms} from 'react-icons/md'

const googleOneTapAuthenticated = new Promise(resolve => {
    if (location.hostname !== "localhost") {
        // @ts-ignore
        window.google.accounts.id.initialize({
            client_id: "1079232395889-m71fkfjbkn583dtoto3dbaqdon30rln2.apps.googleusercontent.com",
            auto_select: true,
            callback: resolve,
        })
    }
})

export default class extends Component<{ auth: Auth, userChanged: (user: User) => void }, { user?: User, error?: Error }> {
    constructor(props) {
        super(props)
        this.state = {}

        onAuthStateChanged(this.props.auth, user => {
            this.setState({user});
            this.props.userChanged(user);
        })

        this.handleSuccess = this.handleSuccess.bind(this)
        this.handleError = this.handleError.bind(this)
        googleOneTapAuthenticated.then((response) => {
            // @ts-ignore
            const credential = GoogleAuthProvider.credential(response.credential)
            // noinspection JSIgnoredPromiseFromCall
            signInWithCredential(this.props.auth, credential)
                // .then(this.handleSuccess, this.handleError)
        }, this.handleError)
    }

    // noinspection JSUnusedLocalSymbols
    handleSuccess({user}: { user?: User }) {
        this.setState({error: undefined})
        // this.setState({user, error: undefined})
        // this.props.userChanged(user)
    }

    handleError(error: Error) {
        this.setState({error})
        console.error(error)
    }

    componentDidMount() {
        // @ts-ignore
        window.google.accounts.id.prompt()

        if (isSignInWithEmailLink(this.props.auth, location.href)) {
            let email = window.localStorage.getItem('emailForSignIn')
            if (!email) {
                email = window.prompt('Please provide your email for confirmation')
            }
            signInWithEmailLink(this.props.auth, email, location.href)
                .then((res) => {
                    localStorage.removeItem('emailForSignIn')
                    this.handleSuccess(res)
                }, this.handleError)
        }
    }

    componentWillUnmount() {
        // @ts-ignore
        window.google.accounts.id.cancel()
    }

    render() {
        const buttonStyle: CSSProperties = {
            marginLeft: '1em',
        }

        return (
            <div style={{
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <div
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        {this.state.user ? this.state.user.isAnonymous ? "Create account using:" : "Link account with:" : "Login using:"}
                    </div>
                    <button
                        onClick={event => {
                            event.preventDefault()
                            const email = prompt("Please enter your email address\n" +
                                "Note: You will be able to send emails from this address",
                                "@" + location.hostname.replace(/^email\./, ''))
                            if (email === null) return
                            const url = new URL(location.href)
                            url.searchParams.set("linkAccount", this.state.user ? "1" : "")
                            sendSignInLinkToEmail(this.props.auth, email, {
                                url: location.href,
                                handleCodeInApp: true,
                            }).then(() => {
                                window.localStorage.setItem('emailForSignIn', email)
                                alert("Close this page and check your inbox")
                            }).catch(this.handleError)
                        }}
                        disabled={!!this.state.user}
                        style={buttonStyle}
                    >
                        <MdEmail/> Email
                    </button>
                    <button
                        onClick={event => {
                            event.preventDefault()
                            if (this.state.user) {
                                linkWithPopup(this.state.user, new GoogleAuthProvider())
                                    .then(this.handleSuccess, this.handleError)
                            } else {
                                signInWithPopup(this.props.auth, new GoogleAuthProvider())
                                    .then(this.handleSuccess, this.handleError)
                            }
                        }}
                        disabled={false}
                        style={buttonStyle}
                    >
                        <FcGoogle/> Google
                    </button>
                    <button
                        disabled={true}
                        style={buttonStyle}
                    >
                        <MdSms/> Phone number
                    </button>
                    {this.state.user ? <button
                        onClick={event => {
                            event.preventDefault()
                            signOut(this.props.auth)
                                .then(() => this.handleSuccess({}), this.handleError)
                        }}
                        disabled={!this.state.user}
                        style={{
                            ...buttonStyle,
                            marginLeft: 'auto',
                        }}
                    >
                        <MdExitToApp/> Sign out
                    </button> : <button
                        onClick={event => {
                            event.preventDefault()
                            signInAnonymously(this.props.auth)
                                .then(this.handleSuccess, this.handleError)
                        }}
                        // disabled={!!this.state.user}
                        disabled={true}
                        style={{
                            ...buttonStyle,
                            marginLeft: 'auto',
                        }}
                    >
                        <MdNoAccounts/> Continue without signing in
                    </button>}
                </div>
                {this.state.error && <p style={{
                    color: 'red',
                    marginTop: 0,
                }}>
                    {this.state.error.toString()}
				</p>}
            </div>
        )
    }
}
