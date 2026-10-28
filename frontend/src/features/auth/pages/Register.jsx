import {useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"
const Register = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e)=> {
    e.preventDefault()
    setError("")
    try {
      await handleRegister({username, email, password})
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account. Please try again.")
    }
  }

  if(loading){
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

            <form className="auth-form" onSubmit={handleSubmit}>

                {error && <p role="alert">{error}</p>}

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" autoComplete="username" placeholder='How should we call you?' onChange={(e)=>{setUsername(e.target.value)}}/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" autoComplete="email" placeholder='you@example.com' onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" autoComplete="new-password" placeholder='Create a password' onChange={(e)=>setPassword(e.target.value)}/>
                </div>

                <button className='button primary-button' type="submit">Create account <span aria-hidden="true">↗</span></button>

            </form>

            <p className="auth-switch">Already have an account? <Link to={"/login"}>Sign in</Link></p>
        </div>
        <p className="auth-footer">A little preparation goes a long way.</p>
    </main>
  )
}

export default Register
