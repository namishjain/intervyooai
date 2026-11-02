import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
import GoogleSignInButton from '../components/GoogleSignInButton'
import { getErrorMessage } from '../../../lib/error-message'

const Register = () => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const { loading, sessionError, handleGoogleLogin } = useAuth()

    const handleGoogleSuccess = async (credential) => {
        setError("")
        try {
            await handleGoogleLogin(credential)
            navigate("/")
        } catch (err) {
            setError(getErrorMessage(err, "Unable to create your account with Google. Please try again."))
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="auth-loading" role="status">Creating your account<span>...</span></div>
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
                    <p className="auth-eyebrow">GET STARTED</p>
                    <h1>Your next chapter<br />starts here.</h1>
                    <p>Create an account and make your next interview count.</p>
                </div>

                <div className="auth-form">
                    {(error || sessionError) && <p className="auth-error" role="alert">{error || sessionError}</p>}
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={setError}
                    />
                </div>

                <p className="auth-switch">Already have an account? <Link to={"/login"}>Sign in</Link></p>
            </div>
            <p className="auth-footer">A little preparation goes a long way.</p>
        </main>
    )
}

export default Register
