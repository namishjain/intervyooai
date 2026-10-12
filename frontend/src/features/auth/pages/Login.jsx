import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
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
        return (<main><h1>Loading.....</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder='Enter email address' onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter password' onChange={(e)=>setPassword(e.target.value)}/>
                </div>

                <button className='button primary-button'>Login</button>

            </form>

            <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
    </main>
  )
}

export default Login
