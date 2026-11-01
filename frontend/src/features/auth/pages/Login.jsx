import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from '../components/GoogleSignInButton'

const Login = () => {
    const { loading, handleGoogleLogin } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleGoogleSuccess = async (credential) => {
        setError("")
        try {
            await handleGoogleLogin(credential)
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Unable to sign in with Google. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-loading" role="status">Signing you in<span>...</span></div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <Link className="auth-brand" to="/">
                    <span className="auth-brand-mark" aria-hidden="true">i</span>
                    <span>intervyoo<span className="auth-brand-dot">.</span></span>
                </Link>

                <div className="auth-heading">
                    <p className="auth-eyebrow">WELCOME BACK</p>
                    <h1>Good to see you.</h1>
                    <p>Sign in to pick up where your preparation left off.</p>
                </div>

                <div className="auth-form">
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={setError}
                    />
                </div>

                <p className="auth-switch">New to intervyoo? <Link to={"/register"}>Create an account</Link></p>
            </div>
            <p className="auth-footer">A little preparation goes a long way.</p>
        </main>
    )
}

export default Login
