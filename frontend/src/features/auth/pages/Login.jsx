import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
const Login = () => {

    const {loading, handleLogin} = useAuth()
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin({email,password})
        navigate('/')
    }

    if(loading){
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

            <form className="auth-form" onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" autoComplete="email" placeholder='you@example.com' onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" autoComplete="current-password" placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}/>
                </div>

                <button className='button primary-button' type="submit">Sign in <span aria-hidden="true">↗</span></button>

            </form>

            <p className="auth-switch">New to intervyoo? <Link to={"/register"}>Create an account</Link></p>
        </div>
        <p className="auth-footer">A little preparation goes a long way.</p>
    </main>
  )
}

export default Login
