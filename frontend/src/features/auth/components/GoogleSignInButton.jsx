import { useEffect, useRef } from "react"

const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client"
let googleIdentityScriptPromise

function loadGoogleIdentityServices() {
    if (window.google?.accounts?.id) {
        return Promise.resolve()
    }

    if (!googleIdentityScriptPromise) {
        googleIdentityScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = GOOGLE_IDENTITY_SCRIPT
            script.async = true
            script.defer = true
            script.onload = resolve
            script.onerror = () => {
                googleIdentityScriptPromise = undefined
                reject(new Error("Unable to load Google sign-in. Please try again."))
            }
            document.head.appendChild(script)
        })
    }

    return googleIdentityScriptPromise
}

const GoogleSignInButton = ({ onSuccess, onError }) => {
    const buttonRef = useRef(null)
    const onSuccessRef = useRef(onSuccess)
    const onErrorRef = useRef(onError)
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    useEffect(() => {
        onSuccessRef.current = onSuccess
        onErrorRef.current = onError
    }, [onSuccess, onError])

    useEffect(() => {
        if (!clientId) {
            return undefined
        }

        const button = buttonRef.current
        if (!button) {
            return undefined
        }

        let isMounted = true

        loadGoogleIdentityServices()
            .then(() => {
                if (!isMounted) {
                    return
                }

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        if (!response.credential) {
                            onErrorRef.current("Google did not return a sign-in credential. Please try again.")
                            return
                        }
                        onSuccessRef.current(response.credential)
                    },
                })

                const width = Math.min(
                    400,
                    Math.floor(button.getBoundingClientRect().width),
                )
                window.google.accounts.id.renderButton(button, {
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    width,
                })
            })
            .catch((error) => {
                if (isMounted) {
                    onErrorRef.current(error.message)
                }
            })

        return () => {
            isMounted = false
            button.replaceChildren()
        }
    }, [clientId])

    if (!clientId) {
        return (
            <p className="auth-error" role="alert">
                Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID to enable it.
            </p>
        )
    }

    return <div className="auth-google-button" ref={buttonRef} />
}

export default GoogleSignInButton
